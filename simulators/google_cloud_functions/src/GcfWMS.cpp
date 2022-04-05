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
    std::random_device rd;  // Will be used to obtain a seed for the random number engine
    std::mt19937 gen(rd()); // Standard mersenne_twister_engine seeded with rd()
    std::uniform_real_distribution<> dis(0.0, max_change);

    // initial sleep time and num free instances set in simulator
    direction = 1;
    failures = 0;

    while (wrench::Simulation::getCurrentSimulatedDate() < 7.0 * 24 * 3600) {

        // Insert into the queue
        double requests_arrival_time = wrench::Simulation::getCurrentSimulatedDate();
        sorted_queue_of_request_arrival_times.push_back(requests_arrival_time + 10.0);

        // Compute the next sleep time
        if (coinToss() == 0) {
            sleep_time += direction * dis(gen);
        }
        if (direction == 1 && sleep_time >= max_sleep_time) {
            sleep_time = max_sleep_time;
            direction = -1;
        } else if (direction == -1 && sleep_time >= min_sleep_time) {
            sleep_time = min_sleep_time;
            direction = 1;
        }

        // Compute the arrival date of the next request
        double arrival_date_of_next_request = wrench::Simulation::getCurrentSimulatedDate() + sleep_time;

        // Until that request arrives, deal with job completions and perhaps serve more requests
        while (wrench::Simulation::getCurrentSimulatedDate() < arrival_date_of_next_request) {

            // WHILE THERE IS A FREE INSTANCE AND THE QUEUE IS NOT EMPTY:
            // GO THROUGH THE DEQUEUE FROM OLDEST TIME TO NEWEST TIME
            //    REMOVE ITEM
            //    IF CURRENT DATE < DEQUEUE VALUE THEN SUBMIT JOB, NUM_FREE_INSTANCES--
            //    ELSE NUMBER_FAILURE++

            double time_to_sleep = arrival_date_of_next_request - wrench::Simulation::getCurrentSimulatedDate();
            if (time_to_sleep < 0.000001) time_to_sleep = 0.000001;
            this->waitForAndProcessNextEvent(time_to_sleep);
        }

    }

    this->job_manager.reset();

    return 0;
}

void GcfWMS::processEventStandardJobCompletion(std::shared_ptr<wrench::StandardJobCompletedEvent> e) {
    num_free_instances++;
}