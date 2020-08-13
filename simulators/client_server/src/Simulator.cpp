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

/**
 * @brief Generates an independent-task Workflow
 *
 * @param workflow
 * @param file_size_in_mb
 *
 * @throws std::invalid_argument
 */
void generateWorkflow(wrench::Workflow *workflow, int file_size_in_mb) {

    if (workflow == nullptr) {
        throw std::invalid_argument("generateWorkflow(): invalid workflow");
    }

    // WorkflowTask specifications
    const double               GFLOP = 1000.0 * 1000.0 * 1000.0;
    const unsigned long    MIN_CORES = 1;
    const unsigned long    MAX_CORES = 1;
    const double                  MB = 1000.0 * 1000.0;
    const double                  GB = 1000.0 * 1000.0 * 1000.0;

    wrench::WorkflowTask *single_task;
    single_task = workflow->addTask("slow_server_task", 1000 * GFLOP, MIN_CORES, MAX_CORES, 8 * GB);
    single_task->addInputFile(workflow->addFile("file_copy", file_size_in_mb*MB));

}

/**
 * @brief Generates a platform with a single multi-core host
 * @param platform_file_path: path to write the platform file to
 *
 * @throws std::invalid_argumemnt
 */
void generatePlatform(std::string platform_file_path, int link_1_latency, int link_1_bandwidth, int  link_2_bandwidth, int disk_toggle, int disk_speed) {

    if (platform_file_path.empty()) {
        throw std::invalid_argument("generatePlatform() platform_file_path cannot be empty");
    }
    if (link_1_bandwidth < 1 ) {
        throw std::invalid_argument("generatePlatform() bandwidth must be greater than 1");
    }
    if (disk_toggle != 0 && disk_toggle != 1 ) {
        throw std::invalid_argument("generatePlatform() disk_toggle must be 1 or 0");
    }
    if (disk_speed <= 0) {
        throw std::invalid_argument("generatePlatform() disk_speed must be greater than 0");
    }


    // Create a the platform file
    std::string xml_string = "<?xml version='1.0'?>\n"
                             "<!DOCTYPE platform SYSTEM \"http://simgrid.gforge.inria.fr/simgrid/simgrid.dtd\">\n"
                             "<platform version=\"4.1\">\n"
                             "   <zone id=\"AS0\" routing=\"Full\">\n"
                             "       <!-- effective bandwidth = 10 MBps-->"
                             "       <link id=\"link1\" bandwidth=\"10.309MBps\" latency=\"10us\"/>\n"
                             "       <link id=\"link2\" bandwidth=\"103.09MBps\" latency=\"10us\"/>\n"
                             "       <host id=\"client\" speed=\"100Gf\" core=\"1000\">\n"
                             "           <prop id=\"ram\" value=\"32GB\"/>\n"
                             "           <disk id=\"large_disk\" read_bw=\"50MBps\" write_bw=\"50MBps\">\n"
                             "                            <prop id=\"size\" value=\"5000GiB\"/>\n"
                             "                            <prop id=\"mount\" value=\"/\"/>\n"
                             "           </disk>\n"
                             "       </host>\n"
                             "       <host id=\"server2\" speed=\"60Gf\" core=\"1\">\n"
                             "           <prop id=\"ram\" value=\"32GB\"/>\n"
                             "           <disk id=\"large_disk1\" read_bw=\"100000TBps\" write_bw=\"100000TBps\">\n"
                             "                            <prop id=\"size\" value=\"5000GiB\"/>\n"
                             "                            <prop id=\"mount\" value=\"/\"/>\n"
                             "           </disk>\n"
                             "       </host>\n"
                             "       <host id=\"server1\" speed=\"100Gf\" core=\"1\">\n"
                             "           <prop id=\"ram\" value=\"32GB\"/>\n"
                             "           <disk id=\"large_disk2\" read_bw=\"100000TBps\" write_bw=\"100000TBps\">\n"
                             "                            <prop id=\"size\" value=\"5000GiB\"/>\n"
                             "                            <prop id=\"mount\" value=\"/\"/>\n"
                             "           </disk>\n"
                             "       </host>\n"
                             "       <link id=\"loopback\" bandwidth=\"100000TBps\" latency=\"0us\"/>\n"
                             "       <route src=\"client\" dst=\"server1\">"
                             "           <link_ctn id=\"link1\"/>"
                             "       </route>"
                             "       <route src=\"client\" dst=\"server2\">"
                             "           <link_ctn id=\"link2\"/>"
                             "       </route>"
                             "       <route src=\"server1\" dst=\"server1\">"
                             "           <link_ctn id=\"loopback\"/>"
                             "       </route>"
                             "       <route src=\"server2\" dst=\"server2\">"
                             "           <link_ctn id=\"loopback\"/>"
                             "       </route>"
                             "   </zone>\n"
                             "</platform>\n";


    pugi::xml_document xml_doc;

    if (xml_doc.load_string(xml_string.c_str(), pugi::parse_doctype)) {

        pugi::xml_node link1 = xml_doc.child("platform").child("zone").child("link");
        pugi::xml_node link2 = xml_doc.child("platform").child("zone").child("link").next_sibling("link");
        pugi::xml_node disk0 = xml_doc.child("platform").child("zone").child("host").child("disk");


        // entering (effective_bandwidth / 0.97) as bandwidth into the simulation
        // so that the max bandwidth we can achieve is the effective_bandwidth
        double link_1_real_bandwidth = link_1_bandwidth / 0.97;
        double link_2_real_bandwidth = link_2_bandwidth / 0.97;

        link1.attribute("bandwidth").set_value(std::string(std::to_string(link_1_real_bandwidth) + "MBps").c_str());
        link1.attribute("latency").set_value(std::string(std::to_string(link_1_latency) + "us").c_str());
        link2.attribute("bandwidth").set_value(std::string(std::to_string(link_2_real_bandwidth) + "MBps").c_str());

        if (disk_toggle == 0) {
            disk0.attribute("read_bw").set_value(std::string(std::to_string(999999999999999999) + "MBps").c_str());
            disk0.attribute("write_bw").set_value(std::string(std::to_string(999999999999999999) + "MBps").c_str());
        } else {
            disk0.attribute("read_bw").set_value(std::string(std::to_string(disk_speed) + "MBps").c_str());
            disk0.attribute("write_bw").set_value(std::string(std::to_string(disk_speed) + "MBps").c_str());
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
    int SERVER_1_LINK_BANDWIDTH;
    int SERVER_2_LINK_BANDWIDTH;
    int BUFFER_SIZE;
    std::string BUFFER_STRING;
    int DISK_TOGGLE;
    int DISK_SPEED;
    int SERVER_1_LINK_LATENCY;
    int FILE_SIZE;

    try {

        if (argc != 9) {
            throw std::invalid_argument("invalid number of arguments");
        }

        SERVER_1_LINK_LATENCY  =  std::stoi(std::string(argv[1]));
        if (SERVER_1_LINK_LATENCY < 1 || SERVER_1_LINK_LATENCY > 1000000) {
            std::cerr << "Invalid server1 link latency. latency must be in range [1,1000000] us" << std::endl;
            throw std::invalid_argument("invalid server1 link latency");
        }

        SERVER_1_LINK_BANDWIDTH = std::stoi(std::string(argv[2]));

        if (SERVER_1_LINK_BANDWIDTH < 1 || SERVER_1_LINK_BANDWIDTH > 10000) {
            std::cerr << "Invalid server1 link speed. Speed must be in range [1,10000] MBps" << std::endl;
            throw std::invalid_argument("invalid server1 link speed");
        }

        SERVER_2_LINK_BANDWIDTH = std::stoi(std::string(argv[3]));

        if (SERVER_2_LINK_BANDWIDTH < 1 || SERVER_2_LINK_BANDWIDTH > 10000) {
            std::cerr << "Invalid server2 link speed. Speed must be in range [1,10000] MBps" << std::endl;
            throw std::invalid_argument("invalid server2 link speed");
        }

        BUFFER_STRING = std::string(argv[4]);
        BUFFER_SIZE = std::stoi(BUFFER_STRING);

        if (BUFFER_SIZE < 1 || BUFFER_SIZE > 1000000000) {
            std::cerr << "Invalid buffer size. Buffer must be in range [1,100000000] bytes" << std::endl;
            throw std::invalid_argument("invalid buffer size");
        }

        HOST_SELECT = std::stoi(std::string(argv[5]));

        if (HOST_SELECT !=  1 && HOST_SELECT != 2) {
            std::cerr << "Invalid host selection. Host must be either 1 or 2" << std::endl;
            throw std::invalid_argument("invalid host selection");
        }

        DISK_TOGGLE = std::stoi(std::string(argv[6]));

        if (DISK_TOGGLE !=  0 && DISK_TOGGLE != 1) {
            std::cerr << "Invalid disk toggle value, should be binary." << std::endl;
            throw std::invalid_argument("invalid disk toggle");
        }

        if (DISK_TOGGLE == 0) {
            BUFFER_STRING = std::string("infinity");
        }

        DISK_SPEED = std::stoi(std::string(argv[7]));

        if (DISK_SPEED <  1 || DISK_SPEED > 100000) {
            std::cerr << "Invalid disk speed. Speed must be in range [1,10000] MBps" << std::endl;
            throw std::invalid_argument("invalid link speed");
        }

        FILE_SIZE = std::stoi(std::string(argv[8]));

        if (FILE_SIZE <  1 || FILE_SIZE > 10000) {
            std::cerr << "Invalid file size. Speed must be in range [1,10000] MB" << std::endl;
            throw std::invalid_argument("invalid link speed");
        }


    } catch(std::invalid_argument &e) {
        std::cerr << e.what() << std::endl;
        std::cerr << "Usage: " << argv[0] << " <server_1_link_latency> <server_1_link_speed> <server_2_link_speed> <buffer> <host_select> <disk select> <disk speed>" << std::endl;
        std::cerr << "   server_1_link_latency: Latency must be in range [1,1000000] us  (microsecs)" << std::endl;
        std::cerr << "   server_1_link_speed: Speed must be in range [1,10000] MBps" << std::endl;
        std::cerr << "   server_2_link_speed: Speed must be in range [1,10000] MBps" << std::endl;
        std::cerr << "   buffer: buffer size must be inn range [1,1000000000] bytes" << std::endl;
        std::cerr << "   host select: host selection should be either 1 or 2" << std::endl;
        std::cerr << "   disk toggle: disk toggle should be either 0 or 1" << std::endl;
        std::cerr << "   disk speed: Speed must be in range [1,100000] MBps" << std::endl;
        std::cerr << "   file size: File size must be in range [1,100000] MBps" << std::endl;
        std::cerr << "" << std::endl;
        return 1;
    }

    // create workflow
    wrench::Workflow workflow;
    generateWorkflow(&workflow, FILE_SIZE);

    // read and instantiate the platform with the desired HPC specifications
    std::string platform_file_path = "/tmp/platform.xml";
    generatePlatform(platform_file_path, SERVER_1_LINK_LATENCY, SERVER_1_LINK_BANDWIDTH, SERVER_2_LINK_BANDWIDTH, DISK_TOGGLE, DISK_SPEED);
    simulation.instantiatePlatform(platform_file_path);


    const std::string CLIENT("client");
    const std::string SERVER1("server1");
    const std::string SERVER2("server2");


    std::set<std::shared_ptr<wrench::StorageService>> storage_services;
    std::shared_ptr<wrench::StorageService> client_storage_service;

    client_storage_service = simulation.add(new wrench::SimpleStorageService(CLIENT, {"/"}, {{wrench::SimpleStorageServiceProperty::BUFFER_SIZE, BUFFER_STRING}}));


    storage_services.insert(client_storage_service);

    std::shared_ptr<wrench::ComputeService> compute_service;
    if (HOST_SELECT == 1){
        compute_service = simulation.add(
                new wrench::BareMetalComputeService(
                        CLIENT,
                        {{SERVER1, std::make_tuple(wrench::ComputeService::ALL_CORES, wrench::ComputeService::ALL_RAM)}},
                        "",
                        {
                                {wrench::BareMetalComputeServiceProperty::TASK_STARTUP_OVERHEAD, "0"},
                        },
                        {}
                )
        );

        auto server_storage_service = simulation.add(new wrench::SimpleStorageService(SERVER1, {"/"}, {{wrench::SimpleStorageServiceProperty::BUFFER_SIZE, BUFFER_STRING}}));
        storage_services.insert(server_storage_service);
    } else {
        compute_service = simulation.add(
                new wrench::BareMetalComputeService(
                        CLIENT,
                        {{SERVER2, std::make_tuple(wrench::ComputeService::ALL_CORES, wrench::ComputeService::ALL_RAM)}},
                        "",
                        {
                                {wrench::BareMetalComputeServiceProperty::TASK_STARTUP_OVERHEAD, "0"},
                        },
                        {}
                )
        );
        auto server_storage_service = simulation.add(new wrench::SimpleStorageService(SERVER2, {"/"}, {{wrench::SimpleStorageServiceProperty::BUFFER_SIZE, BUFFER_STRING}}));
        storage_services.insert(server_storage_service);
    }


    // wms
    auto wms = simulation.add(new wrench::ActivityWMS(
            {compute_service},
            storage_services,
            CLIENT
    ));





    wms->addWorkflow(&workflow);

    simulation.add(new wrench::FileRegistryService(CLIENT));

    for (auto const &file : workflow.getInputFiles()) {
        simulation.stageFile(file, client_storage_service);
    }

    simulation.getOutput().enableDiskTimestamps(true);

    simulation.launch();

    simulation.getOutput().dumpUnifiedJSON(&workflow, "/tmp/workflow_data.json", false, true, true, false, true, true);

    return 0;
}
