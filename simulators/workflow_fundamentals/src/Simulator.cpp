/**
 * Copyright (c) 2019-2020. The WRENCH Team.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 */

#include <iostream>
#include <string>
#include <wrench.h>
#include <pugixml.hpp>

#include "ActivityWMS.h"
#include "ActivityScheduler.h"

/**
 * @brief Generate the workflow for activity 1
 * @description Fork-Join
 */
void generateWorkflow(wrench::Workflow *workflow) {

    const double GFLOP = 1000.0 * 1000.0 * 1000.0;
    const double MB = 1000.0 * 1000.0;
    const double GB = MB * 1000.0;

    auto data_file = workflow->addFile("data", 500  * MB);
    auto task1 = workflow->addTask("task1", 500 * GFLOP, 1, 1, 1.0, 12 * GB);
    task1->addInputFile(data_file);
    task1->setColor("#D4E8D4");
    auto filtered_file = workflow->addFile("filtered", 400 *  MB);
    task1->addOutputFile(filtered_file);

    auto task2 = workflow->addTask("task2", 1000 * GFLOP, 1, 1, 1.0, 15 * GB);
    auto task3 = workflow->addTask("task3", 5000 * GFLOP, 1, 1, 1.0, 7 * GB);
    auto task4 = workflow->addTask("task4", 1000 * GFLOP, 1, 1, 1.0, 7 * GB);

    task2->addInputFile(filtered_file);
    task2->setColor("#DAE8FC");
    task3->addInputFile(filtered_file);
    task3->setColor("#DAE8FC");
    task4->addInputFile(filtered_file);
    task4->setColor("#DAE8FC");

    auto finalA_file = workflow->addFile("finalA", 200 * MB);
    auto finalB_file = workflow->addFile("finalB", 200 * MB);
    auto finalC_file = workflow->addFile("finalC", 200 * MB);

    task2->addOutputFile(finalA_file);
    task3->addOutputFile(finalB_file);
    task4->addOutputFile(finalC_file);

    auto task5 = workflow->addTask("task5", 2000 * GFLOP, 1, 1, 1.0, 2 * GB);
    task5->setColor("#FFFCCC");
    task5->addInputFile(finalB_file);
    task5->addInputFile(finalC_file);

    auto aggBC_file = workflow->addFile("aggBC", 200 * MB);
    task5->addOutputFile(aggBC_file);

    auto task6 = workflow->addTask("task6", 200 * GFLOP, 1, 1, 1, 4 * GB);
    task6->addInputFile(finalA_file);
    task6->addInputFile(aggBC_file);
    task6->setColor("#F8CECC");
}

/**
 * @brief Generate the platform file for activity 1
 * @param platform_file_path: path to write the file to
 * @param compute_speed: compute speed in GFlop/sec
 */
void generatePlatform(std::string platform_file_path, int num_cores, int disk_bw) {
    if (platform_file_path.empty()) {
        throw std::invalid_argument("generatePlatform() platform_file_path cannot be empty");
    }

    int effective_bandwidth = 10 * 1000 * 1000; // 10 MBps

    if ((num_cores < 1) || (disk_bw < 1)) {
        throw std::invalid_argument("generatePlatform() bandwidth must be greater than 1");
    }

    std::string xml_string = "<?xml version='1.0'?>\n"
                             "<!DOCTYPE platform SYSTEM \"http://simgrid.gforge.inria.fr/simgrid/simgrid.dtd\">\n"
                             "<platform version=\"4.1\">\n"
                             "   <zone id=\"AS0\" routing=\"Full\">\n"
                             "       <host id=\"the_host\" speed=\"50Gf\" core=\"" + std::to_string(num_cores) + "\">\n"
                             "           <disk id=\"disk\" read_bw=\""+std::to_string(disk_bw)+"MBps\" write_bw=\"" +std::to_string(disk_bw)+"MBps\">\n"
                             "                            <prop id=\"size\" value=\"5000GB\"/>\n"
                             "                            <prop id=\"mount\" value=\"/\"/>\n"
                             "           </disk>\n"
                             "           <prop id=\"ram\" value=\"16GB\" />"
                             "       </host>\n"
                             "       <link id=\"loopback\" bandwidth=\"100000GBps\" latency=\"0us\"/>\n"
                             "       <route src=\"the_host\" dst=\"the_host\">\n"
                             "           <link_ctn id=\"loopback\"/>\n"
                             "       </route>\n"
                             "    </zone>\n"
                             "</platform>";

    FILE *platform_file = fopen(platform_file_path.c_str(), "w");
    fprintf(platform_file, "%s", xml_string.c_str());
    fclose(platform_file);

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

    // Customize logging
    xbt_log_control_set("root.fmt:[%.2d][%h]%e%m%n");

    int NUM_CORES;
    int DISK_BW;

    try {
        if (argc != 3) {
            throw std::invalid_argument("bad args");
        }

        NUM_CORES = std::stoi(std::string(argv[1]));
        DISK_BW = std::stoi(std::string(argv[2]));

        if (NUM_CORES < 1) {
            std::cerr << "Number of cores must be at least 1";
            throw std::invalid_argument("invalid number of cores");
        }

        if (DISK_BW < 1) {
            std::cerr << "Disk bandwidth must be at least 1";
            throw std::invalid_argument("invalid disk bandwidth");
        }

    } catch (std::invalid_argument &e) {
        std::cerr << "Usage: " << argv[0] << " <num cores> <disk bandwidth>" << std::endl;
        std::cerr << "    disk bandwidth: measured in MB/sec" << std::endl;
        return 1;
    }

    // generate workflow
    wrench::Workflow workflow;
    generateWorkflow(&workflow);

    // generate platform
    std::string platform_file_path = "/tmp/platform.xml";
    generatePlatform(platform_file_path, NUM_CORES, DISK_BW);
    simulation.instantiatePlatform(platform_file_path);

    // storage service
    auto storage_service = simulation.add(new wrench::SimpleStorageService("the_host", {"/"},
            {
                    {wrench::SimpleStorageServiceProperty::BUFFER_SIZE, "infinity"},
        }, {}));

    storage_service->setNetworkTimeoutValue(100000.00); // Large file, small bandwidth

    auto compute_service = simulation.add(new wrench::BareMetalComputeService(
            "the_host",
            {"the_host"},
            {},
            {}
    ));

    // WMS on my_lab_computer_edu
    auto wms = simulation.add(new wrench::ActivityWMS(std::unique_ptr<wrench::ActivityScheduler>(
            new wrench::ActivityScheduler(storage_service)),
                                                      {compute_service},
                                                      {storage_service},
                                                      "the_host"
    ));

    wms->addWorkflow(&workflow);

    // file registry service on storage_db_edu
    simulation.add(new wrench::FileRegistryService("the_host"));

    // stage the input files
    for (auto file : workflow.getInputFiles()) {
        simulation.stageFile(file, storage_service);
    }

    // launch the simulation
    simulation.launch();

    simulation.getOutput().dumpUnifiedJSON(&workflow, "/tmp/workflow_data.json");
}
