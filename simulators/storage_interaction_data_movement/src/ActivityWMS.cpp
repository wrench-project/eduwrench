/**
 * Copyright (c) 2020. The WRENCH Team.
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
            const std::shared_ptr<FileRegistryService> &file_registry_service) : WMS(
            nullptr,
            nullptr,
            {},
            storage_services,
            {}, file_registry_service,
            hostname,
            "client_server"
    ) {}

    /**
     * @brief WMS main method
     * @return
     */
    int ActivityWMS::main() {
        TerminalOutput::setThisProcessLoggingColor(TerminalOutput::Color::COLOR_RED);

        // Create a job manager
        auto data_manager = this->createDataMovementManager();
        auto job_manager = this->createJobManager();
        auto file_registry = this->getAvailableFileRegistryService();

        // Start bandwidth meters
        const double BANDWIDTH_METER_PERIOD = 0.01;
        std::vector<std::string> linknames;
        linknames.emplace_back("network_link");
        auto em = this->createBandwidthMeter(linknames, BANDWIDTH_METER_PERIOD);

        std::shared_ptr<StorageService> client_storage_service, server_storage_service;
        for (const auto &storage_service : this->getAvailableStorageServices()) {
            if (storage_service->getHostname() == "ClientHost") {
                client_storage_service = storage_service;
            } else {
                server_storage_service = storage_service;
            }
        }

        auto input_file = this->getWorkflow()->getFileByID("file_copy");

        WRENCH_INFO("Sending the file over to the server running on host %s",
                    server_storage_service->getHostname().c_str());

        //  Copy the file over to the server
        data_manager->doSynchronousFileCopy(input_file,
                                            FileLocation::LOCATION(client_storage_service),
                                            FileLocation::LOCATION(server_storage_service),
                                            file_registry);

        WRENCH_INFO("File sent and registered in the file registry!");

        WRENCH_INFO("Simulation Complete!");

        return 0;
    }
}
