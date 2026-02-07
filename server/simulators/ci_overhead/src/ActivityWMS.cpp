/**
 * Copyright (c) 2021-2022. The WRENCH Team.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 */

#include "ActivityWMS.h"
#include <memory>

XBT_LOG_NEW_DEFAULT_CATEGORY(simple_wms, "Log category for Simple WMS");

namespace wrench {

    /**
     * @brief WMS constructor
     * @param standard_job_scheduler
     * @param compute_services
     * @param storage_services
     * @param hostname
     */
    ActivityWMS::ActivityWMS(
            const std::set<std::shared_ptr<ComputeService>> &compute_services,
            const std::set<std::shared_ptr<StorageService>> &storage_services,
            const std::shared_ptr<Workflow> &workflow,
            double compute_overhead,
            const std::string &hostname) : ExecutionController(
            hostname,
            "client_server"
    ) {
        this->compute_services = compute_services;
        this->storage_services = storage_services;
        this->workflow = workflow;
        this->compute_overhead = compute_overhead;
    }

    /**
     * @brief WMS main method
     * @return
     */
    int ActivityWMS::main() {
        TerminalOutput::setThisProcessLoggingColor(TerminalOutput::Color::COLOR_MAGENTA);

        // Create a job manager
        auto job_manager = this->createJobManager();
        auto data_manager = this->createDataMovementManager();

        // Get the compute service
        std::shared_ptr<StorageService> client_storage_service, server_storage_service;
        for (const auto &ss : this->storage_services) {
            if (ss->getHostname() == "client") {
                client_storage_service = ss;
            } else {
                server_storage_service = ss;
            }
        }

        auto task = *(this->workflow->getTasks().begin());
        auto file = (*(this->workflow->getFileMap().begin())).second;

        //  Copy the file over to the server
        WRENCH_INFO("Sending the image file over to the server running on host %s",
                    server_storage_service->getHostname().c_str());
        data_manager->doSynchronousFileCopy(
                                            FileLocation::LOCATION(client_storage_service, file),
                                            FileLocation::LOCATION(server_storage_service, file));
        WRENCH_INFO(
                "File sent, server can start computing");

        // Sleep to simulate the server overhead (should convert this simulator to Action API really)
        wrench::Simulation::sleep(compute_overhead);

        // Run the task
        std::map<std::shared_ptr<DataFile>, std::shared_ptr<FileLocation>> file_locations;
        file_locations[file] = FileLocation::LOCATION(server_storage_service, file);
        auto job = job_manager->createStandardJob(task, file_locations);
        job_manager->submitJob(job, *(compute_services.begin()), {});

        // Wait for a workflow execution event, and process it
        try {
            this->waitForAndProcessNextEvent();
        } catch (ExecutionException &e) { WRENCH_INFO(
                    "Error while getting next execution event (%s)... ignoring and trying again",
                    (e.getCause()->toString().c_str()));
        }

        return 0;
    }

    /**
     * @brief Any time a standard job is completed, print to WRENCH_INFO in RED, the number of tasks in the job
     * @param event
     */
    void ActivityWMS::processEventStandardJobCompletion(const std::shared_ptr<StandardJobCompletedEvent> &event) {
        auto standard_job = event->standard_job;
        TerminalOutput::setThisProcessLoggingColor(TerminalOutput::Color::COLOR_RED);WRENCH_INFO(
                "Server has completed the task!");
    }
}