
#include "ActivityWMS.h"
#include <algorithm>
#include <memory>
#include <regex>

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
            const std::shared_ptr<FileRegistryService> &file_registry,
            const std::set<std::shared_ptr<StorageService>> &storage_services,
            const std::string &hostname) :
            WMS(nullptr, nullptr, {}, storage_services, {}, file_registry, hostname,
                "client_server") {}

    /**
     * @brief WMS main method
     * @return
     */
    int ActivityWMS::main() {
        TerminalOutput::setThisProcessLoggingColor(TerminalOutput::Color::COLOR_MAGENTA);

        //set up random number generator
        std::random_device rd;
        std::mt19937 gen(rd());
        std::uniform_real_distribution<> dis(0,1);

        // Create a job manager, data manager, get file registry
        auto data_manager = this->createDataMovementManager();
        auto job_manager = this->createJobManager();
        auto file_registry = this->getAvailableFileRegistryService();

        //get storage services
        std::shared_ptr<StorageService> client_storage_service, storage_service_1, storage_service_2;
        for (const auto &storage_service : this->getAvailableStorageServices()) {
            if (storage_service->getHostname() == "ClientHost") {
                client_storage_service = storage_service;
            } else if (storage_service->getHostname() == "ServerHost1") {
                storage_service_1 = storage_service;
            } else {
                storage_service_2 = storage_service;
            }
        }

        bool transferCorrupted, serverCorrupted;
        double probability;
        WorkflowFile* corrupted_file;
        WorkflowFile* not_corrupted_file;

        //get files from workflow
        for (auto file : this->getWorkflow()->getFiles()) {
            if (file->getID().find("XkOWL") != std::string::npos) {
                not_corrupted_file = file;
            } else if (file->getID().find("XmOWL") != std::string::npos) {
                corrupted_file = file;
                transferCorrupted = true;
            } else if (file->getID().find("XuOWL") != std::string::npos) {
                corrupted_file = file;
                serverCorrupted = true;
            } else if (file->getID().find("p") != std::string::npos) {
                //get probability of file being corrupted if scenario 1 was chosen
                std::string ID = file->getID();
                ID = std::regex_replace(ID, std::regex("[^0-9]*([0-9]+).*"), std::string("$1"));
                probability = std::stoi(ID) / 100.0;
            }
        }

        WRENCH_INFO("Downloading file %s from server %s",
                    not_corrupted_file->getID().c_str(), storage_service_1->getHostname().c_str());

        if (transferCorrupted) {
            //if running scenario 1, while the uncorrupted file is not transferred, keep trying
            while (transferCorrupted) {
                //using random number generator to determine if corrupted file will be retrieved
                if (dis(gen) < probability) {
                    data_manager->doSynchronousFileCopy(corrupted_file,
                                                        FileLocation::LOCATION(storage_service_1),
                                                        FileLocation::LOCATION(client_storage_service),
                                                        file_registry);

                    //faux checksum computing runtime based on file size
                    TerminalOutput::setThisProcessLoggingColor(TerminalOutput::Color::COLOR_GREEN);
                    WRENCH_INFO("Computing checksum of file...");
                    Simulation::sleep(corrupted_file->getSize() * 0.0000002);

                    TerminalOutput::setThisProcessLoggingColor(TerminalOutput::Color::COLOR_MAGENTA);
                    WRENCH_INFO("File %s from server %s was corrupted during transfer",
                                corrupted_file->getID().c_str(), storage_service_1->getHostname().c_str());
                } else {
                    data_manager->doSynchronousFileCopy(not_corrupted_file,
                                                        FileLocation::LOCATION(storage_service_1),
                                                        FileLocation::LOCATION(client_storage_service),
                                                        file_registry);
                    //faux checksum computing runtime based on file size
                    TerminalOutput::setThisProcessLoggingColor(TerminalOutput::Color::COLOR_GREEN);
                    WRENCH_INFO("Computing checksum of file...");
                    Simulation::sleep(not_corrupted_file->getSize() * 0.0000002);

                    TerminalOutput::setThisProcessLoggingColor(TerminalOutput::Color::COLOR_MAGENTA);
                    WRENCH_INFO("File %s from server %s was successfully transferred",
                            not_corrupted_file->getID().c_str(), storage_service_1->getHostname().c_str());
                    transferCorrupted = false;
                }
            }
        } else if (serverCorrupted) {
            //if running scenario 2, download uncorrupted file from server 2
            data_manager->doSynchronousFileCopy(corrupted_file,
                                                FileLocation::LOCATION(storage_service_1),
                                                FileLocation::LOCATION(client_storage_service),
                                                file_registry);

            TerminalOutput::setThisProcessLoggingColor(TerminalOutput::Color::COLOR_GREEN);
            WRENCH_INFO("Computing checksum of file...");
            Simulation::sleep(not_corrupted_file->getSize() * 0.0000002);
            TerminalOutput::setThisProcessLoggingColor(TerminalOutput::Color::COLOR_MAGENTA);
            WRENCH_INFO("File %s (received: %s) at server %s is corrupted! Downloading from server %s",
                        not_corrupted_file->getID().c_str(), corrupted_file->getID().c_str(), storage_service_1->getHostname().c_str(), storage_service_2->getHostname().c_str());

            data_manager->doSynchronousFileCopy(not_corrupted_file,
                                                FileLocation::LOCATION(storage_service_2),
                                                FileLocation::LOCATION(client_storage_service),
                                                file_registry);
            TerminalOutput::setThisProcessLoggingColor(TerminalOutput::Color::COLOR_MAGENTA);
            WRENCH_INFO("File %s from server %s was successfully transferred",
                        not_corrupted_file->getID().c_str(), storage_service_2->getHostname().c_str());
        }

        TerminalOutput::setThisProcessLoggingColor(TerminalOutput::Color::COLOR_BLACK);
        WRENCH_INFO("------------------------------------------------");
        WRENCH_INFO("Simulation Complete!");


        return 0;
    }
}