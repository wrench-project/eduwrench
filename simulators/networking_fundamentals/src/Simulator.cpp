#include <iostream>
#include <fstream>
#include <iomanip>
#include <algorithm>
#include <cmath>
#include <pugixml.hpp>

#include "ActivityWMS.h"

/**
 * @brief Generate a workflow containing only files
 * @param workflow: pointer to the workflow
  @param file_sizes: the list of file sizes, in MB
 */
void generateWorkflow(wrench::Workflow *workflow, std::vector<double> &file_sizes) {
    int id=0;
    for (auto const &size : file_sizes) {
        workflow->addFile(("file_" + std::to_string(id++)), size * 1000.0 * 1000.0);
    }
}

/**
 * @brief Generate a platform with two hosts connected by three links.
 * @param platform_file_path: the path where the platform.xml file will be written to
 * @param effective_bandwidth: effective bandwidth of the second (middle) of the three links in MBps
 *
 * throws std::invalid_argument
 */
void generatePlatform(std::string platform_file_path, unsigned long effective_bandwidth) {
    if (platform_file_path.empty()) {
        throw std::invalid_argument("generateSingleLinkPlatform() platform_file_path cannot be empty");
    }

    if (effective_bandwidth < 1) {
        throw std::invalid_argument("generateSingleLinkPlatform() bandwidth must be at least 1 MBps");
    }

    std::string xml_string = "<?xml version='1.0'?>\n"
                             "<!DOCTYPE platform SYSTEM \"http://simgrid.gforge.inria.fr/simgrid/simgrid.dtd\">\n"
                             "<platform version=\"4.1\">\n"
                             "   <zone id=\"AS0\" routing=\"Full\">\n"
                             "       <host id=\"host1\" speed=\"1000Gf\" core=\"1\"/>\n"
                             "       <host id=\"host2\" speed=\"1000Gf\" core=\"1\"/>\n"

                             "       <!-- effective bandwidth = 100 MBps -->\n"
                             "       <link id=\"link1\" bandwidth=\"206.185MBps\" latency=\"10us\"/>\n"
                             "       <link id=\"link2\" bandwidth=\"103.092MBps\" latency=\"10us\"/>\n"
                             "       <link id=\"link3\" bandwidth=\"206.185MBps\" latency=\"10us\"/>\n"

                             "       <route src=\"host1\" dst=\"host2\">\n"
                             "           <link_ctn id=\"link1\"/>\n"
                             "           <link_ctn id=\"link2\"/>\n"
                             "           <link_ctn id=\"link3\"/>\n"
                             "       </route>\n"
                             "    </zone>\n"
                             "</platform>";

    pugi::xml_document xml_doc;

    if (xml_doc.load_string(xml_string.c_str(), pugi::parse_doctype)) {

        pugi::xml_node zone = xml_doc.child("platform").child("zone");
        pugi::xml_node middle_link = zone.find_child_by_attribute("link", "id", "link2");

        // entering (effective_bandwidth / 0.97) as bandwidth into the simulation
        // so that the max bandwidth we can achieve is the effective_bandwidth
        double bandwidth = effective_bandwidth / 0.97;

        middle_link.attribute("bandwidth").set_value(std::string(std::to_string(bandwidth) + "MBps").c_str());

        xml_doc.save_file(platform_file_path.c_str());

    } else {
        throw std::runtime_error("something went wrong with parsing xml string");
    }
}

int main(int argc, char **argv) {
    wrench::Simulation simulation;
    simulation.init(&argc, argv);

    const int MAX_NUM_FILES = 100;
    const int MAX_FILE_SIZE = 1000;

    std::vector<double> file_sizes;

    try {
        if (argc < 2) {
            throw std::invalid_argument("bad args");
        }

        if (argc -1 > MAX_NUM_FILES) {
            std::cerr << "Too many file sizes specified (maximum 100)" << std::endl;
            throw std::invalid_argument("invalid number of files");
        }

        for (int i = 1; i < argc; i++) {
            double size = std::stof(std::string(argv[i]));
            if ((size < 1) || (size > MAX_FILE_SIZE)) {
                std::cerr << "Invalid file size. Enter a file size in the range [1, " + std::to_string(MAX_FILE_SIZE) + "] MB" << std::endl;
                throw std::invalid_argument("invalid file size");
            } else {
                file_sizes.push_back(size);
            }
        }

    } catch (std::invalid_argument &e) {
        std::cerr << "Usage: " << std::string(argv[0]) << " <file size> [file size]*" << std::endl;
        std::cerr << "    file size: the size of each file, a value in the range of [1, " + std::to_string(MAX_FILE_SIZE) + "] MB" << std::endl;
        std::cerr << "    (at most " + std::to_string(MAX_FILE_SIZE) + " file sizes can be specified)" << std::endl;
        return 1;
    }

    std::string platform_file_path = "/tmp/platform.xml";
    generatePlatform(platform_file_path, 100);
    simulation.instantiatePlatform(platform_file_path);

    // two storage services, one on each host
    const double STORAGE_CAPACITY = MAX_FILE_SIZE * MAX_NUM_FILES * 1000.0 * 1000.0;
    auto storage_service_1 = simulation.add(
            new wrench::SimpleStorageService("host1", STORAGE_CAPACITY)
            );

    auto storage_service_2 = simulation.add(
            new wrench::SimpleStorageService("host2", STORAGE_CAPACITY)
    );

    // wms
    auto wms = simulation.add(new wrench::ActivityWMS({storage_service_1, storage_service_2}, "host1"));

    wrench::Workflow workflow;
    generateWorkflow(&workflow, file_sizes);
    wms->addWorkflow(&workflow);

    // file registry service
    auto file_registry_service = simulation.add(new wrench::FileRegistryService("host1"));

    // stage all the files in the workflow at ss on host1
    for (const auto &file : workflow.getFiles()) {
        simulation.stageFile(file, storage_service_1);
    }

    simulation.launch();

    // Gather the data transfer completion times
    std::map<wrench::WorkflowFile *, double> transfer_completion_times;

    auto file_copy_starts = simulation.getOutput().getTrace<wrench::SimulationTimestampFileCopyStart>();

    for (const auto &file_copy : file_copy_starts) {
        double start_time = file_copy->getDate();
        double end_time = file_copy->getContent()->getEndpoint()->getDate();
        double duration = end_time - start_time;
        transfer_completion_times[file_copy->getContent()->getFile()] = duration;
    }


    std::cout << "----------------------------------------" << std::endl;
    std::cout.precision(4);
    for (const auto &tct : transfer_completion_times) {
        std::cout << (tct.first->getSize() / (1000.0 * 1000.0)) << " MB transfer completed at time " << tct.second << "\n";
    }
    std::cout << "----------------------------------------" << std::endl;

    return 0;
}
