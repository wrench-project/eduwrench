
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

        auto input_file = this->getWorkflow()->getFileByID("file_copy");

        // Create a job manager
        auto data_manager = this->createDataMovementManager();
        auto job_manager = this->createJobManager();
        auto file_registry = this->getAvailableFileRegistryService();
        auto np_services = this->getAvailableNetworkProximityServices();
        bool use_nps = !np_services.empty();

        std::shared_ptr<StorageService> client_storage_service;
        std::shared_ptr<StorageService> chosen_storage_service;
        std::vector<std::shared_ptr<StorageService>> server_storage_services;

        //load storage services into the vector
        for (const auto &storage_service : this->getAvailableStorageServices()) {
            if (storage_service->getHostname() == "ClientHost") {
                client_storage_service = storage_service;
            } else {
                if (!use_nps) {
                    if (storage_service->getHostname() == "ChosenServerHost") {
                        chosen_storage_service = storage_service;
                    }
                }
                server_storage_services.push_back(storage_service);
            }
        }

        for (const auto &storage_service : server_storage_services) {
            WRENCH_INFO("Sending the file over to the server running on host %s",
                        storage_service->getHostname().c_str());
            data_manager->doSynchronousFileCopy(input_file,
                                                FileLocation::LOCATION(client_storage_service),
                                                FileLocation::LOCATION(storage_service),
                                                file_registry);
        }

        file_registry->removeEntry(input_file, FileLocation::LOCATION(client_storage_service));
        if (use_nps) {
            TerminalOutput::setThisProcessLoggingColor(TerminalOutput::Color::COLOR_BLACK);
            WRENCH_INFO("Sleep for 30 minutes (1800 seconds) so NPS has time to ping and find "
                        "proximity");
            Simulation::sleep(1800.0);

            TerminalOutput::setThisProcessLoggingColor(TerminalOutput::Color::COLOR_GREEN);
            // using network proximity service
            WRENCH_INFO("Using Network Proximity Service to find closest storage unit...");
            auto np_service = *np_services.begin();
            chosen_storage_service = *server_storage_services.begin();
            double min_distance = DBL_MAX;

            //find minimal distance between the storage service and client host
            for (const auto &storage_service : server_storage_services) {
                if (storage_service->getHostname() != "ClientHost") {
                    double proximity = np_service->getHostPairDistance(
                            {"ClientHost", storage_service->getHostname()}).first;
                    WRENCH_INFO("Proximity between ClientHost and host %s is %e",
                                storage_service->getHostname().c_str(), proximity);
                    if (proximity < min_distance) {
                        min_distance = proximity;
                        chosen_storage_service = storage_service;
                    }
                }
            }
        }

        TerminalOutput::setThisProcessLoggingColor(TerminalOutput::Color::COLOR_MAGENTA);
        //Copy from chosen server storage back to client
        WRENCH_INFO("Sending the file over to the client running on host %s",
                    client_storage_service->getHostname().c_str());

        /*if (use_nps) {
            // using network proximity service
            WRENCH_INFO("Using Network Proximity Service to find closest storage unit...");
            auto entries = file_registry->lookupEntry(input_file, "ClientHost", *np_services.begin());
            chosen_storage_service = entries.begin()->second->getStorageService();
        }*/

        WRENCH_INFO("Receiving from chosen storage service on host %s", chosen_storage_service->getHostname
        ().c_str());
        data_manager->doSynchronousFileCopy(input_file,
                                            FileLocation::LOCATION(chosen_storage_service),
                                            FileLocation::LOCATION(client_storage_service),
                                            file_registry);


        WRENCH_INFO("File sent!");

        TerminalOutput::setThisProcessLoggingColor(TerminalOutput::Color::COLOR_BLACK);
        WRENCH_INFO("------------------------------------------------");
        WRENCH_INFO("Simulation Complete!");
        return 0;
    }
}
