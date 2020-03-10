
#include "ActivityScheduler.h"

XBT_LOG_NEW_DEFAULT_CATEGORY(simple_wms_scheduler, "Log category for Simple WMS Scheduler");


namespace wrench {

    /**
     * @brief Constructor
     * @param storage_services: a map of hostname key to StorageService pointer
     */
    ActivityScheduler::ActivityScheduler(std::shared_ptr<StorageService> storage_service) : StandardJobScheduler(), storage_service(storage_service) {

    }


    /**
     * @brief Schedules a single ready task at a time on the compute service.
     * @param compute_services
     * @param ready_tasks
     */
    void ActivityScheduler::scheduleTasks(const std::set<std::shared_ptr<ComputeService>> &compute_services,
                                          const std::vector<WorkflowTask *> &ready_tasks) {

        TerminalOutput::setThisProcessLoggingColor(TerminalOutput::Color::COLOR_BLUE);
        auto compute_service = *compute_services.begin();
        auto idle_core_count = compute_service->getTotalNumIdleCores();

        std::map<WorkflowFile *, std::shared_ptr<FileLocation>> file_locations;
        for (auto const &ready_task : ready_tasks) {
            for (auto f: ready_task->getInputFiles()){
                file_locations.insert(std::make_pair(f, FileLocation::LOCATION(storage_service)));
            }
            if (idle_core_count == 0) {
                break;
            }
            auto job = this->getJobManager()->createStandardJob(ready_task, file_locations);
            this->getJobManager()->submitJob(job, compute_service, {});
            idle_core_count--;
        }

    }
}
