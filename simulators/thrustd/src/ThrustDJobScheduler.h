/**
 * Copyright (c) 2020. <ADD YOUR HEADER INFORMATION>.
 * Generated with the wrench-init.in tool.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 */
#ifndef MY_SIMPLESCHEDULER_H
#define MY_SIMPLESCHEDULER_H

#include <wrench-dev.h>
//#include "ThrustDWMS.h"

class ThrustDJobScheduler {

public:
  ThrustDJobScheduler(std::shared_ptr<wrench::StorageService> default_storage_service, std::shared_ptr<wrench::StorageService> cloud_storage_service) :
          default_storage_service(default_storage_service), cloud_storage_service(cloud_storage_service) {}

  void scheduleTasks(const std::shared_ptr<wrench::ComputeService> &local_cs,
                     const std::set<std::shared_ptr<wrench::ComputeService>> &vm_created_cs,
                     const std::vector<wrench::WorkflowTask *> &tasks);

  void updateNumCoresAvailable(std::shared_ptr<wrench::BareMetalComputeService> cs, long increment);
  void createCoresTracker(std::set<std::shared_ptr<wrench::ComputeService>> &compute_services);
  unsigned long getNumCoresAvailable(std::shared_ptr<wrench::BareMetalComputeService> cs);
  int getNumVmInstances();
  void setNumVmInstances(int num_vm_instances);
  bool isCloudTask(std::string task_id);
  void setCloudTasks(std::set<std::string> cloud_tasks_set);
  std::map<wrench::WorkflowTask *, std::shared_ptr<wrench::BareMetalComputeService>> tasks_run_on;
  std::shared_ptr<wrench::JobManager> getJobManager();
  void setJobManager(std::shared_ptr<wrench::JobManager> job_manager);
private:
  std::shared_ptr<wrench::StorageService> default_storage_service;
  std::shared_ptr<wrench::StorageService> cloud_storage_service;

  std::map<std::shared_ptr<wrench::BareMetalComputeService>, long> numCoresAvailable;
  std::set<std::string> cloud_tasks_set;
  int num_vm_instances;
  std::shared_ptr<wrench::JobManager> job_manager;
};

#endif //MY_SIMPLESCHEDULER_H

