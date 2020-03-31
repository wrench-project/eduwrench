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
void generateWorkflow(wrench::Workflow *workflow, std::vector<std::tuple<double,double,double>> task_list) {

    if (workflow == nullptr) {
        throw std::invalid_argument("generateWorkflow(): invalid workflow");
    }

    if (task_list.size() < 1) {
        throw std::invalid_argument("generateWorkflow(): number of tasks must be at least 1");
    }

    // WorkflowTask specifications
    const double               GFLOP = 1000.0 * 1000.0 * 1000.0;
    const unsigned long    MIN_CORES = 1;
    const unsigned long    MAX_CORES = 1;
    const double PARALLEL_EFFICIENCY = 1.0;
    const double                  MB = 1000.0 * 1000.0;
    const int                TASK_ID = 0;

    for (auto const &task : task_list) {
        auto current_task = workflow->addTask("task"+std::to_string(TASK_ID), std::get<1>(task), MIN_CORES, MAX_CORES, PARALLEL_EFFICIENCY, 0);
        current_task->addInputFile(workflow->addFile("task" + std::to_string(TASK_ID) + "::0.in", std::get<0>(task) * MB));
        current_task->addOutputFile(workflow->addFile("task" + std::to_string(TASK_ID) + "::0.out", std::get<2>(task) * MB));
        TASK_ID++;
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
                      "       <host id=\"master\" speed=\"1000000000000000Gf\" core=\"1000\">\n"
                      "           <prop id=\"ram\" value=\"32GB\"/>\n"
                      "           <disk id=\"large_disk\" read_bw=\"1000000000000000000MBps\" write_bw=\"1000000000000000000MBps\">\n"
                      "                            <prop id=\"size\" value=\"5000GiB\"/>\n"
                      "                            <prop id=\"mount\" value=\"/\"/>\n"
                      "           </disk>\n"
                      "       </host>\n"
                      "       <host id=\"worker_zero\" speed=\"100Gf\" core=\"1\">\n"
                      "           <prop id=\"ram\" value=\"32GB\"/>\n"
                      "           <disk id=\"worker_zero_disk\" read_bw=\"50MBps\" write_bw=\"50MBps\">\n"
                      "                            <prop id=\"size\" value=\"5000GiB\"/>\n"
                      "                            <prop id=\"mount\" value=\"/\"/>\n"
                      "           </disk>\n"
                      "       </host>\n"
                      "       <host id=\"worker_one\" speed=\"100Gf\" core=\"1\">\n"
                      "           <prop id=\"ram\" value=\"32GB\"/>\n"
                      "           <disk id=\"worker_one_disk\" read_bw=\"50MBps\" write_bw=\"50MBps\">\n"
                      "                            <prop id=\"size\" value=\"5000GiB\"/>\n"
                      "                            <prop id=\"mount\" value=\"/\"/>\n"
                      "           </disk>\n"
                      "       </host>\n"
                      "       <host id=\"worker_two\" speed=\"100Gf\" core=\"1\">\n"
                      "           <prop id=\"ram\" value=\"32GB\"/>\n"
                      "           <disk id=\"worker_two_disk\" read_bw=\"50MBps\" write_bw=\"50MBps\">\n"
                      "                            <prop id=\"size\" value=\"5000GiB\"/>\n"
                      "                            <prop id=\"mount\" value=\"/\"/>\n"
                      "           </disk>\n"
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

    const int MAX_NUM_TASKS = 100;
    const int MAX_TASK_INPUT = 1000;
    const int MAX_TASK_FLOP = 1000;
    const int MAX_TASK_OUTPUT = 1000;

    std::vector<std::tuple<double, double, double>> tasks;

    try {
        if (argc < 4) {
            throw std::invalid_argument("bad args");
        }

        if ((argc-1)%3 != 0) {
            throw std::invalid_argument("Missing task specifications. Each task must have an input, flops and output specified.");
        }

        if ((argc - 1)/3 > MAX_NUM_TASKS) {
            std::cerr << "Too many file sizes specified (maximum 100)" << std::endl;
            throw std::invalid_argument("invalid number of files");
        }

        for (int i = 1; i < argc; i+=3) {
            double input = std::stof(std::string(argv[i]));
            double flops = std::stof(std::string(argv[i+1]));
            double output = std::stof(std::string(argv[i+2]));

            if ((input < 1) || (input > MAX_TASK_INPUT)) {
                std::cerr << "Invalid task input. Enter a task input size in the range [1, " + std::to_string(MAX_TASK_INPUT) +
                             "] MB" << std::endl;
                throw std::invalid_argument("invalid task input");
            } else if ((flops < 1) || (flops > MAX_TASK_FLOP)) {
                std::cerr << "Invalid task flops. Enter task flops in the range [1, " + std::to_string(MAX_TASK_FLOP) +
                             "] flops" << std::endl;
                throw std::invalid_argument("invalid task flops");
            } else if ((output < 1) || (output > MAX_TASK_OUTPUT)) {
                std::cerr << "Invalid task output. Enter a task output size in the range [1, " + std::to_string(MAX_TASK_OUTPUT) +
                             "] MB" << std::endl;
                throw std::invalid_argument("invalid task output");
            } else {
                tasks.push_back(std::make_tuple(input, flops, output));
            }
        }

    } catch (std::invalid_argument &e) {
        std::cerr << "Usage: " << std::string(argv[0]) << " <task input> <task flops> <task output> [<task input> <task flops> <task outpit>]*" << std::endl;
        std::cerr << "    task input: the amount of data that must be sent from master to worker to begin task in range of [1, " +
                     std::to_string(MAX_TASK_INPUT) + "] MB" << std::endl;
        std::cerr << "    task flops: the required amount of processing needed for the task [1, " +
                     std::to_string(MAX_TASK_FLOP) + "] flops" << std::endl;
        std::cerr << "    task output: the amount of data that must be sent back from worker to master after completion in range of [1, " +
                     std::to_string(MAX_TASK_OUTPUT) + "] MB" << std::endl;
        std::cerr << "    (at most " + std::to_string(MAX_NUM_TASKS) + " tasks can be specified)" << std::endl;
        return 1;
    }

    // create workflow
    wrench::Workflow workflow;
    generateWorkflow(&workflow, tasks);

    // read and instantiate the platform with the desired HPC specifications
    std::string platform_file_path = "/tmp/platform.xml";
    generatePlatform(platform_file_path);
    simulation.instantiatePlatform(platform_file_path);

    const std::string MASTER("master");
    const std::string WORKER_ZERO("worker_zero");
    const std::string WORKER_ONE("worker_one");
    const std::string WORKER_TWO("worker_two");

    auto master_storage_service = simulation.add(new wrench::SimpleStorageService(MASTER, {"/"}));

    auto compute_service_zero = simulation.add(
            new wrench::BareMetalComputeService(
                    WORKER_ZERO,
                    {{WORKER_ZERO, std::make_tuple(1, wrench::ComputeService::ALL_RAM)}},
                    "",
                    {
                            {wrench::BareMetalComputeServiceProperty::TASK_STARTUP_OVERHEAD, "0"},
                    },
                    {}
            )
    );
    auto compute_service_one = simulation.add(
            new wrench::BareMetalComputeService(
                    WORKER_ONE,
                    {{WORKER_ONE, std::make_tuple(1, wrench::ComputeService::ALL_RAM)}},
                    "",
                    {
                            {wrench::BareMetalComputeServiceProperty::TASK_STARTUP_OVERHEAD, "0"},
                    },
                    {}
            )
    );
    auto compute_service_two = simulation.add(
            new wrench::BareMetalComputeService(
                    WORKER_TWO,
                    {{WORKER_TWO, std::make_tuple(1, wrench::ComputeService::ALL_RAM)}},
                    "",
                    {
                            {wrench::BareMetalComputeServiceProperty::TASK_STARTUP_OVERHEAD, "0"},
                    },
                    {}
            )
    );

    std::set<auto> compute_services;
    compute_services.push_back(compute_service_zero);
    compute_services.push_back(compute_service_one);
    compute_services.push_back(compute_service_two);

    // wms
    auto wms = simulation.add(new wrench::ActivityWMS(std::unique_ptr<wrench::ActivityScheduler>(
            new wrench::ActivityScheduler()), compute_services, MASTER
    ));

    wms->addWorkflow(&workflow);

    simulation.launch();

    simulation.getOutput().dumpUnifiedJSON(&workflow, "workflow_data.json", true, true, true, false, false);


    return 0;
}
