/**
 * Copyright (c) 2019-2020. The WRENCH Team.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 */

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
 * @brief Generate the workflow
 * @description Fork-Join
 */
void generateWorkflow(wrench::Workflow *workflow, int file_size, int task_flops) {
    // Blue task
    const double GFLOP = 1000.0 * 1000.0 * 1000.0;
    const double MB = 1000.0 * 1000.0;

    auto task = workflow->addTask("task", task_flops * GFLOP, 1, 1, 1, 0);
    task->addInputFile(workflow->addFile("task_input", file_size*MB));
    task->addOutputFile(workflow->addFile("task_output", file_size*MB));
}

/**
 * @brief Generate the platform file
 * @param platform_file_path: path to write the file to
 * @param num_hosts: number of hosts
 * @param num_cores_per_host: number of cores per host
 * @param effective_nework_bandwidth: wide-area bandwidth in MB/sec
 */
void generatePlatform(std::string platform_file_path, std::string compute_host1, std::string
compute_host2) {
    if (platform_file_path.empty()) {
        throw std::invalid_argument("generatePlatform() platform_file_path cannot be empty");
    }

    std::string xml_string = "<?xml version='1.0'?>\n"
                             "<!DOCTYPE platform SYSTEM \"http://simgrid.gforge.inria.fr/simgrid/simgrid.dtd\">\n"
                             "<platform version=\"4.1\">\n"
                             "   <zone id=\"AS0\" routing=\"Full\">\n"
                             "       <host id=\"WMSHost\" speed=\"10Gf\" core=\"1\">\n"
                             "       </host>\n"
                             "       <host id=\"StorageHost\" speed=\"1000Gf\" core=\"1000\">\n"
                             "           <prop id=\"ram\" value=\"32GB\"/>\n"
                             "           <disk id=\"large_disk\" read_bw=\"50MBps\" write_bw=\"50MBps\">\n"
                             "                            <prop id=\"size\" value=\"5000GiB\"/>\n"
                             "                            <prop id=\"mount\" value=\"/\"/>\n"
                             "           </disk>\n"
                             "       </host>\n"
                             "       <host id=\"" + compute_host1 + "\" speed=\"1000Gf\" core=\"3\">\n"
                             "           <disk id=\"scratch\" read_bw=\"100000TBps\" write_bw=\"100000TBps\">\n"
                             "                            <prop id=\"size\" value=\"5000GiB\"/>\n"
                             "                            <prop id=\"mount\" value=\"/scratch/\"/>\n"
                             "           </disk>\n"
                             "       </host>\n"
                             "       <host id=\"" + compute_host2 + "\" speed=\"500Gf\" core=\"3\">\n"
                             "           <disk id=\"scratch\" read_bw=\"100000TBps\" write_bw=\"100000TBps\">\n"
                             "                            <prop id=\"size\" value=\"5000GiB\"/>\n"
                             "                            <prop id=\"mount\" value=\"/scratch/\"/>\n"
                             "           </disk>\n"
                             "       </host>\n"
                             "       <link id=\"compute_link1\" bandwidth=\"100MBps\" latency=\"20us\"/>\n"
                             "       <link id=\"compute_link2\" bandwidth=\"10MBps\" latency=\"20us\"/>\n"
                             "       <link id=\"ss_link\" bandwidth=\"100MBps\" latency=\"20us\"/>\n"
                             "       <link id=\"computess_link1\" bandwidth=\"200MBps\" latency=\"20us\"/>\n"
                             "       <link id=\"computess_link2\" bandwidth=\"500MBps\" latency=\"20us\"/>\n"
                             "       <route src=\"WMSHost\" dst=\"StorageHost\">"
                             "           <link_ctn id=\"ss_link\"/>"
                             "       </route>\n"
                             "       <route src=\"WMSHost\" dst=\"" + compute_host1 + "\">"
                             "           <link_ctn id=\"compute_link1\"/>"
                             "       </route>\n"
                             "       <route src=\"WMSHost\" dst=\""  + compute_host2 +  "\">"
                             "           <link_ctn id=\"compute_link2\"/>"
                             "       </route>\n"
                             "       <route src=\"StorageHost\" dst=\"" + compute_host1 + "\">"
                             "           <link_ctn id=\"computess_link1\"/>"
                             "       </route>\n"
                             "       <route src=\"StorageHost\" dst=\"" + compute_host2 + "\">"
                             "           <link_ctn id=\"computess_link2\"/>"
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
 * @brief Activity 1 Simulation
 * @param argc
 * @param argv
 * @return
 */
int main(int argc, char **argv) {
    wrench::Simulation simulation;
    simulation.init(&argc, argv);

    const std::string WMS = "WMSHost";
    const std::string SERVICES = "ServicesHost";
    const std::string STORAGE = "StorageHost";
    int HOST_SELECT;
    int TASK_FLOPS;
    int FILE_SIZE;

    try {
        if (argc != 4) {
            throw std::invalid_argument("invalid number of arguments");
        }

        HOST_SELECT = std::stoi(std::string(argv[1]));

        if (HOST_SELECT !=  1 && HOST_SELECT != 2) {
            std::cerr << "Invalid host selection. Host must be either 1 or 2" << std::endl;
            throw std::invalid_argument("invalid host selection");
        }

        TASK_FLOPS = std::stoi(std::string(argv[2]));

        if (TASK_FLOPS <  1 || TASK_FLOPS > 100000) {
            std::cerr << "Invalid flops of task. Must be in range [1,10000] flops" << std::endl;
            throw std::invalid_argument("invalid link speed");
        }

        FILE_SIZE = std::stoi(std::string(argv[3]));

        if (FILE_SIZE <  1 || FILE_SIZE > 10000) {
            std::cerr << "Invalid file size. Size must be in range [1,10000] MB" << std::endl;
            throw std::invalid_argument("invalid link speed");
        }
    } catch (std::invalid_argument &e) {
        std::cerr << e.what() << std::endl;
        std::cerr << "Usage: " << argv[0]
                  << " <host_select> <task_flops> <file_size>"
                  << std::endl;
        return 1;
    }

    std::string COMPUTE_HOST1 = (HOST_SELECT == 1) ? "ChosenHost" : "ComputeHost1";
    std::string COMPUTE_HOST2 = (HOST_SELECT == 2) ? "ComputeHost2" : "ChosenHost";

    // generate workflow
    wrench::Workflow workflow;
    generateWorkflow(&workflow, FILE_SIZE, TASK_FLOPS);

    // generate platform
    std::string platform_file_path = "/tmp/platform.xml";
    generatePlatform(platform_file_path, HOST_SELECT, COMPUTE_HOST1, COMPUTE_HOST2);
    simulation.instantiatePlatform(platform_file_path);

    //instantiate compute services with their own scratch space
    auto compute_service1 = simulation.add(new wrench::BareMetalComputeService(COMPUTE_HOST1,
            {COMPUTE_HOST1}, "/scratch/",
            {{wrench::BareMetalComputeServiceProperty::TASK_STARTUP_OVERHEAD, "5"}}, {}));
    auto compute_service2 = simulation.add(new wrench::BareMetalComputeService(COMPUTE_HOST2,
            {COMPUTE_HOST2},"/scratch/",
            {{wrench::BareMetalComputeServiceProperty::TASK_STARTUP_OVERHEAD, "10"}}, {}));

    //instantiate storage services
    auto storage_service = simulation.add(new wrench::SimpleStorageService(STORAGE, {"/"},
            {{wrench::SimpleStorageServiceProperty::BUFFER_SIZE, "50000000"}}));

    //instantiate file registry and WMS
    auto file_registry = simulation.add(new wrench::FileRegistryService(WMS, {}, {}));

    auto wms = simulation.add(new wrench::ActivityWMS(file_registry,
            {compute_service1, compute_service2}, {storage_service}, WMS));

    wms->addWorkflow(&workflow);

    //stage the input files on the storage service
    for (auto file : workflow.getInputFiles()) {
        simulation.stageFile(file, storage_service);
    }

    // launch the simulation
    simulation.launch();

    simulation.getOutput().dumpUnifiedJSON(&workflow, "/tmp/workflow_data.json");
}
