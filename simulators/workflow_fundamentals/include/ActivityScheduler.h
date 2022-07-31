#ifndef WRENCH_ACTIVITY_SCHEDULER_H
#define WRENCH_ACTIVITY_SCHEDULER_H

#include <wrench-dev.h>

namespace wrench {
    class Simulation;

    class ActivityScheduler {

    public:
        void scheduleTasks(const std::set<std::shared_ptr<ComputeService>> &compute_services,
                           const std::vector<std::shared_ptr<WorkflowTask>> &tasks);


        ActivityScheduler(std::shared_ptr<StorageService> storage_service);

       std::shared_ptr<JobManager> job_manager;
    private:
       std::shared_ptr<StorageService> storage_service;
    };
}

#endif 
