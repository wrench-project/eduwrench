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
    ActivityWMS::ActivityWMS(const std::shared_ptr<FileRegistryService> &file_registry,
                             const std::set<std::shared_ptr<NetworkProximityService>> &network_proximity,
                             const std::set<std::shared_ptr<StorageService>> &storage_services,
                             const std::string &hostname) :
            WMS(nullptr, nullptr, {}, storage_services, network_proximity, file_registry, hostname,
                "client_server") {}

    /**
     * @brief WMS main method
     * @return
     */
    int ActivityWMS::main() {
        TerminalOutput::setThisProcessLoggingColor(TerminalOutput::Color::COLOR_MAGENTA);

        auto input_file = this->getWorkflow()->getFileByID("data.file");

        // Create a job manager
        auto data_manager = this->createDataMovementManager();
        auto job_manager = this->createJobManager();
        auto file_registry = this->getAvailableFileRegistryService();
        auto np_services = this->getAvailableNetworkProximityServices();

        std::shared_ptr<StorageService> client_storage_service;
        std::vector<std::shared_ptr<StorageService>> server_storage_services;

        //load storage services into the vector
        for (const auto &storage_service : this->getAvailableStorageServices()) {
            if (storage_service->getHostname() == "Client") {
                client_storage_service = storage_service;
            } else {
                server_storage_services.push_back(storage_service);
            }
        }

        for (const auto &storage_service : server_storage_services) {
            // storing file into storage service
            WRENCH_INFO("Storing file into storage service %s", storage_service->getHostname().c_str());
            data_manager->doSynchronousFileCopy(input_file,
                                                FileLocation::LOCATION(client_storage_service),
                                                FileLocation::LOCATION(storage_service),
                                                file_registry);
        }
        file_registry->removeEntry(input_file, FileLocation::LOCATION(client_storage_service));

        WRENCH_INFO("Sleep for 1 minute so Network Proximity Service has time to ping and find proximity");
        Simulation::sleep(60.0);

        // using network proximity service
        WRENCH_INFO("Using Network Proximity Service to find closest storage unit...");
        std::shared_ptr<StorageService> chosen_storage_service = *server_storage_services.begin();
        auto np_service = *np_services.begin();
        double min_distance = DBL_MAX;

//        WRENCH_INFO("Network Proximity algorithm: %s", np_service->getNetworkProximityServiceType().c_str());

        //find minimal distance between the storage service and client host
        for (const auto &storage_service : server_storage_services) {
            if (storage_service->getHostname() != "Client") {
                double proximity = np_service->getHostPairDistance(
                        {"Client", storage_service->getHostname()}).first;

                WRENCH_INFO("Proximity between Client and host %s is %e",
                            storage_service->getHostname().c_str(), proximity);

                if (proximity < min_distance) {
                    min_distance = proximity;
                    chosen_storage_service = storage_service;
                }
            }
        }
        std::cerr << "----------------------------------------" << std::endl;
        std::cerr << "Nearest Storage Service: " << chosen_storage_service->getHostname() << std::endl;
        std::cerr << "----------------------------------------" << std::endl;

        //Copy from chosen server storage back to client
        WRENCH_INFO("Receiving the file stored in %s", chosen_storage_service->getHostname().c_str());

        data_manager->doSynchronousFileCopy(input_file,
                                            FileLocation::LOCATION(chosen_storage_service),
                                            FileLocation::LOCATION(client_storage_service),
                                            file_registry);

        WRENCH_INFO("File received!");
        return 0;
    }
}
