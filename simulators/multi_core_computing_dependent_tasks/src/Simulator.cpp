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
void generateWorkflow(wrench::Workflow *workflow, double analyze_work) {

    if (workflow == nullptr) {
        throw std::invalid_argument("generateWorkflow(): invalid workflow");
    }

    if (analyze_work < 1) {
        throw std::invalid_argument("generateWorkflow(): analyze  work must be at least 1");
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
     *      viz           analyze     stats
     *       |              |
     *      plot          summarize
     *
     *
     *                   display
     */
    // create the tasks
    auto task_start     = workflow->addTask("start", 50*GFLOP, 1, 1, 1.0, 0);
    auto task_viz       = workflow->addTask("viz", 200*GFLOP, 1, 1, 1.0, 0);
    auto task_plot      = workflow->addTask("plot", 100*GFLOP, 1, 1, 1.0, 0);
    auto task_stats     = workflow->addTask("stats", 400*GFLOP, 1, 1, 1.0, 0);
    auto task_analyze   = workflow->addTask("analyze", analyze_work*GFLOP, 1, 1, 1.0, 0);
    auto task_summarize = workflow->addTask("summarize", 100*GFLOP, 1, 1, 1.0, 0);
    auto task_display   = workflow->addTask("display", 10*GFLOP, 1, 1, 1.0, 0);

    // create the task dependencies
    workflow->addControlDependency(task_start, task_viz);
    workflow->addControlDependency(task_viz, task_plot);
    workflow->addControlDependency(task_plot, task_display);
    workflow->addControlDependency(task_start, task_analyze);
    workflow->addControlDependency(task_analyze, task_summarize);
    workflow->addControlDependency(task_summarize, task_display);
    workflow->addControlDependency(task_start, task_stats);
    workflow->addControlDependency(task_stats, task_display);
}

/**
 * @brief Generates a platform with a single multi-core host
 * @param platform_file_path: path to write the platform file to
 *
 * @throws std::invalid_argument
 */
void generatePlatform(std::string platform_file_path, int num_cores) {

    if (platform_file_path.empty()) {
        throw std::invalid_argument("generatePlatform() platform_file_path cannot be empty");
    }

    // Create a the platform file
    std::string xml = "<?xml version='1.0'?>\n"
                      "<!DOCTYPE platform SYSTEM \"http://simgrid.gforge.inria.fr/simgrid/simgrid.dtd\">\n"
                      "<platform version=\"4.1\">\n"
                      "   <zone id=\"AS0\" routing=\"Full\">\n"
                      "       <host id=\"the_host\" speed=\"10Gf\" core=\"" + std::to_string(num_cores) +  "\">\n"
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
    double ANALYZE;
    std::string SCHEDULING_SCHEME;

    try {

        if (argc != 4) {
            throw std::invalid_argument("bad args");
        }

        NUM_CORES = std::stoi(std::string(argv[1]));

        if (NUM_CORES < 1 || NUM_CORES > MAX_CORES) {
            throw std::invalid_argument("Invalid number cores. Enter a value in the range [1, " + std::to_string(MAX_CORES) + "]");
        }

        ANALYZE = std::stof(std::string(argv[2]));

        if (ANALYZE < 1) {
            throw std::invalid_argument("Invalid analyze work. Enter a value greater than 1");
        }

        SCHEDULING_SCHEME = std::string(argv[3]);

        if ((SCHEDULING_SCHEME != "stats") and
            (SCHEDULING_SCHEME  != "viz") and
            (SCHEDULING_SCHEME != "analyze")) {
            throw std::invalid_argument("Invalid scheduling scheme. Enter 'stats', 'viz', or 'analyze'");
        }

    } catch(std::invalid_argument &e) {
        std::cerr << std::string(e.what()) << "\n";
        std::cerr << "Usage: " << argv[0] << " <num cores> <analyze work> <scheduling scheme>" << std::endl;
        std::cerr << "   num cores: number of cores [1, " + std::to_string(MAX_CORES) + "]" << std::endl;
        std::cerr << "   analyze work: work  of the analyze task in GFlop (> 0)" << std::endl;
        std::cerr << "   scheduling scheme: 'stats', 'viz', or 'analyze' (the path that's NOT prioritized)" << std::endl;
        std::cerr << "" << std::endl;
        std::cerr << "   (Core speed is always 10GFlop/sec)" << std::endl;
        return 1;
    }

    // create workflow
    wrench::Workflow workflow;
    generateWorkflow(&workflow, ANALYZE);

    // read and instantiate the platform with the desired HPC specifications
    std::string platform_file_path = "/tmp/platform.xml";
    generatePlatform(platform_file_path, NUM_CORES);
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
            new wrench::ActivityScheduler(SCHEDULING_SCHEME)), compute_service, THE_HOST));

    wms->addWorkflow(&workflow);

    simulation.launch();

    simulation.getOutput().dumpUnifiedJSON(&workflow, "/tmp/workflow_data.json", true, true, true, false, false, false);

    std::cout << simulation.getCurrentSimulatedDate() << "\n";
    return 0;
}
