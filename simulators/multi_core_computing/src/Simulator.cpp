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
 * @brief Generates an independent-task Workflow
 *
 * @param workflow
 * @param num_tasks: number of tasks
 * @param task_gflop: Task GFlop rating
 *
 * @throws std::invalid_argument
 */
void generateWorkflow(wrench::Workflow *workflow, int num_tasks, int task_gflop, int task_ram) {

    if (workflow == nullptr) {
        throw std::invalid_argument("generateWorkflow(): invalid workflow");
    }

    if (num_tasks < 1) {
        throw std::invalid_argument("generateWorkflow(): number of tasks must be at least 1");
    }

    if (task_gflop < 1) {
        throw std::invalid_argument("generateWorkflow(): task GFlop must be at least 1");
    }

    if (task_ram < 0) {
        throw std::invalid_argument("generateWorkflow(): task GB must be at least 0");
    }

    // WorkflowTask specifications
    const double               GFLOP = 1000.0 * 1000.0 * 1000.0;
    const unsigned long    MIN_CORES = 1;
    const unsigned long    MAX_CORES = 1;
    const double PARALLEL_EFFICIENCY = 1.0;
    const double                  GB = 1000.0 * 1000.0 * 1000.0;

    // create the tasks
    for (int i = 0; i < num_tasks; ++i) {
        std::string task_id("task" + std::to_string(i));
        workflow->addTask(task_id, task_gflop * GFLOP, MIN_CORES, MAX_CORES, PARALLEL_EFFICIENCY, task_ram * GB);
    }
}

/**
 * @brief Generates a platform with a single multi-core host
 * @param platform_file_path: path to write the platform file to
 *
 * @throws std::invalid_argumemnt
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
                      "       <host id=\"the_host\" speed=\"100Gf\" core=\"1000\">\n"
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

        if (argc != 5) {
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

        TASK_GFLOP = std::stoi(std::string(argv[3]));

        if (TASK_GFLOP < 1) {
            std::cerr << "Invalid task gflop. Enter a value greater than 1" << std::endl;
            throw std::invalid_argument("invalid task gflop");
        }

        TASK_MEMORY = std::stoi(std::string(argv[4]));

        if (TASK_MEMORY < 0) {
            std::cerr << "Invalid task memory. Enter a value greater than 0" << std::endl;
            throw std::invalid_argument("invalid task gflop");
        }


    } catch(std::invalid_argument &e) {
        std::cerr << "Usage: " << argv[0] << " <num_cores> <num_tasks> <task_gflop> <task_ram>" << std::endl;
        std::cerr << "   num_cores: number of cores [1, " + std::to_string(MAX_CORES) + "]" << std::endl;
        std::cerr << "   num_tasks: number of tasks (> 0)" << std::endl;
        std::cerr << "   task_gflop: task GFlop (> 0)" << std::endl;
        std::cerr << "   task_ram: task GB (>= 0)" << std::endl;
        std::cerr << "" << std::endl;
        std::cerr << "   (Core speed is always 100GFlop/sec, Host RAM capacity is always 32 GB)" << std::endl;
        return 1;
    }

    // create workflow
    wrench::Workflow workflow;
    generateWorkflow(&workflow, NUM_TASKS, TASK_GFLOP, TASK_MEMORY);

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

    //simulation.getOutput().dumpUnifiedJSON(&workflow, "workflow_data.json", true, true, true, false, false);
    simulation.getOutput().dumpWorkflowExecutionJSON(&workflow, "workflow_data.json", false);
    //simulation.getOutput().dumpWorkflowGraphJSON(&workflow, "workflow_graph.json");

    return 0;
}
