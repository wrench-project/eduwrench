
#include "ActivityScheduler.h"

XBT_LOG_NEW_DEFAULT_CATEGORY(simple_wms_scheduler, "Log category for Simple WMS Scheduler");


namespace wrench {

    /**
    * @brief Constructor
    * @param storage_services: a map of hostname key to StorageService pointer
    */
    ActivityScheduler::ActivityScheduler(std::shared_ptr<StorageService> storage_service) : storage_service(storage_service) {

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
                                          const std::vector<std::shared_ptr<WorkflowTask>> &ready_tasks) {


        auto compute_service = *compute_services.begin();
        auto compute_host = compute_service->getHostname();

        std::vector<std::shared_ptr<WorkflowTask>> tasks_to_submit;
        std::map<std::string, std::string> service_specific_args;
        //add all tasks possible to be submitted.
        for (const auto &task : ready_tasks) {
//            WRENCH_INFO("TASK : %s", task->getID().c_str());
            tasks_to_submit.push_back(task);
        }

        std::map<std::shared_ptr<DataFile>, std::shared_ptr<FileLocation>> file_locations;
        for (const auto &task : tasks_to_submit) {

            for (const auto &file : task->getInputFiles()) {
                file_locations.insert(std::make_pair(file, FileLocation::LOCATION(storage_service)));
            }

            for (const auto &file : task->getOutputFiles()) {
                file_locations.insert(std::make_pair(file, FileLocation::LOCATION(storage_service)));
            }
            auto job = this->job_manager->createStandardJob(task, file_locations);
            this->job_manager->submitJob(job, compute_service, service_specific_args);
            if (task->getID() == "io read task #1") {
                TerminalOutput::setThisProcessLoggingColor(TerminalOutput::Color::COLOR_RED);
                WRENCH_INFO("Starting reading input file for task #1");
            } else if (task->getID() == "io read task #2") {
                TerminalOutput::setThisProcessLoggingColor(TerminalOutput::Color::COLOR_BLUE);
                WRENCH_INFO("Starting reading input file for task #2");
            } else if (task->getID() == "task #1") {
                TerminalOutput::setThisProcessLoggingColor(TerminalOutput::Color::COLOR_RED);
                WRENCH_INFO("Starting computation for task #1");
            } else if (task->getID() == "task #2") {
                TerminalOutput::setThisProcessLoggingColor(TerminalOutput::Color::COLOR_BLUE);
                WRENCH_INFO("Starting computation for task #2");
            } else if (task->getID() == "io write task #1") {
                TerminalOutput::setThisProcessLoggingColor(TerminalOutput::Color::COLOR_RED);
                WRENCH_INFO("Starting writing output file for task #1");
            } else if (task->getID() == "io write task #2") {
                TerminalOutput::setThisProcessLoggingColor(TerminalOutput::Color::COLOR_BLUE);
                WRENCH_INFO("Starting writing output file for task #2");
            }
        }

    }
}
