
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

        // only a single compute service in this activity
        auto compute_service = *compute_services.begin();
        auto compute_host = compute_service->getHostname();
        auto idle_core_counts = compute_service->getPerHostNumIdleCores();
        auto num_idle_cores = idle_core_counts.at(compute_service->getHostname());

        // add tasks to a "tasks_to_submit" vector until core and or ram requirements cannot be met
        // and in this case only single task jobs will be submitted since our CS has 1 core
        WorkflowTask *task_to_submit = *ready_tasks.begin();

        if (task_to_submit->getMaxNumCores() <= num_idle_cores) {

            std::map<std::string, std::string> service_specific_args = {
                    {task_to_submit->getID(), compute_host + ":1"}
            };

            std::map<WorkflowFile *, std::shared_ptr<StorageService>> file_locations;

            for (auto f : task_to_submit->getInputFiles()) {
               file_locations.insert(std::make_pair(f, storage_service));
            }

            for (auto f : task_to_submit->getOutputFiles()) {
               file_locations.insert(std::make_pair(f, storage_service));
            }

            WRENCH_INFO("Submitting %s to compute service on %s", task_to_submit->getID().c_str(), compute_service->getHostname().c_str());
            WorkflowJob *job = (WorkflowJob *) this->getJobManager()->createStandardJob(task_to_submit, file_locations);
            this->getJobManager()->submitJob(job, compute_service, service_specific_args);
        }
    }
}
