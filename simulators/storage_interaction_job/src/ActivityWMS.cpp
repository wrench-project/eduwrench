
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
            const std::set<std::shared_ptr<ComputeService>> &compute_services,
            const std::set<std::shared_ptr<StorageService>> &storage_services,
            const std::string &hostname) : WMS (
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

        auto compute_service = *(this->getAvailableComputeServices<BareMetalComputeService>().begin());

        std::shared_ptr<StorageService> client_storage_service, server_storage_service;
        for (const auto &storage_service : this->getAvailableStorageServices()) {
            if (storage_service->getHostname() == "ClientHost") {
                client_storage_service = storage_service;
            } else {
                server_storage_service = storage_service;
            }
        }

        WRENCH_INFO("Assigning pre and post copy operations (from user to server and server to user)");

        //auto task = this->getWorkflow()->getTaskByID("task");
        auto input_file = this->getWorkflow()->getFileByID("file_copy");

        std::vector<std::tuple<WorkflowFile *, std::shared_ptr<FileLocation>, std::shared_ptr<FileLocation>>> copy_operation1;
        std::tuple<WorkflowFile *, std::shared_ptr<FileLocation>, std::shared_ptr<FileLocation>> client_to_server(input_file,
                                                                                                                  FileLocation::LOCATION(client_storage_service),
                                                                                                                  FileLocation::LOCATION(server_storage_service));
        copy_operation1.push_back(client_to_server);

        std::vector<std::tuple<WorkflowFile *, std::shared_ptr<FileLocation>, std::shared_ptr<FileLocation>>> copy_operation2;
        std::tuple<WorkflowFile *, std::shared_ptr<FileLocation>, std::shared_ptr<FileLocation>> server_to_client(input_file,
                                                                                                                  FileLocation::LOCATION(server_storage_service),
                                                                                                                  FileLocation::LOCATION(client_storage_service));
        copy_operation2.push_back(server_to_client);

        WRENCH_INFO("test3");
        auto job = job_manager->createStandardJob({}, {}, copy_operation1, copy_operation2, {});

        WRENCH_INFO("Submitting job..");
        job_manager->submitJob(job, compute_service);


        // Wait for a workflow execution event, and process it
        try {
            this->waitForAndProcessNextEvent();
        } catch (WorkflowExecutionException &e) {
            WRENCH_INFO("Error while getting next execution event (%s)... ignoring and trying again",
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
        TerminalOutput::setThisProcessLoggingColor(TerminalOutput::Color::COLOR_RED);
        WRENCH_INFO("Server has completed the task!");
    }
}
