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
#include <deque>
#include <fstream>
#include <stdio.h>
#include "GcfWMS.h"

XBT_LOG_NEW_DEFAULT_CATEGORY(GcfWMS, "Log category for Gcf WMS");

std::deque<double> sorted_queue_of_request_arrival_times;

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

void GcfWMS::setTaskFlops(double flops) {
  this->task_flops = flops;
}

void GcfWMS::setTimeout(double timeout) {
  this->timeout = timeout;
}

int GcfWMS::coinToss() {
    double val = (double) (rand() % 2); // gives val between 0 or 1
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

    // Referenced from https://en.cppreference.com/w/cpp/numeric/random/uniform_real_distribution
    // mention in narrative that every time you run, you will get different results due to random device seed
    std::random_device rd;  // Will be used to obtain a seed for the random number engine
    std::mt19937 gen(rd()); // Standard mersenne_twister_engine seeded with rd()
    std::uniform_real_distribution<> dis(0.0, max_change);

    // initial sleep time and num free instances set in simulator
    direction = 1;
    num_requests_arrived = 0;
    succeeded = 0;
    failures = 0;
    record_period = 60; // every 1 min
    record_time = record_period;

    remove("/tmp/record.json"); // remove file if existed before
    std::string filename("/tmp/record.json");
    std::ofstream file_out;
    file_out.open(filename, std::ios_base::app);
    file_out << "{" << endl;
    double total_sim_time = 1.0 * .25 * 3600;

    int n = 0;
    idle = this->getAvailableComputeServices<wrench::ComputeService>();
    busy = {};
//    while (wrench::Simulation::getCurrentSimulatedDate() < 7.0 * 24 * 3600) {
    while (wrench::Simulation::getCurrentSimulatedDate() < total_sim_time) {

        /*
         * "time": {
         *     "succeeded": x,
         *     "failed": y
         * },
         */
        if (wrench::Simulation::getCurrentSimulatedDate() >= record_time) {
          file_out << "  \"" << record_time << "\": {" << std::endl;
          file_out << "    \"succeeded\": " << succeeded << "," << std::endl;
          file_out << "    \"failed\": " << failures << std::endl;
          if (wrench::Simulation::getCurrentSimulatedDate() + record_period > total_sim_time) {
            file_out << "  }" << std::endl;
          }
          else {
            file_out << "  }," << std::endl;
          }
          record_time += record_period;
        }

        WRENCH_INFO("IN LOOP");
        // Insert into the queue
        double requests_arrival_time = wrench::Simulation::getCurrentSimulatedDate();
        sorted_queue_of_request_arrival_times.push_back(requests_arrival_time + timeout);

        // Compute the next sleep time
        if (coinToss() == 0) {
            sleep_time += direction * dis(gen);
        }
        if (direction == 1 && sleep_time >= max_sleep_time) {
            sleep_time = max_sleep_time;
            direction = -1;
        } else if (direction == -1 && sleep_time <= min_sleep_time) {
            sleep_time = min_sleep_time;
            direction = 1;
        }

        // Compute the arrival date of the next request
        double arrival_date_of_next_request = wrench::Simulation::getCurrentSimulatedDate() + sleep_time;

        WRENCH_INFO("ARRIVAL DATE OF NEXT REQUEST: %.2lf", arrival_date_of_next_request);
        // Until that request arrives, deal with job completions and perhaps serve more requests
        while (wrench::Simulation::getCurrentSimulatedDate() < arrival_date_of_next_request) {
            WRENCH_INFO("IN SECOND LOOP");
            // WHILE THERE IS A FREE INSTANCE AND THE QUEUE IS NOT EMPTY:
            // GO THROUGH THE DEQUEUE FROM OLDEST TIME TO NEWEST TIME
            //    REMOVE ITEM
            //    IF CURRENT DATE < DEQUEUE VALUE THEN SUBMIT JOB, NUM_FREE_INSTANCES--
            //    ELSE NUMBER_FAILURE++

            while (num_free_instances > 0 && !sorted_queue_of_request_arrival_times.empty()) {
              auto it = idle.begin();
              auto it_value = *it;
              double deque_val = sorted_queue_of_request_arrival_times[0];
              sorted_queue_of_request_arrival_times.pop_front();
              num_requests_arrived++;
              if (wrench::Simulation::getCurrentSimulatedDate() < deque_val) {
                wrench::WorkflowTask * task =
                    this->getWorkflow()->addTask("task_" + std::to_string(n),
                                                 task_flops,
                                                 1, 1, 1000);
                n++;
                auto standard_job = this->job_manager->createStandardJob(task);
                this->job_manager->submitJob(standard_job, it_value, {});
                idle.erase(it);
                auto busy_inserted = busy.insert(it_value);
                num_free_instances--;
                submitted++;
              }
              else {
                failures++;
              }
            }

            WRENCH_INFO("DONE WITH SECOND LOOP");

            double time_to_sleep = arrival_date_of_next_request - wrench::Simulation::getCurrentSimulatedDate();
            if (time_to_sleep < 0.000001) time_to_sleep = 0.000001;
            this->waitForAndProcessNextEvent(time_to_sleep);
        }

    }

    file_out << "}" << endl;
    file_out.close();

    std::cerr << "Arrived: " << num_requests_arrived << std::endl;
    std::cerr << "Submitted: " << submitted << std::endl;
    std::cerr << "Succeeded: " << succeeded << std::endl;
    std::cerr << "Failures: " << failures << std::endl;
    this->job_manager.reset();

    return 0;
}

void GcfWMS::processEventStandardJobCompletion(std::shared_ptr<wrench::StandardJobCompletedEvent> e) {
    auto cs = e->compute_service;
    idle.insert(cs);
    std::set<std::shared_ptr<wrench::ComputeService>>::iterator it = busy.find(cs);
    busy.erase(it);
    succeeded++;
    num_free_instances++;
}