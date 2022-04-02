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
#include <random>
#include "GcfWMS.h"

XBT_LOG_NEW_DEFAULT_CATEGORY(GcfWMS, "Log category for Gcf WMS");

void GcfWMS::setNumInstances(int num_instances) {
    this->num_free_instances = num_instances;
}

void GcfWMS::setSleepTime(double max_sleep_time, double min_sleep_time) {
    this->max_sleep_time = max_sleep_time;
    this->min_sleep_time = min_sleep_time;
    this->sleep_time = (max_sleep_time - min_sleep_time) / 2;
}

void GcfWMS::setChangeProb(double change_prob) {
  this->change_prob = change_prob;
}

void GcfWMS::setMaxChange(double max_change) {
  this->max_change = max_change;
}

int coinToss() {
  double val = (double) rand() % 2; // gives val between 0 or 1
  // 0 is yes & 1 is no
  if (val < this->change_prob) {
    return 0;
  }
  return 1;
}

/**
 * @brief Create a Gcf WMS with a workflow instance, a scheduler implementation, and a list of compute services
 */
GcfWMS::GcfWMS(std::unique_ptr<wrench::StandardJobScheduler> standard_job_scheduler,
                     std::unique_ptr<wrench::PilotJobScheduler> pilot_job_scheduler,
                     const std::set<std::shared_ptr<wrench::ComputeService>> &compute_services,
                     const std::set<std::shared_ptr<wrench::StorageService>> &storage_services,
                     const std::string &hostname) : wrench::WMS(
         std::move(standard_job_scheduler),
         std::move(pilot_job_scheduler),
         compute_services,
         storage_services,
         {}, nullptr,
         hostname,
         "gcf") {}

/**
 * @brief main method of the GcfWMS daemon
 */
int GcfWMS::main() {

  wrench::TerminalOutput::setThisProcessLoggingColor(wrench::TerminalOutput::COLOR_GREEN);

  // Check whether the WMS has a deferred start time
  checkDeferredStart();

  // WRENCH_INFO("About to execute a workflow with %lu tasks", this->getWorkflow()->getNumberOfTasks());

  // Create a job manager
  this->job_manager = this->createJobManager();

  // Create a data movement manager
  // std::shared_ptr<wrench::DataMovementManager> data_movement_manager = this->createDataMovementManager();

//  while (true) {
//    // Get the ready tasks
//    std::vector<wrench::WorkflowTask *> ready_tasks = this->getWorkflow()->getReadyTasks();
//
//    // Get the available compute services
//    auto compute_services = this->getAvailableComputeServices<wrench::ComputeService>();
//
//    if (compute_services.empty()) {
//      WRENCH_INFO("Aborting - No compute services available!");
//      break;
//    }
//
//    // Run ready tasks with defined scheduler implementation
//    this->getStandardJobScheduler()->scheduleTasks(this->getAvailableComputeServices<wrench::ComputeService>(), ready_tasks);
//
//    // Wait for a workflow execution event, and process it
//    try {
//      this->waitForAndProcessNextEvent();
//    } catch (wrench::WorkflowExecutionException &e) {
//      WRENCH_INFO("Error while getting next execution event (%s)... ignoring and trying again",
//                   (e.getCause()->toString().c_str()));
//      continue;
//    }
//
//    if (this->getWorkflow()->isDone()) {
//      break;
//    }
//  }

  // Referenced from https://en.cppreference.com/w/cpp/numeric/random/uniform_real_distribution
  std::random_device rd;  // Will be used to obtain a seed for the random number engine
  std::mt19937 gen(rd()); // Standard mersenne_twister_engine seeded with rd()
  std::uniform_real_distribution<> dis(0.0, max_change);

  // initial sleep time and num free instances set in simulator
  direction = 1;
  failures = 0;
  while (wrench::Simulation::getCurrentSimulatedDate() < 7 * 24 * 3600) { // not sure how to code that
    bool free_instance = false;
    // Wait for a workflow execution event, and process it
    try {
      free_instance = this->waitForAndProcessNextEvent(10); // wait for 10 seconds to see if instance is available
    } catch (wrench::WorkflowExecutionException &e) {
      WRENCH_INFO("Error while getting next execution event (%s)... ignoring and trying again",
                  (e.getCause()->toString().c_str()));
      continue;
    }

    if (free_instance) {
      // submit job
      num_free_instances--;
    }
    else {
      failures++;
    }
    wrench::Simulation::sleep(sleep_time);

    // flip a coin
    if (coinToss() == 0) {
      sleep_time = direction * dis(gen);
    }

    if (direction == 1 && sleep_time >= max_sleep_time) {
      sleep_time = max_sleep_time;
      direction = -1;
    }
    else if (direction == -1 && sleep_time >= min_sleep_time) {
      sleep_time = min_sleep_time;
      direction = 1;
    }
  }

  // wrench::Simulation::sleep(10);

  this->job_manager.reset();

  return 0;
}
