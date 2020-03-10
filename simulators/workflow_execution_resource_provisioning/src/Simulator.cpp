#include <fstream>
#include <iostream>

#include <pugixml.hpp>

#include <wrench.h>

#include "ActivityWMS.h"
#include "ActivityScheduler.h"

/**
 * @brief Generates a 3 task join (4 tasks total) Workflow
 * @description: Creates a workflow where 3 independent tasks join into a single task. The input
 *              file size for this workflow is determined by the user.
 * @param workflow
 * @param input_file_size: file size in megabytes for the 3 input files to this Workflow
 * @throws std::invalid_argument
 */
void generateTaskJoinWorkflow(wrench::Workflow *workflow, double input_file_size_in_mb) {

    if (workflow == nullptr) {
        throw std::invalid_argument("generateTaskJoinWorkflow(): invalid workflow");
    }

    if (input_file_size_in_mb < 1.0) {
        throw std::invalid_argument("generateTaskJoinWorkflow(): file size must be at least 1.0 bytes");
    }

    // WorkflowTask specifications
    const double TOP_LEVEL_TASKS_FLOPS   = 100.0 * 1000.0 * 1000.0 * 1000.0 * 1000.0;
    const double BOTTOM_LEVEL_TASK_FLOPS =  10.0 * 1000.0 * 1000.0 * 1000.0 * 1000.0;

    const unsigned long MIN_CORES    = 1;
    const unsigned long MAX_CORES    = 1;
    const double PARALLEL_EFFICIENCY = 1.0;

    const double TOP_LEVEL_TASKS_MEMORY_REQUIREMENT    = 9.0 * 1000.0 * 1000.0 * 1000.0;
    const double BOTTOM_LEVEL_TASKS_MEMORY_REQUIREMENT = 1.0 * 1000.0 * 1000.0 * 1000.0;

    // create final task and its 3KB output file
    auto final_task = workflow->addTask("task3",
                                        BOTTOM_LEVEL_TASK_FLOPS,
                                        MIN_CORES,
                                        MAX_CORES,
                                        PARALLEL_EFFICIENCY,
                                        BOTTOM_LEVEL_TASKS_MEMORY_REQUIREMENT);

    final_task->addOutputFile(workflow->addFile("task3.out", 3.0 * 1000.0));

    // create 3 tasks that join into the final task
    for (size_t i = 0; i < 3; ++i) {
        std::string task_id("task" + std::to_string(i));

        auto current_task = workflow->addTask(task_id,
                                              TOP_LEVEL_TASKS_FLOPS,
                                              MIN_CORES,
                                              MAX_CORES,
                                              PARALLEL_EFFICIENCY,
                                              TOP_LEVEL_TASKS_MEMORY_REQUIREMENT);

        // each current task has an input file
        double input_file_size_in_bytes = input_file_size_in_mb * 1000.0 * 1000.0;
        current_task->addInputFile(workflow->addFile(task_id + ".in", input_file_size_in_bytes));

        // each current task has an output file, which is an input file to the final task
        wrench::WorkflowFile *current_task_output_file = workflow->addFile(task_id + ".out", 1.0 * 1000.0);
        current_task->addOutputFile(current_task_output_file);

        final_task->addInputFile(current_task_output_file);
        workflow->addControlDependency(current_task, final_task);
    }
}

/**
 * @brief Generate a platform with three hosts
 * @description Hosts/Links are arranged as follows: [my_work_computer.org] <--link1--> [infrastructure.org/compute] <--link2--> [infrastructure.org/storage]
 * @param platform_file_path: the path where the platform.xml file will be written to
 * @param num_cores: number of cores on host infrastructure.org/compute
 * @param ram: ram on host infrastructure.org/compute
 * @param effective_bandwidth_of_link_to_remote_ss: effective bandwidth of link2
 * @throws std::invalid_argument
 */
void generatePlatform(std::string platform_file_path, int num_cores, int ram_in_GB, int effective_bandwidth_of_link_to_remote_ss) {
    if (platform_file_path.empty()) {
        throw std::invalid_argument("generatePlatform() platform_file_path cannot be empty");
    }

    if (effective_bandwidth_of_link_to_remote_ss < 1 ) {
        throw std::invalid_argument("generatePlatform() bandwidth must be greater than 1");
    }

    std::string xml_string = "<?xml version='1.0'?>\n"
                             "<!DOCTYPE platform SYSTEM \"http://simgrid.gforge.inria.fr/simgrid/simgrid.dtd\">\n"
                             "<platform version=\"4.1\">\n"
                             "   <zone id=\"AS0\" routing=\"Floyd\">\n"
                             "       <host id=\"my_work_computer.org\" speed=\"1000Gf\" core=\"1\"/>\n"

                             "       <host id=\"infrastructure.org/compute\" speed=\"1000Gf\" core=\"2\">\n"
                             "           <prop id=\"ram\" value=\"16000000000\"/>\n"
                             "       </host>\n"

                             "       <host id=\"infrastructure.org/storage\" speed=\"1000Gf\" core=\"1\"/>\n"
                             "       <!-- effective bandwidth 100 MBps -->"
                             "       <link id=\"link1\" bandwidth=\"103.092MBps\" latency=\"100us\"/>\n"
                             "       <link id=\"link2\" bandwidth=\"103.092MBps\" latency=\"100us\"/>\n"

                             "       <route src=\"my_work_computer.org\" dst=\"infrastructure.org/compute\">\n"
                             "           <link_ctn id=\"link1\"/>\n"
                             "       </route>\n"

                             "       <route src=\"infrastructure.org/compute\" dst=\"infrastructure.org/storage\">\n"
                             "           <link_ctn id=\"link2\"/>\n"
                             "       </route>\n"

                             "    </zone>\n"
                             "</platform>\n";

    pugi::xml_document xml_doc;

    if (xml_doc.load_string(xml_string.c_str(), pugi::parse_doctype)) {

        pugi::xml_node zone = xml_doc.child("platform").child("zone");

        // set num_cores and ram of the compute service host
        pugi::xml_node infrastructure_compute = zone.find_child_by_attribute("host", "id", "infrastructure.org/compute");
        infrastructure_compute.attribute("core").set_value(std::to_string(num_cores).c_str());

        unsigned long long ram_in_bytes = (unsigned long long)ram_in_GB * 1000 * 1000 * 1000;
        infrastructure_compute.find_child_by_attribute("prop", "id", "ram").attribute("value").set_value(ram_in_bytes);

        // set bandwidth of link between compute service host and storage service host

        // entering (effective_bandwidth / 0.97) as bandwidth into the simulation
        // so that the max bandwidth we can achieve is the effective_bandwidth
        double bandwidth = effective_bandwidth_of_link_to_remote_ss / 0.97;

        pugi::xml_node link_to_remote_storage = zone.find_child_by_attribute("link", "id", "link2");
        link_to_remote_storage.attribute("bandwidth").set_value(std::string(
                std::to_string(bandwidth) + "MBps").c_str());

        xml_doc.save_file(platform_file_path.c_str());

    } else {
        throw std::runtime_error("something went wrong with parsing xml string");
    }
}

/**
 * @brief Activity 3 Simulation
 * @param argc
 * @param argv
 * @return
 */
int main(int argc, char **argv) {
    wrench::Simulation simulation;
    simulation.init(&argc, argv);

    const int MAX_NUM_CORES = 100;
    const int MAX_RAM_IN_GB = 64;
    const int MAX_BANDWIDTH = 10000;
    const int MAX_INPUT_FILE_SIZE_IN_MB = 10 * 1000;

    int NUM_CORES;
    int RAM_IN_GB;
    int BANDWIDTH;
    int INPUT_FILE_SIZE_IN_MB;

    try {
        if (argc != 5) {
            throw std::invalid_argument("bad args");
        }

        NUM_CORES = std::stoi(std::string(argv[1]));

        if (NUM_CORES < 1 || NUM_CORES > MAX_NUM_CORES) {
            std::cerr << "Invalid number of cores. Enter a value in the range [1, " + std::to_string(MAX_NUM_CORES) + "]" << std::endl;
            throw std::invalid_argument("invalid number of cores");
        }

        RAM_IN_GB = std::stoi(std::string(argv[2]));

        if (RAM_IN_GB < 1 || RAM_IN_GB > MAX_RAM_IN_GB) {
            std::cerr << "Invalid ram amount. Enter a ram amount in the range [1, " + std::to_string(RAM_IN_GB) + "] GB" << std::endl;
            throw std::invalid_argument("invalid ram amount");
        }

        BANDWIDTH = std::stoi(std::string(argv[3]));

        if (BANDWIDTH < 1 || BANDWIDTH > MAX_BANDWIDTH) {
            std::cerr << "Invalid bandwidth. Enter a value in the range [1, " + std::to_string(MAX_BANDWIDTH) + "] MBps" << std::endl;
            throw std::invalid_argument("invalid bandwidth");
        }

        INPUT_FILE_SIZE_IN_MB = std::stoi(std::string(argv[4]));
        if (INPUT_FILE_SIZE_IN_MB < 1 || INPUT_FILE_SIZE_IN_MB > MAX_INPUT_FILE_SIZE_IN_MB) {
            std::cerr << "Invalid input file size. Enter a value in the range [1, " + std::to_string(MAX_INPUT_FILE_SIZE_IN_MB) + "] MB" << std::endl;
            throw std::invalid_argument("invalid file size");
        }

    } catch (std::invalid_argument &e) {
        std::cerr << "Usage: activity_0_simulator <num_cores> <ram> <bandwidth> <input_file_size" << std::endl;
        std::cerr << "    num_cores: number of cores on compute service host [1, " + std::to_string(MAX_NUM_CORES) + "]" << std::endl;
        std::cerr << "    ram: amount of ram on compute service host [1, " + std::to_string(MAX_RAM_IN_GB) + "] GB" << std::endl;
        std::cerr << "    bandwidth: the effective bandwidth of the link between compute and storage hosts, a value in the range of [1, " + std::to_string(MAX_BANDWIDTH) + "] MBps" << std::endl;
        std::cerr << "    input_file_size: the input file size of the workflow, a value in the range of [1, " + std::to_string(MAX_INPUT_FILE_SIZE_IN_MB) + "] MB" << std::endl;

        return 1;
    }

    std::string platform_file_path = "/tmp/platform.xml";
    generatePlatform(platform_file_path, NUM_CORES, RAM_IN_GB, BANDWIDTH);
    simulation.instantiatePlatform(platform_file_path);

    const std::string STORAGE_HOST("infrastructure.org/storage");
    const std::string COMPUTE_HOST("infrastructure.org/compute");
    const std::string WMS_HOST("my_work_computer.org");

    // create a remote storage service and a storage service on the same host as the compute service
    const double STORAGE_CAPACITY = 50.0 * 1000.0 * 1000.0 * 1000.0 * 1000.0;
    auto remote_storage_service = simulation.add(
            new wrench::SimpleStorageService(STORAGE_HOST, STORAGE_CAPACITY)
            );

    // this storage service is pretending to be scratch for the baremetal compute service
    auto bare_metal_storage_service = simulation.add(
            new wrench::SimpleStorageService(COMPUTE_HOST, STORAGE_CAPACITY)
            );

    std::map<std::string, std::shared_ptr<wrench::StorageService>> storage_services = {
            {STORAGE_HOST, remote_storage_service},
            {COMPUTE_HOST, bare_metal_storage_service}
    };

    // create the compute service
    auto compute_service = simulation.add(
            new wrench::BareMetalComputeService(
                    COMPUTE_HOST,
                    {COMPUTE_HOST},
                    {},
                    {}
                    )
            );

    // create workflow and stage input files
    wrench::Workflow workflow;
    generateTaskJoinWorkflow(&workflow, INPUT_FILE_SIZE_IN_MB);

    simulation.add(new wrench::FileRegistryService(WMS_HOST));
    simulation.stageFiles(workflow.getInputFiles(), remote_storage_service);

    // create wms and add workflow
    auto wms = simulation.add(
            new wrench::ActivityWMS(
                    std::unique_ptr<wrench::ActivityScheduler>(new wrench::ActivityScheduler(storage_services)),
                    {compute_service},
                    {remote_storage_service},
                    WMS_HOST
                    )
            );

    wms->addWorkflow(&workflow);

    simulation.launch();

    // print completion date so I can grab it with run_options.py
    std::cout << workflow.getCompletionDate() << std::endl;

    return 0;
}
