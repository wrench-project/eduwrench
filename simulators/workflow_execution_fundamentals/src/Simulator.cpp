#include <iostream>
#include <fstream>
#include <iomanip>
#include <string>

#include <wrench.h>
#include <nlohmann/json.hpp>
#include <pugixml.hpp>

#include "ActivityWMS.h"
#include "ActivityScheduler.h"

/**
 * @brief Generate the workflow for activity 1
 * @description Fork-Join
 */
void generateWorkflow(wrench::Workflow *workflow) {

    const double TFLOP = 1000.0 * 1000.0 * 1000.0 * 1000.0;
    const double MB    = 1000.0 * 1000.0;

    wrench::WorkflowTask *task0 = workflow->addTask("task0", 100 * TFLOP, 1, 1, 1.0, 0);
    task0->addInputFile(workflow->addFile("task0::0.in", 200 * MB));
    task0->addOutputFile(workflow->addFile("task0::0.out", 400 * MB));

    wrench::WorkflowTask *task1 = workflow->addTask("task1", 35 * TFLOP, 1, 1, 1.0, 0);
    task1->addInputFile(workflow->getFileByID("task0::0.out"));
    task1->addOutputFile(workflow->addFile("task1::0.out", 100 * MB));
}

/**
 * @brief Generate the platform file for activity 1
 * @param platform_file_path: path to write the file to
 * @param compute_speed: compute speed in GFlop/sec
 */
void generatePlatform(std::string platform_file_path, int compute_speed) {
    if (platform_file_path.empty()) {
        throw std::invalid_argument("generatePlatform() platform_file_path cannot be empty");
    }

    int effective_bandwidth = 10 * 1000 * 1000; // 10 MBps

    if (compute_speed < 1 ) {
        throw std::invalid_argument("generatePlatform() bandwidth must be greater than 1");
    }

    std::string xml_string = "<?xml version='1.0'?>\n"
                      "<!DOCTYPE platform SYSTEM \"http://simgrid.gforge.inria.fr/simgrid/simgrid.dtd\">\n"
                      "<platform version=\"4.1\">\n"
                      "   <zone id=\"AS0\" routing=\"Full\">\n"
                      "       <host id=\"my_lab_computer.edu\" speed=\"1000Gf\" core=\"1\"/>\n"
                      "       <host id=\"hpc.edu\" speed=\"1000Gf\" core=\"1\"/>\n"
                      "       <host id=\"storage_db.edu\" speed=\"1000Gf\" core=\"1\"/>\n"

                      "       <!-- effective bandwidth = 10 MBps-->"
                      "       <link id=\"1\" bandwidth=\"10.309MBps\" latency=\"10us\"/>\n"

                      "       <route src=\"my_lab_computer.edu\" dst=\"hpc.edu\">\n"
                      "           <link_ctn id=\"1\"/>\n"
                      "       </route>\n"

                      "       <route src=\"storage_db.edu\" dst=\"my_lab_computer.edu\">\n"
                      "           <link_ctn id=\"1\"/>\n"
                      "       </route>\n"

                      "       <route src=\"storage_db.edu\" dst=\"hpc.edu\">\n"
                      "           <link_ctn id=\"1\"/>\n"
                      "       </route>\n"
                      "    </zone>\n"
                      "</platform>";

    pugi::xml_document xml_doc;

    // Fix the compute speed
    if (xml_doc.load_string(xml_string.c_str(), pugi::parse_doctype)) {

        auto parents = xml_doc.child("platform").child("zone");
        auto host = parents.find_child_by_attribute("id", "hpc.edu");
        host.attribute("speed").set_value(std::string(std::to_string(compute_speed) + "Gf").c_str());
        xml_doc.save_file(platform_file_path.c_str());

    } else {
        throw std::runtime_error("something went wrong with parsing xml string");
    }
}

/**
 * @brief Activity 1 Simulation
 * @param argc
 * @param argv
 * @return
 */
int main(int argc, char** argv) {

    wrench::Simulation simulation;
    simulation.init(&argc, argv);

    int COMPUTE_SPEED;

    try {
        if (argc != 2) {
            throw std::invalid_argument("bad args");
        }

        COMPUTE_SPEED = std::stoi(std::string(argv[1]));

        if (COMPUTE_SPEED < 1) {
            std::cerr << "Compute Speed must be greater than 0 GFlop/sec";
            throw std::invalid_argument("invalid compute speed");
        }
    } catch(std::invalid_argument &e) {
        std::cerr << "Usage: " << argv[0] << " <compute speed>" << std::endl;
        std::cerr << "    compute speed: measured in GFlop/sec" << std::endl;
        return 1;
    }

    // generate workflow
    wrench::Workflow workflow;
    generateWorkflow(&workflow);

    // generate platform
    std::string platform_file_path = "/tmp/platform.xml";
    generatePlatform(platform_file_path, COMPUTE_SPEED);

    simulation.instantiatePlatform(platform_file_path);

    const std::string WMS_HOST("my_lab_computer.edu");
    const std::string COMPUTE_HOST("hpc.edu");
    const std::string STORAGE_HOST("storage_db.edu");

    // storage service on storage_db_edu
    auto storage_db_edu_storage_service = simulation.add(new wrench::SimpleStorageService(STORAGE_HOST, 10000000000000.0));

    auto compute_service = simulation.add(new wrench::BareMetalComputeService(
                COMPUTE_HOST,
                {COMPUTE_HOST},
                {},
                {}
            ));

    // WMS on my_lab_computer_edu
    auto wms = simulation.add(new wrench::ActivityWMS(std::unique_ptr<wrench::ActivityScheduler> (
            new wrench::ActivityScheduler(storage_db_edu_storage_service)),
            {compute_service},
            {storage_db_edu_storage_service},
            WMS_HOST
            ));

    wms->addWorkflow(&workflow);

    // file registry service on storage_db_edu
    simulation.add(new wrench::FileRegistryService(WMS_HOST));

    // stage the input files
    std::map<std::string, wrench::WorkflowFile *> input_files = workflow.getInputFiles();
    simulation.stageFiles(input_files, storage_db_edu_storage_service);

    // launch the simulation
    simulation.launch();

    simulation.getOutput().dumpWorkflowExecutionJSON(&workflow, "workflow_data.json");
    //simulation.getOutput().dumpWorkflowGraphJSON(&workflow, "workflow_graph.json");
}
