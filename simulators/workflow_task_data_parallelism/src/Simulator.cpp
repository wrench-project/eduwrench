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

#include "ActivityWMS.h"

/**
 * @brief Generate the workflow
 * @description Fork-Join
 */
void generateWorkflow(wrench::Workflow *workflow,
                      int task_blue_num_cores,
                      int task_yellow_num_cores,
                      int task_purple_num_cores
) {

    const double GFLOP = 1000.0 * 1000.0 * 1000.0;

    //  Green task
    auto green_task  = workflow->addTask("green", 100 * GFLOP, 1,  1, 0);
    green_task->setColor("#D5E8D4");

    // Blue task
    double blue_alpha = 0.9;
    double blue_parallel_efficiency =  (1 / (blue_alpha / task_blue_num_cores +  (1 - blue_alpha))) / task_blue_num_cores;
    double blue_work = 1000 * GFLOP;
    auto blue_task = workflow->addTask("blue", blue_work, task_blue_num_cores,  task_blue_num_cores, 0);
    blue_task->setParallelModel(wrench::ParallelModel::CONSTANTEFFICIENCY(blue_parallel_efficiency));
    blue_task->setColor("#DAE8FC");

    // Yellow task
    double yellow_alpha = 0.85;
    double yellow_parallel_efficiency =  (1 / (yellow_alpha / task_yellow_num_cores +  (1 - yellow_alpha))) / task_yellow_num_cores;
    double yellow_work = 2000 * GFLOP;
    auto yellow_task = workflow->addTask("yellow", yellow_work, task_yellow_num_cores,  task_yellow_num_cores, 0);
    yellow_task->setParallelModel(wrench::ParallelModel::CONSTANTEFFICIENCY(yellow_parallel_efficiency));
    yellow_task->setColor("#FFF2CC");

    // Purple task
    double purple_alpha = 0.80;
    double purple_parallel_efficiency =  (1 / (purple_alpha / task_purple_num_cores +  (1 - purple_alpha))) / task_purple_num_cores;
    double purple_work = 1200 * GFLOP;
    auto purple_task = workflow->addTask("purple", purple_work, task_purple_num_cores,  task_purple_num_cores, 0);
    purple_task->setParallelModel(wrench::ParallelModel::CONSTANTEFFICIENCY(purple_parallel_efficiency));
    purple_task->setColor("#E1D5E7");

    // Red task
    auto red_task  = workflow->addTask("red", 100 * GFLOP, 1,  1, 0);
    red_task->setColor("#F8CECC");

    workflow->addControlDependency(green_task,  blue_task);
    workflow->addControlDependency(green_task,  yellow_task);
    workflow->addControlDependency(green_task,  purple_task);
    workflow->addControlDependency(blue_task, red_task);
    workflow->addControlDependency(yellow_task, red_task);
    workflow->addControlDependency(purple_task, red_task);
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

    const double MB = 1000.0 * 1000.0;
    const double GB = MB * 1000.0;

    // Create a the platform file
    std::string xml = "<?xml version='1.0'?>\n"
                      "<!DOCTYPE platform SYSTEM \"http://simgrid.gforge.inria.fr/simgrid/simgrid.dtd\">\n"
                      "<platform version=\"4.1\">\n";
    xml += "   <zone id=\"AS0\" routing=\"Full\">\n";


    // The two hosts
    xml += "      <host id=\"host1\" speed=\"100Gf\" core=\"3\"/>\n";
    xml += "      <host id=\"host2\" speed=\"100Gf\" core=\"3\"/>\n";

    // The loopback link
    xml += "      <link id=\"loopback\" bandwidth=\"50000GBps\" latency=\"0ns\"/>\n";

    // The routes
    xml += "      <route src=\"host1\" dst=\"host2\">\n";
    xml += "          <link_ctn id=\"loopback\"/>\n";
    xml += "      </route>\n";
    xml += "      <route src=\"host1\" dst=\"host1\">\n";
    xml += "          <link_ctn id=\"loopback\"/>\n";
    xml += "      </route>\n";
    xml += "      <route src=\"host2\" dst=\"host2\">\n";
    xml += "          <link_ctn id=\"loopback\"/>\n";
    xml += "      </route>\n";

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

    wrench::Simulation simulation;
    simulation.init(&argc, argv);

    int BLUE_NUM_CORES;
    int YELLOW_NUM_CORES;
    int PURPLE_NUM_CORES;

    try {
        if (argc != 4) {
            throw std::invalid_argument("bad args");
        }

        BLUE_NUM_CORES = std::stoi(std::string(argv[1]));
        YELLOW_NUM_CORES = std::stoi(std::string(argv[2]));
        PURPLE_NUM_CORES = std::stoi(std::string(argv[3]));

        if ((BLUE_NUM_CORES < 1) or (BLUE_NUM_CORES > 3)) {
            std::cerr << "Number of cores must be at least 1 and at most 3";
            throw std::invalid_argument("invalid number of hosts");
        }

        if ((YELLOW_NUM_CORES < 1) or (YELLOW_NUM_CORES > 3)) {
            std::cerr << "Number of cores must be at least 1 and at most 3";
            throw std::invalid_argument("invalid number of hosts");
        }

        if ((PURPLE_NUM_CORES < 1) or (PURPLE_NUM_CORES > 3)) {
            std::cerr << "Number of cores must be at least 1 and at most 3";
            throw std::invalid_argument("invalid number of hosts");
        }

    } catch (std::invalid_argument &e) {
        std::cerr << "Usage: " << argv[0] << " <num cores for blue task> <num cores for yellow task> <num cores for purple task>" << std::endl;
        return 1;
    }

    // generate workflow
    wrench::Workflow workflow;
    generateWorkflow(&workflow, BLUE_NUM_CORES, YELLOW_NUM_CORES, PURPLE_NUM_CORES);

    // generate platform
    std::string platform_file_path = "/tmp/platform.xml";
    generatePlatform(platform_file_path);
    simulation.instantiatePlatform(platform_file_path);

    std::vector<std::string> compute_hosts = {"host1", "host2"};
    auto compute_service = simulation.add(new wrench::BareMetalComputeService(
            "host1",
            compute_hosts,
            {},
            {}
    ));

    // WMS on user.edu
    auto wms = simulation.add(new wrench::ActivityWMS({compute_service},
                                                      {},"host1"
    ));

    wms->addWorkflow(&workflow);

    // launch the simulation
    simulation.launch();

    simulation.getOutput().dumpUnifiedJSON(&workflow, "/tmp/workflow_data.json");
}
