#ifndef ACTIVITY_WMS_H
#define ACTIVITY_WMS_H

#include <wrench-dev.h>

namespace wrench {

    class Simulation;

    class ActivityWMS : public ExecutionController {
    public:
        ActivityWMS(const std::shared_ptr<ComputeService> &compute_service,
                    const std::shared_ptr<Workflow> &workflow,
                    const std::string &hostname);

        void processEventStandardJobCompletion(const std::shared_ptr<StandardJobCompletedEvent> &event) override;

    private:
        int main() override;
        void scheduleTasks(std::shared_ptr<ComputeService> &compute_service,
                           const std::vector<std::shared_ptr<WorkflowTask>> &ready_tasks);

        std::shared_ptr<ComputeService> compute_service;
        std::shared_ptr<Workflow> workflow;

        std::shared_ptr<JobManager> job_manager;
        bool abort = false;

    };
};

#endif
