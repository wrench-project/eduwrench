
#include "ActivityWMS.h"
#include <algorithm>

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
                             const std::set<std::shared_ptr<ComputeService>> &compute_services,
                             const std::set<std::shared_ptr<StorageService>> &storage_services,
                             const std::string &hostname) : WMS (
            nullptr,
            nullptr,
            compute_services,
            storage_services,
            {}, file_registry,
            hostname,
            ""
    ) {}

    /**
     * @brief WMS main method
     * @return
     */
    int ActivityWMS::main() {
        TerminalOutput::setThisProcessLoggingColor(TerminalOutput::Color::COLOR_MAGENTA);

        WRENCH_INFO("About to execute a workflow with %lu tasks", this->getWorkflow()->getNumberOfTasks());

        // Create the managers
        auto data_manager = this->createDataMovementManager();
        auto job_manager = this->createJobManager();

        // Get the compute service
        std::shared_ptr<ComputeService> chosen_compute_service;
        for (const auto &compute_service : this->getAvailableComputeServices<ComputeService>()) {
            if (compute_service->getHostname() == "ChosenHost") {
                chosen_compute_service = compute_service;
            }
        }

        //get storage service
        auto storage_service = *(this->getAvailableStorageServices().begin());

        //get references to task and files
        auto task = this->getWorkflow()->getTaskByID("task");
        auto input_file = this->getWorkflow()->getFileByID("task_input");
        auto output_file = this->getWorkflow()->getFileByID("task_output");

        //create map of file locations
        std::map<WorkflowFile *, std::shared_ptr<FileLocation>> locations;

        //create set of pre file copy operations to be performed
        std::vector<std::tuple<WorkflowFile *, std::shared_ptr<FileLocation>,
                std::shared_ptr<FileLocation>>> pre_copy;

        //create set of post file copy operations to be performed
        std::vector<std::tuple<WorkflowFile *, std::shared_ptr<FileLocation>,
                std::shared_ptr<FileLocation>>> post_copy;

        locations.insert({input_file, FileLocation::LOCATION(storage_service)});
        locations.insert({output_file, FileLocation::LOCATION(chosen_compute_service->getScratch())});
        pre_copy.emplace_back(input_file, FileLocation::LOCATION(storage_service),
                FileLocation::LOCATION(chosen_compute_service->getScratch()));
        post_copy.emplace_back(output_file, FileLocation::LOCATION(chosen_compute_service->getScratch()),
                FileLocation::LOCATION(storage_service));

        //compute task
        auto job = job_manager->createStandardJob({task}, locations, pre_copy, post_copy,
                {});
        job_manager->submitJob(job, chosen_compute_service, {{"task", "ChosenHost"}});
        WRENCH_INFO("Task starting on %s", chosen_compute_service->getHostname().c_str());
        this->waitForNextEvent();
        WRENCH_INFO("Task has completed!");

        TerminalOutput::setThisProcessLoggingColor(TerminalOutput::Color::COLOR_BLACK);

        WRENCH_INFO("--------------------------------------------------------");
        if (this->getWorkflow()->isDone()) {
            WRENCH_INFO("Workflow execution completed in %.2f seconds!", this->getWorkflow()->getCompletionDate());
        } else {
            WRENCH_INFO("Workflow execution is incomplete!");
        }

        job_manager.reset();

        return 0;
    }

}
