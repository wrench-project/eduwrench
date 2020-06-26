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
void generateWorkflow(wrench::Workflow *workflow) {
    // Blue task
    auto blue_task = workflow->addTask("blue_task", 1000000, 1, 1, 1, 0);
    auto blue_output = workflow->addFile("blue_outfile", 100000000);
    blue_task->addInputFile(workflow->addFile("blue_infile", 100000000));
    blue_task->addOutputFile(blue_output);

    // Yellow task
    auto yellow_task = workflow->addTask("yellow_task", 1000, 1, 1, 1, 0);
    auto yellow_output1 = workflow->addFile("yellow_outfile1", 100000000);
    auto yellow_output2 = workflow->addFile("yellow_outfile2", 100000000);
    yellow_task->addInputFile(workflow->addFile("yellow_infile", 100000000));
    yellow_task->addOutputFile(yellow_output1);
    yellow_task->addOutputFile(yellow_output2);

    // Red task
    auto red_task  = workflow->addTask("red_task", 1000000, 1,  1, 1.0, 0);
    red_task->addInputFile(blue_output);
    red_task->addInputFile(yellow_output1);
    red_task->addInputFile(yellow_output2);

    workflow->addControlDependency(blue_task, red_task);
    workflow->addControlDependency(yellow_task, red_task);
}

/**
 * @brief Generate the platform file
 * @param platform_file_path: path to write the file to
 * @param num_hosts: number of hosts
 * @param num_cores_per_host: number of cores per host
 * @param effective_nework_bandwidth: wide-area bandwidth in MB/sec
 */
void generatePlatform(std::string platform_file_path) {
    if (platform_file_path.empty()) {
        throw std::invalid_argument("generatePlatform() platform_file_path cannot be empty");
    }

    std::string xml_string = "<?xml version='1.0'?>\n"
                             "<!DOCTYPE platform SYSTEM \"http://simgrid.gforge.inria.fr/simgrid/simgrid.dtd\">\n"
                             "<platform version=\"4.1\">\n"
                             "   <zone id=\"AS0\" routing=\"Full\">\n"
                             "       <host id=\"WMSHost\" speed=\"10Gf\" core=\"1\">\n"
                             "       </host>\n"
                             "       <host id=\"ServicesHost\" speed=\"10Gf\" core=\"1\">\n"
                             "       </host>\n"
                             "       <host id=\"StorageHost\" speed=\"100Gf\" core=\"1000\">\n"
                             "           <prop id=\"ram\" value=\"32GB\"/>\n"
                             "           <disk id=\"large_disk\" read_bw=\"50MBps\" write_bw=\"50MBps\">\n"
                             "                            <prop id=\"size\" value=\"5000GiB\"/>\n"
                             "                            <prop id=\"mount\" value=\"/\"/>\n"
                             "           </disk>\n"
                             "       </host>\n"
                             "       <host id=\"ComputeHost1\" speed=\"100Gf\" core=\"3\">\n"
                             "           <disk id=\"scratch\" read_bw=\"100000TBps\" write_bw=\"100000TBps\">\n"
                             "                            <prop id=\"size\" value=\"5000GiB\"/>\n"
                             "                            <prop id=\"mount\" value=\"/scratch/\"/>\n"
                             "           </disk>\n"
                             "       </host>\n"
                             "       <host id=\"ComputeHost2\" speed=\"100Gf\" core=\"3\">\n"
                             "           <disk id=\"scratch\" read_bw=\"100000TBps\" write_bw=\"100000TBps\">\n"
                             "                            <prop id=\"size\" value=\"5000GiB\"/>\n"
                             "                            <prop id=\"mount\" value=\"/scratch/\"/>\n"
                             "           </disk>\n"
                             "       </host>\n"
                             "       <link id=\"network_link\" bandwidth=\"20MBps\" latency=\"20us\"/>\n"
                             "       <route src=\"WMSHost\" dst=\"ServicesHost\">"
                             "           <link_ctn id=\"network_link\"/>"
                             "       </route>\n"
                             "       <route src=\"ComputeHost1\" dst=\"ServicesHost\">"
                             "           <link_ctn id=\"network_link\"/>"
                             "       </route>\n"
                             "       <route src=\"ComputeHost2\" dst=\"ServicesHost\">"
                             "           <link_ctn id=\"network_link\"/>"
                             "       </route>\n"
                             "       <route src=\"StorageHost\" dst=\"ServicesHost\">"
                             "           <link_ctn id=\"network_link\"/>"
                             "       </route>\n"
                             "       <route src=\"WMSHost\" dst=\"StorageHost\">"
                             "           <link_ctn id=\"network_link\"/>"
                             "       </route>\n"
                             "       <route src=\"WMSHost\" dst=\"ComputeHost1\">"
                             "           <link_ctn id=\"network_link\"/>"
                             "       </route>\n"
                             "       <route src=\"WMSHost\" dst=\"ComputeHost2\">"
                             "           <link_ctn id=\"network_link\"/>"
                             "       </route>\n"
                             "       <route src=\"StorageHost\" dst=\"ComputeHost1\">"
                             "           <link_ctn id=\"network_link\"/>"
                             "       </route>\n"
                             "       <route src=\"StorageHost\" dst=\"ComputeHost2\">"
                             "           <link_ctn id=\"network_link\"/>"
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
    const std::string COMPUTE_HOST1 = "ComputeHost1";
    const std::string COMPUTE_HOST2 = "ComputeHost2";

    // generate workflow
    wrench::Workflow workflow;
    generateWorkflow(&workflow);

    // generate platform
    std::string platform_file_path = "/tmp/platform.xml";
    generatePlatform(platform_file_path);
    simulation.instantiatePlatform(platform_file_path);

    //instantiate compute services with their own scratch space
    auto compute_service1 = simulation.add(new wrench::BareMetalComputeService(COMPUTE_HOST1,
            {COMPUTE_HOST1}, "/scratch/", {}, {}));
    auto compute_service2 = simulation.add(new wrench::BareMetalComputeService(COMPUTE_HOST2,
            {COMPUTE_HOST2},"/scratch/", {}, {}));

    //instantiate storage services
    auto storage_service = simulation.add(new wrench::SimpleStorageService(STORAGE, {"/"},
            {{wrench::SimpleStorageServiceProperty::BUFFER_SIZE, "50000000"}}));

    //instantiate file registry and WMS
    auto file_registry = simulation.add(new wrench::FileRegistryService(SERVICES, {}, {}));

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
