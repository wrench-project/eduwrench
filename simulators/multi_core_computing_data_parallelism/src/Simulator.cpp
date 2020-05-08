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
 * @brief Generates a 2-task workflow
 *
 * @param workflow
 * @param radius: radio for the oil filter
 * @param num_cores: number of cores
 *
 * @throws std::invalid_argument
 */
void generateWorkflow(wrench::Workflow *workflow, int num_cores, int radius) {

    if (workflow == nullptr) {
        throw std::invalid_argument("generateWorkflow(): invalid workflow");
    }

    if (radius < 1) {
        throw std::invalid_argument("generateWorkflow(): radius must be at least 1");
    }
    if (num_cores < 1) {
        throw std::invalid_argument("generateWorkflow(): num_cores must be at least 1");
    }

    // WorkflowTask specifications
    const double               GFLOP = 1000.0 * 1000.0 * 1000.0;
    const unsigned long    MIN_CORES = 1;
    const unsigned long    MAX_CORES = 1;
    const double PARALLEL_EFFICIENCY = 1.0;

    // create the tasks  and dependencies
    auto task_luminence = workflow->addTask("luminence", 100*GFLOP, 1, 1, 1.0, 0);
    task_luminence->setColor("#D5E8D4");
    for (int i=0; i < num_cores; i++) {
        double flops = 100 * radius * radius * GFLOP / num_cores;
        auto task = workflow->addTask("oil_" + std::to_string(i), flops, 1, 1, 1.0, 0);
        task->setColor("#FFF2CC");
        workflow->addControlDependency(task, task_luminence);
    }
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
                      "       <host id=\"the_host\" speed=\"100Gf\" core=\"" + std::to_string(num_cores) +  "\">\n" +
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
 * @param argc
 * @param argvx
 * @return
 */
int main(int argc, char** argv) {

    wrench::Simulation simulation;
    simulation.init(&argc, argv);

    int NUM_CORES;
    int RADIUS;

    try {

        if (argc != 3) {
            throw std::invalid_argument("bad args");
        }

        NUM_CORES = std::stoi(std::string(argv[1]));

        if (NUM_CORES < 1) {
            throw std::invalid_argument("Invalid number cores. Enter a value >= 1");
        }

        RADIUS = std::stoi(std::string(argv[2]));

        if (RADIUS < 1) {
            throw std::invalid_argument("Invalid radius. Enter a value greater than 1");
        }

    } catch(std::invalid_argument &e) {
        std::cerr << std::string(e.what()) << "\n";
        std::cerr << "Usage: " << argv[0] << " <num cores> <radius>" << std::endl;
        std::cerr << "   num cores: number of cores (>1)" << std::endl;
        std::cerr << "   radius: radius of the oil task (> 0)" << std::endl;
        std::cerr << "" << std::endl;
        return 1;
    }

    // create workflow
    wrench::Workflow workflow;
    generateWorkflow(&workflow, NUM_CORES, RADIUS);

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
            new wrench::ActivityScheduler()), compute_service, THE_HOST));

    wms->addWorkflow(&workflow);

    simulation.launch();

    simulation.getOutput().dumpUnifiedJSON(&workflow, "/tmp/workflow_data.json", true, true, true, false, false, false);

    std::cout << simulation.getCurrentSimulatedDate() << "\n";
    return 0;
}
