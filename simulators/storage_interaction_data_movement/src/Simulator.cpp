/**
 * Copyright (c) 2020-2021. The WRENCH Team.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 */

#include <wrench-dev.h>
#include <pugixml.hpp>

#include "ActivityWMS.h"

/**
 * @brief Generates a platform with a single multi-core host
 * @param platform_file_path: path to write the platform file to
 *
 * @throws std::invalid_argument
 */
void generatePlatform(std::string &platform_file_path, int link_bandwidth) {

    if (platform_file_path.empty()) {
        throw std::invalid_argument("generatePlatform() platform_file_path cannot be empty");
    }
    if (link_bandwidth < 1) {
        throw std::invalid_argument("generatePlatform() bandwidth must be greater than 1");
    }

    // Create a the platform file
    std::string xml_string = "<?xml version='1.0'?>\n"
                             "<!DOCTYPE platform SYSTEM \"http://simgrid.gforge.inria.fr/simgrid/simgrid.dtd\">\n"
                             "<platform version=\"4.1\">\n"
                             "   <zone id=\"AS0\" routing=\"Full\">\n"
                             "       <host id=\"FileRegistryService\" speed=\"1f\" core=\"1\">\n"
                             "       </host>\n"
                             "       <host id=\"StorageService\" speed=\"100Gf\" core=\"1\">\n"
                             "           <prop id=\"ram\" value=\"32GB\"/>\n"
                             "           <disk id=\"large_disk\" read_bw=\"50MBps\" write_bw=\"50MBps\">\n"
                             "                            <prop id=\"size\" value=\"5000GiB\"/>\n"
                             "                            <prop id=\"mount\" value=\"/\"/>\n"
                             "           </disk>\n"
                             "       </host>\n"
                             "       <host id=\"Client\" speed=\"100f\" core=\"1\">\n"
                             "           <disk id=\"hard_disk\" read_bw=\"100000TBps\" write_bw=\"100000TBps\">\n"
                             "                            <prop id=\"size\" value=\"5000GiB\"/>\n"
                             "                            <prop id=\"mount\" value=\"/\"/>\n"
                             "           </disk>\n"
                             "       </host>\n"
                             "       <link id=\"network_link\" bandwidth=\"20MBps\" latency=\"20us\"/>\n"
                             "       <route src=\"FileRegistryService\" dst=\"Client\">"
                             "           <link_ctn id=\"network_link\"/>"
                             "       </route>\n"
                             "       <route src=\"FileRegistryService\" dst=\"StorageService\">"
                             "           <link_ctn id=\"network_link\"/>"
                             "       </route>\n"
                             "       <route src=\"Client\" dst=\"StorageService\">"
                             "           <link_ctn id=\"network_link\"/>"
                             "       </route>\n"
                             "   </zone>\n"
                             "</platform>\n";


    pugi::xml_document xml_doc;
    if (xml_doc.load_string(xml_string.c_str(), pugi::parse_doctype)) {
        pugi::xml_node link = xml_doc.child("platform").child("zone").child("link");
        link.attribute("bandwidth").set_value(std::string(std::to_string(link_bandwidth) + "MBps").c_str());
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

    int SERVER_LINK_BANDWIDTH;
    int FILE_SIZE;
    int FILE_REGISTRY_OVERHEAD;
    const double MB = 1000.0 * 1000.0;

    try {
        if (argc != 4) {
            throw std::invalid_argument("invalid number of arguments");
        }

        SERVER_LINK_BANDWIDTH = std::stoi(std::string(argv[1]));
        if (SERVER_LINK_BANDWIDTH < 1 || SERVER_LINK_BANDWIDTH > 1000000) {
            std::cerr << "Invalid server1 link bandwidth. bandwidth must be in range [1,1000000] MBps" << std::endl;
            throw std::invalid_argument("invalid server1 link bandwidth");
        }

        FILE_SIZE = std::stoi(std::string(argv[2]));

        if (FILE_SIZE < 1 || FILE_SIZE > 10000) {
            std::cerr << "Invalid file size. Size must be in range [1,10000] MB" << std::endl;
            throw std::invalid_argument("Invalid file size.");
        }

        FILE_REGISTRY_OVERHEAD = std::stoi(std::string(argv[3]));
        if (FILE_REGISTRY_OVERHEAD < 0 || FILE_REGISTRY_OVERHEAD > 10) {
            std::cerr << "Invalid overhead for file registry. Overhead must be in range [0, 10] sec" << std::endl;
            throw std::invalid_argument("Invalid overhead for file registry.");
        }

    } catch (std::invalid_argument &e) {
        std::cerr << e.what() << std::endl;
        std::cerr << "Usage: " << argv[0] << " <server_link_bandwidth> <file_size>" << std::endl;
        std::cerr << "   server_link_bandwidth: Bandwidth must be in range [1,1000000] MBps" << std::endl;
        std::cerr << "   file size: File size must be in range [1,100000] MBps" << std::endl;
        std::cerr << "" << std::endl;
        return 1;
    }

    // create workflow
    wrench::Workflow workflow;
    workflow.addFile("data_file", FILE_SIZE * MB);

    // read and instantiate the platform with the desired HPC specifications
    std::string platform_file_path = "/tmp/platform.xml";
    generatePlatform(platform_file_path, SERVER_LINK_BANDWIDTH);
    simulation.instantiatePlatform(platform_file_path);

    const std::string CLIENT("Client");
    const std::string FILEREGISTRY("FileRegistryService");
    const std::string SERVER("StorageService");

    //adding and instantiating storage services and file registry
    auto client_storage_service = simulation.add(new wrench::SimpleStorageService(
            CLIENT, {"/"},
            {{wrench::SimpleStorageServiceProperty::BUFFER_SIZE, "50000000"}}));
    auto server_storage_service = simulation.add(new wrench::SimpleStorageService(
            SERVER, {"/"},
            {{wrench::SimpleStorageServiceProperty::BUFFER_SIZE, "50000000"}}));

    std::set<std::shared_ptr<wrench::StorageService>> storage_services;
    storage_services.insert(client_storage_service);
    storage_services.insert(server_storage_service);

    auto file_registry = simulation.add(new wrench::FileRegistryService(FILEREGISTRY, {
            {wrench::FileRegistryServiceProperty::ADD_ENTRY_COMPUTE_COST, std::to_string(FILE_REGISTRY_OVERHEAD)}
    }, {}));

    //adding WMS and workflow to simulation
    auto wms = simulation.add(new wrench::ActivityWMS({storage_services}, CLIENT, file_registry));

    wms->addWorkflow(&workflow);

    //staging file to be copied on client storage service
    auto file = workflow.getFileByID("data_file");
    simulation.stageFile(file, client_storage_service);

    simulation.getOutput().enableDiskTimestamps(true);

    simulation.launch();

    simulation.getOutput().dumpUnifiedJSON(&workflow, "/tmp/workflow_data.json", false, false, false, false, false, true, true);

    return 0;
}
