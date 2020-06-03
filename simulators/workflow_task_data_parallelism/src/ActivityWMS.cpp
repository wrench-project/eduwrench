
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
                             const std::set<std::shared_ptr<StorageService>> &storage_services,
                             const std::string &hostname) : WMS (
            nullptr,
            nullptr,
            compute_services,
            storage_services,
            {}, nullptr,
            hostname,
            ""
    ) {}

    void ActivityWMS::submitTask(std::string task_name, std::string host_name) {
        auto cs = *((this->getAvailableComputeServices<ComputeService>()).begin());
        auto job = this->job_manager->createStandardJob(this->getWorkflow()->getTaskByID(task_name), {});
        this->job_manager->submitJob(job, cs, {{task_name, host_name}});
        WRENCH_INFO("%s task starting on %lu cores on %s",
                    task_name.c_str(),
                    this->getWorkflow()->getTaskByID(task_name)->getMinNumCores(),
                    host_name.c_str()
        );
    }

    /**
     * @brief WMS main method
     * @return
     */
    int ActivityWMS::main() {
        TerminalOutput::setThisProcessLoggingColor(TerminalOutput::Color::COLOR_MAGENTA);

        WRENCH_INFO("About to execute a workflow with %lu tasks", this->getWorkflow()->getNumberOfTasks());

        // Create the job manager
        this->job_manager = this->createJobManager();

        int num_pending_tasks = 0;

        // Get the compute service
        auto cs = *((this->getAvailableComputeServices<ComputeService>()).begin());

        std::map<std::string, int> idle_cores = {{"host1", 3}, {"host2", 3}};

        // Submit green task on host1
        {
            submitTask("green", "host1");
            auto event = this->waitForNextEvent();
            WRENCH_INFO("green task has completed");
        }
        // Submit blue task on host1
        {
            auto blue_task = this->getWorkflow()->getTaskByID("blue");
            submitTask("blue", "host1");
            num_pending_tasks++;
            idle_cores["host1"] -= blue_task->getMinNumCores();
        }
        // Submit yellow task on host1 or host2
        {
            auto yellow_task = this->getWorkflow()->getTaskByID("yellow");
            if (idle_cores["host1"] >= yellow_task->getMinNumCores()) {
                submitTask("yellow", "host1");
                idle_cores["host1"] -= yellow_task->getMinNumCores();
            } else {
                submitTask("yellow", "host2");
                idle_cores["host2"] -= yellow_task->getMinNumCores();
            }
            num_pending_tasks++;
        }

        bool purple_task_submitted = false;
        while (not purple_task_submitted) {
            auto purple_task = this->getWorkflow()->getTaskByID("purple");
            if (idle_cores["host1"] >= purple_task->getMinNumCores()) {
                submitTask("purple", "host1");
                num_pending_tasks++;
                purple_task_submitted = true;
                break;
            } else if (idle_cores["host2"] >= purple_task->getMinNumCores()) {
                submitTask("purple", "host2");
                num_pending_tasks++;
                purple_task_submitted = true;
                break;
            }
            auto event = this->waitForNextEvent();
            num_pending_tasks--;
            auto real_event = std::dynamic_pointer_cast<StandardJobCompletedEvent>(event);
            auto num_cores = real_event->standard_job->getTasks().at(0)->getMinNumCores();
            auto hostname = real_event->standard_job->getTasks().at(0)->getExecutionHost();
            WRENCH_INFO("%s task has completed", real_event->standard_job->getTasks().at(0)->getID().c_str());
            idle_cores[hostname] -= num_cores;
        }

        while (num_pending_tasks--) {
            auto event = waitForNextEvent();
            auto real_event = std::dynamic_pointer_cast<StandardJobCompletedEvent>(event);
            WRENCH_INFO("%s task has completed", real_event->standard_job->getTasks().at(0)->getID().c_str());
        }

        // Run red task on host1
        {
            submitTask("red", "host1");
            this->waitForNextEvent();
            WRENCH_INFO("red task has completed");
        }

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
