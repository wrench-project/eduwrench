
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
                                     "io_operations"
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

//        WRENCH_INFO("Starting on host %s listening on mailbox_name %s",
//                    S4U_Simulation::getHostName().c_str(),
//                    this->mailbox_name.c_str());
//        WRENCH_INFO("About to execute a workflow with %lu tasks", this->workflow->getNumberOfTasks());

        // Create a job manager
        this->job_manager = this->createJobManager();
        this->standard_job_scheduler->job_manager = this->job_manager;

        while (true) {

            // Run ready tasks with defined scheduler implementation
            this->standard_job_scheduler->scheduleTasks(
                    compute_services,
                    this->workflow->getReadyTasks());

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
        auto task = (*standard_job->getTasks().begin());
        if (task->getID() == "io read task #1") {
            TerminalOutput::setThisProcessLoggingColor(TerminalOutput::Color::COLOR_RED);
            WRENCH_INFO("Finished reading input file for task #1");
        } else if (task->getID() == "io read task #2") {
            TerminalOutput::setThisProcessLoggingColor(TerminalOutput::Color::COLOR_BLUE);
            WRENCH_INFO("Finished reading input file for task #2");
        } else if (task->getID() == "task #1") {
            TerminalOutput::setThisProcessLoggingColor(TerminalOutput::Color::COLOR_RED);
            WRENCH_INFO("Finished computation for task #1");
        } else if (task->getID() == "task #2") {
            TerminalOutput::setThisProcessLoggingColor(TerminalOutput::Color::COLOR_BLUE);
            WRENCH_INFO("Finished computation for task #2");
        } else if (task->getID() == "io write task #1") {
            TerminalOutput::setThisProcessLoggingColor(TerminalOutput::Color::COLOR_RED);
            WRENCH_INFO("Finished writing output file for task #1");
        } else if (task->getID() == "io write task #2") {
            TerminalOutput::setThisProcessLoggingColor(TerminalOutput::Color::COLOR_BLUE);
            WRENCH_INFO("Finished writing output file for task #2");
        }
    }
}
