#ifndef ACTIVITY_WMS_H
#define ACTIVITY_WMS_H

#include <wrench-dev.h>

namespace wrench {

    class Simulation;
    class ActivityScheduler;

    class ActivityWMS : public ExecutionController {
    public:
        ActivityWMS(ActivityScheduler *standard_job_scheduler,
                    const std::set<std::shared_ptr<ComputeService>> &compute_services,
                    const std::set<std::shared_ptr<StorageService>> &storage_services,
                    const std::shared_ptr<Workflow> &workflow,
                    const std::string &hostname);

        void processEventStandardJobCompletion(std::shared_ptr<StandardJobCompletedEvent>) override;

    private:
        int main() override;
        ActivityScheduler *standard_job_scheduler;
        std::set<std::shared_ptr<ComputeService>> compute_services;
        std::set<std::shared_ptr<StorageService>> storage_services;
        std::shared_ptr<Workflow> workflow;

        std::shared_ptr<JobManager> job_manager;
        bool abort = false;

    };
};

#endif
