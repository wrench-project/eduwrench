#ifndef ACTIVITY_WMS_H
#define ACTIVITY_WMS_H

#include <wrench-dev.h>
#include "ActivityScheduler.h"

namespace wrench {

    class Simulation;

    class ActivityWMS : public ExecutionController {
    public:
        ActivityWMS(ActivityScheduler *standard_job_scheduler,
                    const std::set<std::shared_ptr<ComputeService>> &compute_services,
                    const std::set<std::shared_ptr<StorageService>> &storage_services,
                    const std::shared_ptr<Workflow> &workflow,
                    const std::string &hostname);

        void processEventStandardJobCompletion(std::shared_ptr<wrench::StandardJobCompletedEvent>) override;
        void processEventStandardJobFailure(std::shared_ptr<StandardJobFailedEvent> event) override;

    private:
        int main() override;
        std::set<std::shared_ptr<ComputeService>> compute_services;
        std::set<std::shared_ptr<StorageService>> storage_services;
        std::shared_ptr<Workflow> workflow;

        ActivityScheduler *standard_job_scheduler;

        std::shared_ptr<JobManager> job_manager;
        bool abort = false;

    };
};

#endif
