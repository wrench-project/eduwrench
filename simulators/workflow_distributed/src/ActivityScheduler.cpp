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
     * @param local_storage_services: local storage service
     * @param use_local_storage_services: true/false
     */
    ActivityScheduler::ActivityScheduler(std::shared_ptr<StorageService> storage_service,
                                         std::shared_ptr<StorageService> local_storage_service,
                                         bool use_local_storage_service)
            : StandardJobScheduler(), storage_service(storage_service),
              local_storage_service(local_storage_service),
              use_local_storage_service(use_local_storage_service) {
    }

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
                                          const std::vector<WorkflowTask *> &ready_tasks) {

        TerminalOutput::setThisProcessLoggingColor(TerminalOutput::Color::COLOR_BLUE);

        // only a single compute service in this activity
        auto compute_service = *compute_services.begin();


        if (this->idle_core_counts.empty()) {
            this->idle_core_counts = compute_service->getPerHostNumCores();
            this->available_rams = compute_service->getPerHostAvailableMemoryCapacity();
        }

        for (const auto &t : ready_tasks) {
            // Is there an option?
            for (auto const &h : this->idle_core_counts) {
                if ((this->idle_core_counts[h.first] > 0) && (this->available_rams[h.first] >= t->getMemoryRequirement())) {

                    WRENCH_INFO("Starting task %s on a core of host %s", t->getID().c_str(), h.first.c_str());
                    std::map<wrench::WorkflowFile *, std::shared_ptr<wrench::FileLocation>> file_locations;
                    for (auto const &f : t->getInputFiles()) {
                        if ((t->getTopLevel() != 0) and (this->use_local_storage_service)) {
                            file_locations[f] = wrench::FileLocation::LOCATION(this->local_storage_service);
                        } else {
                            file_locations[f] = wrench::FileLocation::LOCATION(this->storage_service);
                        }
                    }
                    for (auto const &f : t->getOutputFiles()) {
                        if ((t->getTopLevel() != t->getWorkflow()->getNumLevels()-1) and (this->use_local_storage_service)) {
                            file_locations[f] = wrench::FileLocation::LOCATION(this->local_storage_service);
                        } else {
                            file_locations[f] = wrench::FileLocation::LOCATION(this->storage_service);
                        }
                    }
//                    std::cerr << "Task" << t->getID() << "\n";
//                    for (auto const &f : file_locations) {
//                        std::cerr << "  - " << f.first->getID() << " at " << f.second->getStorageService()->getHostname() << "\n";
//                    }

                    auto job = this->getJobManager()->createStandardJob(t, file_locations);
                    std::map<std::string, std::string> service_specific_arguments;
                    service_specific_arguments[t->getID()] = h.first+":1";
                    this->getJobManager()->submitJob(job, compute_service, service_specific_arguments);

                    this->idle_core_counts[h.first]--;
                    this->available_rams[h.first] -= t->getMemoryRequirement();
                    break;
                }
            }
        }
    }

    void ActivityScheduler::taskCompletedOnHost(std::string hostname, WorkflowTask *task) {
        this->idle_core_counts[hostname]++;
        this->available_rams[hostname] += task->getMemoryRequirement();
    }

}
