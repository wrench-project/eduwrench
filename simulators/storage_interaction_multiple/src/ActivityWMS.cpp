
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
            const std::string &hostname) : WMS (
            nullptr,
            nullptr,
            {},
            storage_services,
            {}, file_registry,
            hostname,
            "client_server"
    ) {}



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
        auto np_service = this->getAvailableNetworkProximityServices();
        bool use_nps = !np_service.empty();

        std::shared_ptr<StorageService> client_storage_service;
        std::shared_ptr<StorageService> chosen_storage_service;
        std::vector<std::shared_ptr<StorageService>> server_storage_services;
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
            WRENCH_INFO("Sending the file over to the server running on host %s", storage_service->getHostname().c_str());
            data_manager->doSynchronousFileCopy(input_file,
                                                FileLocation::LOCATION(client_storage_service),
                                                FileLocation::LOCATION(storage_service), file_registry);
            WRENCH_INFO("File sent!");
        }


        //Copy from chosen server storage back to client
        WRENCH_INFO("Sending the file over to the client running on host %s", client_storage_service->getHostname().c_str());
        if (np_service.empty()) {
            std::cerr << "NULL" << std::endl;
        }
        if (use_nps) {
            WRENCH_INFO("Using Network Proximity Service to find closest storage unit...");
            auto entries = file_registry->lookupEntry(input_file, "ClientHost", *(np_service.begin()));

           // WRENCH_INFO("Choosing file from storage running on host %s", *(entries.begin())->getStorageService()->getHostname().c_str());
            data_manager->doSynchronousFileCopy(input_file,
                                                entries.begin()->second,
                                                FileLocation::LOCATION(client_storage_service),
                                                file_registry);
        } else {
            WRENCH_INFO("Receiving from chosen storage service...");
            data_manager->doSynchronousFileCopy(input_file,
                                                FileLocation::LOCATION(chosen_storage_service),
                                                FileLocation::LOCATION(client_storage_service),
                                                file_registry);
        }
        WRENCH_INFO("File sent!");


        return 0;
    }
}
