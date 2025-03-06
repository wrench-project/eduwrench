/**
 * Copyright (c) 2020. <ADD YOUR HEADER INFORMATION>.
 * Generated with the wrench-init.in tool.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 */
#include <iostream>

#include "ThrustDWMS.h"
#include "ThrustDJobScheduler.h"

XBT_LOG_NEW_DEFAULT_CATEGORY(simple_wms, "Log category for Simple WMS");

/**
 * @brief Create a Simple WMS with a workflow instance, a scheduler implementation, and a list of compute services
 */
ThrustDWMS::ThrustDWMS(std::unique_ptr<ThrustDJobScheduler> ss_job_scheduler,
                       const std::set<std::shared_ptr<wrench::ComputeService>> &compute_services,
                       const std::set<std::shared_ptr<wrench::StorageService>> &storage_services,
                       const std::shared_ptr<wrench::Workflow> &workflow,
                       const std::string &hostname) : wrench::ExecutionController(
        hostname,
        "simple") {
    this->ss_job_scheduler = std::move(ss_job_scheduler);
    this->compute_services = compute_services;
    this->storage_services = storage_services;
    this->workflow = workflow;
}

/**
 * @brief main method of the ThrustDWMS daemon
 */
int ThrustDWMS::main() {

    wrench::TerminalOutput::setThisProcessLoggingColor(wrench::TerminalOutput::COLOR_GREEN);

    // Instantiate a Bandwidth Meter
    if (this->getNumVmInstances() > 0) {
      this->createBandwidthMeter({"WIDE_AREA_LINK"}, 10.0);
    }

    WRENCH_INFO("About to execute a workflow with %lu tasks", this->workflow->getNumberOfTasks());

    // Create a job manager
    this->job_manager = this->createJobManager();

    // pass job manager to scheduler
    this->ss_job_scheduler->setJobManager(this->job_manager);

    // Create a data movement manager
    std::shared_ptr<wrench::DataMovementManager> data_movement_manager = this->createDataMovementManager();

    // Check that we have at least one compute service
    if (this->compute_services.size() < 1) {
        throw std::runtime_error("WMS needs at least one compute service to run!");
    }

    // Check that we have exactly  one BM compute service
    int num_bm_cs = 0;
    std::shared_ptr<wrench::BareMetalComputeService> compute_service;
    for (auto const &cs : this->compute_services) {
        if (std::dynamic_pointer_cast<wrench::BareMetalComputeService>(cs)) {
            num_bm_cs++;
            compute_service = std::dynamic_pointer_cast<wrench::BareMetalComputeService>(cs);
        }
    }
    if (num_bm_cs != 1) {
        throw std::runtime_error("WMS needs exactly  one BareMetal compute service to run!");
    }


    // Get the cloud compute service
    std::shared_ptr<wrench::CloudComputeService> cloud_service;
    if (this->getNumVmInstances() > 0) {
        int num_cloud_cs = 0;
        for (auto const &cs : this->compute_services) {
            if (std::dynamic_pointer_cast<wrench::CloudComputeService>(cs)) {
                num_cloud_cs++;
                cloud_service = std::dynamic_pointer_cast<wrench::CloudComputeService>(cs);
            }
        }
        if (num_cloud_cs != 1) {
            throw std::runtime_error("WMS needs exactly one cloud service to run!");
        }
    }

    // Get the available storage services
    if (this->storage_services.empty()) {
        throw std::runtime_error("WMS needs at least one storage service to run!");
    }

    vector<std::string> cloud_vm;
    std::set<std::shared_ptr<wrench::ComputeService>> vm_css;

    if (this->getNumVmInstances() > 0) {
        for (int i = 0; i < num_vm_instances; i++) {
            cloud_vm.push_back(cloud_service->createVM(4, 500000));
            // start vms and add the baremetal services from the vms to compute_services
            // compute_services.insert(cloud_service->startVM(cloud_vm.at(i)));
            vm_css.insert(cloud_service->startVM(cloud_vm.at(i)));
        }

        this->ss_job_scheduler->setNumVmInstances(this->getNumVmInstances());
        this->convertCloudTasks(cloud_tasks);
        this->ss_job_scheduler->setCloudTasks(cloud_tasks_set);

    }

    std::set<std::shared_ptr<wrench::ComputeService>> all_bms = vm_css;
    all_bms.insert(compute_service);
    // Set the num cores available for each compute service
    this->ss_job_scheduler->createCoresTracker(all_bms);

    while (true) {
        // Get the ready tasks
        auto ready_tasks = this->workflow->getReadyTasks();

        // Sort them by ID
        std::sort(
                ready_tasks.begin(),
                ready_tasks.end(),
                [] (const std::shared_ptr<wrench::WorkflowTask> &t1, const std::shared_ptr<wrench::WorkflowTask> &t2) {
                    return (t1->getID() < t2->getID());
                }
            );

        this->ss_job_scheduler->scheduleTasks(compute_service, vm_css, ready_tasks);

        // Wait for a workflow execution event, and process it
        try {
            WRENCH_INFO("Waiting for some execution event (job completion or failure)");
            this->waitForAndProcessNextEvent();
//            WRENCH_INFO("Got the execution event");
        } catch (wrench::ExecutionException &e) {
            WRENCH_INFO("Error while getting next execution event (%s)... ignoring and trying again",
                        (e.getCause()->toString().c_str()));
            continue;
        }

        if (this->workflow->isDone()) {
            break;
        }
    }

    this->job_manager.reset();

    return 0;
}

/**
 * @brief Process a standard job failure event
 *
 * @param event: the event
 */
void ThrustDWMS::processEventStandardJobFailure(std::shared_ptr<wrench::StandardJobFailedEvent> event) {
    /* Retrieve the job that this event is for */
    auto job = event->standard_job;
    WRENCH_INFO("Notified that a standard job has failed (failure cause: %s)",
                event->failure_cause->toString().c_str());
    /* Retrieve the job's tasks */
    WRENCH_INFO("As a result, the following tasks have failed:");
    for (auto const &task : job->getTasks()) {
        WRENCH_INFO(" - %s", task->getID().c_str());
        auto cs = this->ss_job_scheduler->tasks_run_on.find(task)->second;
        this->ss_job_scheduler->updateNumCoresAvailable(cs, task->getNumCoresAllocated());
    }
    throw std::runtime_error("A job failure has occurred... this should never happen!");
}

/**
 * @brief Process a standard job completion event
 *
 * @param event: the event
 */
void ThrustDWMS::processEventStandardJobCompletion(std::shared_ptr<wrench::StandardJobCompletedEvent> event) {
    /* Retrieve the job that this event is for */
    auto job = event->standard_job;
    WRENCH_INFO("Notified that a standard job has successfully completed");
    /* Retrieve the job's tasks */
    WRENCH_INFO("As a result, the following tasks have completed:");
    for (auto const &task : job->getTasks()) {
        WRENCH_INFO(" - %s", task->getID().c_str());
        auto cs = this->ss_job_scheduler->tasks_run_on.find(task)->second;
        this->ss_job_scheduler->updateNumCoresAvailable(cs, task->getMinNumCores());
    }
}

/**
 * @brief Method to get the number of vm instances
 * @return the number of vm instances
 */
int ThrustDWMS::getNumVmInstances() {
    return num_vm_instances;
}

/**
 * @brief Method to set the number of vm instances
 *
 * @param num_vm_instances: number of vm instances to set
 */
void ThrustDWMS::setNumVmInstances(int num_vm_instances) {
    this->num_vm_instances = num_vm_instances;
}

/**
 * @brief Method to convert string containing the cloud tasks to a vector of cloud tasks
 *
 * @param tasks: string of cloud vm tasks
 */
void ThrustDWMS::convertCloudTasks(std::string tasks) {
    stringstream ss(tasks);
    while (ss.good()) {
        string substr;
        getline(ss, substr, ',');
        cloud_tasks_set.insert(substr);
    }
}

/**
 * @brief Method to set cloud_tasks
 *
 * @param tasks: string of cloud vm tasks
 */
void ThrustDWMS::setCloudTasks(std::string tasks) {
    cloud_tasks = tasks;
}
