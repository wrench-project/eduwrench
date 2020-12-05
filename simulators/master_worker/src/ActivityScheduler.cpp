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
        WorkflowTask *task;
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


    bool compareFlop (const TaskInformation &a, const TaskInformation &b) {
        return a.flop < b.flop;
    }
    bool compareFlopDesc (const TaskInformation &a, const TaskInformation &b) {
        return a.flop > b.flop;
    }
    bool compareBytes (const TaskInformation &a, const TaskInformation &b) {
        return a.bytes < b.bytes;
    }
    bool compareBytesDesc (const TaskInformation &a, const TaskInformation &b) {
        return a.bytes > b.bytes;
    }
    bool compareRatio (const TaskInformation &a, const TaskInformation &b) {
        return a.ratio < b.ratio;
    }
    bool compareRatioDesc (const TaskInformation &a, const TaskInformation &b) {
        return a.ratio > b.ratio;
    }

    bool compareFlopsDescCompute (const ComputeServiceMetadata &a, const ComputeServiceMetadata &b) {
        return a.flops > b.flops;
    }
    bool compareBandwidth (const ComputeServiceMetadata &a, const ComputeServiceMetadata &b) {
        return a.bandwidth > b.bandwidth;
    }
    bool compareFlopsConnectionRatio (const ComputeServiceMetadata &a, const ComputeServiceMetadata &b) {
        return a.flops_connection_ratio > b.flops_connection_ratio;
    }
    bool compareTimeEstimate (const ComputeServiceMetadata &a, const ComputeServiceMetadata &b) {
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
                StandardJobScheduler(),
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
                                          const std::vector<WorkflowTask *> &ready_tasks) {

        std::random_device rd;
        std::mt19937 RNG(rd());

        TerminalOutput::setThisProcessLoggingColor(TerminalOutput::Color::COLOR_BLUE);
        auto compute_service = *compute_services.begin();

        ///Creating a vector of structs for all ready tasks and their relevant information for scheduling
        std::vector<TaskInformation> task_information;
        for (const auto &task : ready_tasks) {
            double total_bytes = 0;
            if(task->getInputFiles().size() > 0 || task->getOutputFiles().size() > 0){
                for (const auto &file : task->getInputFiles()) {
                    total_bytes+=file->getSize();
                }
                for (const auto &file : task->getOutputFiles()) {
                    total_bytes+=file->getSize();
                }
            }
            task_information.push_back({task,
                                        task->getFlops(),
                                        total_bytes,
                                        ((task->getFlops())/total_bytes)});
        }

        ///sorts tasks based on scheduling behavior specified.
        switch (task_selection) {
            case 0:
                std::shuffle(task_information.begin(), task_information.end(), RNG);
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

        std::vector<ComputeServiceMetadata> compute_service_information;
        for (const auto &compute : compute_services) {


            auto flop_map = compute->getCoreFlopRate();
            double flops_tally = 0;

            std::map<std::string, double>::iterator it = flop_map.begin();

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
                                                   connection*1000.0*1000.0,
                                                   0,
                                                   0});

        }

        switch (compute_selection) {
            case 0:
                std::shuffle(compute_service_information.begin(), compute_service_information.end(), RNG);
                break;
            case 1:
                std::sort(compute_service_information.begin(), compute_service_information.end(), compareFlopsDescCompute);
                break;
            case 2:
                std::sort(compute_service_information.begin(), compute_service_information.end(), compareBandwidth);
                break;
            case 3:
                for (const auto &task : task_information) {
                    for (auto &compute : compute_service_information) {
                        compute.flops_connection_ratio = (task.flop/compute.flops)/(task.bytes/compute.bandwidth);
                    }
                    break;
                }
                std::sort(compute_service_information.begin(), compute_service_information.end(), compareFlopsConnectionRatio);
                break;
            case 4:
                for (const auto &task : task_information) {
                    for (auto &compute : compute_service_information) {
                        compute.time_estimate = (task.flop/compute.flops)+(task.bytes/compute.bandwidth);
                    }
                    break;
                }
                std::sort(compute_service_information.begin(), compute_service_information.end(), compareTimeEstimate);
                break;
        }


        std::vector<JobsAwaitingSubmission> jobs_awaiting_submission;
        while(compute_service_information.size()>0 && task_information.size()>0) {
            for (const auto &compute : compute_service_information) {
                if (task_information.size()>0) {
                    auto idle_core_counts = compute.compute_service->getPerHostNumIdleCores();
                    auto ram_capacities = compute.compute_service->getMemoryCapacity();

                    ///Get availability of resources on the current compute service.
                    std::vector <ComputeResource> available_resources;
                    for (const auto &host : idle_core_counts) {
                        if (host.second > 0) {
                            available_resources.push_back({host.first,
                                                           host.second,
                                                           ram_capacities.at(host.first)});
                        }
                    }


                    ///If this compute service is busy, remove it from the list and move on to next.
                    if ( available_resources.size() == 0 ){
                        compute_service_information.erase(compute_service_information.begin(), compute_service_information.begin()+1);
                        break;
                    }


                    /// add tasks to a "tasks_to_submit" vector until core and or ram requirements cannot be met
                    std::vector < WorkflowTask * > tasks_to_submit;
                    std::map <std::string, std::string> service_specific_args;
                    for (auto &task_info : task_information) {
                        for (auto &resource : available_resources) {
                            if (task_info.task->getMaxNumCores() <= resource.num_idle_cores &&
                                task_info.task->getMemoryRequirement() <= resource.available_ram) {
                                tasks_to_submit.push_back(task_info.task);
                                service_specific_args[task_info.task->getID()] =
                                        resource.hostname + ":" + std::to_string(task_info.task->getMaxNumCores());

                                resource.num_idle_cores -= task_info.task->getMaxNumCores();
                                resource.available_ram -= task_info.task->getMemoryRequirement();
                                break;
                            }
                        }
                    }

                    /// specify file locations for tasks that will be submitted
                    std::map < WorkflowFile * , std::shared_ptr < FileLocation >> file_locations;
                    for (const auto &task : tasks_to_submit) {

                        bool taskHasChildren = (task->getNumberOfChildren() != 0);

                        for (const auto &file : task->getInputFiles()) {
                            file_locations.insert(std::make_pair(file, FileLocation::LOCATION(storage_service)));
                        }

                        for (const auto &file: task->getOutputFiles()) {
                            file_locations.insert(std::make_pair(file, FileLocation::LOCATION(storage_service)));
                        }
                    }

                    ///create jobs and store them, remove the utilized resources/tasks from corresponding vectors.
                    if (tasks_to_submit.size()>0) {
                        auto job = this->getJobManager()->createStandardJob(tasks_to_submit, file_locations);
                        jobs_awaiting_submission.push_back({job,
                                                            compute.compute_service,
                                                            service_specific_args});
                        task_information.erase(task_information.begin(), task_information.begin() + tasks_to_submit.size());
                        compute_service_information.erase(compute_service_information.begin(), compute_service_information.begin()+tasks_to_submit.size());
                    }
                }
                break;
            }
            ///For the next task in line, reshuffle the compute services if necessary.
            if (compute_selection == 3 && compute_service_information.size()>0 && task_information.size()>0) {
                for (const auto &task : task_information) {
                    for (auto &compute : compute_service_information) {
                        compute.flops_connection_ratio = (task.flop/compute.flops)/(task.bytes/compute.bandwidth);
                    }
                    break;
                }
                std::sort(compute_service_information.begin(), compute_service_information.end(), compareFlopsConnectionRatio);
            } else if (compute_selection == 4 && compute_service_information.size()>0 && task_information.size()>0) {
                for (const auto &task : task_information) {
                    for (auto &compute : compute_service_information) {
                        compute.time_estimate = (task.flop/compute.flops)+(task.bytes/compute.bandwidth);
                    }
                    break;
                }
                std::sort(compute_service_information.begin(), compute_service_information.end(), compareTimeEstimate);
            }
        }

        ///Submit all of the queued jobs
        for (const auto &unscheduled_job : jobs_awaiting_submission) {
            WRENCH_INFO("Launching execution of %s on  %s",
                        (*(unscheduled_job.job->getTasks().begin()))->getID().c_str(),
                        unscheduled_job.compute->getHostname().c_str());
            this->getJobManager()->submitJob(unscheduled_job.job, unscheduled_job.compute, unscheduled_job.arguments);
        }
    }
}
