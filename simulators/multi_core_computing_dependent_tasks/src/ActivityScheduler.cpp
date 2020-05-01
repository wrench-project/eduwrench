
#include "ActivityScheduler.h"

XBT_LOG_NEW_DEFAULT_CATEGORY(simple_wms_scheduler, "Log category for Simple WMS Scheduler");


namespace wrench {


    /**
     * @brief Constructor
     * @param storage_services: a map of hostname key to StorageService pointer
     */
    ActivityScheduler::ActivityScheduler(const std::string &scheduling_scheme) : StandardJobScheduler() {
        this->scheduling_scheme = scheduling_scheme;
    }

    void ActivityScheduler::scheduleTasks(const std::set<std::shared_ptr<ComputeService>> &compute_services,
                                          const std::vector<WorkflowTask *> &ready_tasks) {

        TerminalOutput::setThisProcessLoggingColor(TerminalOutput::Color::COLOR_BLUE);
        auto compute_service = *compute_services.begin();

        auto idle_core_count = compute_service->getPerHostNumIdleCores()["the_host"];

        std::set<WorkflowTask *> ready_task_set;
        for (auto const &t : ready_tasks) {
            ready_task_set.insert(t);
        }

        // Map of which tasks shouldn't be picked first based on the scheduling scheme
        std::map<std::string, std::vector<std::string>> losers;
        losers["viz"] = {"viz", "plot"};
        losers["analyze"] = {"analyze", "summarize"};
        losers["stats"] = {"stats"};
        int num_scheduled =  0;

        //  Schedule tasks
        while ((!ready_task_set.empty()) and (idle_core_count > 0)) {

            WorkflowTask *lucky_winner;
            if (ready_task_set.size() == 1)  {
                lucky_winner = *(ready_task_set.begin());
            } else {
                //  This is pretty lame, but it's just a one-shot simulator :)
                for (auto const &t  : ready_task_set)  {
                    bool is_a_loser = false;
                    for (auto const &l : losers[this->scheduling_scheme]) {
                        if (t->getID() == l) {
                            is_a_loser = true;
                            break;
                        }
                    }
                    if (!is_a_loser) {
                        lucky_winner = t;
                        break;
                    }
                }
            }
            ready_task_set.erase(lucky_winner);

            WRENCH_INFO("Starting task %s on a core!", lucky_winner->getID().c_str());
            auto job = this->getJobManager()->createStandardJob(lucky_winner, {});
            this->getJobManager()->submitJob(job, compute_service, {});
            idle_core_count--;
            num_scheduled++;
        }

    }
}
