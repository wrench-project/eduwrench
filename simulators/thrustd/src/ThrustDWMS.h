/**
 * Copyright (c) 2020. <ADD YOUR HEADER INFORMATION>.
 * Generated with the wrench-init.in tool.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 */
#ifndef MY_SIMPLEWMS_H
#define MY_SIMPLEWMS_H

#include <wrench-dev.h>
#include "ThrustDJobScheduler.h"

class Simulation;

/**
 *  @brief A simple WMS implementation
 */
class ThrustDWMS : public wrench::WMS {
public:
    ThrustDWMS(std::unique_ptr<ThrustDJobScheduler> ss_job_scheduler,
               const std::set<std::shared_ptr<wrench::ComputeService>> &compute_services,
               const std::set<std::shared_ptr<wrench::StorageService>> &storage_services,
               const std::string &hostname);
    /** @brief The job manager */
    std::shared_ptr<wrench::JobManager> job_manager;
    int getNumVmInstances();
    void setNumVmInstances(int num_vm_instances);
    void convertCloudTasks(std::string tasks);
    void setCloudTasks(std::string tasks);
private:
    std::unique_ptr<ThrustDJobScheduler> ss_job_scheduler;
    int num_vm_instances;
    std::set<std::string> cloud_tasks_set;
    std::string cloud_tasks;
    int main() override;
    void processEventStandardJobFailure(std::shared_ptr<wrench::StandardJobFailedEvent> event) override;
    void processEventStandardJobCompletion(std::shared_ptr<wrench::StandardJobCompletedEvent> event) override;
};

#endif //MY_SIMPLEWMS_H

