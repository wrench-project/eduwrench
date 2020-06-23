
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
            const std::string &hostname) : WMS (
            nullptr,
            nullptr,
            {},
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
        auto data_manager = this->createDataMovementManager();
        auto job_manager = this->createJobManager();
        auto file_registry = this->getAvailableFileRegistryService();

        std::shared_ptr<StorageService> client_storage_service, server_storage_service;
        for (const auto &storage_service : this->getAvailableStorageServices()) {
            if (storage_service->getHostname() == "ClientHost") {
                client_storage_service = storage_service;
            } else {
                server_storage_service = storage_service;
            }
        }

        auto input_file = this->getWorkflow()->getFileByID("file_copy");

        WRENCH_INFO("Sending the file over to the server running on host %s", server_storage_service->getHostname().c_str());

        //  Copy the file over to the server
        data_manager->doSynchronousFileCopy(input_file,
                                            FileLocation::LOCATION(client_storage_service),
                                            FileLocation::LOCATION(server_storage_service));
        WRENCH_INFO("File sent!");


        TerminalOutput::setThisProcessLoggingColor(TerminalOutput::Color::COLOR_CYAN);
        //Copy from server storage back to client
        WRENCH_INFO("Sending the file over to the client running on host %s", client_storage_service->getHostname().c_str());
        data_manager->doSynchronousFileCopy(input_file,
                                            FileLocation::LOCATION(server_storage_service),
                                            FileLocation::LOCATION(client_storage_service));
        WRENCH_INFO("File sent!");

        TerminalOutput::setThisProcessLoggingColor(TerminalOutput::Color::COLOR_BLACK);
        WRENCH_INFO("------------------------------------------------");
        WRENCH_INFO("Simulation Complete!");


        return 0;
    }
}
