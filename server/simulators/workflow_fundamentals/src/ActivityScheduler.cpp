/**
 * Copyright (c) 2019-2020. The WRENCH Team.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 */

#include "ActivityScheduler.h"

XBT_LOG_NEW_DEFAULT_CATEGORY(simple_wms_scheduler, "Log category for Simple WMS Scheduler");


namespace wrench {

    /**
     * @brief Constructor
     * @param storage_services: storage service
     */
    ActivityScheduler::ActivityScheduler(std::shared_ptr<StorageService> storage_service)
            : storage_service(storage_service) {}

    /**
     * @brief Schedules a single ready task at a time on the compute service.
     * @description If REMOTE_STORAGE is defined, then all files are written to/read from the storage
     *              service at storage_db.edu. If LOCAL_STORAGE is defined, then only the initial input files
     *              and final output files are written to/read from the storage service at storage_db.edu. All
     *              other files are written to/read from the storage service that resides on the same host as
     *              the compute service.
     * @param compute_services
     * @param ready_tasks
     */
    void ActivityScheduler::scheduleTasks(const std::set<std::shared_ptr<ComputeService>> &compute_services,
                                          const std::vector<std::shared_ptr<WorkflowTask>> &ready_tasks) {

        TerminalOutput::setThisProcessLoggingColor(TerminalOutput::Color::COLOR_BLUE);

        // only a single compute service in this activity
        auto compute_service = *compute_services.begin();

        // Get the  number of idle core counts
        auto idle_core_count = compute_service->getPerHostNumIdleCores()["the_host"];
        // Get the available ram
        auto free_ram = compute_service->getPerHostAvailableMemoryCapacity()["the_host"];

        for (const auto &t : ready_tasks) {
            if ((idle_core_count > 0) and (free_ram >= t->getMemoryRequirement())) {
                WRENCH_INFO("Starting task %s on a core", t->getID().c_str());
                std::map<std::shared_ptr<wrench::DataFile>, std::shared_ptr<wrench::FileLocation>> file_locations;
                for (auto const &f : t->getInputFiles()) {
                    file_locations[f] = wrench::FileLocation::LOCATION(this->storage_service, f);
                }
                for (auto const &f : t->getOutputFiles()) {
                    file_locations[f] = wrench::FileLocation::LOCATION(this->storage_service, f);;
                }
                auto job = this->job_manager->createStandardJob(t, file_locations);
                this->job_manager->submitJob(job, compute_service, {});

                idle_core_count--;
                free_ram -= t->getMemoryRequirement();
            }
        }
    }
}
