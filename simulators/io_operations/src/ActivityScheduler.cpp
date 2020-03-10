
#include "ActivityScheduler.h"

XBT_LOG_NEW_DEFAULT_CATEGORY(simple_wms_scheduler, "Log category for Simple WMS Scheduler");


namespace wrench {

    /**
    * @brief Constructor
    * @param storage_services: a map of hostname key to StorageService pointer
    */
    ActivityScheduler::ActivityScheduler(std::shared_ptr<StorageService> storage_service) : StandardJobScheduler(), storage_service(storage_service) {

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

        auto compute_service = *compute_services.begin();
        auto compute_host = compute_service->getHostname();
        auto idle_core_counts = compute_service->getPerHostNumIdleCores();
        auto num_idle_cores = idle_core_counts.at(compute_service->getHostname());

        std::vector<WorkflowTask *> tasks_to_submit;
        std::map<std::string, std::string> service_specific_args;
        //add all tasks possible to be submitted.
        for (const auto &task : ready_tasks) {
            if (task->getMaxNumCores() <= num_idle_cores) {
                tasks_to_submit.push_back(task);
                service_specific_args[task->getID()] = compute_host + ":" + std::to_string(task->getMaxNumCores());
            }
        }

        std::map<WorkflowFile *, std::shared_ptr<FileLocation>> file_locations;
        for (const auto &task : tasks_to_submit) {

            for (const auto &file : task->getInputFiles()) {
                file_locations.insert(std::make_pair(file, FileLocation::LOCATION(storage_service)));
            }

            for (const auto &file : task->getOutputFiles()) {
                file_locations.insert(std::make_pair(file, FileLocation::LOCATION(storage_service)));
            }
        }
        WorkflowJob *job = (WorkflowJob *) this->getJobManager()->createStandardJob(tasks_to_submit, file_locations);
        this->getJobManager()->submitJob(job, compute_service, service_specific_args);

    }
}
