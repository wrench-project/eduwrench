#ifndef WRENCH_ACTIVITY_SCHEDULER_H
#define WRENCH_ACTIVITY_SCHEDULER_H

#include <wrench-dev.h>

namespace wrench {
    class Simulation;

    class ActivityScheduler {

    public:
        void scheduleTasks(const std::set<std::shared_ptr<ComputeService>> &compute_services,
                           const std::vector<std::shared_ptr<WorkflowTask>> &ready_tasks,
                           std::shared_ptr<JobManager> job_manager);

        ActivityScheduler(std::shared_ptr<StorageService> storage_service,
                          std::map<std::string, double> link_speed,
                          std::mt19937 &rng,
                          int task_selection = 0,
                          int compute_selection = 0);


        void setComputeServiceToIdle(std::shared_ptr<ComputeService> cs);
        void setComputeServiceToBusy(std::shared_ptr<ComputeService> cs);

    private:
        std::shared_ptr<StorageService> storage_service;
        std::shared_ptr<JobManager> job_manager;
        std::map<std::string, double> link_speed;

        int task_selection;
        int compute_selection;
        std::mt19937 &rng;

        std::unordered_map<std::shared_ptr<ComputeService>, bool> cs_busy;

    };
}

#endif 
