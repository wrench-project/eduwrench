
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
    ActivityWMS::ActivityWMS(std::unique_ptr <StandardJobScheduler> standard_job_scheduler,
                             const std::set<std::shared_ptr<ComputeService>> &compute_services,
                             const std::set<std::shared_ptr<StorageService>> &storage_services,
                             const std::string &hostname) : WMS (
                                     std::move(standard_job_scheduler),
                                     nullptr,
                                     compute_services,
                                     storage_services,
                                     {}, nullptr,
                                     hostname,
                                     "io_operations"
                                     ) {}

    /**
     * @brief WMS main method
     * @return
     */
    int ActivityWMS::main() {
        TerminalOutput::setThisProcessLoggingColor(TerminalOutput::Color::COLOR_MAGENTA);

//        WRENCH_INFO("Starting on host %s listening on mailbox_name %s",
//                    S4U_Simulation::getHostName().c_str(),
//                    this->mailbox_name.c_str());
//        WRENCH_INFO("About to execute a workflow with %lu tasks", this->getWorkflow()->getNumberOfTasks());

        // Create a job manager
        this->job_manager = this->createJobManager();

        while (true) {

            // Get the available compute services, in this case only one
            const std::set<std::shared_ptr<ComputeService>> compute_services = this->getAvailableComputeServices<ComputeService>();

            // Run ready tasks with defined scheduler implementation
            this->getStandardJobScheduler()->scheduleTasks(
                    compute_services,
                    this->getWorkflow()->getReadyTasks());

            // Wait for a workflow execution event, and process it
            try {
                this->waitForAndProcessNextEvent();
            } catch (WorkflowExecutionException &e) {
                WRENCH_INFO("Error while getting next execution event (%s)... ignoring and trying again",
                            (e.getCause()->toString().c_str()));
                continue;
            }
            if (this->abort || this->getWorkflow()->isDone()) {
                break;
            }
        }
        TerminalOutput::setThisProcessLoggingColor(TerminalOutput::Color::COLOR_MAGENTA);

        WRENCH_INFO("--------------------------------------------------------");
        if (this->getWorkflow()->isDone()) {
            WRENCH_INFO("Execution completed in %f seconds!", this->getWorkflow()->getCompletionDate());
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
