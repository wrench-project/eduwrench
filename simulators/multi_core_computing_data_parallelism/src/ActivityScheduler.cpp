
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

        //  Schedule all  ready tasks (this is  always possible)
        for (auto const &t : ready_tasks) {
            WRENCH_INFO("Starting task %s on a core!", t->getID().c_str());
            auto job = this->getJobManager()->createStandardJob(t);
            this->getJobManager()->submitJob(job, compute_service, {});
            idle_core_count--;
        }

    }
}
