
#include "ActivityScheduler.h"

XBT_LOG_NEW_DEFAULT_CATEGORY(simple_wms_scheduler, "Log category for Simple WMS Scheduler");


namespace wrench {

    /**
     * @brief Constructor
     * @param storage_services: a map of hostname key to StorageService pointer
     */
    ActivityScheduler::ActivityScheduler() : StandardJobScheduler() {

    }

    void ActivityScheduler::scheduleTasks(const std::set<std::shared_ptr<ComputeService>> &compute_services,
                                          const std::vector<WorkflowTask *> &ready_tasks) {

        TerminalOutput::setThisProcessLoggingColor(TerminalOutput::Color::COLOR_BLUE);
        auto compute_service = *compute_services.begin();


        auto idle_core_count = compute_service->getPerHostNumIdleCores()["the_host"];
        auto ram_capacity = compute_service->getPerHostAvailableMemoryCapacity()["the_host"];

        for (auto const &ready_task : ready_tasks) {
            auto task_memory = ready_task->getMemoryRequirement();
            if (idle_core_count == 0) {
                break;
            }
            if (ram_capacity < task_memory) {
                break;
            }
            auto job = this->getJobManager()->createStandardJob(ready_task, {});
            this->getJobManager()->submitJob(job, compute_service, {});
            idle_core_count--;
            ram_capacity = ram_capacity - task_memory;
        }

    }
}
