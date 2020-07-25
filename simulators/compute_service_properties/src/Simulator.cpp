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
 * @description
 */
void generateWorkflow(wrench::Workflow *workflow, std::vector<int> CORES, std::vector<int>
        MEMORY, int file_nums) {
    //adding tasks
    auto blue_task = workflow->addTask("blue_task", 1000000, CORES[0], CORES[0], 1, MEMORY[0]);
    auto yellow_task = workflow->addTask("yellow_task", 1000, CORES[1], CORES[1], 1, MEMORY[1]);
    auto orange_task = workflow->addTask("orange_task", 1000, CORES[2], CORES[2], 1, MEMORY[2]);
    auto red_task  = workflow->addTask("red_task", 1000000, CORES[3], CORES[3], 1, MEMORY[3]);

    for (int i = 1; i <= file_nums; ++i) {
        //adding input files for blue, orange, yellow
        blue_task->addInputFile(workflow->addFile("blue_infile" + std::to_string(i), 1000));
        yellow_task->addInputFile(workflow->addFile("yellow_infile" + std::to_string(i), 1000));

        //adding output files for blue, orange, yellow
        auto blue_output = workflow->addFile("blue_outfile" + std::to_string(i), 1000);
        blue_task->addOutputFile(blue_output);

        auto yellow_output = workflow->addFile("yellow_outfile"  + std::to_string(i), 1000);
        auto orange_output = workflow->addFile("orange_outfile"  + std::to_string(i), 1000);

        yellow_task->addOutputFile(yellow_output);
        orange_task->addOutputFile(orange_output);

        //red task takes output of previous tasks as input files
        red_task->addInputFile(blue_output);
        red_task->addInputFile(yellow_output);
        red_task->addInputFile(orange_output);
    }

    workflow->addControlDependency(blue_task, red_task);
    workflow->addControlDependency(yellow_task, red_task);
    workflow->addControlDependency(orange_task, red_task);
}

/**
 * @brief Generate the platform file
 * @param platform_file_path: path to write the file to
 * @param num_hosts: number of hosts
 * @param num_cores_per_host: number of cores per host
 * @param effective_nework_bandwidth: wide-area bandwidth in MB/sec
 */
void generatePlatform(std::string platform_file_path, std::vector<int> bandwidths) {
    if (platform_file_path.empty()) {
        throw std::invalid_argument("generatePlatform() platform_file_path cannot be empty");
    }

    std::string xml_string = "<?xml version='1.0'?>\n"
                             "<!DOCTYPE platform SYSTEM \"http://simgrid.gforge.inria.fr/simgrid/simgrid.dtd\">\n"
                             "<platform version=\"4.1\">\n"
                             "   <zone id=\"AS0\" routing=\"Full\">\n"
                             "       <host id=\"WMSHost\" speed=\"10Gf\" core=\"1\">\n"
                             "       </host>\n"
                             "       <host id=\"StorageHost\" speed=\"100Gf\" core=\"1000\">\n"
                             "           <prop id=\"ram\" value=\"32GB\"/>\n"
                             "           <disk id=\"large_disk\" read_bw=\"50MBps\" write_bw=\"50MBps\">\n"
                             "                            <prop id=\"size\" value=\"5000GiB\"/>\n"
                             "                            <prop id=\"mount\" value=\"/\"/>\n"
                             "           </disk>\n"
                             "       </host>\n"
                             "       <host id=\"ComputeHost1\" speed=\"10Gf\" core=\"3\">\n"
                             "           <disk id=\"scratch\" read_bw=\"100000TBps\" write_bw=\"100000TBps\">\n"
                             "                            <prop id=\"size\" value=\"5000GiB\"/>\n"
                             "                            <prop id=\"mount\" value=\"/scratch/\"/>\n"
                             "           </disk>\n"
                             "       </host>\n"
                             "       <host id=\"ComputeHost2\" speed=\"10Gf\" core=\"3\">\n"
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
                             "       <route src=\"WMSHost\" dst=\"ComputeHost1\">"
                             "           <link_ctn id=\"compute_link1\"/>"
                             "       </route>\n"
                             "       <route src=\"WMSHost\" dst=\"ComputeHost2\">"
                             "           <link_ctn id=\"compute_link2\"/>"
                             "       </route>\n"
                             "       <route src=\"StorageHost\" dst=\"ComputeHost1\">"
                             "           <link_ctn id=\"computess_link1\"/>"
                             "       </route>\n"
                             "       <route src=\"StorageHost\" dst=\"ComputeHost2\">"
                             "           <link_ctn id=\"computess_link2\"/>"
                             "       </route>\n"
                             "   </zone>\n"
                             "</platform>\n";

    pugi::xml_document xml_doc;

    if (xml_doc.load_string(xml_string.c_str(), pugi::parse_doctype)) {
        pugi::xml_node zone = xml_doc.child("platform").child("zone");
        pugi::xml_node compute_link1 = zone.find_child_by_attribute("link", "id", "compute_link1");
        pugi::xml_node compute_link2 = zone.find_child_by_attribute("link", "id", "compute_link2");
        pugi::xml_node ss_link = zone.find_child_by_attribute("link", "id", "ss_link");
        pugi::xml_node computess_link1 = zone.find_child_by_attribute("link", "id", "computess_link1");
        pugi::xml_node computess_link2 = zone.find_child_by_attribute("link", "id", "computess_link2");

        compute_link1.attribute("bandwidth").set_value(std::string(std::to_string(bandwidths[0]) + "MBps").c_str());
        compute_link2.attribute("bandwidth").set_value(std::string(std::to_string(bandwidths[1]) + "MBps").c_str());
        ss_link.attribute("bandwidth").set_value(std::string(std::to_string(bandwidths[2]) + "MBps").c_str());
        computess_link1.attribute("bandwidth").set_value(std::string(std::to_string(bandwidths[3]) + "MBps").c_str());
        computess_link2.attribute("bandwidth").set_value(std::string(std::to_string(bandwidths[4]) + "MBps").c_str());

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
    const std::string STORAGE = "StorageHost";
    const std::string COMPUTE_HOST1 = "ComputeHost1";
    const std::string COMPUTE_HOST2 = "ComputeHost2";

    std::string PARAMETERS;
    int FILE_NUMS = 1;
    std::vector<int> BANDWIDTH(5, 10);
    std::vector<std::string> PROPERTY = {"0", "0", "500000", "0"};
    std::vector<int> CORES(4, 1);
    std::vector<int> MEMORY(4, 1);

    bool use_bandwidth, use_property, use_cores, use_mem, use_file_num;
    int offset = 1;

    try {
        PARAMETERS = std::string(argv[1]);

        use_bandwidth = (PARAMETERS.find('b') != std::string::npos) ? 1 : 0;
        use_property = (PARAMETERS.find('p') != std::string::npos) ? 1 : 0;
        use_cores = (PARAMETERS.find('c') != std::string::npos) ? 1 : 0;
        use_mem = (PARAMETERS.find('m') != std::string::npos) ? 1 : 0;
        use_file_num = (PARAMETERS.find('f') != std::string::npos) ? 1 : 0;

        if (use_bandwidth) {
            for (int i = 1; i <= 5; ++i) {
                BANDWIDTH[i - 1] = std::stoi(std::string(argv[i + offset]));
                if (BANDWIDTH[i - 1] <  1 || BANDWIDTH[i - 1] > 10000) {
                    std::cerr << "Invalid bandwidth. Speed must be in range [1,10000] MBps" << std::endl;
                    throw std::invalid_argument("invalid link speed");
                }
            }
            offset += 5;
        }

        if (use_property) {
            for (int i = 1; i <= 4; ++i) {
                PROPERTY[i - 1] = std::string(argv[i + offset]);
            }
            offset += 4;
        }

        if (use_cores) {
            for (int i = 1; i <= 4; ++i) {
                CORES[i - 1] = std::stoi(std::string(argv[i + offset]));
            }
            offset += 4;
        }

        if (use_mem) {
            for (int i = 1; i <= 4; ++i) {
                MEMORY[i - 1] = std::stoi(std::string(argv[i + offset]));
            }
            offset += 4;
        }

        if (use_file_num) {
            FILE_NUMS = std::stoi(std::string(argv[offset + 1]));
            offset += 1;
        }

        if (argc != offset + 1) {
            throw std::invalid_argument("invalid number of arguments");
        }

    } catch (std::invalid_argument &e) {
        std::cerr << e.what() << std::endl;
        std::cerr << "Usage: " << argv[0]
                  << "<PARAMETER> <BANDWIDTH (C1, C2, SS, CSS1, CSS2)> <STARTUP (C1, C2, SS, FR)>"
                     " <CORES (B, Y, O, R)> "
                  << std::endl;
        return 1;
    }

    // generate workflow
    wrench::Workflow workflow;
    generateWorkflow(&workflow, CORES, MEMORY, FILE_NUMS);

    // generate platform
    std::string platform_file_path = "/tmp/platform.xml";
    generatePlatform(platform_file_path, BANDWIDTH);
    simulation.instantiatePlatform(platform_file_path);

    //instantiate compute services with their own scratch space
    auto compute_service1 = simulation.add(new wrench::BareMetalComputeService(COMPUTE_HOST1,
            {COMPUTE_HOST1}, "/scratch/",
            {{wrench::BareMetalComputeServiceProperty::TASK_STARTUP_OVERHEAD, PROPERTY[0]}}, {}));
    auto compute_service2 = simulation.add(new wrench::BareMetalComputeService(COMPUTE_HOST2,
            {COMPUTE_HOST2},"/scratch/",
            {{wrench::BareMetalComputeServiceProperty::TASK_STARTUP_OVERHEAD, PROPERTY[1]}}, {}));

    //instantiate storage services
    auto storage_service = simulation.add(new wrench::SimpleStorageService(STORAGE, {"/"},
            {{wrench::SimpleStorageServiceProperty::BUFFER_SIZE, PROPERTY[2]}}));

    //instantiate file registry and WMS
    auto file_registry = simulation.add(new wrench::FileRegistryService(WMS,
            {{wrench::FileRegistryServiceProperty::LOOKUP_COMPUTE_COST, PROPERTY[3]}}, {}));

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
