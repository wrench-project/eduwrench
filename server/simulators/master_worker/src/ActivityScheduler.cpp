#include <ctime>
#include <random>
#include <algorithm>
#include "ActivityScheduler.h"

XBT_LOG_NEW_DEFAULT_CATEGORY(simple_wms_scheduler, "Log category for Simple WMS Scheduler");

namespace wrench {

    /**
    * @brief A struct representing a "Compute Node"
    */
    typedef struct ComputeResource {
        std::string hostname;
        unsigned long num_idle_cores;
        double available_ram;
    } ComputeResource;

    /**
     * @brief A struct to hold metrics for each compute service available.
     */
    typedef struct ComputeServiceMetadata {
        std::shared_ptr<ComputeService> compute_service;
        double flops;
        double bandwidth; //in bytes
        double flops_connection_ratio;
        double time_estimate;
    } ComputeServiceMetadata;

    /**
     * @brief A struct to hold metrics for each ready task.
     */
    typedef struct TaskInformation {
        std::shared_ptr<WorkflowTask> task;
        double flop;
        double bytes;
        double ratio;
    } TaskInformation;

    /**
     * @brief A struct to hold all pieces of each job to be submitted.
     */
    typedef struct JobsAwaitingSubmission {
        std::shared_ptr<StandardJob> job;
        std::shared_ptr<ComputeService> compute;
        std::map<std::string, std::string> arguments;
    } JobsAwaitingSubmission;


    bool compareFlop(const TaskInformation &a, const TaskInformation &b) {
        return a.flop < b.flop;
    }

    bool compareFlopDesc(const TaskInformation &a, const TaskInformation &b) {
        return a.flop > b.flop;
    }

    bool compareBytes(const TaskInformation &a, const TaskInformation &b) {
        return a.bytes < b.bytes;
    }

    bool compareBytesDesc(const TaskInformation &a, const TaskInformation &b) {
        return a.bytes > b.bytes;
    }

    bool compareRatio(const TaskInformation &a, const TaskInformation &b) {
        return a.ratio < b.ratio;
    }

    bool compareRatioDesc(const TaskInformation &a, const TaskInformation &b) {
        return a.ratio > b.ratio;
    }

    bool compareFlopsDescCompute(const ComputeServiceMetadata &a, const ComputeServiceMetadata &b) {
        return a.flops > b.flops;
    }

    bool compareBandwidth(const ComputeServiceMetadata &a, const ComputeServiceMetadata &b) {
        return a.bandwidth > b.bandwidth;
    }

    bool compareFlopsConnectionRatio(const ComputeServiceMetadata &a, const ComputeServiceMetadata &b) {
        return a.flops_connection_ratio > b.flops_connection_ratio;
    }

    bool compareTimeEstimate(const ComputeServiceMetadata &a, const ComputeServiceMetadata &b) {
        return a.time_estimate < b.time_estimate;
    }


    /**
   * @brief Constructor
   * @param storage_services: a map of hostname key to StorageService pointer
   * @param link_speed: a map of the link bandwidths specified by user (or defaults)
   * @param task_selection - selection for how to pick task
        *  - 0 random (default)
        *  - 1 highest flop
        *  - 2 lowest flop
        *  - 3 highest bytes
        *  - 4 lowest bytes
        *  - 5 highest flop/bytes
        *  - 6 lowest flop/bytes
   * @param compute_selection - selection for how to pick worker
        *  - 0 random (default)
        *  - 1 fastest worker
        *  - 2 best connected worker
        *  - 3 largest compute time/io time ratio
        *  - 4 earliest completion
   */
    ActivityScheduler::ActivityScheduler(std::shared_ptr<StorageService> storage_service,
                                         std::map<std::string, double> link_speed,
                                         std::mt19937 &rng,
                                         int task_selection,
                                         int compute_selection) :
            storage_service(storage_service),
            link_speed(link_speed),
            task_selection(task_selection),
            compute_selection(compute_selection),
            rng(rng) {
    }

    /**
     *
     * @param compute_services - set of available compute services
     * @param ready_tasks - vector of tasks ready to be run
     */
    void ActivityScheduler::scheduleTasks(const std::set<std::shared_ptr<ComputeService>> &compute_services,
                                          const std::vector<std::shared_ptr<WorkflowTask>> &ready_tasks,
                                          std::shared_ptr<JobManager> job_manager) {

        TerminalOutput::setThisProcessLoggingColor(TerminalOutput::Color::COLOR_BLUE);
        auto compute_service = *compute_services.begin();

//        std::cerr << "IN SCHEDULE TASK\n";

        /// Creating a vector of structs for all ready tasks and their relevant information for scheduling
        std::vector<TaskInformation> task_information;
        for (const auto &task : ready_tasks) {
            double total_bytes = 0;
            if (task->getInputFiles().size() > 0 || task->getOutputFiles().size() > 0) {
                for (const auto &file : task->getInputFiles()) {
                    total_bytes += file->getSize();
                }
                for (const auto &file : task->getOutputFiles()) {
                    total_bytes += file->getSize();
                }
            }
            task_information.push_back({task,
                                        task->getFlops(),
                                        total_bytes,
                                        ((task->getFlops()) / total_bytes)});
        }

        ///sorts tasks based on scheduling behavior specified.
        switch (task_selection) {
            case 0:
                std::sort(task_information.begin(), task_information.end(), compareFlopDesc); //highest flop first
                std::shuffle(task_information.begin(), task_information.end(), rng);
                break;
            case 1:
                std::sort(task_information.begin(), task_information.end(), compareFlopDesc); //highest flop first
                break;
            case 2:
                std::sort(task_information.begin(), task_information.end(), compareFlop); //lowest flop first
                break;
            case 3:
                std::sort(task_information.begin(), task_information.end(), compareBytesDesc);
                break;
            case 4:
                std::sort(task_information.begin(), task_information.end(), compareBytes);
                break;
            case 5:
                std::sort(task_information.begin(), task_information.end(), compareRatioDesc);
                break;
            case 6:
                std::sort(task_information.begin(), task_information.end(), compareRatio);
                break;
        }

        // Create compute service information structures
        std::vector<ComputeServiceMetadata> compute_service_information;
        for (const auto &compute : compute_services) {



            auto flop_map = compute->getCoreFlopRate();
            double flops_tally = 0;
            auto it = flop_map.begin();
            while (it != flop_map.end()) {
                flops_tally += it->second;
                it++;
            }

            double connection = 0;
            auto x = compute->getPerHostNumCores();
            for (const auto &host : x) {
                connection += link_speed[host.first];
            }

            compute_service_information.push_back({compute,
                                                   flops_tally,
                                                   connection * 1000.0 * 1000.0,
                                                   0,
                                                   0});

        }

        // Now go through the tasks in sequence and submit them to workers
        for (auto const &task_to_run : task_information) {

//            std::cerr << "SCHEDULING TASK " << task_to_run.task->getID() << "\n";
            // Sort the workers
            switch (compute_selection) {
                case 0:
                    std::sort(compute_service_information.begin(), compute_service_information.end(),compareFlopsDescCompute);
                    std::shuffle(compute_service_information.begin(), compute_service_information.end(), rng);
                    break;
                case 1:
                    std::sort(compute_service_information.begin(), compute_service_information.end(),
                              compareFlopsDescCompute);
                    break;
                case 2:
                    std::sort(compute_service_information.begin(), compute_service_information.end(), compareBandwidth);
                    break;
                case 3:
                    for (auto &compute : compute_service_information) {
                        compute.time_estimate =
                                (task_to_run.flop / compute.flops) + (task_to_run.bytes / compute.bandwidth);
                    }
                    std::sort(compute_service_information.begin(), compute_service_information.end(),
                              compareTimeEstimate);
                    break;
            }

            // Got through each worker, and if it's not busy, submit the task to it
            bool scheduled = false;
            for (auto const &cs : compute_service_information) {

                if (this->cs_busy[cs.compute_service] == true) {
                    continue;
                }

//                std::cerr << "    CONSIDERING " << cs.compute_service->getHostname() << "\n";
                // If it's busy, nevermind
                if (cs.compute_service->getTotalNumIdleCores() < 1) {
                    continue;
                }
                // Otherwise, off we go
                std::map<std::string, std::string> service_specific_args;
                service_specific_args[task_to_run.task->getID()] =
                        cs.compute_service->getHostname() + ":" + std::to_string(task_to_run.task->getMaxNumCores());

                // specify file locations for tasks that will be submitted
                std::map<std::shared_ptr<DataFile>, std::shared_ptr<FileLocation >> file_locations;
                for (const auto &file : task_to_run.task->getInputFiles()) {
                    file_locations.insert(std::make_pair(file, FileLocation::LOCATION(storage_service, file)));
                }

                for (const auto &file: task_to_run.task->getOutputFiles()) {
                    file_locations.insert(std::make_pair(file, FileLocation::LOCATION(storage_service, file)));
                }
//                std::cerr << "SUBMITTING " << task_to_run.task->getID() << " to " << cs.compute_service->getHostname() << "\n";
                auto job = job_manager->createStandardJob(task_to_run.task, file_locations);
                job_manager->submitJob(job, cs.compute_service, service_specific_args);
                this->setComputeServiceToBusy(cs.compute_service);
                scheduled = true;
                break;
            }
            if (not scheduled) break;
        }
    }

    void ActivityScheduler::setComputeServiceToIdle(std::shared_ptr<ComputeService> cs) {
        this->cs_busy[cs] = false;
    }

    void ActivityScheduler::setComputeServiceToBusy(std::shared_ptr<ComputeService> cs) {
        this->cs_busy[cs] = true;
    }


}
