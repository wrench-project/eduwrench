#ifndef ACTIVITY_WMS_H
#define ACTIVITY_WMS_H

#include <wrench-dev.h>

namespace wrench {

    class Simulation;
    class ActivityScheduler;

    class ActivityWMS : public ExecutionController {
    public:
        ActivityWMS(ActivityScheduler *job_scheduler,
                    const std::set<std::shared_ptr<ComputeService>> &compute_services,
                    const std::set<std::shared_ptr<StorageService>> &storage_services,
                    const std::shared_ptr<Workflow> &workflow,
                    const std::string &hostname);

        void processEventStandardJobCompletion(const std::shared_ptr<StandardJobCompletedEvent> &event) override;

    private:
        int main() override;
        std::set<std::shared_ptr<ComputeService>> compute_services;
        std::set<std::shared_ptr<StorageService>> storage_services;
        ActivityScheduler *job_scheduler;
        std::shared_ptr<Workflow> workflow;

        std::shared_ptr<JobManager> job_manager;
        bool abort = false;


    };
};

#endif
