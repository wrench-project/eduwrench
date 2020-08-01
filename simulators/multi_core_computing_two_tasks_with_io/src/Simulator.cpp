/**
 * Copyright (c) 1010. The WRENCH Team.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 */

#include <iostream>
#include <string>
#include <algorithm>
#include <simgrid/s4u.hpp>
#include <wrench.h>

#include "ActivityWMS.h"
#include "ActivityScheduler.h"

/**
 * @brief Generates a two-task Workflow
 *
 * @param workflow
 * @param task1_read: task1 read size in MB
 * @param task1_write: task1 write size in MB
 * @param task1_gflop: task1 GFlop rating
 * @param task1_read: task1 read size in MB
 * @param task1_write: task1 write size in MB
 * @param task1_gflop: task1 GFlop rating
 * @param io_overlap: Whether IO overlaps w/ computation.
 *
 * @throws std::invalid_argument
 */
void generateWorkflow(wrench::Workflow *workflow,
                      std::vector<std::tuple<int,int,int>> task_specs,
                      bool task1_before_task2)  {

    if (workflow == nullptr) {
        throw std::invalid_argument("generateWorkflow(): invalid workflow");
    }

    for (auto const &task_spec : task_specs) {
        if (std::get<0>(task_spec) < 0 || std::get<1>(task_spec) < 0 || std::get<2>(task_spec) < 0) {
            throw std::invalid_argument("generateWorkflow(): no task spec argument can be negative");
        }
    }

    // WorkflowTask specifications
    const double GFLOP = 1000.0 * 1000.0 * 1000.0;
    const double MB = 1000.0 * 1000.0;

    // Create tasks
    std::vector<std::tuple<wrench::WorkflowTask*, wrench::WorkflowTask*, wrench::WorkflowTask*>> tasks;
    int count = 0;
    for (auto const &task_spec : task_specs) {
        count++;

        // Compute task
        std::string compute_task_id("task #" + std::to_string(count));
        auto compute_task = workflow->addTask(compute_task_id, std::get<2>(task_spec) * GFLOP, 1, 1, 1.0, 0);

        // IO read task
        std::string io_read_task_id("io read task #" + std::to_string(count));
        auto io_read_task = workflow->addTask(io_read_task_id, 0, 1, 1, 1.0, 0);
        io_read_task->addInputFile(workflow->addFile(compute_task_id+"::in", std::get<0>(task_spec) * MB));

        // IO write task
        std::string io_write_task_id("io write task #" + std::to_string(count));
        auto io_write_task = workflow->addTask(io_write_task_id, 0, 1, 1, 1.0, 0);
        io_read_task->addInputFile(workflow->addFile(compute_task_id+"::out", std::get<1>(task_spec) * MB));


        // Add implicit control dependencies
        workflow->addControlDependency(io_read_task, compute_task);
        workflow->addControlDependency(compute_task, io_write_task);
        tasks.push_back({io_read_task, io_write_task, compute_task});
    }

    // Add implicit read input control dependencies due to order
    int first_task = (task1_before_task2 ? 0 : 1);
    int last_task = (task1_before_task2 ? 1 : 0);
    workflow->addControlDependency(std::get<0>(tasks[first_task]), std::get<0>(tasks[last_task]));

    // Add implicit write output control dependency based on what we know the schedule to be
    double first_task_finishes_computing  = std::get<0>(task_specs[first_task]) / 100.0  +
            std::get<2>(task_specs[first_task]) / 100.0;
    double last_task_finishes_computing  = std::get<0>(task_specs[first_task]) / 100.0 + std::get<0>(task_specs[last_task]) / 100.0  +
                                            std::get<2>(task_specs[last_task]) / 100.0;
    if (first_task_finishes_computing  <= last_task_finishes_computing) {
        workflow->addControlDependency(std::get<1>(tasks[first_task]), std::get<1>(tasks[last_task]));
    } else {
        workflow->addControlDependency(std::get<1>(tasks[last_task]), std::get<1>(tasks[first_task]));
    }
}

/**
 * @brief Generates a platform with a single two-core host
 * @param platform_file_path: path to write the platform file to
 *
 * @throws std::invalid_argumemnt
 */
void generatePlatform(std::string platform_file_path) {

    if (platform_file_path.empty()) {
        throw std::invalid_argument("generatePlatform() platform_file_path cannot be empty");
    }

    // Create a the platform file
    std::string xml = "<?xml version='1.0'?>\n"
                      "<!DOCTYPE platform SYSTEM \"http://simgrid.gforge.inria.fr/simgrid/simgrid.dtd\">\n"
                      "<platform version=\"4.1\">\n"
                      "   <zone id=\"AS0\" routing=\"Full\">\n"
                      "       <host id=\"twocorehost\" speed=\"100Gf\" core=\"2\">\n"
                      "           <prop id=\"ram\" value=\"31GB\"/>\n"
                      "           <disk id=\"large_disk\" read_bw=\"100MBps\" write_bw=\"100MBps\">\n"
                      "                            <prop id=\"size\" value=\"5000GiB\"/>\n"
                      "                            <prop id=\"mount\" value=\"/\"/>\n"
                      "           </disk>\n"
                      "       </host>\n"
                      "       <link id=\"link\" bandwidth=\"100000TBps\" latency=\"0us\"/>\n"
                      "       <route src=\"twocorehost\" dst=\"twocorehost\">\n"
                      "           <link_ctn id=\"link\"/>\n"
                      "       </route>\n"
                      "   </zone>\n"
                      "</platform>\n";

    FILE *platform_file = fopen(platform_file_path.c_str(), "w");
    fprintf(platform_file, "%s", xml.c_str());
    fclose(platform_file);
}

/**
 *
 * @param argc
 * @param argv
 * @return
 */
int main(int argc, char **argv) {

    wrench::Simulation simulation;

    simulation.init(&argc, argv);

    int TASK1_READ;
    int TASK1_WRITE;
    int TASK1_GFLOP;
    int TASK2_READ;
    int TASK2_WRITE;
    int TASK2_GFLOP;
    bool TASK1_BEFORE_TASK2;

    try {

        if (argc != 8) {
            throw std::invalid_argument("bad args");
        }

        TASK1_READ = std::stoi(std::string(argv[1]));
        TASK1_WRITE = std::stoi(std::string(argv[2]));
        TASK1_GFLOP = std::stoi(std::string(argv[3]));
        TASK2_READ = std::stoi(std::string(argv[4]));
        TASK2_WRITE = std::stoi(std::string(argv[5]));
        TASK2_GFLOP = std::stoi(std::string(argv[6]));

        if (TASK1_READ < 0 || TASK1_WRITE < 0 || TASK1_GFLOP < 0 ||
            TASK2_READ < 0 || TASK2_WRITE < 0 || TASK2_GFLOP < 0) {
            throw std::invalid_argument("invalid arguments");
        }

        if (std::string(argv[7]) == "true") {
            TASK1_BEFORE_TASK2 = true;
        } else if (std::string(argv[7]) == "false") {
            TASK1_BEFORE_TASK2 = false;
        } else {
            throw std::invalid_argument("invalid arguments");
        }

    } catch (std::invalid_argument &e) {
        std::cerr << "Usage: " << argv[0] << " <task1_read> <task1_write> <task1_gflop> <task2_read> <task2_write> <task2_gflop> <task1_before_task2>"
                  << std::endl;
        std::cerr << "   task1_read: amount read for task #1 in MB [0,9999]" << std::endl;
        std::cerr << "   task_write: amount written for task #1 in MB [0,9999]" << std::endl;
        std::cerr << "   task_gflop: work for  task #1 in Gflop (> 0)" << std::endl;
        std::cerr << "   task2_read: amount read for task #2 in MB [0,9999]" << std::endl;
        std::cerr << "   task_write: amount written for task #2 in MB [0,9999]" << std::endl;
        std::cerr << "   task_gflop: work for  task #2 in Gflop (> 0)" << std::endl;
        std::cerr << "   task1_before_task2: whether task1 runs before task2 [true|false]"
                  << std::endl;
        std::cerr << "" << std::endl;
        std::cerr << "   (Core speed is always 100Gflop/sec, I/O bandwidth is always 100 MB/sec)" << std::endl;
        return 1;
    }

    // create workflow
    wrench::Workflow workflow;
    std::vector<std::tuple<int,int,int>> task_specs;
    task_specs.push_back(std::make_tuple(TASK1_READ, TASK1_WRITE, TASK1_GFLOP));
    task_specs.push_back(std::make_tuple(TASK2_READ, TASK2_WRITE, TASK2_GFLOP));

    generateWorkflow(&workflow, task_specs, TASK1_BEFORE_TASK2);

    // read and instantiate the platform with the desired HPC specifications
    std::string platform_file_path = "/tmp/platform.xml";
    generatePlatform(platform_file_path);

    simulation.instantiatePlatform(platform_file_path);

    const std::string WMS_HOST("twocorehost");
    const std::string COMPUTE_HOST("twocorehost");
    const std::string STORAGE_HOST("twocorehost");

    std::set<std::shared_ptr<wrench::StorageService>> storage_services;
    auto io_storage_service = simulation.add(new wrench::SimpleStorageService(STORAGE_HOST, {"/"}));
    storage_services.insert(io_storage_service);

    std::set<std::shared_ptr<wrench::ComputeService>> compute_services;
    auto compute_service = simulation.add(
            new wrench::BareMetalComputeService(
                    COMPUTE_HOST,
                    {{COMPUTE_HOST, std::make_tuple(2, wrench::ComputeService::ALL_RAM)}},
                    "",
                    {
                            {wrench::BareMetalComputeServiceProperty::TASK_STARTUP_OVERHEAD, "0"},
                    },
                    {}
            )
    );
    compute_services.insert(compute_service);

    // wms
    auto wms = simulation.add(new wrench::ActivityWMS(std::unique_ptr<wrench::ActivityScheduler>(
            new wrench::ActivityScheduler(io_storage_service)),
                                                      compute_services,
                                                      storage_services,
                                                      WMS_HOST
    ));

    wms->addWorkflow(&workflow);

    auto *file_registry_service =
            new wrench::FileRegistryService(WMS_HOST);
    simulation.add(file_registry_service);

    // stage the input files
    for (auto const &file : workflow.getInputFiles()) {
        simulation.stageFile(file, io_storage_service);
    }

    simulation.getOutput().enableDiskTimestamps(true);
    simulation.launch();

    simulation.getOutput().dumpUnifiedJSON(&workflow, "/tmp/workflow_data.json", true, true, true, false, false, true);
    return 0;
}
