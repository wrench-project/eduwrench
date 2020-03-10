
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
     * @brief Schedules as many tasks as possible onto the compute service without over subscribing. Intermediate files are read/written from/to local storage (pretending to be scratch)
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
        auto ram_capacities = compute_service->getMemoryCapacity();

        auto num_idle_cores = idle_core_counts.at(compute_service->getHostname());
        auto available_ram = ram_capacities.at(compute_service->getHostname());

        // add tasks to a "tasks_to_submit" vector until core and or ram requirements cannot be met
        std::vector<WorkflowTask *> tasks_to_submit;
        std::map<std::string, std::string> service_specific_args;
        for (const auto &task : ready_tasks) {
            if (task->getMaxNumCores() <= num_idle_cores && task->getMemoryRequirement() <= available_ram) {
                tasks_to_submit.push_back(task);
                service_specific_args[task->getID()] = compute_host + ":1";

                num_idle_cores -= task->getMaxNumCores();
                available_ram -= task->getMemoryRequirement();
            } else {
                break;
            }
        }

        // specify file locations for tasks that will be submitted
        std::map<WorkflowFile *, std::shared_ptr<StorageService>> file_locations;
        for (const auto &task : tasks_to_submit) {

            bool taskHasChildren = (task->getNumberOfChildren() != 0) ? true : false;

            // initial input files should be read from the remote storage service
            // files "in between" should be read from the local storage service
            for (const auto &file : task->getInputFiles()) {
                if (taskHasChildren) {
                    file_locations.insert(std::make_pair(file, storage_services.at("infrastructure.org/storage")));
                } else {
                    file_locations.insert(std::make_pair(file, storage_services.at("infrastructure.org/compute")));
                }
            }

            // the final output file should be written to the remote storage service
            // files "in between" should be written to the local storage service
            for (const auto &file: task->getOutputFiles()) {
                if (not taskHasChildren) {
                    file_locations.insert(std::make_pair(file, storage_services.at("infrastructure.org/storage")));
                } else {
                    file_locations.insert(std::make_pair(file, storage_services.at("infrastructure.org/compute")));
                }
            }
        }

        WorkflowJob *job = (WorkflowJob *) this->getJobManager()->createStandardJob(tasks_to_submit, file_locations);
        this->getJobManager()->submitJob(job, compute_service, service_specific_args);
    }
}
