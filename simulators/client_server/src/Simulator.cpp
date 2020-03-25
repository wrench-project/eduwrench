#include <iostream>
#include <fstream>
#include <iomanip>
#include <string>
#include <algorithm>

#include <simgrid/s4u.hpp>
#include <wrench.h>
#include <nlohmann/json.hpp>
#include <pugixml.hpp>

#include "ActivityWMS.h"
#include "ActivityScheduler.h"

/**
 * @brief Generates an independent-task Workflow
 *
 * @param workflow
 * @param host_select: which host to use
 *
 * @throws std::invalid_argument
 */
void generateWorkflow(wrench::Workflow *workflow, int host_select) {

    if (workflow == nullptr) {
        throw std::invalid_argument("generateWorkflow(): invalid workflow");
    }

    if (host_select != 0 && host_select != 1) {
        throw std::invalid_argument("generateWorkflow(): valid host must be selected");
    }


    // WorkflowTask specifications
    const double               GFLOP = 1000.0 * 1000.0 * 1000.0;
    const unsigned long    MIN_CORES = 1;
    const unsigned long    MAX_CORES = 1;
    const double PARALLEL_EFFICIENCY = 1.0;
    const double                  GB = 1000.0 * 1000.0 * 1000.0;

    wrench::WorkflowTask *single_task;
    if (host_select == 0) {
        single_task = workflow->addTask("slow_server_task", 10 * GFLOP, MIN_CORES, MAX_CORES, PARALLEL_EFFICIENCY, 8 * GB);
    } else {
        single_task = workflow->addTask("fast_server_task", 10 * GFLOP, MIN_CORES, MAX_CORES, PARALLEL_EFFICIENCY, 8 * GB);
    }
    single_task->addInputFile(workflow->addFile("file_copy", 0.1*GB));

}

/**
 * @brief Generates a platform with a single multi-core host
 * @param platform_file_path: path to write the platform file to
 *
 * @throws std::invalid_argumemnt
 */
void generatePlatform(std::string platform_file_path, int link_1_bandwidth, int disk_toggle) {

    if (platform_file_path.empty()) {
        throw std::invalid_argument("generatePlatform() platform_file_path cannot be empty");
    }
    if (link_1_bandwidth < 1 ) {
        throw std::invalid_argument("generatePlatform() bandwidth must be greater than 1");
    }
    if (disk_toggle != 0 && disk_toggle != 1 ) {
        throw std::invalid_argument("generatePlatform() disk_toggle must be 1 or 0");
    }




    // Create a the platform file
    std::string xml_string = "<?xml version='1.0'?>\n"
                      "<!DOCTYPE platform SYSTEM \"http://simgrid.gforge.inria.fr/simgrid/simgrid.dtd\">\n"
                      "<platform version=\"4.1\">\n"
                      "   <zone id=\"AS0\" routing=\"Full\">\n"
                      "       <!-- effective bandwidth = 10 MBps-->"
                      "       <link id=\"slow_link\" bandwidth=\"10.309MBps\" latency=\"10us\"/>\n"
                      "       <link id=\"fast_link\" bandwidth=\"103.09MBps\" latency=\"10us\"/>\n"
                      "       <host id=\"client\" speed=\"100Gf\" core=\"1000\">\n"
                      "           <prop id=\"ram\" value=\"32GB\"/>\n"
                      "           <disk id=\"large_disk\" read_bw=\"50MBps\" write_bw=\"50MBps\">\n"
                      "                            <prop id=\"size\" value=\"5000GiB\"/>\n"
                      "                            <prop id=\"mount\" value=\"/\"/>\n"
                      "           </disk>\n"
                      "       </host>\n"
                      "       <host id=\"slow_server\" speed=\"10Gf\" core=\"1000\">\n"
                      "           <prop id=\"ram\" value=\"32GB\"/>\n"
                      "       </host>\n"
                      "       <host id=\"fast_server\" speed=\"100Gf\" core=\"1000\">\n"
                      "           <prop id=\"ram\" value=\"32GB\"/>\n"
                      "       </host>\n"
                      "       <link id=\"link\" bandwidth=\"100000TBps\" latency=\"0us\"/>\n"
                      "       <route src=\"client\" dst=\"fast_server\">"
                      "           <link_ctn id=\"slow_link\"/>"
                      "       </route>"
                      "       <route src=\"client\" dst=\"slow_server\">"
                      "           <link_ctn id=\"fast_link\"/>"
                      "       </route>"
                      "   </zone>\n"
                      "</platform>\n";


    pugi::xml_document xml_doc;

    if (xml_doc.load_string(xml_string.c_str(), pugi::parse_doctype)) {

        pugi::xml_node link1 = xml_doc.child("platform").child("zone").child("link");
        pugi::xml_node link2 = xml_doc.child("platform").child("zone").next_sibling("link");
        pugi::xml_node disk0 = xml_doc.child("platform").child("zone").child("host").child("disk");


        // entering (effective_bandwidth / 0.97) as bandwidth into the simulation
        // so that the max bandwidth we can achieve is the effective_bandwidth
        double link_1_real_bandwidth = link_1_bandwidth / 0.97;
        //double link_2_real_bandwidth = link_2_bandwidth / 0.97;

        link1.attribute("bandwidth").set_value(std::string(std::to_string(link_1_real_bandwidth) + "MBps").c_str());
        //link2.attribute("bandwidth").set_value(std::string(std::to_string(link_2_real_bandwidth) + "MBps").c_str());

        if (disk_toggle == 0) {
            disk0.attribute("read_bw").set_value(std::string(std::to_string(999999999999999999) + "MBps").c_str());
            disk0.attribute("write_bw").set_value(std::string(std::to_string(999999999999999999) + "MBps").c_str());
        }

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

    const int MAX_CORES         = 1000;
    int HOST_SELECT;
    int SERVER_1_LINK;
    int BUFFER;
    std::string BUFFER_STRING;
    int DISK_TOGGLE;


    try {

        if (argc != 5) {
            throw std::invalid_argument("bad args");
        }

        SERVER_1_LINK = std::stoi(std::string(argv[1]));


        if (SERVER_1_LINK <  1 || SERVER_1_LINK > 10000) {
            std::cerr << "Invalid link speed. Speed must be in range [1,10000] MBps" << std::endl;
            throw std::invalid_argument("invalid link speed");
        }

        BUFFER_STRING = std::string(argv[2]);
        BUFFER = std::stoi(BUFFER_STRING);

        if (BUFFER <  1 || BUFFER > 1000000000) {
            std::cerr << "Invalid buffer size. Buffer must be in range [1,100000000] bytes" << std::endl;
            throw std::invalid_argument("invalid buffer size");
        }


        HOST_SELECT = std::stoi(std::string(argv[3]));

        if (HOST_SELECT !=  0 && HOST_SELECT != 1) {
            std::cerr << "Invalid host selection. Host must be either 0 or 1" << std::endl;
            throw std::invalid_argument("invalid host selection");
        }

        DISK_TOGGLE = std::stoi(std::string(argv[4]));

        if (DISK_TOGGLE !=  0 && DISK_TOGGLE != 1) {
            std::cerr << "Invalid disk toggle value, should be binary." << std::endl;
            throw std::invalid_argument("invalid disk toggle");
        }


    } catch(std::invalid_argument &e) {
        std::cerr << "Usage: " << argv[0] << " <server_1_link_speed> <buffer> <host_select>" << std::endl;
        std::cerr << "   server_1_link_speed: Speed must be in range [1,10000] MBps" << std::endl;
        std::cerr << "   buffer: buffer size must be inn range [1,1000000000] bytes" << std::endl;
        std::cerr << "   host_select: host selection should be either 0 or 1" << std::endl;
        std::cerr << "   disk_toggle: disk toggle should be either 0 or 1" << std::endl;
        std::cerr << "" << std::endl;
        return 1;
    }

    // create workflow
    wrench::Workflow workflow;
    generateWorkflow(&workflow, HOST_SELECT);

    // read and instantiate the platform with the desired HPC specifications
    std::string platform_file_path = "/tmp/platform.xml";
    generatePlatform(platform_file_path, SERVER_1_LINK, DISK_TOGGLE);
    simulation.instantiatePlatform(platform_file_path);


    const std::string CLIENT("client");
    const std::string SLOW_SERVER("slow_server");
    const std::string FAST_SERVER("fast_server");


    std::set<std::shared_ptr<wrench::StorageService>> storage_services;
    std::shared_ptr<wrench::StorageService> client_storage_service;

    if(DISK_TOGGLE == 0) {
        client_storage_service = simulation.add(new wrench::SimpleStorageService(CLIENT, {"/"}, {{wrench::SimpleStorageServiceProperty::BUFFER_SIZE, "infinity"}}));
    } else {
        client_storage_service = simulation.add(new wrench::SimpleStorageService(CLIENT, {"/"}, {{wrench::SimpleStorageServiceProperty::BUFFER_SIZE, BUFFER_STRING}}));
    }


    storage_services.insert(client_storage_service);

    std::shared_ptr<wrench::ComputeService> compute_service;
    if (HOST_SELECT == 0){
        compute_service = simulation.add(
                new wrench::BareMetalComputeService(
                        CLIENT,
                        {{SLOW_SERVER, std::make_tuple(wrench::ComputeService::ALL_CORES, wrench::ComputeService::ALL_RAM)}},
                        "",
                        {
                                {wrench::BareMetalComputeServiceProperty::TASK_STARTUP_OVERHEAD, "0"},
                        },
                        {}
                )
        );
    } else {
        compute_service = simulation.add(
                new wrench::BareMetalComputeService(
                        CLIENT,
                        {{FAST_SERVER, std::make_tuple(wrench::ComputeService::ALL_CORES, wrench::ComputeService::ALL_RAM)}},
                        "",
                        {
                                {wrench::BareMetalComputeServiceProperty::TASK_STARTUP_OVERHEAD, "0"},
                        },
                        {}
                )
        );
    }


    // wms
    auto wms = simulation.add(new wrench::ActivityWMS(std::unique_ptr<wrench::ActivityScheduler>(
            new wrench::ActivityScheduler(client_storage_service)),
                                                      {compute_service},
                    storage_services,
                    CLIENT
    ));





    wms->addWorkflow(&workflow);

    simulation.add(new wrench::FileRegistryService(CLIENT));

    for (auto const &file : workflow.getInputFiles()) {
        simulation.stageFile(file.second, client_storage_service);
    }

    simulation.launch();

    simulation.getOutput().dumpUnifiedJSON(&workflow, "workflow_data.json", false, true, true, false, false);
    //simulation.getOutput().dumpWorkflowExecutionJSON(&workflow, "workflow_data.json", false);
    //simulation.getOutput().dumpWorkflowGraphJSON(&workflow, "workflow_graph.json");

    return 0;
}
