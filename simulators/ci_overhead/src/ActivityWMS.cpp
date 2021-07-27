/**
 * Copyright (c) 2021. The WRENCH Team.
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
            const std::string &hostname) : WMS(
            nullptr,
            nullptr,
            compute_services,
            storage_services,
            {}, nullptr,
            hostname,
            "client_server"
    ) {}

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
        const auto compute_service = *(this->getAvailableComputeServices<ComputeService>().begin());

        std::shared_ptr<StorageService> client_storage_service, server_storage_service;
        for (const auto &ss : this->getAvailableStorageServices()) {
            if (ss->getHostname() == "client") {
                client_storage_service = ss;
            } else {
                server_storage_service = ss;
            }
        }

        auto task = *(this->getWorkflow()->getTasks().begin());
        auto file = *(this->getWorkflow()->getFiles().begin());

        //  Copy the file over to the server
        WRENCH_INFO("Sending the image file over to the server running on host %s",
                    server_storage_service->getHostname().c_str());
        data_manager->doSynchronousFileCopy(file,
                                            FileLocation::LOCATION(client_storage_service),
                                            FileLocation::LOCATION(server_storage_service));WRENCH_INFO(
                "File sent, server can start computing");

        // Run the task
        std::map<WorkflowFile *, std::shared_ptr<FileLocation>> file_locations;
        file_locations[file] = FileLocation::LOCATION(server_storage_service);
        auto job = job_manager->createStandardJob(task, file_locations);
        job_manager->submitJob(job, compute_service, {});

        // Wait for a workflow execution event, and process it
        try {
            this->waitForAndProcessNextEvent();
        } catch (WorkflowExecutionException &e) { WRENCH_INFO(
                    "Error while getting next execution event (%s)... ignoring and trying again",
                    (e.getCause()->toString().c_str()));
        }

        return 0;
    }

    /**
     * @brief Any time a standard job is completed, print to WRENCH_INFO in RED, the number of tasks in the job
     * @param event
     */
    void ActivityWMS::processEventStandardJobCompletion(std::shared_ptr<StandardJobCompletedEvent> event) {
        auto standard_job = event->standard_job;
        TerminalOutput::setThisProcessLoggingColor(TerminalOutput::Color::COLOR_RED);WRENCH_INFO(
                "Server has completed the task!");
    }
}
