/**
 * Copyright (c) 2020. <ADD YOUR HEADER INFORMATION>.
 * Generated with the wrench-init.in tool.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 */
#ifndef MY_GCFWMS_H
#define MY_GCFWMS_H

#include <wrench-dev.h>

class Simulation;

/**
 *  @brief A simple WMS implementation
 */
class GcfWMS : public wrench::WMS {
public:
    GcfWMS(std::unique_ptr<wrench::StandardJobScheduler> standard_job_scheduler,
              std::unique_ptr<wrench::PilotJobScheduler> pilot_job_scheduler,
              const std::set<std::shared_ptr<wrench::ComputeService>> &compute_services,
              const std::set<std::shared_ptr<wrench::StorageService>> &storage_services,
              const std::string &hostname);
    void setNumInstances(int num_instances);
    void setReqArrivalRate(double min, double max);
    double getChangeProb();
    void setChangeProb(double change_prob);
    void setMaxChange(double max_change);
    void setTaskFlops(double flops);
    void setTimeout(double timeout);
    int coinToss();

private:
    int main() override;
    void processEventStandardJobCompletion(std::shared_ptr<wrench::StandardJobCompletedEvent> e) override;


        /** @brief The job manager */
    std::shared_ptr<wrench::JobManager> job_manager;
    int num_free_instances;
    double max_arrival_rate;
    double min_arrival_rate;
    int direction; // +1 or -1
    int num_requests_arrived;
    int submitted;
    int succeeded;
    int failures;
    double change_prob;
    double task_flops;
    int max_change;
    double timeout;
    double record_period;
    double record_time;
    std::set<std::shared_ptr<wrench::ComputeService>> idle;
    std::set<std::shared_ptr<wrench::ComputeService>> busy;
};

#endif //MY_GCFWMS_H
