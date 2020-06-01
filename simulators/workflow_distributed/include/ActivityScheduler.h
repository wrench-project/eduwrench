#ifndef WRENCH_ACTIVITY_SCHEDULER_H
#define WRENCH_ACTIVITY_SCHEDULER_H

#include <wrench-dev.h>

namespace wrench {
    class Simulation;

    class ActivityScheduler : public StandardJobScheduler {

    public:
        void scheduleTasks(const std::set<std::shared_ptr<ComputeService>> &compute_services,
                           const std::vector<WorkflowTask *> &tasks);


        ActivityScheduler(std::shared_ptr<StorageService> storage_service,
                          std::shared_ptr<StorageService> local_storage_service,
                          bool use_local_storage_service
                );

        void taskCompletedOnHost(std::string hostname, WorkflowTask *task);

    private:
       std::shared_ptr<StorageService> storage_service;
       std::shared_ptr<StorageService> local_storage_service;
       bool use_local_storage_service;

       std::map<std::string, unsigned long> idle_core_counts;
       std::map<std::string, double> available_rams;
    };
}

#endif 
