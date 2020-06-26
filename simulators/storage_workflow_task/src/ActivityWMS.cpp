
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

        WRENCH_INFO("About to execute a workflow with %lu tasks", this->getWorkflow()->getNumberOfTasks());

        // Create the managers
        auto data_manager = this->createDataMovementManager();
        auto job_manager = this->createJobManager();

        // Get the compute service
        std::shared_ptr<ComputeService> compute_service1, compute_service2;
        for (const auto &compute_service : this->getAvailableComputeServices<ComputeService>()) {
            if (compute_service->getHostname() == "ComputeHost1") {
                compute_service1 = compute_service;
            } else {
                compute_service2 = compute_service;
            }
        }

        //get storage service
        auto storage_service = *(this->getAvailableStorageServices().begin());

        //get references to task and files
        auto blue_task = this->getWorkflow()->getTaskByID("blue_task");
        auto yellow_task = this->getWorkflow()->getTaskByID("yellow_task");
        auto red_task = this->getWorkflow()->getTaskByID("red_task");

        auto blue_infile = this->getWorkflow()->getFileByID("blue_infile");
        auto yellow_infile = this->getWorkflow()->getFileByID("yellow_infile");

        auto blue_outfile = this->getWorkflow()->getFileByID("blue_outfile");
        auto yellow_outfile1 = this->getWorkflow()->getFileByID("yellow_outfile1");
        auto yellow_outfile2 = this->getWorkflow()->getFileByID("yellow_outfile2");

        //create map of file locations
        std::map<WorkflowFile *, std::shared_ptr<FileLocation>> locations1;
        locations1.insert({blue_infile, FileLocation::LOCATION(storage_service)});
        locations1.insert({blue_outfile, FileLocation::LOCATION(compute_service1->getScratch())});

        //create set of pre file copy operations to be performed
        std::vector<std::tuple<WorkflowFile *, std::shared_ptr<FileLocation>,
                std::shared_ptr<FileLocation>>> blue_pre;
        blue_pre.emplace_back(blue_infile, FileLocation::LOCATION(storage_service),
                FileLocation::LOCATION(compute_service1->getScratch()));

        //create set of post file copy operations to be performed
        std::vector<std::tuple<WorkflowFile *, std::shared_ptr<FileLocation>,
                std::shared_ptr<FileLocation>>> blue_post;
        blue_post.emplace_back(blue_outfile, FileLocation::LOCATION(compute_service1->getScratch()
        ), FileLocation::LOCATION(storage_service));

        //compute task
        auto job = job_manager->createStandardJob({blue_task}, locations1, blue_pre, blue_post, {});
        job_manager->submitJob(job, compute_service1, {{"blue_task", "ComputeHost1"}});
        WRENCH_INFO("Blue task starting on Compute Service 1... ");
        this->waitForNextEvent();
        WRENCH_INFO("Blue task has completed!");

        //prepare yellow task
        //create map of file locations
        std::map<WorkflowFile *, std::shared_ptr<FileLocation>> locations2;
        locations2.insert({yellow_infile, FileLocation::LOCATION(storage_service)});
        locations2.insert({yellow_outfile1, FileLocation::LOCATION(compute_service2->getScratch())});
        locations2.insert({yellow_outfile2, FileLocation::LOCATION(compute_service2->getScratch())});

        //create set of pre file copy operations to be performed
        std::vector<std::tuple<WorkflowFile *, std::shared_ptr<FileLocation>,
                std::shared_ptr<FileLocation>>> yellow_pre;
        yellow_pre.emplace_back(yellow_infile, FileLocation::LOCATION(storage_service),
                              FileLocation::LOCATION(compute_service2->getScratch()));

        //create set of post file copy operations to be performed
        std::vector<std::tuple<WorkflowFile *, std::shared_ptr<FileLocation>,
                std::shared_ptr<FileLocation>>> yellow_post;
        yellow_post.emplace_back(yellow_outfile1, FileLocation::LOCATION
        (compute_service2->getScratch()), FileLocation::LOCATION(storage_service));
        yellow_post.emplace_back(yellow_outfile2, FileLocation::LOCATION
                (compute_service2->getScratch()), FileLocation::LOCATION(storage_service));

        //compute task
        auto job2 = job_manager->createStandardJob({yellow_task}, locations2, yellow_pre, yellow_post, {});
        job_manager->submitJob(job2, compute_service2, {{"yellow_task", "ComputeHost2"}});
        WRENCH_INFO("Yellow task starting on Compute Service 2...");
        this->waitForNextEvent();
        WRENCH_INFO("Yellow task has completed!");

        //run red task
        //if (red task runs on compute service 1)
        //copy input file to compute service's scratch space
        //create map of file locations
        std::map<WorkflowFile *, std::shared_ptr<FileLocation>> locations3;
        locations3.insert({blue_outfile, FileLocation::LOCATION(compute_service1->getScratch())});
        locations3.insert({yellow_outfile1, FileLocation::LOCATION(storage_service)});
        locations3.insert({yellow_outfile2, FileLocation::LOCATION(storage_service)});

        //create set of pre file copy operations to be performed
        std::vector<std::tuple<WorkflowFile *, std::shared_ptr<FileLocation>,
                std::shared_ptr<FileLocation>>> red_pre;
        red_pre.emplace_back(yellow_outfile1, FileLocation::LOCATION(storage_service),
                                FileLocation::LOCATION(compute_service1->getScratch()));
        red_pre.emplace_back(yellow_outfile2, FileLocation::LOCATION(storage_service),
                             FileLocation::LOCATION(compute_service1->getScratch()));

        //compute task
        auto job3 = job_manager->createStandardJob({red_task}, locations3, red_pre, {}, {});
        job_manager->submitJob(job3, compute_service1, {{"red_task", "ComputeHost1"}});
        WRENCH_INFO("Red task starting on Compute Service 1...");
        this->waitForNextEvent();
        WRENCH_INFO("Red task has completed!");


        WRENCH_INFO("--------------------------------------------------------");
        if (this->getWorkflow()->isDone()) {
            WRENCH_INFO("Workflow execution completed in %.2f seconds!", this->getWorkflow()->getCompletionDate());
        } else {
            WRENCH_INFO("Workflow execution is incomplete!");
        }

        job_manager.reset();

        return 0;
    }

}
