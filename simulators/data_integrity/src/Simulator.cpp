#include <iostream>
#include <fstream>
#include <iomanip>
#include <string>
#include <algorithm>
#include <random>

#include <simgrid/s4u.hpp>
#include <wrench.h>
#include <nlohmann/json.hpp>
#include <pugixml.hpp>

#include "ActivityWMS.h"

/**
 * @brief Generate the workflow
 * @description Fork-Join
 */
void generateWorkflow(wrench::Workflow *workflow, int scenario, int probability, int file_size) {
    // Blue task
    const double MB = 1000.0 * 1000.0;

    if (scenario == 1) {
        workflow->addFile("file.XmOWL", file_size*MB);
    } else if (scenario == 2) {
        workflow->addFile("file.XuOWL", file_size*MB);
    } else if (scenario == 3) {
        workflow->addFile("file.XrOWL", file_size*MB);
    } else if (scenario == 4) {
        workflow->addFile("file.XzOWL", file_size*MB);
    }

    if (scenario == 1 || scenario == 3) {
        //if scenario 1 or 3, add a dummy file to store probablity value
        workflow->addFile("file.p" + std::to_string(probability), 0);
    }

    //uncorrupted file
    workflow->addFile("file.XkOWL", file_size*MB);
}

/**
 * @brief Generates a platform with a single multi-core host
 * @param platform_file_path: path to write the platform file to
 *
 * @throws std::invalid_argumemnt
 */
void generatePlatform(std::string platform_file_path) {

    if (platform_file_path.empty()) {
        throw std::invalid_argument("generatePlatform() platform_file_path cannot be empty");
    }

    // Create a the platform file
    std::string xml_string = "<?xml version='1.0'?>\n"
                             "<!DOCTYPE platform SYSTEM \"http://simgrid.gforge.inria.fr/simgrid/simgrid.dtd\">\n"
                             "<platform version=\"4.1\">\n"
                             "   <zone id=\"AS0\" routing=\"Full\">\n"
                             "       <host id=\"WMSHost\" speed=\"10Gf\" core=\"1\">\n"
                             "       </host>\n"
                             "       <host id=\"ServerHost1\" speed=\"100Gf\" core=\"1000\">\n"
                             "           <prop id=\"ram\" value=\"32GB\"/>\n"
                             "           <disk id=\"large_disk\" read_bw=\"50MBps\" write_bw=\"50MBps\">\n"
                             "                            <prop id=\"size\" value=\"5000GiB\"/>\n"
                             "                            <prop id=\"mount\" value=\"/\"/>\n"
                             "           </disk>\n"
                             "       </host>\n"
                             "       <host id=\"ServerHost2\" speed=\"100Gf\" core=\"1000\">\n"
                             "           <prop id=\"ram\" value=\"32GB\"/>\n"
                             "           <disk id=\"large_disk\" read_bw=\"50MBps\" write_bw=\"50MBps\">\n"
                             "                            <prop id=\"size\" value=\"5000GiB\"/>\n"
                             "                            <prop id=\"mount\" value=\"/\"/>\n"
                             "           </disk>\n"
                             "       </host>\n"
                             "       <host id=\"ClientHost\" speed=\"100f\" core=\"1\">\n"
                             "           <disk id=\"hard_disk\" read_bw=\"100000TBps\" write_bw=\"100000TBps\">\n"
                             "                            <prop id=\"size\" value=\"5000GiB\"/>\n"
                             "                            <prop id=\"mount\" value=\"/\"/>\n"
                             "           </disk>\n"
                             "       </host>\n"
                             "       <link id=\"network_link\" bandwidth=\"50MBps\" latency=\"20us\"/>\n"
                             "       <link id=\"network_link2\" bandwidth=\"20MBps\" latency=\"20us\"/>\n"
                             "       <route src=\"WMSHost\" dst=\"ClientHost\">"
                             "           <link_ctn id=\"network_link\"/>"
                             "       </route>\n"
                             "       <route src=\"WMSHost\" dst=\"ServerHost1\">"
                             "           <link_ctn id=\"network_link\"/>"
                             "       </route>\n"
                             "       <route src=\"WMSHost\" dst=\"ServerHost2\">"
                             "           <link_ctn id=\"network_link\"/>"
                             "       </route>\n"
                             "       <route src=\"ClientHost\" dst=\"ServerHost1\">"
                             "           <link_ctn id=\"network_link\"/>"
                             "       </route>\n"
                             "       <route src=\"ClientHost\" dst=\"ServerHost2\">"
                             "           <link_ctn id=\"network_link2\"/>"
                             "       </route>\n"
                             "   </zone>\n"
                             "</platform>\n";

    pugi::xml_document xml_doc;

    if (xml_doc.load_string(xml_string.c_str(), pugi::parse_doctype)) {
          xml_doc.save_file(platform_file_path.c_str());
    } else {
        throw std::runtime_error("something went wrong with parsing xml string");
    }
}

/**
 *
 * @param argc
 * @param argvx
 * @return
 */
int main(int argc, char** argv) {
    wrench::Simulation simulation;
    simulation.init(&argc, argv);

    int PROBABILITY = 0;
    int FILE_SIZE;
    int SCENARIO;

    try {
        if (argc < 2) {
            throw std::invalid_argument("Invalid number of arguments");
        } 
        SCENARIO = std::stoi(std::string(argv[1]));
        if (SCENARIO < 1 || SCENARIO > 4) {
            std::cerr << "Invalid scenario, must be 1,2,3 or 4" << std::endl;
            throw std::invalid_argument("Invalid scenario.");
        }

        if (SCENARIO == 1 || SCENARIO == 3) {
            if (argc != 4) {
                throw std::invalid_argument("Invalid number of arguments");
            }
            PROBABILITY = std::stoi(std::string(argv[2]));
            if (PROBABILITY < 0 || PROBABILITY > 99) {
                std::cerr << "Probability must be between 0 and 99" << std::endl;
                throw std::invalid_argument("Invalid probability.");
            }
            FILE_SIZE = std::stoi(std::string(argv[3]));
        } else if (SCENARIO == 2 || SCENARIO == 4) {
            if (argc != 3) {
                throw std::invalid_argument("Invalid number of arguments");
            }
            FILE_SIZE = std::stoi(std::string(argv[2]));
        }
        if (FILE_SIZE < 1 || FILE_SIZE > 10000) {
            std::cerr << "Invalid file size. Size must be in range [1,10000] MB" << std::endl;
            throw std::invalid_argument("Invalid file size.");
        }
    } catch(std::invalid_argument &e) {
        std::cerr << e.what() << std::endl;
        std::cerr << "Usage: " << argv[0] << " <scenario> <probability> <file_size>" << std::endl;
        std::cerr << "   scenario: Scenario must be between 1 or 2" << std::endl;
        std::cerr << "   probability: Probability must be between 0 and 100" << std::endl;
        std::cerr << "   file size: File size must be in range [1,100000] MBps" << std::endl;
        std::cerr << "" << std::endl;
        return 1;
    }

    wrench::Workflow workflow;
    generateWorkflow(&workflow, SCENARIO, PROBABILITY, FILE_SIZE);

    // read and instantiate the platform with the desired HPC specifications
    std::string platform_file_path = "/tmp/platform.xml";
    generatePlatform(platform_file_path);
    simulation.instantiatePlatform(platform_file_path);

    const std::string CLIENT("ClientHost");
    const std::string WMS("WMSHost");
    const std::string SERVER("ServerHost1");
    const std::string SERVER2("ServerHost2");

    //add services
    auto client_storage_service = simulation.add(new wrench::SimpleStorageService(CLIENT, {"/"}, {{wrench::SimpleStorageServiceProperty::BUFFER_SIZE, "50000000"}}));
    auto storage_service_1 = simulation.add(new wrench::SimpleStorageService(SERVER, {"/"},
            {{wrench::SimpleStorageServiceProperty::BUFFER_SIZE, "50000000"}}));
    auto storage_service_2 = simulation.add(new wrench::SimpleStorageService(SERVER2, {"/"},
            {{wrench::SimpleStorageServiceProperty::BUFFER_SIZE, "50000000"}}));
    auto file_registry = simulation.add(new wrench::FileRegistryService(WMS, {}, {}));

    std::set<std::shared_ptr<wrench::StorageService>> storage_services;
    storage_services.insert(client_storage_service);
    storage_services.insert(storage_service_1);
    storage_services.insert(storage_service_2);

    //add WMS and workflow to simulation
    auto wms = simulation.add(new wrench::ActivityWMS(file_registry, {storage_services}, WMS));

    wms->addWorkflow(&workflow);

    //stage files based on scenario chosen
    for (auto file : workflow.getFiles()) {
        simulation.stageFile(file, storage_service_1);
        if (SCENARIO == 2 || SCENARIO == 3 || SCENARIO == 4) {
            simulation.stageFile(file, storage_service_2);
        }
    }

    simulation.launch();

    // Gather the data transfer completion times
    auto file_copy_starts = simulation.getOutput().getTrace<wrench::SimulationTimestampFileCopyStart>();

    std::cerr << "----------------------------------------" << std::endl;
    std::cerr.precision(4);

    for (const auto &file_copy : file_copy_starts) {
        double start_time = file_copy->getDate();
        double end_time = file_copy->getContent()->getEndpoint()->getDate();
        double duration = end_time - start_time;

        std::cerr << file_copy->getContent()->getFile()->getSize() / (1000.0 * 1000.0) <<
        " MB transfer completed at time " << duration << std::endl;
    }
    std::cerr << "----------------------------------------" << std::endl;

    return 0;
}
