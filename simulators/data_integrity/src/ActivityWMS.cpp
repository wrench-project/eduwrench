
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

        bool transferCorrupted, serverCorrupted, transfer2Corrupted, server2Corrupted;
        double probability;
        WorkflowFile* corrupted_file;
        WorkflowFile* not_corrupted_file;
        int max_retries;
        int retries = -1; // initialize to -1 to account for the original try before retrying

        //get files from workflow
        for (auto file : this->getWorkflow()->getFiles()) {
            if (file->getID().find("XkOWL") != std::string::npos) {
                not_corrupted_file = file;
            } else if (file->getID().find("XmOWL") != std::string::npos) {
                corrupted_file = file;
                transferCorrupted = true;
                serverCorrupted = false;
                transfer2Corrupted = false;
                server2Corrupted = false;
            } else if (file->getID().find("XuOWL") != std::string::npos) {
                corrupted_file = file;
                transferCorrupted = false;
                serverCorrupted = true;
                transfer2Corrupted = false;
                server2Corrupted = false;
            } else if (file->getID().find("XrOWL") != std::string::npos) {
                corrupted_file = file;
                transferCorrupted = false;
                serverCorrupted = true;
                transfer2Corrupted = true;
                server2Corrupted = false;
            } else if (file->getID().find("XzOWL") != std::string::npos) {
                corrupted_file = file;
                transferCorrupted = false;
                serverCorrupted = true;
                transfer2Corrupted = false;
                server2Corrupted = true;
            } else if (file->getID().find("p") != std::string::npos) {
                //get probability of file being corrupted if scenario 1 was chosen
                std::string ID = file->getID();
                ID = std::regex_replace(ID, std::regex("[^0-9]*([0-9]+).*"), std::string("$1"));
                probability = std::stoi(ID) / 100.0;
            } else if (file->getID().find("mr") != std::string::npos) {
                std::string ID = file->getID();
                max_retries = std::stoi(std::regex_replace(ID, std::regex("[^0-9]*([0-9]+).*"), std::string("$1")));
            }
        }

        WRENCH_INFO("Downloading file %s from server %s",
                    not_corrupted_file->getID().c_str(), storage_service_1->getHostname().c_str());

        if (transferCorrupted) {
            //if running scenario 1, while the uncorrupted file is not transferred, keep trying
            while (transferCorrupted && retries < max_retries) {
                //using random number generator to determine if corrupted file will be retrieved
                if (dis(gen) < probability) {
                    retries++;
                    data_manager->doSynchronousFileCopy(corrupted_file,
                                                        FileLocation::LOCATION(storage_service_1),
                                                        FileLocation::LOCATION(client_storage_service),
                                                        file_registry);

                    //faux checksum computing runtime based on file size
                    TerminalOutput::setThisProcessLoggingColor(TerminalOutput::Color::COLOR_GREEN);
                    WRENCH_INFO("Computing checksum of file...");
                    Simulation::sleep(corrupted_file->getSize() * 0.0000002);

                    TerminalOutput::setThisProcessLoggingColor(TerminalOutput::Color::COLOR_MAGENTA);
                    char* message;
                    if (retries >= max_retries) {
                        message = "File %s from server %s was corrupted during transfer";
                    } else {
                        message = "File %s from server %s was corrupted during transfer. Retrying %d of %d times";
                    }
                    WRENCH_INFO(message, corrupted_file->getID().c_str(), storage_service_1->getHostname().c_str(), retries + 1, max_retries);
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
            if (retries >= max_retries) {
                TerminalOutput::setThisProcessLoggingColor(TerminalOutput::Color::COLOR_MAGENTA);
                WRENCH_INFO("Exceeded maximum number of retries transferring file %s from server %s",
                                corrupted_file->getID().c_str(), storage_service_1->getHostname().c_str());

            }
        } else if (serverCorrupted) {
            //if running scenario 2, download corrupted file from storage service
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

            if (transfer2Corrupted) {
                while (transfer2Corrupted && retries < max_retries) {
                    // if scenario 3, retry until not corrupted
                    if (dis(gen) < probability) {
                        retries++;
                        data_manager->doSynchronousFileCopy(corrupted_file,
                                                FileLocation::LOCATION(storage_service_2),
                                                FileLocation::LOCATION(client_storage_service),
                                                file_registry);
                        //faux checksum computing runtime based on file size
                        TerminalOutput::setThisProcessLoggingColor(TerminalOutput::Color::COLOR_GREEN);
                        WRENCH_INFO("Computing checksum of file...");
                        Simulation::sleep(corrupted_file->getSize() * 0.0000002);

                        TerminalOutput::setThisProcessLoggingColor(TerminalOutput::Color::COLOR_MAGENTA);
                        char* message;
                        if (retries >= max_retries) {
                            message = "File %s from server %s was corrupted during transfer";
                        } else {
                            message = "File %s from server %s was corrupted during transfer. Retrying %d of %d times";
                        }
                        WRENCH_INFO(message, corrupted_file->getID().c_str(), storage_service_2->getHostname().c_str(), retries + 1, max_retries);
                    } else {
                        //then download uncorrupted file from storage service 2 and compute checksum
                        data_manager->doSynchronousFileCopy(not_corrupted_file,
                                                            FileLocation::LOCATION(storage_service_2),
                                                            FileLocation::LOCATION(client_storage_service),
                                                            file_registry);
                        TerminalOutput::setThisProcessLoggingColor(TerminalOutput::Color::COLOR_GREEN);
                        WRENCH_INFO("Computing checksum of file...");
                        TerminalOutput::setThisProcessLoggingColor(TerminalOutput::Color::COLOR_MAGENTA);
                        WRENCH_INFO("File %s from server %s was successfully transferred",
                        not_corrupted_file->getID().c_str(), storage_service_2->getHostname().c_str());
                        transfer2Corrupted = false;
                    }
                }
                if (retries >= max_retries) {
                    TerminalOutput::setThisProcessLoggingColor(TerminalOutput::Color::COLOR_MAGENTA);
                    WRENCH_INFO("Exceeded maximum number of retries transferring file %s from server %s",
                                corrupted_file->getID().c_str(), storage_service_2->getHostname().c_str());

                }
            } else if (server2Corrupted) {
                // if scenario 4, recreate the data
                data_manager->doSynchronousFileCopy(corrupted_file,
                                            FileLocation::LOCATION(storage_service_2),
                                            FileLocation::LOCATION(client_storage_service),
                                            file_registry);
                //faux checksum computing runtime based on file size
                TerminalOutput::setThisProcessLoggingColor(TerminalOutput::Color::COLOR_GREEN);
                WRENCH_INFO("Computing checksum of file...");
                Simulation::sleep(corrupted_file->getSize() * 0.0000002);

                TerminalOutput::setThisProcessLoggingColor(TerminalOutput::Color::COLOR_MAGENTA);
                WRENCH_INFO("Files from both servers were corrupted! Data needs to be recreated");
            } else { 
                // if scenario 2, transfer the file succesfully
                data_manager->doSynchronousFileCopy(not_corrupted_file,
                                                FileLocation::LOCATION(storage_service_2),
                                                FileLocation::LOCATION(client_storage_service),
                                                file_registry);
                TerminalOutput::setThisProcessLoggingColor(TerminalOutput::Color::COLOR_GREEN);
                WRENCH_INFO("Computing checksum of file...");
                TerminalOutput::setThisProcessLoggingColor(TerminalOutput::Color::COLOR_MAGENTA);
                WRENCH_INFO("File %s from server %s was successfully transferred",
                not_corrupted_file->getID().c_str(), storage_service_2->getHostname().c_str());
            }
        }

        TerminalOutput::setThisProcessLoggingColor(TerminalOutput::Color::COLOR_BLACK);
        WRENCH_INFO("------------------------------------------------");
        WRENCH_INFO("Simulation Complete!");


        return 0;
    }
}
