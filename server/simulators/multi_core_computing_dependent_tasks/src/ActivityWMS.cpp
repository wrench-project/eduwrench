
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
                             const std::shared_ptr<Workflow> &workflow,
                             const std::string &scheduling_scheme,
                             const std::string &hostname) : ExecutionController (
                                     hostname,
                                     "multicore"
                                     ) {
        this->workflow = workflow;
        this->compute_service = compute_service;
        this->scheduling_scheme = scheduling_scheme;
    }

    /**
     * @brief WMS main method
     * @return
     */
    int ActivityWMS::main() {
        TerminalOutput::setThisProcessLoggingColor(TerminalOutput::Color::COLOR_MAGENTA);

//        WRENCH_INFO("Starting on host %s listening on mailbox_name %s", S4U_Simulation::getHostName().c_str(), this->mailbox_name.c_str());
 //       WRENCH_INFO("About to execute a workflow with %lu tasks", this->getWorkflow()->getNumberOfTasks());

        // Create a job manager
        this->job_manager = this->createJobManager();

        while (true) {
            // Get the ready tasks
            auto ready_tasks = this->workflow->getReadyTasks();

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
            WRENCH_INFO("Execution completed in %.2f seconds!", this->workflow->getCompletionDate());
        } else {
            WRENCH_INFO("Execution is incomplete!");
        }

        this->job_manager.reset();

        return 0;
    }

    /**
     * @brief Any time a standard job is completed, print to WRENCH_INFO in RED, the number of tasks in the job
     * @param events
     */
    void ActivityWMS::processEventStandardJobCompletion(const std::shared_ptr<StandardJobCompletedEvent> &event) {
        auto standard_job = event->standard_job;
        TerminalOutput::setThisProcessLoggingColor(TerminalOutput::Color::COLOR_RED);
        WRENCH_INFO("Task %s has completed", standard_job->getTasks().at(0)->getID().c_str());
    }


    void ActivityWMS::scheduleTasks(const std::vector<std::shared_ptr<WorkflowTask>> &ready_tasks) {

        TerminalOutput::setThisProcessLoggingColor(TerminalOutput::Color::COLOR_BLUE);

        auto idle_core_count = compute_service->getPerHostNumIdleCores()["the_host"];

        std::set<std::shared_ptr<WorkflowTask>> ready_task_set;
        for (auto const &t : ready_tasks) {
            ready_task_set.insert(t);
        }

        // Map of which tasks shouldn't be picked first based on the scheduling scheme
        std::map<std::string, std::vector<std::string>> losers;
        losers["viz"] = {"viz", "plot"};
        losers["analyze"] = {"analyze", "summarize"};
        losers["stats"] = {"stats"};

        //  Schedule tasks
	int num_scheduled = 0;
        while ((!ready_task_set.empty()) and (idle_core_count > 0)) {

            std::shared_ptr<WorkflowTask> lucky_winner;
            if (ready_task_set.size() == 1)  {
                lucky_winner = *(ready_task_set.begin());
            } else {
                //  This is pretty lame, but it's just a one-shot simulator :)
                for (auto const &t  : ready_task_set)  {
                    bool is_a_loser = false;
                    for (auto const &l : losers[this->scheduling_scheme]) {
                        if (t->getID() == l) {
                            is_a_loser = true;
                            break;
                        }
                    }
                    if (!is_a_loser) {
                        lucky_winner = t;
                        break;
                    }
                }
            }
            ready_task_set.erase(lucky_winner);

            WRENCH_INFO("Starting task %s on a core!", lucky_winner->getID().c_str());
            auto job = this->job_manager->createStandardJob(lucky_winner);
            this->job_manager->submitJob(job, compute_service, {});
            idle_core_count--;
            num_scheduled++;
        }

    }
}
