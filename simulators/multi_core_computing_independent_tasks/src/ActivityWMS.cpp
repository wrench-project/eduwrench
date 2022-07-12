
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
    ActivityWMS::ActivityWMS(const std::set<std::shared_ptr<ComputeService>> &compute_services,
                             const std::shared_ptr<Workflow> &workflow,
                             const std::string &hostname) : ExecutionController (
                                     hostname,
                                     "multicore"
                                     ) {
        this->compute_services = compute_services;
        this->workflow = workflow;
    }

    /**
     * @brief WMS main method
     * @return
     */
    int ActivityWMS::main() {
        TerminalOutput::setThisProcessLoggingColor(TerminalOutput::Color::COLOR_MAGENTA);

        WRENCH_INFO("Starting on host %s",
                    S4U_Simulation::getHostName().c_str());
        WRENCH_INFO("About to execute a workflow with %lu tasks", this->workflow->getNumberOfTasks());

        // Create a job manager
        this->job_manager = this->createJobManager();

        while (true) {
            // Get the ready tasks and SORT them by taskID
            auto ready_tasks = this->workflow->getReadyTasks();
            std::sort(ready_tasks.begin(), ready_tasks.end(),
                      [](const std::shared_ptr<WorkflowTask> t1,
                               const std::shared_ptr<WorkflowTask> t2) -> bool {
                            return (t1->getID() < t2->getID());
                          }
                      );

            // Run ready tasks with defined scheduler implementation
            this->scheduleTasks(compute_services, ready_tasks);

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
        WRENCH_INFO("Task %s has completed", standard_job->getTasks().at(0)->getID().c_str());
    }

    void ActivityWMS::scheduleTasks(const std::set<std::shared_ptr<ComputeService>> &compute_services,
                                          const std::vector<std::shared_ptr<WorkflowTask>> &ready_tasks) {

        TerminalOutput::setThisProcessLoggingColor(TerminalOutput::Color::COLOR_BLUE);
        auto compute_service = *compute_services.begin();

        auto idle_core_count = (*(compute_service->getPerHostNumIdleCores().begin())).second;
        auto ram_capacity = (*(compute_service->getPerHostAvailableMemoryCapacity().begin())).second;

        for (auto const &ready_task : ready_tasks) {
            auto task_memory = ready_task->getMemoryRequirement();
            if (idle_core_count == 0) {
                break;
            }
            if (ram_capacity < task_memory) {
                break;
            }
            auto job = this->job_manager->createStandardJob(ready_task);
            this->job_manager->submitJob(job, compute_service, {});
            idle_core_count--;
            ram_capacity = ram_capacity - task_memory;
        }

    }
}
