
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
    ActivityWMS::ActivityWMS(const std::shared_ptr<ComputeService> &compute_service,
                             const std::shared_ptr<StorageService> &storage_service,
                             const std::string &hostname,
                             const std::shared_ptr<Workflow>& workflow) : ExecutionController(
                                     hostname,
                                     "io_operations"
                                     ) {
        this->workflow = workflow;
        this->compute_service = compute_service;
        this->storage_service = storage_service;
    }

    /**
     * @brief WMS main method
     * @return
     */
    int ActivityWMS::main() {
        TerminalOutput::setThisProcessLoggingColor(TerminalOutput::Color::COLOR_MAGENTA);

        /**
        WRENCH_INFO("Starting on host %s listening on mailbox_name %s",
                    S4U_Simulation::getHostName().c_str(),
                    this->mailbox_name.c_str());
        WRENCH_INFO("About to execute a workflow with %lu tasks", this->getWorkflow()->getNumberOfTasks());
        */

        // Create a job manager
        this->job_manager = this->createJobManager();

        while (true) {

            // Get the ready tasks and SORT them by taskID
            auto ready_tasks = this->workflow->getReadyTasks();

            std::sort(ready_tasks.begin(), ready_tasks.end(),
                      [ ] (std::shared_ptr<WorkflowTask> lhs, std::shared_ptr<WorkflowTask> rhs) {
                return lhs->getID() < rhs->getID();
            });

            // Run ready tasks with defined scheduler implementation
            this->scheduleTasks(ready_tasks);

            // Wait for a workflow execution event, and process it
            try {
                this->waitForAndProcessNextEvent();
            } catch (ExecutionException &e) {
                WRENCH_INFO("Error while getting next execution event (%s)... ignoring and trying again",
                            (e.getCause()->toString().c_str()));
                continue;
            }
            if (this->abort || this->workflow->isDone()) {
                break;
            }
        }
        TerminalOutput::setThisProcessLoggingColor(TerminalOutput::Color::COLOR_MAGENTA);

        WRENCH_INFO("--------------------------------------------------------");
        if (this->workflow->isDone()) {
            WRENCH_INFO("Execution completed in %f seconds!", this->workflow->getCompletionDate());
        } else {
            WRENCH_INFO("Execution is incomplete!");
        }
        WRENCH_INFO("--------------------------------------------------------");

        this->job_manager.reset();

        return 0;
    }

    /**
     * @brief Any time a standard job is completed, print to WRENCH_INFO in RED, the number of tasks in the job
     * @param event
     */
    void ActivityWMS::processEventStandardJobCompletion(std::shared_ptr<StandardJobCompletedEvent> event) {
        auto standard_job = event->standard_job;
        TerminalOutput::setThisProcessLoggingColor(TerminalOutput::Color::COLOR_RED);
        //WRENCH_INFO("Task %s has completed", (*standard_job->getTasks().begin())->getID().c_str());
    }


    /**
     * @brief Method to schedule tasks
     * @param compute_services
     * @param ready_tasks
     */
    void ActivityWMS::scheduleTasks(const std::vector<std::shared_ptr<WorkflowTask>> &ready_tasks) {

        TerminalOutput::setThisProcessLoggingColor(TerminalOutput::Color::COLOR_BLUE);

        auto compute_host = compute_service->getHostname();
        auto idle_core_counts = compute_service->getPerHostNumIdleCores();
        auto num_idle_cores = idle_core_counts.at(compute_service->getHostname());

        std::vector<std::shared_ptr<WorkflowTask>> tasks_to_submit;
        std::map<std::string, std::string> service_specific_args;
        //add all tasks possible to be submitted.
        for (const auto &task : ready_tasks) {
            if (task->getMaxNumCores() <= num_idle_cores) {
                tasks_to_submit.push_back(task);
                service_specific_args[task->getID()] = compute_host + ":" + std::to_string(task->getMaxNumCores());
            }
        }

        std::map<std::shared_ptr<DataFile>, std::shared_ptr<FileLocation>> file_locations;
        for (const auto &task : tasks_to_submit) {

            for (const auto &file : task->getInputFiles()) {
                file_locations.insert(std::make_pair(file, FileLocation::LOCATION(this->storage_service)));
            }

            for (const auto &file : task->getOutputFiles()) {
                file_locations.insert(std::make_pair(file, FileLocation::LOCATION(this->storage_service)));
            }
        }
        auto job = this->job_manager->createStandardJob(tasks_to_submit, file_locations);
        this->job_manager->submitJob(job, compute_service, service_specific_args);
    }
}
