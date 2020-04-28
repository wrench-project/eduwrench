#ifndef ACTIVITY_WMS_H
#define ACTIVITY_WMS_H

#include <wrench-dev.h>

namespace wrench {

    class Simulation;

    class ActivityWMS : public WMS {
    public:
        ActivityWMS(std::unique_ptr <StandardJobScheduler> standard_job_scheduler,
                    const std::shared_ptr<ComputeService> &compute_service,
                    const std::string &hostname);

        void processEventStandardJobCompletion(std::shared_ptr<StandardJobCompletedEvent>) override;

    private:
        int main() override;

        std::shared_ptr<JobManager> job_manager;
        bool abort = false;

    };
};

#endif
