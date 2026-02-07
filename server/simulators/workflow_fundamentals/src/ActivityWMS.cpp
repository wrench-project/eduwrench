
#include "ActivityWMS.h"
#include "ActivityScheduler.h"
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
    ActivityWMS::ActivityWMS(ActivityScheduler *standard_job_scheduler,
                             const std::set<std::shared_ptr<ComputeService>> &compute_services,
                             const std::set<std::shared_ptr<StorageService>> &storage_services,
                             const std::shared_ptr<Workflow> &workflow,
                             const std::string &hostname) : ExecutionController (
                                     hostname,
                                     ""
                                     ) {
        this->standard_job_scheduler = standard_job_scheduler;
        this->compute_services = compute_services;
        this->storage_services = storage_services;
        this->workflow = workflow;
    }

    /**
     * @brief WMS main method
     * @return
     */
    int ActivityWMS::main() {
        TerminalOutput::setThisProcessLoggingColor(TerminalOutput::Color::COLOR_MAGENTA);


        WRENCH_INFO("About to execute a workflow with %lu tasks", this->workflow->getNumberOfTasks());

        // Create a job manager
        this->job_manager = this->createJobManager();
        this->standard_job_scheduler->job_manager = this->job_manager;

        while (true) {

            // Get the ready tasks and SORT them by taskID
            auto ready_tasks = this->workflow->getReadyTasks();

            std::sort(ready_tasks.begin(), ready_tasks.end(), [ ] (std::shared_ptr<WorkflowTask> lhs, std::shared_ptr<WorkflowTask> rhs) {
                return lhs->getID() < rhs->getID();
            });


            // Run ready tasks with defined scheduler implementation
            this->standard_job_scheduler->scheduleTasks(
                    compute_services,
                    ready_tasks);

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
            WRENCH_INFO("Workflow execution completed in %.2f seconds!", this->workflow->getCompletionDate());
        } else {
            WRENCH_INFO("Workflow execution is incomplete!");
        }

        this->job_manager.reset();

        return 0;
    }

    /**
     * @brief Any time a standard job is completed, print to WRENCH_INFO in RED, the number of tasks in the job
     * @param event
     */
    void ActivityWMS::processEventStandardJobCompletion(const std::shared_ptr<StandardJobCompletedEvent> &event) {
        auto standard_job = event->standard_job;
        TerminalOutput::setThisProcessLoggingColor(TerminalOutput::Color::COLOR_RED);
        for (const auto &t : standard_job->getTasks()) { WRENCH_INFO("Notified that %s has completed",
                                                                     t->getID().c_str());
        }
    }

    /**
     * @brief Any time a standard job is completed, print to WRENCH_INFO in RED, the number of tasks in the job
     * @param event
     */
    void ActivityWMS::processEventStandardJobFailure(const std::shared_ptr<StandardJobFailedEvent> &event) {
        auto standard_job = event->standard_job;
        TerminalOutput::setThisProcessLoggingColor(TerminalOutput::Color::COLOR_RED);
        for (const auto &t : standard_job->getTasks()) {
            WRENCH_INFO("Notified that %s has failed  (%s)",
                    t->getID().c_str(), event->failure_cause->toString().c_str());
        }
    }
}
