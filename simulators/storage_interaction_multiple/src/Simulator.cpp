/**
 * Copyright (c) 2021. The WRENCH Team.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 */

#include <iostream>
#include <random>
#include <string>
#include <algorithm>

#include <simgrid/s4u.hpp>
#include <wrench.h>
#include <pugixml.hpp>

#include "ActivityWMS.h"

/**
 * @brief Generates a platform with a single multi-core host
 * @param platform_file_path: path to write the platform file to
 *
 * @throws std::invalid_argumemnt
 */
void generatePlatform(std::string &platform_file_path,
                      int server_link_bandwidth[],
                      int server_link_latency[]) {
    if (platform_file_path.empty()) {
        throw std::invalid_argument("generatePlatform() platform_file_path cannot be empty");
    }

    // Create the platform file
    std::string xml_string = "<?xml version='1.0'?>\n"
                             "<!DOCTYPE platform SYSTEM \"http://simgrid.gforge.inria.fr/simgrid/simgrid.dtd\">\n"
                             "<platform version=\"4.1\">\n"
                             "   <zone id=\"AS0\" routing=\"Full\">\n"
                             "       <host id=\"Services\" speed=\"100Gf\" core=\"16\">\n"
                             "       </host>\n"
                             "       <host id=\"Client\" speed=\"100f\" core=\"16\">\n"
                             "           <disk id=\"hard_disk\" read_bw=\"100000TBps\" write_bw=\"100000TBps\">\n"
                             "                            <prop id=\"size\" value=\"5000GiB\"/>\n"
                             "                            <prop id=\"mount\" value=\"/\"/>\n"
                             "           </disk>\n"
                             "       </host>\n";

    for (int i = 1; i <= 3; ++i) {
        xml_string += "       <host id=\"StorageService_" + std::to_string(i) + "\" speed=\"100Gf\" core=\"16\">\n";
        xml_string += "           <disk id=\"large_disk\" read_bw=\"50MBps\" write_bw=\"50MBps\">\n"
                      "                            <prop id=\"size\" value=\"5000GiB\"/>\n"
                      "                            <prop id=\"mount\" value=\"/\"/>\n"
                      "           </disk>\n"
                      "       </host>\n";
        xml_string += "       <link id=\"network_link_" + std::to_string(i) + "\" bandwidth=\"" +
                      std::to_string(server_link_bandwidth[i - 1]) + "MBps\" latency=\"" +
                      std::to_string(server_link_latency[i - 1]) + "us\"/>\n";
    }

    xml_string += "       <link id=\"servers_link\" bandwidth=\"100MBps\" latency=\"1us\"/>"
                  "       <link id=\"client_link\" bandwidth=\"20MBps\" latency=\"20us\"/>\n";

    for (int i = 1; i <= 3; i++) {
        // client to server route
        xml_string += "       <route src=\"Client\" dst=\"StorageService_" + std::to_string(i) + "\">";
        xml_string += "           <link_ctn id=\"network_link_" + std::to_string(i) + "\"/>\n</route>\n";

        // services to server route
        xml_string += "       <route src=\"Services\" dst=\"StorageService_" + std::to_string(i) + "\">";
        xml_string += "           <link_ctn id=\"servers_link\"/>\n</route>\n";

        // server to server routes
        for (int j = i + 1; j <= 3; ++j) {
            xml_string += "       <route src=\"StorageService_" + std::to_string(i) + "\" dst=\"StorageService_" +
                          std::to_string(j) + "\">";
            xml_string += "           <link_ctn id=\"servers_link\"/>\n</route>\n";
        }
    }

    xml_string += "       <route src=\"Services\" dst=\"Client\">"
                  "           <link_ctn id=\"client_link\"/>"
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
int main(int argc, char **argv) {
    wrench::Simulation simulation;
    simulation.init(&argc, argv);

    long FILE_SIZE; // 10 GB
    int SERVER_LINK_BANDWIDTH[3];
    int SERVER_LINK_LATENCY[3];

    std::vector<std::string> HOST_LIST;

    //server names
    const std::string CLIENT("Client");
    const std::string SERVICES("Services");

    try {
        if (argc != 8) {
            throw std::invalid_argument("Invalid number of arguments");
        }
        FILE_SIZE = std::stol(std::string(argv[1]));
        SERVER_LINK_BANDWIDTH[0] = std::stoi(std::string(argv[2]));
        SERVER_LINK_LATENCY[0] = std::stoi(std::string(argv[3]));
        SERVER_LINK_BANDWIDTH[1] = std::stoi(std::string(argv[4]));
        SERVER_LINK_LATENCY[1] = std::stoi(std::string(argv[5]));
        SERVER_LINK_BANDWIDTH[2] = std::stoi(std::string(argv[6]));
        SERVER_LINK_LATENCY[2] = std::stoi(std::string(argv[7]));

    } catch (std::invalid_argument &e) {
        std::cerr << e.what() << std::endl;
        std::cerr << "Usage: " << argv[0]
                  << " <file_size> <server1_bandwidth> <server1_latency> <server2_bandwidth> <server2_latency>"
                     " <server3_bandwidth> <server3_latency>"
                  << std::endl;
        return 1;
    }

    //setting up random number generator
//    std::random_device rd;
//    std::mt19937 gen(rd());
//    std::uniform_int_distribution<> bandwidth_distribution(100, 1000);
//    std::uniform_int_distribution<> latency_distribution(10, 100);
//    int SERVER_LINK_BANDWIDTH[3] = {bandwidth_distribution(gen),
//                                    bandwidth_distribution(gen),
//                                    bandwidth_distribution(gen)};
//    int SERVER_LINK_LATENCY[3] = {latency_distribution(gen),
//                                  latency_distribution(gen),
//                                  latency_distribution(gen)};

    // create workflow
    wrench::Workflow workflow;
    workflow.addFile("data.file", FILE_SIZE);

    // read and instantiate the platform with the desired HPC specifications
    std::string platform_file_path = "/tmp/platform.xml";
    generatePlatform(platform_file_path, SERVER_LINK_BANDWIDTH, SERVER_LINK_LATENCY);
    simulation.instantiatePlatform(platform_file_path);

    std::set<std::shared_ptr<wrench::StorageService>> storage_services;

    //instantiate storage services
    auto client_storage_service = simulation.add(new wrench::SimpleStorageService(
            CLIENT, {"/"},
            {{wrench::SimpleStorageServiceProperty::BUFFER_SIZE, "50000000"}}));
    storage_services.insert(client_storage_service);

    for (int i = 1; i <= 3; ++i) {
        auto server_storage_service = simulation.add(new wrench::SimpleStorageService(
                "StorageService_" + std::to_string(i), {"/"},
                {{wrench::SimpleStorageServiceProperty::BUFFER_SIZE, "50000000"}}));
        storage_services.insert(server_storage_service);
        HOST_LIST.push_back("StorageService_" + std::to_string(i));
    }

    //instantiate wms and file registry
    auto file_registry = new wrench::FileRegistryService(SERVICES, {}, {});
    auto file_registry_ptr = simulation.add(file_registry);

//    std::cerr << "----------------------------------------" << std::endl;
//    for (int i = 0; i < 3; ++i) {
//        std::cerr << "StorageService_" << i + 1 << ":" << std::endl;
//        std::cerr << "  Bandwidth: " << SERVER_LINK_BANDWIDTH[i] << " Mbps" << std::endl;
//        std::cerr << "  Latency: " << SERVER_LINK_LATENCY[i] << " us" << std::endl;
//    }
//    std::cerr << "----------------------------------------" << std::endl;

    HOST_LIST.push_back(CLIENT);
    auto np_service = simulation.add(new wrench::NetworkProximityService(
            SERVICES, HOST_LIST,
            {{wrench::NetworkProximityServiceProperty::NETWORK_PROXIMITY_SERVICE_TYPE,
                     "ALLTOALL"}}, {}));
    auto wms = simulation.add(
            new wrench::ActivityWMS(file_registry_ptr, {np_service}, storage_services, CLIENT));
    wms->addWorkflow(&workflow);

    //stage file
    auto file = workflow.getFileByID("data.file");
    simulation.stageFile(file, client_storage_service);
    simulation.launch();

    // Gather the data transfer completion times
    auto file_copy_starts = simulation.getOutput().getTrace<wrench::SimulationTimestampFileCopyStart>();

    std::cerr.precision(4);

    std::cerr << "----------------------------------------" << std::endl;
    for (const auto &file_copy : file_copy_starts) {
        if (file_copy->getContent()->getDestination()->getStorageService()->getHostname() == "Client") {
            double duration = file_copy->getContent()->getEndpoint()->getDate() - file_copy->getDate();

            std::cerr << file_copy->getContent()->getFile()->getSize() / (1000.0 * 1000.0 * 1000.0) <<
                      " GB transfer from " <<
                      file_copy->getContent()->getSource()->getStorageService()->getHostname() <<
                      " completed at time " << duration << std::endl;
        }
    }
    std::cerr << "----------------------------------------" << std::endl;

    return 0;
}
