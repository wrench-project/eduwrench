
#include "ActivityScheduler.h"

XBT_LOG_NEW_DEFAULT_CATEGORY(simple_wms_scheduler, "Log category for Simple WMS Scheduler");


namespace wrench {


    /**
    * @brief A struct representing a "Compute Node"
    */
    typedef struct ComputeResource {
        std::string hostname;
        double flops;
        //double connection;
        unsigned long num_idle_cores;
        double available_ram;
    } ComputeResource;

    typedef struct TaskInformation {
        WorkflowTask *task;
        double flops;
        double bytes;
        double ratio;
    } TaskInformation;


    bool compareFlops (const TaskInformation &a, const TaskInformation &b) {
        return a.flops < b.flops;
    }
    bool compareFlopsDesc (const TaskInformation &a, const TaskInformation &b) {
        return a.flops > b.flops;
    }
    bool compareFlopsDescCompute (const ComputeResource &a, const ComputeResource &b) {
        return a.flops > b.flops;
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
    /**
    compareProximity (const ComputeResource &a, const ComputeResource &b) {
        return a.connection < b.connection;
    }
     */


    /**
   * @brief Constructor
   * @param storage_services: a map of hostname key to StorageService pointer
   * @param task_selection - selection for how to pick task
        *  - 0 random (default)
        *  - 1 highest flop
        *  - 2 lowest flop
        *  - 3 highest bytes
        *  - 4 lowest bytes
        *  - 5 highest flops/bytes
        *  - 6 lowest flops/bytes
   * @param compute_selection - selection for how to pick worker
        *  - 0 random (default)
        *  - 1 fastest worker
        *  - 2 best connected worker
        *  - 3 largest compute time/io time ratio
        *  - 4 earliest completion
   */
    ActivityScheduler::ActivityScheduler(std::shared_ptr<StorageService> storage_service, int task_selection, int compute_selection) :
    StandardJobScheduler(), storage_service(storage_service), task_selection(task_selection), compute_selection(compute_selection) {

    }
    /**
     *
     * @param compute_services - set of available compute services
     * @param ready_tasks - vector of tasks ready to be run
     */
    void ActivityScheduler::scheduleTasks(const std::set<std::shared_ptr<ComputeService>> &compute_services,
                                          const std::vector<WorkflowTask *> &ready_tasks) {

        TerminalOutput::setThisProcessLoggingColor(TerminalOutput::Color::COLOR_BLUE);
        auto compute_service = *compute_services.begin();




        /**
         *
         * Functionality to be added here:
         *  Evaluate ready tasks to sort by:
         * @param task_selection - selection for how to pick task
        *  - 0 random (default)
        *  - 1 highest flop
        *  - 2 lowest flop
        *  - 3 highest bytes
        *  - 4 lowest bytes
        *  - 5 highest flops/bytes
        *  - 6 lowest flops/bytes
        * @param compute_selection - selection for how to pick worker
        *  - 0 random (default)
        *  - 1 fastest worker
        *  - 2 best connected worker
        *  - 3 largest compute time/io time ratio
        *  - 4 earliest completion
         */

        /**
         *
         * Functionality to be added here:
         *  Evaluate compute services to pick by:
         *      - random
         *      - fastest worker
         *      - best connected worker
         *      - largest compute time/io time ratio
         *      - worker that will complete the task earliest
         *
         */

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


        //sorts tasks based on scheduling behavior specified.
        switch (task_selection) {
            case 0:
                //TODO implement random
                break;
            case 1:
                std::sort(task_information.begin(), task_information.end(), compareFlopsDesc); //highest flops first
                break;
            case 2:
                std::sort(task_information.begin(), task_information.end(), compareFlops); //lowest flops first
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



        //TODO replace the compute_services vector with a vector that has struct including the metrics needed

        for (const auto &compute : compute_services){
            if (task_information.size()>0) {
                auto idle_core_counts = compute->getPerHostNumIdleCores();
                auto ram_capacities = compute->getMemoryCapacity();

                // combining core counts and ram capacities together
                std::vector <ComputeResource> available_resources;
                for (const auto &host : idle_core_counts) {
                    if (host.second > 0) {
                        available_resources.push_back({host.first,
                                                       ram_capacities.at(host.first),
                                                              //(*proximity_service.begin()))->getHostPairDistance(std::make_pair("master", host.first)).first,
                                                       host.second,
                                                       ram_capacities.at(host.first)});
                    }
                }

                switch (compute_selection) {
                    case 0:
                        //TODO implement random
                        break;
                    case 1:
                        std::sort(available_resources.begin(), available_resources.end(), compareFlopsDescCompute);
                        break;
                    case 2:
                        //TODO not implemented yet, need network proximity service?
                        break;
                    case 3:
                        break;
                    case 4:
                        break;
                }







                // add tasks to a "tasks_to_submit" vector until core and or ram requirements cannot be met
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

                // specify file locations for tasks that will be submitted
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

                if (tasks_to_submit.size()>0) {
                    WorkflowJob * job = (WorkflowJob * ) this->getJobManager()->createStandardJob(tasks_to_submit, file_locations);
                    this->getJobManager()->submitJob(job, compute, service_specific_args);
                    task_information.erase(task_information.begin(), task_information.begin() + tasks_to_submit.size());
                }
            }
        }
    }
}
