/**
 * Copyright (c) 2020-2021. The WRENCH Team.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 */

#include "ActivityWMS.h"
#include <algorithm>
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
            const std::set<std::shared_ptr<StorageService>> &storage_services,
            const std::string &hostname,
            const std::shared_ptr<FileRegistryService> &file_registry_service,
            const std::shared_ptr<Workflow> &workflow) : ExecutionController(
            hostname,
            "client_server"
    ) {
        this->storage_services = storage_services;
        this->file_registry_service = file_registry_service;
        this->workflow = workflow;
    }

    /**
     * @brief WMS main method
     * @return
     */
    int ActivityWMS::main() {
        TerminalOutput::setThisProcessLoggingColor(TerminalOutput::Color::COLOR_RED);

        // Create a job manager
        auto data_manager = this->createDataMovementManager();
        auto job_manager = this->createJobManager();

        // Start bandwidth meters
        const double BANDWIDTH_METER_PERIOD = 0.01;
        std::vector<std::string> linknames;
        linknames.emplace_back("network_link");
        auto em = this->createBandwidthMeter(linknames, BANDWIDTH_METER_PERIOD);

        std::shared_ptr<StorageService> client_storage_service, server_storage_service;
        for (const auto &storage_service : this->storage_services) {
            if (storage_service->getHostname() == "Client") {
                client_storage_service = storage_service;
            } else {
                server_storage_service = storage_service;
            }
        }

        auto input_file = wrench::Simulation::getFileByID("data_file");

        WRENCH_INFO("Sending the file over to the server running on host %s",
                    server_storage_service->getHostname().c_str());

        //  Copy the file over to the server
        data_manager->doSynchronousFileCopy(
                                            FileLocation::LOCATION(client_storage_service, input_file),
                                            FileLocation::LOCATION(server_storage_service, input_file),
                                            this->file_registry_service);

        WRENCH_INFO("File sent and registered in the file registry!");

        WRENCH_INFO("Simulation Complete!");

        return 0;
    }
}
