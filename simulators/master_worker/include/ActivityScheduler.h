#ifndef WRENCH_ACTIVITY_SCHEDULER_H
#define WRENCH_ACTIVITY_SCHEDULER_H

#include <wrench-dev.h>

namespace wrench {
    class Simulation;

    class ActivityScheduler : public StandardJobScheduler {

    public:
        void scheduleTasks(const std::set<std::shared_ptr<ComputeService>> &compute_services,
                           const std::vector<WorkflowTask *> &ready_tasks) override;

        ActivityScheduler(std::shared_ptr<StorageService> storage_service,
                          std::map<std::string, double> link_speed,
                          std::mt19937 &rng,
                          int task_selection = 0,
                          int compute_selection = 0);


    private:
        std::shared_ptr<StorageService> storage_service;
        std::map<std::string, double> link_speed;
        int task_selection;
        int compute_selection;
        std::mt19937 &rng;

    };
}

#endif 
