#ifndef WRENCH_ACTIVITY_SCHEDULER_H
#define WRENCH_ACTIVITY_SCHEDULER_H

#include <wrench-dev.h>

namespace wrench {
    class Simulation;

    class ActivityScheduler {

    public:
        void scheduleTasks(const std::set<std::shared_ptr<ComputeService>> &compute_services,
                           const std::vector<std::shared_ptr<WorkflowTask>> &tasks);


        ActivityScheduler(std::shared_ptr<StorageService> storage_service,
                          std::shared_ptr<StorageService> local_storage_service,
                          bool use_local_storage_service
                );

        void taskCompletedOnHost(std::string hostname, std::shared_ptr<WorkflowTask> task);
        std::shared_ptr<JobManager> job_manager;

    private:
       std::shared_ptr<StorageService> storage_service;
       std::shared_ptr<StorageService> local_storage_service;
       bool use_local_storage_service;

       std::map<std::string, unsigned long> idle_core_counts;
       std::map<std::string, sg_size_t> available_rams;
    };
}

#endif 
