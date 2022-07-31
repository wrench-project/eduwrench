#ifndef ACTIVITY_WMS_H
#define ACTIVITY_WMS_H

#include <wrench-dev.h>

namespace wrench {

    class Simulation;

    class ActivityWMS : public ExecutionController {
    public:
        ActivityWMS(const std::shared_ptr<ComputeService> &compute_service,
                    const std::shared_ptr<StorageService> &storage_service,
                    const std::string &hostname,
                    const std::shared_ptr<Workflow>& workflow);

        void processEventStandardJobCompletion(std::shared_ptr<StandardJobCompletedEvent>) override;

    private:
        int main() override;

        void scheduleTasks(const std::vector<std::shared_ptr<WorkflowTask>> &ready_tasks);

        std::shared_ptr<wrench::ComputeService> compute_service;
        std::shared_ptr<wrench::StorageService> storage_service;

        std::shared_ptr<JobManager> job_manager;
        std::shared_ptr<Workflow> workflow;
        bool abort = false;

    };
};

#endif
