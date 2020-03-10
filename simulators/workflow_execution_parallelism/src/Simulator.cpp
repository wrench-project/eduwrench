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
 * @brief Generates a join Workflow
 * @description Creates a workflow where num_tasks_to_join independent tasks are joined into one task. All tasks at the
 *              top level compute for the same amount of time. The final task computes for a fraction of what the top level
 *              tasks compute for.
 * @param workflow
 * @param num_tasks_to_join: number of tasks to join into one final task
 * @param file_size: file size for all files in this workflow
 * @param requires_memory: bool specifying if the tasks have a RAM requirement of 12.0 GB or not
 *
 * @throws std::invalid_argument
 */
void generateTaskJoinWorkflow(wrench::Workflow *workflow, int num_tasks_to_join, double file_size, bool requires_memory) {

    if (workflow == nullptr) {
        throw std::invalid_argument("generateTaskJoinWorkflow(): invalid workflow");
    }

    if (num_tasks_to_join < 2) {
        throw std::invalid_argument("generateTaskJoinWorkflow(): number of tasks to join must be at least 2");
    }

    if (file_size < 1.0) {
        throw std::invalid_argument("generateTaskJoinWorkflow(): file size must be at least 1.0 bytes");
    }

    // WorkflowTask specifications
    const double               FLOPS = 60 * 60 * 1000.0 * 1000.0 * 1000.0 * 1000.0;
    const unsigned long    MIN_CORES = 1;
    const unsigned long    MAX_CORES = 1;
    const double PARALLEL_EFFICIENCY = 1.0;
    const double  MEMORY_REQUIREMENT = requires_memory ? 12.0 * 1000.0 * 1000.0 * 1000.0 : 0.0;

    // add final task
    auto final_task = workflow->addTask("task" + std::to_string(num_tasks_to_join), (FLOPS / 12), MIN_CORES, MAX_CORES, PARALLEL_EFFICIENCY,
      MEMORY_REQUIREMENT + ((double)num_tasks_to_join * file_size) + file_size);

    // create number of desired tasks to join into one
    for (int i = 0; i < num_tasks_to_join; ++i) {
        std::string task_id("task" + std::to_string(i));
        auto current_task = workflow->addTask("task" + std::to_string(i), FLOPS, MIN_CORES, MAX_CORES, PARALLEL_EFFICIENCY, MEMORY_REQUIREMENT + (2.0 * file_size));
        current_task->addInputFile(workflow->addFile(task_id + ".in", file_size));

        auto output_file = workflow->addFile(task_id + ".out", file_size);
        current_task->addOutputFile(output_file);
        final_task->addInputFile(output_file);
        workflow->addControlDependency(current_task, final_task);
    }

    final_task->addOutputFile(workflow->addFile("task" + std::to_string(num_tasks_to_join) + ".out", file_size));
}

/**
 * @brief Generates a platform with two hosts and a cluster
 * @description Generates a platform where the cluster has a configurable number of nodes and number of cores per node
 * @param platform_file_path: path to write the platform file to
 * @param num_nodes: number of nodes in the cluster
 * @param num_cores: number of cores per node
 *
 * @throws std::invalid_argumemnt
 */
void generatePlatformWithHPCSpecs(std::string platform_file_path, int num_nodes, int num_cores) {

    if (platform_file_path.empty()) {
        throw std::invalid_argument("generatePlatformWithHPCSpecs() platform_file_path cannot be empty");
    }

    if (num_nodes < 1) {
        throw std::invalid_argument("generatePlatformWithHPCSpecs() num_nodes must be at least 1");
    }

    if (num_cores < 1) {
        throw std::invalid_argument("generatePlatformWithHPCSpecs() num_cores must at least 1");
    }

    // Create a the platform file
    std::string xml = "<?xml version='1.0'?>\n"
                      "<!DOCTYPE platform SYSTEM \"http://simgrid.gforge.inria.fr/simgrid/simgrid.dtd\">\n"
                      "<platform version=\"4.1\">\n"
                      "   <zone id=\"AS0\" routing=\"Full\">\n"
                      "     <!-- effective bandwidth = 1250 MBps -->\n"
                      "     <cluster id=\"hpc.edu\" prefix=\"hpc.edu/node_\" suffix=\"\" radical=\"0-";
            xml += std::to_string(num_nodes)  + "\" core=\"" + std::to_string(num_cores) + "\" speed=\"1000Gf\" bw=\"1288.6597MBps\" lat=\"10us\" router_id=\"hpc_gateway\">\n";
            xml += "         <prop id=\"ram\" value=\"80000000000\"/>\n";
            xml += "        </cluster>\n";
            xml += "      <zone id=\"AS2\" routing=\"Full\">\n";
            xml += "          <host id=\"storage_db.edu\" speed=\"1000Gf\">\n";
            xml += "                <disk id=\"large_disk\" read_bw=\"100MBps\" write_bw=\"100MBps\">\n";
            xml += "                       <prop id=\"size\" value=\"5000GiB\"/>\n";
            xml += "                       <prop id=\"mount\" value=\"/\"/>\n";
            xml += "                </disk>\n";
            xml += "          </host>\n";
            xml += "      </zone>\n";
            xml += "      <zone id=\"AS3\" routing=\"Full\">\n";
            xml += "          <host id=\"my_lab_computer.edu\" speed=\"1000Gf\" core=\"1\">\n";
            xml += "                <disk id=\"large_disk\" read_bw=\"100MBps\" write_bw=\"100MBps\">\n";
            xml += "                       <prop id=\"size\" value=\"5000GiB\"/>\n";
            xml += "                       <prop id=\"mount\" value=\"/\"/>\n";
            xml += "                </disk>\n";
            xml += "          </host>\n";
            xml += "      </zone>\n";
            xml += "      <!-- effective bandwidth = 125 MBps -->\n";
            xml += "      <link id=\"link1\" bandwidth=\"128.8659MBps\" latency=\"100us\"/>\n";
            xml += "      <zoneRoute src=\"AS2\" dst=\"hpc.edu\" gw_src=\"storage_db.edu\" gw_dst=\"hpc_gateway\">\n";
            xml += "        <link_ctn id=\"link1\"/>\n";
            xml += "      </zoneRoute>\n";
            xml += "      <zoneRoute src=\"AS3\" dst=\"hpc.edu\" gw_src=\"my_lab_computer.edu\" gw_dst=\"hpc_gateway\">\n";
            xml += "        <link_ctn id=\"link1\"/>\n";
            xml += "      </zoneRoute>\n";
            xml += "      <zoneRoute src=\"AS3\" dst=\"AS2\" gw_src=\"my_lab_computer.edu\" gw_dst=\"storage_db.edu\">\n";
            xml += "        <link_ctn id=\"link1\"/>\n";
            xml += "      </zoneRoute>\n";
            xml += "   </zone>\n";
            xml += "</platform>\n";

    FILE *platform_file = fopen(platform_file_path.c_str(), "w");
    fprintf(platform_file, "%s", xml.c_str());
    fclose(platform_file);
}

/**
 *
 * @param argc
 * @param argv
 * @return
 */
int main(int argc, char** argv) {

    wrench::Simulation simulation;
    simulation.init(&argc, argv);

    const int MAX_NODES         = 32;
    const int MAX_CORES         = 32;
    const int MAX_TASKS_TO_JOIN = 50;
    const double MAX_FILE_SIZE  = 1000.0 * 1000.0 * 1000.0 * 1000.0;

    int  NUM_HPC_NODES;
    int  NUM_CORES_PER_HPC_NODE;
    int  NUM_TASKS_TO_JOIN;
    double FILE_SIZE;
    bool TASK_MEMORY_REQUIRED;

    try {

        if (argc != 6) {
            throw std::invalid_argument("bad args");
        }

        NUM_HPC_NODES = std::stoi(std::string(argv[1]));

        if (NUM_HPC_NODES < 1 || NUM_HPC_NODES > MAX_NODES) {
            std::cerr << "Invalid number of HPC execution nodes. Enter a value in the range [1, " + std::to_string(MAX_NODES) + "]" << std::endl;
            throw std::invalid_argument("invalid number of execution nodes");
        }

        NUM_CORES_PER_HPC_NODE = std::stoi(std::string(argv[2]));

        if (NUM_CORES_PER_HPC_NODE < 1 || NUM_CORES_PER_HPC_NODE > MAX_CORES) {
            std::cerr << "Invalid number of cores per HPC node. Enter a value in the range [1, " + std::to_string(MAX_CORES) + "]" << std::endl;
            throw std::invalid_argument("invalid number of cores per hpc node");
        }

        NUM_TASKS_TO_JOIN = std::stoi(std::string(argv[3]));

        if (NUM_TASKS_TO_JOIN < 2 || NUM_TASKS_TO_JOIN > MAX_TASKS_TO_JOIN) {
            std::cerr << "Invalid number of tasks to join. Enter a value in the range [2, " + std::to_string(MAX_TASKS_TO_JOIN) + "]" << std::endl;
            throw std::invalid_argument("invalid number of tasks to join");
        }

        FILE_SIZE = std::stod(std::string(argv[4]));

        if (FILE_SIZE < 1.0 || FILE_SIZE > MAX_FILE_SIZE) {
            std::cerr << "Invalid file sizes. Enter a value in the range [1, " + std::to_string(MAX_FILE_SIZE) + "]" << std::endl;
            throw std::invalid_argument("invalid file size");
        }

        std::string task_memory_required_arg  = std::string(argv[5]);

        if (task_memory_required_arg == "RAM_REQUIRED") {
            TASK_MEMORY_REQUIRED = true;
        } else if (task_memory_required_arg == "RAM_NOT_REQUIRED") {
            TASK_MEMORY_REQUIRED = false;
        } else {
            std::cerr << "Invalid memory requirement. Enter RAM_REQUIRED or RAM_NOT_REQUIRED" << std::endl;
            throw std::invalid_argument("invalid memory requirement");
        }

    } catch(std::invalid_argument &e) {
        std::cerr << "Usage: activity_2_simulator <num_hpc_nodes> <num_hpc_cores_per_node> <num_tasks_to_join> <file_size> <task_memory_requirement>" << std::endl;
        std::cerr << "   num_hpc_nodes: number of execution nodes in the range [1, " + std::to_string(MAX_NODES) + "]" << std::endl;
        std::cerr << "   num_hpc_cores_per_node: number of cores per node in the range [1, " + std::to_string(MAX_CORES) + "]" << std::endl;
        std::cerr << "   num_tasks_to_join: the number of independent tasks to join in the range [2, " + std::to_string(MAX_TASKS_TO_JOIN) + "]" << std::endl;
        std::cerr << "   file_size: number of bytes in the range [1, " + std::to_string(MAX_FILE_SIZE) + "]" << std::endl;
        std::cerr << "   task_memory_requirement: RAM_REQUIRED or RAM_NOT_REQUIRED" << std::endl;
        return 1;
    }

    // create workflow
    wrench::Workflow workflow;
    generateTaskJoinWorkflow(&workflow, NUM_TASKS_TO_JOIN, FILE_SIZE, TASK_MEMORY_REQUIRED);

    // read and instantiate the platform with the desired HPC specifications
    std::string platform_file_path = "/tmp/platform.xml";
    generatePlatformWithHPCSpecs(platform_file_path,  NUM_HPC_NODES, NUM_CORES_PER_HPC_NODE);
    simulation.instantiatePlatform(platform_file_path);

    // get all the hosts in the cluster zone
    simgrid::s4u::Engine *simgrid_engine = simgrid::s4u::Engine::get_instance();
    simgrid::s4u::NetZone *hpc_net_zone = simgrid_engine->netzone_by_name_or_null("hpc.edu");
    std::vector<simgrid::s4u::Host *> hpc_nodes = hpc_net_zone->get_all_hosts();

    // order nodes by the number postfixed to its name just so I can print them and use them in order if needed
    std::string hpc_node_name_format("hpc.edu/node_XXX");
    std::string::size_type index_of_node_number = hpc_node_name_format.find('_') + 1;

    std::sort(hpc_nodes.begin(), hpc_nodes.end(), [&index_of_node_number] (const simgrid::s4u::Host *lhs, const simgrid::s4u::Host *rhs) {
        return std::stoi(lhs->get_name().substr(index_of_node_number)) < std::stoi(rhs->get_name().substr(index_of_node_number));
    });

    #ifdef DEBUG
    std::cerr << "\n************** DEBUG INFO **************" << std::endl;
    std::cerr << "\nhpc.edu configuration" << std::endl;
    std::cerr << "-----------------------------" << std::endl;
    std::cerr << std::setw(18) << std::left  << "node"
        << std::setw(7) << std::left << "cores"
        << std::setw(14) << std::left << "ram" << std::endl;

    for (const auto &node : hpc_nodes) {
        std::cerr << std::setw(18) << std::left << node->get_name()
            << std::setw(7) << std::left << node->get_core_count()
            << std::setw(14) << std::left << node->get_property("ram") << std::endl;
    }

    std::cerr << "\nworkflow configuration" << std::endl;
    std::cerr << "----------------------" << std::endl;

    auto some_task = workflow.getTasks().at(0);

    std::cerr << std::setw(8) << std::left << "taskID"
        << std::setw(9) << std::left << "parents"
        << std::setw(11) << std::left << "children"
        << std::setw(15) << std::left << "input files"
        << std::setw(17) << std::left << "output files" << std::endl;

    for (const auto &task : workflow.getTasks()) {
        std::cerr << std::setw(8) << std::left << task->getID()
                  << std::setw(9) << std::left << task->getNumberOfParents()
                  << std::setw(11) << std::left << task->getNumberOfChildren()
                  << std::setw(15) << std::left << task->getInputFiles().size()
                  << std::setw(17) << std::left << task->getOutputFiles().size() << std::endl;
    }

    std::cerr << "\ntasks configuration" << std::endl;
    std::cerr << "-------------------" << std::endl;
    std::cerr << std::setw(15) << std::left << "computation: " << some_task->getFlops() << std::endl;
    std::cerr << std::setw(15) << std::left << "final task computation: " << (some_task->getFlops() / 12) << std::endl;
    std::cerr << std::setw(15) << std::left << "max cores: " << some_task->getMaxNumCores() << std::endl;
    std::cerr << std::setw(15) << std::left << "memory usage: " << some_task->getMemoryRequirement() << std::endl;

    auto some_file = *(some_task->getInputFiles().begin());

    std::cerr << "\nfile configuration" << std::endl;
    std::cerr << "------------------" << std::endl;
    std::cerr << "size: " << some_file->getSize() << std::endl;

    std::cerr << "\n****************************************\n" << std::endl;
    #endif

   const std::string REMOTE_STORAGE_HOST("storage_db.edu");
   const std::string WMS_HOST("my_lab_computer.edu");
   const std::string COMPUTE_HOST("hpc.edu/node_0");

   // create a remote storage service and a storage service on the same host as the compute service
   const double STORAGE_CAPACITY = 10.0 * 1000.0 * 1000.0 * 1000.0 * 1000.0;
   auto remote_storage_service = simulation.add(
            new wrench::SimpleStorageService(REMOTE_STORAGE_HOST, {"/"}));

   ///TODO fix mount point for cluster, need to look into this later.
   // this storage service is pretending to be scratch for the baremetal compute service
   auto bare_metal_storage_service = simulation.add(
           new wrench::SimpleStorageService(COMPUTE_HOST, {})
           );

   std::map<std::string, std::shared_ptr<wrench::StorageService>> storage_services = {
           {REMOTE_STORAGE_HOST, remote_storage_service},
           {COMPUTE_HOST, bare_metal_storage_service}
   };

   // compute service
   std::set<std::string> compute_nodes;

   // compute resources will be all the nodes in the cluster except node_0
   for (auto node = hpc_nodes.begin() + 1; node != hpc_nodes.end(); ++node) {
       compute_nodes.insert((*node)->get_name());
   }

   auto compute_service = simulation.add(
           new wrench::BareMetalComputeService(
                   COMPUTE_HOST,
                   compute_nodes,
                   {},
                   {}
                   )
           );

   // wms
   auto wms = simulation.add(new wrench::ActivityWMS(std::unique_ptr<wrench::ActivityScheduler>(
           new wrench::ActivityScheduler(storage_services)), {compute_service}, {remote_storage_service}, WMS_HOST
           ));

   wms->addWorkflow(&workflow);

   // file registry service
   simulation.add(new wrench::FileRegistryService(REMOTE_STORAGE_HOST));

   // stage input files
   for (auto const &file : workflow.getInputFiles()) {
       simulation.stageFile(file.second, remote_storage_service);
   }

   simulation.launch();

   simulation.getOutput().dumpWorkflowExecutionJSON(&workflow, "workflow_data.json", true);
   //simulation.getOutput().dumpWorkflowGraphJSON(&workflow, "workflow_graph.json");

   return 0;
}
