/**
 * Copyright (c) 2019-2020. The WRENCH Team.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 */

#include <iostream>
#include <iomanip>
#include <string>
#include <wrench.h>
#include <sstream>

#include "ActivityWMS.h"
#include "ActivityScheduler.h"

/**
 * @brief Generate the workflow
 * @description Fork-Join
 */
void generateWorkflow(std::shared_ptr<wrench::Workflow> workflow) {

    const double GFLOP = 1000.0 * 1000.0 * 1000.0;
    const size_t MB = 1000 * 1000;
    const size_t GB = MB * 1000;

    const int num_pre_tasks = 20;

    auto final_task = workflow->addTask("final", 1000 * GFLOP, 1, 1, 2 * GB);
    for (int  i=1; i < num_pre_tasks+1; i++) {
        ostringstream os;
        os<<setfill('0')<<setw(2)<<i;
        auto  number =  os.str();
        auto ifile = wrench::Simulation::addFile("in_" + number, 50 * MB);
        auto ofile = wrench::Simulation::addFile("out_" + number, 100 * MB);
        auto task = workflow->addTask("pre_" + number, 1000 *  GFLOP, 1, 1, 8 *GB);
        task->setColor("#D4E8D4");
        task->addInputFile(ifile);
        task->addOutputFile(ofile);
        final_task->addInputFile(ofile);
    }

    auto output_file = wrench::Simulation::addFile("output", 1 * MB);
    final_task->addOutputFile(output_file);
    final_task->setColor("#FFFCCC");
}

/**
 * @brief Generate the platform file
 * @param platform_file_path: path to write the file to
 * @param num_hosts: number of hosts
 * @param num_cores_per_host: number of cores per host
 * @param effective_nework_bandwidth: wide-area bandwidth in MB/sec
 */
void generatePlatform(std::string platform_file_path, int num_hosts, int num_cores_per_host, int effective_network_bandwidth) {

    if (platform_file_path.empty()) {
        throw std::invalid_argument("generatePlatform() platform_file_path cannot be empty");
    }

    if ((num_hosts < 1) || (num_cores_per_host < 1) || (effective_network_bandwidth < 1)) {
        throw std::invalid_argument("generatePlatform() bandwidth must be greater than 1");
    }

    const double MB = 1000.0 * 1000.0;
    const double GB = MB * 1000.0;

    int wide_area_bandwidth_in_kb_p_sec = (int)(1000.0 * effective_network_bandwidth / .97);
    int local_area_bandwidth_in_kb_p_sec = (int)(10 * (GB/1000.0) / .97);

    // Create a the platform file
    std::string xml = "<?xml version='1.0'?>\n"
                      "<!DOCTYPE platform SYSTEM \"http://simgrid.gforge.inria.fr/simgrid/simgrid.dtd\">\n"
                      "<platform version=\"4.1\">\n";
    xml += "   <zone id=\"AS0\" routing=\"Full\">\n";

    xml += "    <zone id=\"AS1\" routing=\"Full\">\n";



    // The cluster's storage node)
    xml += "          <host id=\"hpc_0.edu\" speed=\"100Gf\" core=\"1\">\n";
    xml += "                <disk id=\"hpc_disk\" read_bw=\"500MBps\" write_bw=\"500MBps\">\n";
    xml += "                       <prop id=\"size\" value=\"5000GiB\"/>\n";
    xml += "                       <prop id=\"mount\" value=\"/\"/>\n";
    xml += "                </disk>\n";
    xml += "          </host>\n";

    // The cluster's other compute nodes
    for (int i = 1; i < num_hosts + 1; i++) {
        xml += "        <host id=\"hpc_" + std::to_string(i) + ".edu\" speed=\"100Gf\" core=\"" +
               std::to_string(num_cores_per_host) + "\">\n";
        xml += "         <prop id=\"ram\" value=\"32000000000\"/>\n";
        xml += "        </host>\n";
    }

    // The cluster's router
    xml += "       <router id=\"hpc_router\"> </router>\n";

    // The loopback link
    xml += "      <link id=\"loopback\" bandwidth=\"50000GBps\" latency=\"0ns\"/>\n";

    // The cluster's network links
    for (int i = 0; i < num_hosts + 1; i++) {
        xml += "        <link id=\"link_" + std::to_string(i) +
               "\" bandwidth=\""+ std::to_string(local_area_bandwidth_in_kb_p_sec) +"kBps\" latency=\"10us\"/>\n";
    }

    // The cluster's routes
    for (int i = 1; i < num_hosts + 1; i++) {
        xml += "        <route src=\"hpc_" + std::to_string(i) + ".edu\" dst=\"hpc_router\">\n";
        xml += "            <link_ctn id=\"link_" + std::to_string(i) + "\"/>\n";
        xml += "        </route>\n";
        xml += "        <route src=\"hpc_" + std::to_string(i) + ".edu\" dst=\"hpc_" + std::to_string(i) + ".edu\">\n";
        xml += "            <link_ctn id=\"loopback\"/>\n";
        xml += "        </route>\n";
        xml += "        <route src=\"hpc_" + std::to_string(i) + ".edu\" dst=\"hpc_" + std::to_string(0) + ".edu\">\n";
        xml += "            <link_ctn id=\"link_" + std::to_string(i) + "\"/>\n";
        xml += "            <link_ctn id=\"link_" + std::to_string(0) + "\"/>\n";
        xml += "        </route>\n";
    }
    xml += "      </zone>\n";

    // The rest of the platform
    xml += "      <zone id=\"AS2\" routing=\"Full\">\n";
    xml += "          <host id=\"storage.edu\" speed=\"1000Gf\">\n";
    xml += "                <disk id=\"large_disk\" read_bw=\"500MBps\" write_bw=\"500MBps\">\n";
    xml += "                       <prop id=\"size\" value=\"5000GiB\"/>\n";
    xml += "                       <prop id=\"mount\" value=\"/\"/>\n";
    xml += "                </disk>\n";
    xml += "          </host>\n";
    xml += "      </zone>\n";
    xml += "      <zone id=\"AS3\" routing=\"Full\">\n";
    xml += "          <host id=\"user.edu\" speed=\"1000Gf\" core=\"1\">\n";
    xml += "          </host>\n";
    xml += "      </zone>\n";

    xml += "      <link id=\"wide_area_link\" bandwidth=\"" + std::to_string(wide_area_bandwidth_in_kb_p_sec) + "kBps\" latency=\"10ms\"/>\n";
    xml += "      <link id=\"fast_wide_area_link\" bandwidth=\"1000000GBps\" latency=\"1us\"/>\n";
    xml += "      <zoneRoute src=\"AS3\" dst=\"AS2\" gw_src=\"user.edu\" gw_dst=\"storage.edu\">\n";
    xml += "        <link_ctn id=\"fast_wide_area_link\"/>\n";
    xml += "      </zoneRoute>\n";
    xml += "      <zoneRoute src=\"AS3\" dst=\"AS1\" gw_src=\"user.edu\" gw_dst=\"hpc_router\">\n";
    xml += "        <link_ctn id=\"fast_wide_area_link\"/>\n";
    xml += "      </zoneRoute>\n";
    xml += "      <zoneRoute src=\"AS2\" dst=\"AS1\" gw_src=\"storage.edu\" gw_dst=\"hpc_router\">\n";
    xml += "        <link_ctn id=\"wide_area_link\"/>\n";
    xml += "      </zoneRoute>\n";
    xml += "   </zone>\n";
    xml += "</platform>\n";

    FILE *platform_file = fopen(platform_file_path.c_str(), "w");
    fprintf(platform_file, "%s", xml.c_str());
    fclose(platform_file);
}

/**
 * @brief Activity 1 Simulation
 * @param argc
 * @param argv
 * @return
 */
int main(int argc, char **argv) {

    auto simulation = wrench::Simulation::createSimulation();
    simulation->init(&argc, argv);

    int NUM_HOSTS;
    int NUM_CORES_PER_HOST;
    int WIDE_AREA_BW;
    int USE_LOCAL_STORAGE;

    try {
        if (argc != 5) {
            throw std::invalid_argument("bad args");
        }

        NUM_HOSTS = std::stoi(std::string(argv[1]));
        NUM_CORES_PER_HOST = std::stoi(std::string(argv[2]));
        WIDE_AREA_BW = std::stoi(std::string(argv[3]));
        USE_LOCAL_STORAGE = std::stoi(std::string(argv[4]));

        if (NUM_HOSTS < 1) {
            std::cerr << "Number of hosts must be at least 1";
            throw std::invalid_argument("invalid number of hosts");
        }

        if (NUM_CORES_PER_HOST < 1) {
            std::cerr << "Number of cores per host must be at least 1";
            throw std::invalid_argument("invalid number of cores per host");
        }

        if (WIDE_AREA_BW < 1) {
            std::cerr << "Network bandwidth must be at least 1";
            throw std::invalid_argument("invalid network bandwidth");
        }

        if (USE_LOCAL_STORAGE != 0 && USE_LOCAL_STORAGE != 1) {
            std::cerr << "Use local storage must be 0 or 1";
            throw std::invalid_argument("invalid local storage spec");
        }

    } catch (std::invalid_argument &e) {
        std::cerr << "Usage: " << argv[0] << " <num hosts> <num cores per host> <network bandwidth> <use local storage>" << std::endl;
        std::cerr << "    disk bandwidth: measured in MB/sec" << std::endl;
        std::cerr << "    use local storage: 0 (false) or 1 (true)" << std::endl;
        return 1;
    }

    // generate workflow
    auto workflow = wrench::Workflow::createWorkflow();
    generateWorkflow(workflow);

    // generate platform
    std::string platform_file_path = "/tmp/platform.xml";
    generatePlatform(platform_file_path, NUM_HOSTS, NUM_CORES_PER_HOST, WIDE_AREA_BW);
    simulation->instantiatePlatform(platform_file_path);

    // Remote storage service
    auto storage_service = simulation->add(wrench::SimpleStorageService::createSimpleStorageService(
            "storage.edu", {"/"},
            {
                    {wrench::SimpleStorageServiceProperty::BUFFER_SIZE, "25000000000"}, // no buffering
            }, {
                    {wrench::SimpleStorageServiceMessagePayload::FILE_READ_REQUEST_MESSAGE_PAYLOAD, 0},
                    {wrench::SimpleStorageServiceMessagePayload::FILE_READ_ANSWER_MESSAGE_PAYLOAD, 0}
            }));

    storage_service->setNetworkTimeoutValue(100000.00); // Large file, small bandwidth

    // Local storage service
    auto local_storage_service = simulation->add(wrench::SimpleStorageService::createSimpleStorageService(
            "hpc_0.edu", {"/"},
            {
                    {wrench::SimpleStorageServiceProperty::BUFFER_SIZE, "25000000000"}, // no buffering
            }, {
                    {wrench::SimpleStorageServiceMessagePayload::FILE_READ_REQUEST_MESSAGE_PAYLOAD, 0},
                    {wrench::SimpleStorageServiceMessagePayload::FILE_READ_ANSWER_MESSAGE_PAYLOAD, 0}
            }));
    local_storage_service->setNetworkTimeoutValue(100000.00); // Large file, small bandwidth

    std::vector<std::string> compute_hosts;
    for (int i=1; i < NUM_HOSTS + 1; i++) {
        compute_hosts.push_back("hpc_" + std::to_string(i)+".edu");
    }
    auto compute_service = simulation->add(new wrench::BareMetalComputeService(
            "hpc_0.edu",
            compute_hosts,
            {},
            {}
    ));

    // WMS on user.edu
    auto wms = simulation->add(new wrench::ActivityWMS(
            new wrench::ActivityScheduler(storage_service, local_storage_service, (USE_LOCAL_STORAGE == 1)),
                                                      {compute_service},
                                                      {storage_service, local_storage_service},
                                                      workflow,
                                                      "user.edu"
    ));

    // file registry service on storage_db_edu
    simulation->add(new wrench::FileRegistryService("user.edu"));

    // stage the input files
    for (auto file : workflow->getInputFiles()) {
        wrench::StorageService::createFileAtLocation(wrench::FileLocation::LOCATION(storage_service, file));
    }

    // launch the simulation
    simulation->launch();

    simulation->getOutput().dumpUnifiedJSON(workflow, "/tmp/workflow_data.json", false, true, true, false, true, true, true);
}
