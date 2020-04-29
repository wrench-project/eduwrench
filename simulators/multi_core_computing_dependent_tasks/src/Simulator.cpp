#include <iostream>
#include <fstream>
#include <iomanip>
#include <string>
#include <algorithm>

#include <simgrid/s4u.hpp>
#include <wrench.h>
#include <nlohmann/json.hpp>
#include <pugixml.hpp>

#include "ActivityWMS.h"
#include "ActivityScheduler.h"

/**
 * @brief Generates a dependent-task Workflow
 *
 * @param workflow
 * @param num_tasks: number of tasks  in bottom level
 * @param task_gflop: Task GFlop rating
 *
 * @throws std::invalid_argument
 */
void generateWorkflow(wrench::Workflow *workflow, int num_tasks) {

    if (workflow == nullptr) {
        throw std::invalid_argument("generateWorkflow(): invalid workflow");
    }

    if (num_tasks < 1) {
        throw std::invalid_argument("generateWorkflow(): number of tasks must be at least 1");
    }

    // WorkflowTask specifications
    const double               GFLOP = 1000.0 * 1000.0 * 1000.0;
    const unsigned long    MIN_CORES = 1;
    const unsigned long    MAX_CORES = 1;
    const double PARALLEL_EFFICIENCY = 1.0;
    const double                  GB = 1000.0 * 1000.0 * 1000.0;

    /**
     *
     *                    start
     *              /       |     \
     *            /         |      \
     *          /           |       \
     *      viz           split      stats
     *                    /  |  \
     *             analyze1 .... analyze2
     *
     *
     *                   display
     */
    // create the tasks
    auto task_start  = workflow->addTask("start", 50*GFLOP, 1, 1, 1.0, 0);
    auto task_viz = workflow->addTask("viz", 200*GFLOP, 1, 1, 1.0, 0);
    auto task_stats = workflow->addTask("stats", 400*GFLOP, 1, 1, 1.0, 0);
    auto task_split = workflow->addTask("split", 50*GFLOP, 1, 1, 1.0, 0);
    wrench::WorkflowTask *tasks_analyze[num_tasks];
    double analyze_gflops = 3000*GFLOP;
    for (int i = 0; i < num_tasks; ++i) {
        tasks_analyze[i] = workflow->addTask("analyze_" + std::to_string(i), analyze_gflops/num_tasks, 1, 1, 1.0, 0);
    }
    auto task_display = workflow->addTask("display", 10*GFLOP, 1, 1, 1.0, 0);

    // create the task dependencies
    workflow->addControlDependency(task_start, task_viz);
    workflow->addControlDependency(task_start, task_split);
    workflow->addControlDependency(task_start, task_split);
    for (int i=0; i < num_tasks; ++i) {
        workflow->addControlDependency(task_split, tasks_analyze[i]);
        workflow->addControlDependency(tasks_analyze[i], task_display);
    }
    workflow->addControlDependency(task_viz, task_display);
    workflow->addControlDependency(task_stats, task_display);
}

/**
 * @brief Generates a platform with a single multi-core host
 * @param platform_file_path: path to write the platform file to
 *
 * @throws std::invalid_argument
 */
void generatePlatform(std::string platform_file_path) {

    if (platform_file_path.empty()) {
        throw std::invalid_argument("generatePlatform() platform_file_path cannot be empty");
    }

    // Create a the platform file
    std::string xml = "<?xml version='1.0'?>\n"
                      "<!DOCTYPE platform SYSTEM \"http://simgrid.gforge.inria.fr/simgrid/simgrid.dtd\">\n"
                      "<platform version=\"4.1\">\n"
                      "   <zone id=\"AS0\" routing=\"Full\">\n"
                      "       <host id=\"the_host\" speed=\"10Gf\" core=\"6\">\n"
                      "           <prop id=\"ram\" value=\"32GB\"/>\n"
                      "       </host>\n"
                      "       <link id=\"link\" bandwidth=\"100000TBps\" latency=\"0us\"/>\n"
                      "       <route src=\"the_host\" dst=\"the_host\">"
                      "           <link_ctn id=\"link\"/>"
                      "       </route>"
                      "   </zone>\n"
                      "</platform>\n";

    FILE *platform_file = fopen(platform_file_path.c_str(), "w");
    fprintf(platform_file, "%s", xml.c_str());
    fclose(platform_file);
}

/**
 *
 * @param argc
 * @param argvx
 * @return
 */
int main(int argc, char** argv) {

    wrench::Simulation simulation;
    simulation.init(&argc, argv);

    const int MAX_CORES         = 1000;
    int NUM_CORES;
    int NUM_TASKS;
    int TASK_GFLOP;
    int TASK_MEMORY;

    try {

        if (argc != 3) {
            throw std::invalid_argument("bad args");
        }

        NUM_CORES = std::stoi(std::string(argv[1]));

        if (NUM_CORES < 1 || NUM_CORES > MAX_CORES) {
            std::cerr << "Invalid number cores. Enter a value in the range [1, " + std::to_string(MAX_CORES) + "]" << std::endl;
            throw std::invalid_argument("invalid number of cores");
        }

        NUM_TASKS = std::stoi(std::string(argv[2]));

        if (NUM_TASKS < 1) {
            std::cerr << "Invalid number tasks. Enter a value greater than 1" << std::endl;
            throw std::invalid_argument("invalid number of tasks");
        }

    } catch(std::invalid_argument &e) {
        std::cerr << "Usage: " << argv[0] << " <num_cores> <num_tasks>" << std::endl;
        std::cerr << "   num_cores: number of cores [1, " + std::to_string(MAX_CORES) + "]" << std::endl;
        std::cerr << "   num_tasks: number of tasks (> 0)" << std::endl;
        std::cerr << "" << std::endl;
        std::cerr << "   (Core speed is always 10GFlop/sec)" << std::endl;
        return 1;
    }

    // create workflow
    wrench::Workflow workflow;
    generateWorkflow(&workflow, NUM_TASKS);

    // read and instantiate the platform with the desired HPC specifications
    std::string platform_file_path = "/tmp/platform.xml";
    generatePlatform(platform_file_path);
    simulation.instantiatePlatform(platform_file_path);


    const std::string THE_HOST("the_host");

    auto compute_service = simulation.add(
            new wrench::BareMetalComputeService(
                    THE_HOST,
                    {{THE_HOST, std::make_tuple(NUM_CORES, wrench::ComputeService::ALL_RAM)}},
                    "",
                    {
                            {wrench::BareMetalComputeServiceProperty::TASK_STARTUP_OVERHEAD, "0"},
                    },
                    {}
            )
    );

    // wms
    auto wms = simulation.add(new wrench::ActivityWMS(std::unique_ptr<wrench::ActivityScheduler>(
            new wrench::ActivityScheduler()), compute_service, THE_HOST
    ));

    wms->addWorkflow(&workflow);

    simulation.launch();

    simulation.getOutput().dumpUnifiedJSON(&workflow, "/tmp/workflow_data.json", true, true, true, false, false, false);

    return 0;
}
