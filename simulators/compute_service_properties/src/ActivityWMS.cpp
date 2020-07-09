
#include "ActivityWMS.h"
#include <algorithm>

XBT_LOG_NEW_DEFAULT_CATEGORY(simple_wms, "Log category for Simple WMS");

namespace wrench {

    /**
     * @brief WMS constructor
     * @param standard_job_scheduler
     * @param compute_services
     * @param storage_services
     * @param hostname
     */
    ActivityWMS::ActivityWMS(const std::shared_ptr<FileRegistryService> &file_registry,
                             const std::set<std::shared_ptr<ComputeService>> &compute_services,
                             const std::set<std::shared_ptr<StorageService>> &storage_services,
                             const std::string &hostname) : WMS (
            nullptr,
            nullptr,
            compute_services,
            storage_services,
            {}, file_registry,
            hostname,
            ""
    ) {}

    /**
     * @brief WMS main method
     * @return
     */
    int ActivityWMS::main() {
        TerminalOutput::setThisProcessLoggingColor(TerminalOutput::Color::COLOR_MAGENTA);

        // Create a job manager
        this->job_manager = this->createJobManager();

        while (true) {
            // Get the ready tasks
            std::vector<WorkflowTask *> ready_tasks = this->getWorkflow()->getReadyTasks();

            // Get the available compute services
            const auto compute_services = this->getAvailableComputeServices<ComputeService>();
            const auto storage_service = *this->getAvailableStorageServices().begin();
            const auto file_registry = this->getAvailableFileRegistryService();

            std::shared_ptr<ComputeService> compute_service1, compute_service2;
            for (const auto &compute_service : compute_services) {
                if (compute_service->getHostname() == "ComputeHost1") {
                    compute_service1 = compute_service;
                } else {
                    compute_service2 = compute_service;
                }
            }

            double mem_req;
            double num_cores;

            std::map<WorkflowFile *, std::shared_ptr<FileLocation>> locations;
            std::vector<std::tuple<WorkflowFile *, std::shared_ptr<FileLocation>,
                    std::shared_ptr<FileLocation>>> pre_op;
            std::vector<std::tuple<WorkflowFile *, std::shared_ptr<FileLocation>,
                    std::shared_ptr<FileLocation>>> post_op;

            std::shared_ptr<ComputeService> chosen_compute_service = nullptr;

            for (auto const &task : ready_tasks) {
                mem_req = task->getMemoryRequirement();
                num_cores = task->getMinNumCores();

                while (chosen_compute_service == nullptr) {
                    chosen_compute_service = this->assignTask(compute_service1, compute_service2,
                            mem_req, num_cores);
                }

                for (auto const &file : task->getInputFiles()) {
                    locations[file] = wrench::FileLocation::LOCATION(storage_service);
                    if (task->getTopLevel() != 0){
                        if (wrench::StorageService::lookupFile(file, FileLocation::LOCATION(chosen_compute_service->getScratch()))) {
                            locations[file] = FileLocation::LOCATION(chosen_compute_service->getScratch());
                        } else {
                            pre_op.emplace_back(file, FileLocation::LOCATION(storage_service),
                                                FileLocation::LOCATION(chosen_compute_service->getScratch()));
                        }
                    } else {
                        pre_op.emplace_back(file, FileLocation::LOCATION(storage_service),
                                            FileLocation::LOCATION(chosen_compute_service->getScratch()));
                    }
                }

                for (auto const &file : task->getOutputFiles()) {
                    locations[file] = wrench::FileLocation::LOCATION(chosen_compute_service->getScratch());
                    post_op.emplace_back(file, FileLocation::LOCATION
                            (chosen_compute_service->getScratch()), FileLocation::LOCATION(storage_service));
                }

                auto job = this->job_manager->createStandardJob({task}, locations, pre_op,
                        post_op, {});
                this->job_manager->submitJob(job, chosen_compute_service,
                                             {{task->getID(), chosen_compute_service->getHostname()}});
                WRENCH_INFO("Task starting on %s", chosen_compute_service->getHostname().c_str());

                locations.clear();
                pre_op.clear();
                post_op.clear();
                chosen_compute_service = nullptr;
            }

            // Wait for a workflow execution event, and process it
            try {
                this->waitForAndProcessNextEvent();
            } catch (WorkflowExecutionException &e) {
                WRENCH_INFO("Error while getting next execution event (%s)... ignoring and trying again",
                            (e.getCause()->toString().c_str()));
                continue;
            }
            if (this->getWorkflow()->isDone()) {
                break;
            }
        }
        TerminalOutput::setThisProcessLoggingColor(TerminalOutput::Color::COLOR_BLACK);

        WRENCH_INFO("--------------------------------------------------------");
        if (this->getWorkflow()->isDone()) {
            WRENCH_INFO("Execution completed in %.2f seconds!", this->getWorkflow()->getCompletionDate());
        } else {
            WRENCH_INFO("Execution is incomplete!");
        }

        this->job_manager.reset();

        return 0;
    }

    std::shared_ptr<ComputeService> ActivityWMS::assignTask(std::shared_ptr<ComputeService>
            compute_service1, std::shared_ptr<ComputeService> compute_service2, double mem_req,
            double num_cores) {
        std::shared_ptr<ComputeService> chosen_compute_service;
        if (compute_service1->getPerHostNumIdleCores().begin()->second >= num_cores &&
            compute_service1->getPerHostAvailableMemoryCapacity().begin()->second >= mem_req) {
            chosen_compute_service = compute_service1;
        } else if (compute_service2->getPerHostNumIdleCores().begin()->second >= num_cores &&
                   compute_service2->getPerHostAvailableMemoryCapacity().begin()->second >=
                   mem_req) {
            chosen_compute_service = compute_service2;
        } else {
            this->waitForAndProcessNextEvent();
            return nullptr;
        }

        return chosen_compute_service;
    }

    /**
     * @brief Any time a standard job is completed, print to WRENCH_INFO in RED, the number of tasks in the job
     * @param events
     */
    void ActivityWMS::processEventStandardJobCompletion(std::shared_ptr<StandardJobCompletedEvent> event) {
        auto standard_job = event->standard_job;
        TerminalOutput::setThisProcessLoggingColor(TerminalOutput::Color::COLOR_GREEN);
        WRENCH_INFO("Task %s has completed", standard_job->getTasks().at(0)->getID().c_str());
    }

}
