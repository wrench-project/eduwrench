
#include "ActivityScheduler.h"

XBT_LOG_NEW_DEFAULT_CATEGORY(simple_wms_scheduler, "Log category for Simple WMS Scheduler");


namespace wrench {


    /**
     * @brief Constructor
     * @param storage_services: a map of hostname key to StorageService pointer
     */
    ActivityScheduler::ActivityScheduler(std::map<std::string, std::shared_ptr<StorageService>> storage_services) : StandardJobScheduler(), storage_services(storage_services) {

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

            #ifdef REMOTE_STORAGE
            for (auto f : task_to_submit->getInputFiles()) {
                file_locations.insert(std::make_pair(f, storage_services["storage_db.edu"]));
            }

            for (auto f : task_to_submit->getOutputFiles()) {
                file_locations.insert(std::make_pair(f, storage_services["storage_db.edu"]));
            }
            #endif

            #ifdef LOCAL_STORAGE
            for (auto f : task_to_submit->getInputFiles()) {
                if (task_to_submit->getNumberOfParents() == 0) { // if im the first task, all my inputs should be read from remote
                    file_locations.insert(std::make_pair(f, storage_services["storage_db.edu"]));
                } else {
                    file_locations.insert(std::make_pair(f, storage_services["hpc.edu"]));
                }
            }

            for (auto f : task_to_submit->getOutputFiles()) {
                if (task_to_submit->getNumberOfChildren() == 0) { // if im the last task, all my outputs should be written to remote
                    file_locations.insert(std::make_pair(f, storage_services["storage_db.edu"]));
                } else {
                    file_locations.insert(std::make_pair(f, storage_services["hpc.edu"]));
                }
            }
            #endif


            WRENCH_INFO("Submitting %s as a job to compute service on %s", task_to_submit->getID().c_str(), compute_service->getHostname().c_str());
            WorkflowJob *job = (WorkflowJob *) this->getJobManager()->createStandardJob(task_to_submit, file_locations);
            this->getJobManager()->submitJob(job, compute_service, service_specific_args);
        }
    }
}
