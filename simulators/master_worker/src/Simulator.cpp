#include <iostream>
#include <fstream>
#include <iomanip>
#include <string>
#include <algorithm>

#include <simgrid/s4u.hpp>
#include <wrench.h>
#include <nlohmann/json.hpp>
#include <pugixml.hpp>
#include <sys/wait.h>

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

class ComputeService;


typedef struct retVals {
    std::vector<std::tuple<std::string, double, double>> w_vect;
    std::vector<std::tuple<double, double, double>> t_vect;
    int t_sched;
    int c_sched;
//    long seed;
} retVals;


double generate_random_double_in_range(std::mt19937 &rng, double min,  double max) {
    std::uniform_real_distribution<double> dist(min, max);


    if (min == max) {
        return min;
    } else {
        return dist(rng);
    }
}

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
    const double                  MB = 1000.0 * 1000.0;
    int                TASK_ID = 1;

    for (auto const &task : task_list) {
        auto current_task = workflow->addTask("Task #"+std::to_string(TASK_ID), std::get<1>(task)*GFLOP, MIN_CORES, MAX_CORES, 0);
        current_task->addInputFile(workflow->addFile("input_" + std::to_string(TASK_ID), std::get<0>(task) * MB));
        current_task->addOutputFile(workflow->addFile("output_" + std::to_string(TASK_ID), std::get<2>(task) * MB));
        TASK_ID++;
    }
}

/**
 * @brief Generates a platform with a single multi-core host
 * @param platform_file_path: path to write the platform file to
 *
 * @throws std::invalid_argument
 */
void generatePlatform(std::string platform_file_path, std::vector<std::tuple<std::string, double, double>> workers = {}) {

    if (platform_file_path.empty()) {
        throw std::invalid_argument("generatePlatform() platform_file_path cannot be empty");
    }

    std::string xml_string = "";

    //if no workers specified, use default.
    if (workers.empty()){
        // Create a the platform file
        xml_string = "<?xml version='1.0'?>\n"
                     "<!DOCTYPE platform SYSTEM \"http://simgrid.gforge.inria.fr/simgrid/simgrid.dtd\">\n"
                     "<platform version=\"4.1\">\n"
                     "   <zone id=\"AS0\" routing=\"Full\">\n"
                     "       <host id=\"coordinator\" speed=\"1000000000000000Gf\" core=\"1000\">\n"
                     "           <prop id=\"ram\" value=\"32GB\"/>\n"
                     "           <disk id=\"large_disk\" read_bw=\"1000000000000TBps\" write_bw=\"1000000000000TBps\">\n"
                     "                            <prop id=\"size\" value=\"5000GiB\"/>\n"
                     "                            <prop id=\"mount\" value=\"/\"/>\n"
                     "           </disk>\n"
                     "       </host>\n"
                     "       <host id=\"worker_zero\" speed=\"500Gf\" core=\"1\">\n"
                     "           <prop id=\"ram\" value=\"32GB\"/>\n"
                     "           <disk id=\"worker_zero_disk\" read_bw=\"50MBps\" write_bw=\"50MBps\">\n"
                     "                            <prop id=\"size\" value=\"5000GiB\"/>\n"
                     "                            <prop id=\"mount\" value=\"/\"/>\n"
                     "           </disk>\n"
                     "       </host>\n"
                     "       <host id=\"worker_one\" speed=\"1000Gf\" core=\"1\">\n"
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
                     "       <link id=\"link\" bandwidth=\"1000MBps\" latency=\"0us\"/>\n"
                     "       <link id=\"link1\" bandwidth=\"10000MBps\" latency=\"0us\"/>\n"
                     "       <link id=\"link2\" bandwidth=\"100000MBps\" latency=\"0us\"/>\n"
                     "       <route src=\"coordinator\" dst=\"worker_zero\">"
                     "           <link_ctn id=\"link\"/>"
                     "       </route>"
                     "       <route src=\"coordinator\" dst=\"worker_one\">"
                     "           <link_ctn id=\"link1\"/>"
                     "       </route>"
                     "       <route src=\"coordinator\" dst=\"worker_two\">"
                     "           <link_ctn id=\"link2\"/>"
                     "       </route>"
                     "   </zone>\n"
                     "</platform>\n";

        FILE *platform_file = fopen(platform_file_path.c_str(), "w");
        fprintf(platform_file, "%s", xml_string.c_str());
        fclose(platform_file);
    } else {
        xml_string = "<?xml version='1.0'?>\n"
                     "<!DOCTYPE platform SYSTEM \"http://simgrid.gforge.inria.fr/simgrid/simgrid.dtd\">\n"
                     "<platform version=\"4.1\">\n"
                     "   <zone id=\"AS0\" routing=\"Full\">\n"
                     "       <host id=\"coordinator\" speed=\"1000000000000000Gf\" core=\"1000\">\n"
                     "           <prop id=\"ram\" value=\"32GB\"/>\n"
                     "           <disk id=\"large_disk\" read_bw=\"1000000000000TBps\" write_bw=\"1000000000000TBps\">\n"
                     "                            <prop id=\"size\" value=\"5000GiB\"/>\n"
                     "                            <prop id=\"mount\" value=\"/\"/>\n"
                     "           </disk>\n"
                     "       </host>\n"
                     "   </zone>\n"
                     "</platform>\n";

        pugi::xml_document xml_doc;

        if (xml_doc.load_string(xml_string.c_str(), pugi::parse_doctype)) {

            pugi::xml_node previous_route;
            ///creating the workers specified by command line arguments.
            ///Currently, only the flops and link speed to coordinator are set.
            for (const auto &worker : workers) {

                pugi::xml_node host = xml_doc.child("platform").child("zone").prepend_child("host");
                host.append_attribute("id") = (std::get<0>(worker)).c_str();
                host.append_attribute("speed") = (std::to_string(std::get<2>(worker))+"Gf").c_str();
                host.append_attribute("core") = "1";
                pugi::xml_node host_prop = host.append_child("prop");
                host_prop.append_attribute("id") = "ram";
                host_prop.append_attribute("value") = "32GB";
                /**
                pugi::xml_node host_disk = host.append_child("disk");
                host_disk.append_attribute("id") = (std::get<0>(worker)+"_disk").c_str();
                host_disk.append_attribute("read_bw") = "50MBps";
                host_disk.append_attribute("write_bw") = "50MBps";
                pugi::xml_node host_disk_prop = host_disk.append_child("prop");
                host_disk_prop.append_attribute("id") = "size";
                host_disk_prop.append_attribute("value") = "5000GiB";
                pugi::xml_node host_disk_prop2 = host_disk.append_child("prop");
                host_disk_prop2.append_attribute("id") = "mount";
                host_disk_prop2.append_attribute("value") = "/";
                */

                pugi::xml_node route = xml_doc.child("platform").child("zone").append_child("route");
                route.append_attribute("src") = "coordinator";
                route.append_attribute("dst") = (std::get<0>(worker)).c_str();
                pugi::xml_node route_link = route.append_child("link_ctn");
                route_link.append_attribute("id") = ("link_"+std::get<0>(worker)).c_str();

                if (previous_route == nullptr) {
                    previous_route = route;
                }

                pugi::xml_node link = xml_doc.child("platform").child("zone").insert_child_before("link", previous_route);
                link.append_attribute("id") = ("link_"+std::get<0>(worker)).c_str();
                link.append_attribute("bandwidth") = (std::to_string(std::get<1>(worker)/0.97)+"MBps").c_str();
                link.append_attribute("latency") = "0us";



                xml_doc.save_file(platform_file_path.c_str());
            }
        } else {
            throw std::runtime_error("something went wrong with parsing xml string");
        }
    }
}

retVals parse_arguments_for_individual_run(int argc, char** argv, std::mt19937 &rng) {

    const int MAX_NUM_WORKERS = 50;
    const int MAX_NUM_TASKS = 100;
    const int MAX_TASK_INPUT = 1000000;
    const int MAX_TASK_OUTPUT = 1000000;
    const double MAX_TASK_FLOP = 1000000;
    const double MAX_WORKER_FLOP = 1000000;
    const double MAX_WORKER_BANDWIDTH = 1000000;

    int task_scheduling_selection = 0;
    bool task_scheduling_flag = false;
    int compute_scheduling_selection = 0;
    bool compute_scheduling_flag = false;
    bool worker_specification_flag = false;
    int flags_removed = 0;
    long seed = 0;
    int num_invocation = 1;

    std::vector<std::tuple<double, double, double>> tasks;
    std::vector<std::tuple<std::string, double, double>> workers;

    auto arguments = std::vector<std::string>(argv, argv+argc);
    try {
        if (argc < 5) {
            std::cerr << "Arguments too short" << std::endl;
            throw std::invalid_argument("bad args");
        }
        int inc = 0;
        while (inc < argc) {
            if (std::string(argv[inc]).compare("individual") == 0) {
                arguments.erase(arguments.begin() + inc - (flags_removed),
                                arguments.begin() + inc + 1 - (flags_removed));
                flags_removed += 1;
            } else if (std::string(argv[inc]).compare("--ts") == 0) {
                if (std::stof(std::string(argv[inc + 1])) < 0 || std::stof(std::string(argv[inc + 1])) > 6) {
                    std::cerr << "invalid task_scheduling_selection" << std::endl;
                    throw std::invalid_argument("invalid task_scheduling_selection");
                }

                task_scheduling_selection = std::stof(std::string(argv[inc + 1]));
                task_scheduling_flag = true;

                arguments.erase(arguments.begin() + inc - (flags_removed),
                                arguments.begin() + inc + 2 - (flags_removed));
                flags_removed += 2;
            } else if (std::string(argv[inc]).compare("--cs") == 0) {
                if (std::stof(std::string(argv[inc + 1])) < 0 || std::stof(std::string(argv[inc + 1])) > 4) {
                    std::cerr << "invalid compute_scheduling_selection" << std::endl;
                    throw std::invalid_argument("invalid compute_scheduling_selection");
                }

                compute_scheduling_selection = std::stof(std::string(argv[inc + 1]));
                compute_scheduling_flag = true;

                arguments.erase(arguments.begin() + inc - (flags_removed),
                                arguments.begin() + inc + 2 - (flags_removed));
                flags_removed += 2;
                ++inc;
            } else if (std::string(argv[inc]).compare("--worker") == 0) {
                worker_specification_flag = true;
                workers.push_back(std::make_tuple(std::string(argv[inc + 1]),
                                                  std::stof(std::string(argv[inc + 2])),
                                                  std::stof(std::string(argv[inc + 3]))));
                arguments.erase(arguments.begin() + inc - (flags_removed),
                                arguments.begin() + inc + 4 - (flags_removed));
                flags_removed += 4;
                inc += 3;
            } else if (std::string(argv[inc]).compare("--inv") == 0) {
                num_invocation = stoi(std::string(argv[inc + 1]));
                arguments.erase(arguments.begin() + inc - (flags_removed),
                                arguments.begin() + inc + 2 - (flags_removed));
                flags_removed += 2;
                ++inc;
            } else if (std::string(argv[inc]).compare("--seed") == 0) {
                seed = stol(std::string(argv[inc + 1]));
                arguments.erase(arguments.begin() + inc - (flags_removed),
                                arguments.begin() + inc + 2 - (flags_removed));
                flags_removed += 2;
                ++inc;
            } else if (std::string(argv[inc]).rfind("--log", 0) == 0) {
                arguments.erase(arguments.begin() + inc - (flags_removed),
                                arguments.begin() + inc + 1 - (flags_removed));
                flags_removed += 1;
            }
            ++inc;
        }


        if ((argc - 1 - (flags_removed)) % 3 != 0) {
            std::cerr << "Missing task specifications. Each task must have an input, flops and output specified."
                      << std::endl;
            throw std::invalid_argument(
                    "Missing task specifications. Each task must have an input, flops and output specified.");
        }


        if ((argc - 1 - (flags_removed)) / 3 > MAX_NUM_TASKS) {
            std::cerr << "Too many file sizes specified (maximum " << std::to_string(MAX_NUM_TASKS) << " )."
                      << std::endl;
            throw std::invalid_argument("invalid number of files");
        }


        for (int i = 1; i < (argc - (flags_removed)); i += 3) {
            double input = std::stof(std::string(arguments[i]));
            double flops = std::stof(std::string(arguments[i + 1]));
            double output = std::stof(std::string(arguments[i + 2]));

            if ((input < 1) || (input > MAX_TASK_INPUT)) {
                std::cerr << "Invalid task input. Enter a task input size in the range [1, " +
                             std::to_string(MAX_TASK_INPUT) +
                             "] MB" << std::endl;
                throw std::invalid_argument("invalid task input");
            } else if ((flops < 1) || (flops > MAX_TASK_FLOP)) {
                std::cerr << "Invalid task flop. Enter task flop in the range [1, " +
                             std::to_string(MAX_TASK_FLOP) +
                             "] flops" << std::endl;
                throw std::invalid_argument("invalid task flop");
            } else if ((output < 0) || (output > MAX_TASK_OUTPUT)) {
                std::cerr << "Invalid task output. Enter a task output size in the range [0, " +
                             std::to_string(MAX_TASK_OUTPUT) +
                             "] MB" << std::endl;
                throw std::invalid_argument("invalid task output");
            } else {
                tasks.push_back(std::make_tuple(input, flops, output));
            }
        }

    } catch (std::invalid_argument &e) {
        std::cerr << "Usage: " << std::string(argv[0])
                  << " [individual][optional flags]* <task input> <task Gflop> <task output> [<task input> <task Gflop> <task output>]*"
                  << std::endl;
        std::cerr << "    flags: " << std::endl;
        std::cerr
                << "          '--worker' used to specify a worker to be added to simulation. Accompanied by three arguments, [<flag> <id> <link bandwidth> <flops>] "
                << std::endl;
        std::cerr << "          '--ts' used to specify task scheduling behavior. [<flag> <selection>]" << std::endl;
        std::cerr << "               0: Random" << std::endl;
        std::cerr << "               1: Highest Flop First" << std::endl;
        std::cerr << "               2: Lowest Flop First" << std::endl;
        std::cerr << "               3: Highest Bytes First" << std::endl;
        std::cerr << "               4: Lowest Bytes First" << std::endl;
        std::cerr << "               5: Highest Flops/Bytes First" << std::endl;
        std::cerr << "               6: Lowest Flops/Bytes First" << std::endl;
        std::cerr << "          '--cs' used to specify worker scheduling behavior. [<flag> <selection>]"
                  << std::endl;
        std::cerr << "               0: Random" << std::endl;
        std::cerr << "               1: Faster Worker(Flops) First" << std::endl;
        std::cerr << "               2: Best Connected Worker(Bandwidth) First" << std::endl;
        std::cerr << "               3: Largest Compute Time/IO Time Ratio First" << std::endl;
        std::cerr << "               4: Earliest Completion (Estimate) First" << std::endl;
        std::cerr << "          '--seed' used to specify seed if random scheduling is used. [<flag> <seed>]"
                  << std::endl;
        std::cerr <<
                  "    task input: the amount of data that must be sent from coordinator to worker to begin task in range of [1, " +
                  std::to_string(MAX_TASK_INPUT) + "] MB" << std::endl;
        std::cerr << "    task flops: the required amount of processing needed for the task [1, " +
                     std::to_string(MAX_TASK_FLOP) + "] flop" << std::endl;
        std::cerr <<
                  "    task output: the amount of data that must be sent back from worker to coordinator after completion in range of [1, " +
                  std::to_string(MAX_TASK_OUTPUT) + "] MB" << std::endl;
        std::cerr << "    (at most " + std::to_string(MAX_NUM_TASKS) + " tasks can be specified)" << std::endl;
    }

    rng.seed(seed);

    return retVals {workers, tasks, task_scheduling_selection, compute_scheduling_selection};
}


retVals parse_argument_for_generated_run(int argc, char** argv, std::mt19937 &rng, int xp_id) {
    const int MAX_NUM_WORKERS = 50;
    const int MAX_NUM_TASKS = 100;
    const int MAX_TASK_INPUT = 1000000;
    const int MAX_TASK_OUTPUT = 1000000;
    const double MAX_TASK_FLOP = 1000000;
    const double MAX_WORKER_FLOP = 1000000;
    const double MAX_WORKER_BANDWIDTH = 1000000;

    int task_scheduling_selection = 0;
    bool task_scheduling_flag = false;
    int compute_scheduling_selection = 0;
    bool compute_scheduling_flag = false;
    bool worker_specification_flag = false;
    int flags_removed = 0;
    long seed = 0;
    int num_invocation = 1;

    bool generated_tasks_and_workers = false;
    double min_flops = 1;
    double max_flops = 1;
    double min_band = 1;
    double max_band = 1;
    double min_input = 0;
    double max_input = 0;
    double min_flop = 1;
    double max_flop = 1;
    double min_output = 0;
    double max_output = 0;
    int num_workers = 1;
    int num_tasks = 1;

    std::vector<std::tuple<double, double, double>> tasks;
    std::vector<std::tuple<std::string, double, double>> workers;

    auto arguments = std::vector<std::string>(argv, argv+argc);
    generated_tasks_and_workers = true;
    try {
        if (argc < 13) {
            std::cerr << "Arguments too short" << std::endl;
            throw std::invalid_argument("bad args");
        }
        int inc = 0;
        while (inc < argc) {
            if (std::string(argv[inc]).compare("--ts") == 0) {
                if (std::stof(std::string(argv[inc + 1])) < 0 || std::stof(std::string(argv[inc + 1])) > 6) {
                    std::cerr << "invalid task_scheduling_selection" << std::endl;
                    throw std::invalid_argument("invalid task_scheduling_selection");
                }

                task_scheduling_selection = std::stof(std::string(argv[inc + 1]));
                task_scheduling_flag = true;

                arguments.erase(arguments.begin() + inc - (flags_removed),
                                arguments.begin() + inc + 2 - (flags_removed));
                flags_removed += 2;
            } else if (std::string(argv[inc]).compare("--cs") == 0) {
                if (std::stof(std::string(argv[inc + 1])) < 0 || std::stof(std::string(argv[inc + 1])) > 4) {
                    std::cerr << "invalid compute_scheduling_selection" << std::endl;
                    throw std::invalid_argument("invalid compute_scheduling_selection");
                }

                compute_scheduling_selection = std::stof(std::string(argv[inc + 1]));
                compute_scheduling_flag = true;

                arguments.erase(arguments.begin() + inc - (flags_removed),
                                arguments.begin() + inc + 2 - (flags_removed));
                flags_removed += 2;
                ++inc;
            } else if (std::string(argv[inc]).compare("--generate") == 0) {
                if (std::stof(std::string(argv[inc + 1])) < 0
                    || std::stof(std::string(argv[inc + 1])) > MAX_NUM_WORKERS
                    || std::stof(std::string(argv[inc + 2])) < 1
                    || std::stof(std::string(argv[inc + 2])) > std::stof(std::string(argv[inc + 3]))
                    || std::stof(std::string(argv[inc + 3])) > MAX_WORKER_FLOP
                    || std::stof(std::string(argv[inc + 4])) < 1
                    || std::stof(std::string(argv[inc + 4])) > std::stof(std::string(argv[inc + 5]))
                    || std::stof(std::string(argv[inc + 5])) > MAX_WORKER_BANDWIDTH
                    || std::stof(std::string(argv[inc + 6])) > MAX_NUM_TASKS
                    || std::stof(std::string(argv[inc + 7])) < 0
                    || std::stof(std::string(argv[inc + 7])) > std::stof(std::string(argv[inc + 8]))
                    || std::stof(std::string(argv[inc + 8])) > MAX_TASK_INPUT
                    || std::stof(std::string(argv[inc + 9])) < 1
                    || std::stof(std::string(argv[inc + 9])) > std::stof(std::string(argv[inc + 10]))
                    || std::stof(std::string(argv[inc + 10])) > MAX_TASK_FLOP
                    || std::stof(std::string(argv[inc + 11])) < 0
                    || std::stof(std::string(argv[inc + 11])) > std::stof(std::string(argv[inc + 12]))
                    || std::stof(std::string(argv[inc + 12])) > MAX_TASK_OUTPUT) {
                    std::cerr << "invalid task or worker specifications" << std::endl;
                    throw std::invalid_argument("invalid generation parameters");
                }
                worker_specification_flag = true;
                num_workers = std::stoi(std::string(argv[inc + 1]));
                min_flops = std::stod(std::string(argv[inc + 2]));
                max_flops = std::stod(std::string(argv[inc + 3]));
                min_band = std::stod(std::string(argv[inc + 4]));
                max_band = std::stod(std::string(argv[inc + 5]));
                num_tasks = std::stoi(std::string(argv[inc + 6]));
                min_input = std::stod(std::string(argv[inc + 7]));
                max_input = std::stod(std::string(argv[inc + 8]));
                min_flop = std::stod(std::string(argv[inc + 9]));
                max_flop = std::stod(std::string(argv[inc + 10]));
                min_output = std::stod(std::string(argv[inc + 11]));
                max_output = std::stod(std::string(argv[inc + 12]));

                arguments.erase(arguments.begin() + inc - (flags_removed),
                                arguments.begin() + inc + 13 - (flags_removed));
                flags_removed += 13;
                inc += 12;
            } else if (std::string(argv[inc]).compare("--inv") == 0) {
                num_invocation = stoi(std::string(argv[inc + 1]));
                arguments.erase(arguments.begin() + inc - (flags_removed),
                                arguments.begin() + inc + 2 - (flags_removed));
                flags_removed += 2;
                ++inc;
            } else if (std::string(argv[inc]).compare("--seed") == 0) {
                seed = stol(std::string(argv[inc + 1]));
                arguments.erase(arguments.begin() + inc - (flags_removed),
                                arguments.begin() + inc + 2 - (flags_removed));
                flags_removed += 2;
                ++inc;
            }
            ++inc;
        }

    } catch (std::invalid_argument &e) {
        std::cerr << "Usage: " << std::string(argv[0])
                  << " [--generate][optional flags]* [(if not using generated tasks)<task input> <task flops> <task output>]*"
                  << std::endl;
        std::cerr << "    flags: " << std::endl;
        std::cerr << "          '--generate' used to have workers and tasks randomly generated within parameters."
                  << std::endl;
        std::cerr << "              [<num_workers> <min_flops> <max_flops> <min_bandwidth> <max_bandwidth> "
                  << std::endl;
        std::cerr << "               <num_tasks> <min_input> <max_input> <min_Gflop> <max_Gflop> <min_output> <max_output>]"
                  << std::endl;
        std::cerr << "          '--ts' used to specify task scheduling behavior. [<flag> <selection>]" << std::endl;
        std::cerr << "               0: Random" << std::endl;
        std::cerr << "               1: Highest Flop First" << std::endl;
        std::cerr << "               2: Lowest Flop First" << std::endl;
        std::cerr << "               3: Highest Bytes First" << std::endl;
        std::cerr << "               4: Lowest Bytes First" << std::endl;
        std::cerr << "               5: Highest Flops/Bytes First" << std::endl;
        std::cerr << "               6: Lowest Flops/Bytes First" << std::endl;
        std::cerr << "          '--cs' used to specify worker scheduling behavior. [<flag> <selection>]"
                  << std::endl;
        std::cerr << "               0: Random" << std::endl;
        std::cerr << "               1: Faster Worker(Flops) First" << std::endl;
        std::cerr << "               2: Best Connected Worker(Bandwidth) First" << std::endl;
        std::cerr << "               3: Largest Compute Time/IO Time Ratio First" << std::endl;
        std::cerr << "               4: Earliest Completion (Estimate) First" << std::endl;
        std::cerr << "          '--seed' used to specify seed for random generation and scheduling [<flag> <seed>]"
                  << std::endl;
        std::cerr
                << "          '--inv' used to indicate the number of invocations of the simulation. [<flag> <int>]"
                << std::endl;
    }

    rng.seed(seed + xp_id);

    for (int i=0; i<num_workers; i++) {

        workers.push_back(std::make_tuple("worker_"+std::to_string(i),
                                          generate_random_double_in_range(rng, min_band, max_band),
                                          generate_random_double_in_range(rng, min_flops, max_flops)));
    }
    for (int i=0; i<num_tasks; i++) {
        tasks.push_back(std::make_tuple(
                generate_random_double_in_range(rng, min_input, max_input),
                generate_random_double_in_range(rng, min_flop, max_flop),
                generate_random_double_in_range(rng, min_output, max_output)));
    }




//    return retVals {workers, tasks, task_scheduling_selection, compute_scheduling_selection, seed};
    return retVals {workers, tasks, task_scheduling_selection, compute_scheduling_selection};
}


std::string run_simulation(std::vector<std::tuple<std::string, double, double>> workers,
                           std::vector<std::tuple<double, double, double>> tasks,
                           int task_scheduling_selection,
                           int compute_scheduling_selection,
                           std::mt19937 &rng,
                           int argc,
                           char** argv,
                           bool single = false) {
    wrench::TerminalOutput::setThisProcessLoggingColor(wrench::TerminalOutput::Color::COLOR_BLUE);
    wrench::Simulation simulation;
    simulation.init(&argc, argv);

    wrench::Workflow workflow;
    generateWorkflow(&workflow, tasks);

    // read and instantiate the platform with the desired HPC specifications
    std::string platform_file_path = "/tmp/platform_";
    platform_file_path.append(std::to_string(getpid()));
    platform_file_path.append(".xml");
    generatePlatform(platform_file_path, workers);
    simulation.instantiatePlatform(platform_file_path);

    const std::string MASTER("coordinator");
    const std::string WORKER_ZERO("worker_zero");
    const std::string WORKER_ONE("worker_one");
    const std::string WORKER_TWO("worker_two");

    std::set<std::shared_ptr<wrench::StorageService>> storage_services;
    auto master_storage_service = simulation.add(new wrench::SimpleStorageService(MASTER, {"/"}, {{wrench::SimpleStorageServiceProperty::BUFFER_SIZE,  "infinity"}}, {}));
    storage_services.insert(master_storage_service);

    std::set<std::shared_ptr<wrench::ComputeService>> compute_services;
    std::map<std::string, double> link_speed;

    if(!workers.empty()) {
        for (const auto &worker : workers) {
            auto new_compute_service = simulation.add(
                    new wrench::BareMetalComputeService(
                            std::get<0>(worker),
                            {{std::get<0>(worker), std::make_tuple(1, wrench::ComputeService::ALL_RAM)}},
                            "",
                            {
                                    {wrench::BareMetalComputeServiceProperty::TASK_STARTUP_OVERHEAD, "0"},
                            },
                            {}
                    )
            );
            compute_services.insert(new_compute_service);
            link_speed[std::get<0>(worker)] = std::get<1>(worker);
        }
    } else {
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
        compute_services.insert({compute_service_zero, compute_service_one, compute_service_two});
        link_speed[WORKER_ZERO] = 1000;
        link_speed[WORKER_ONE] = 10000;
        link_speed[WORKER_TWO] = 100000;
    }


    // file registry service on storage_db_edu
    simulation.add(new wrench::FileRegistryService(MASTER));

    // stage the input files
    for (auto file : workflow.getInputFiles()) {
        simulation.stageFile(file, master_storage_service);
    }

    auto wms = simulation.add(new wrench::ActivityWMS(std::unique_ptr<wrench::ActivityScheduler>(
            new wrench::ActivityScheduler(master_storage_service, link_speed, rng, task_scheduling_selection, compute_scheduling_selection)),
                                                      compute_services,
                                                      storage_services,
                                                      MASTER
    ));

    wms->addWorkflow(&workflow);
    simulation.launch();
    if (single) {
        simulation.getOutput().dumpUnifiedJSON(&workflow, "/tmp/workflow_data.json", false, true, false, false, false);
    }

    auto task_termination_timestamps = simulation.getOutput().getTrace<wrench::SimulationTimestampTaskCompletion>();
    if(!task_termination_timestamps.empty()) {
        auto last_task = task_termination_timestamps.back()->getContent()->getDate();
        return std::to_string(last_task);
    }
    return std::string(" ");
}

/**
 *
 * @param argc
 * @param argv
 * @return
 */
int main(int argc, char** argv) {

    //Mersenne Twister: Good quality random number generator
    std::mt19937 rng;

    if (std::string(argv[1]).compare("individual") == 0) {
        try {
            rng.seed(std::random_device{}());
            auto [workers, tasks, t_sched, c_sched] = parse_arguments_for_individual_run(argc, argv, rng);
            auto output = run_simulation(workers, tasks, t_sched, c_sched, rng, argc, argv, true);
        } catch (std::invalid_argument &e) {
            return 1;
        }
    } else {
        int num_invocation = 1;
        long seed = 0;
        int inc = 0;
        while (inc < argc) {
            if (std::string(argv[inc]).compare("--inv") == 0) {
                num_invocation = stoi(std::string(argv[inc + 1]));
                ++inc;
            } else if (std::string(argv[inc]).compare("--seed") == 0) {
                seed = stol(std::string(argv[inc + 1]));
                ++inc;
            }
            ++inc;
        }
        int pipes[num_invocation][2];
        pid_t pid[num_invocation];
        char runtimes[num_invocation][100];
        for (int i = 0; i < num_invocation; i++) {
            if (pipe(pipes[i]) != 0) {
                printf("Could not create new pipe %d\n", i);
                exit(1);
            }
            if ((pid[i] = fork()) == -1) {
                printf("Could not fork() new process %d\n", i);
                exit(1);
            } else if (pid[i] == 0) { // Child
                // Initialize with deterministic seed!
                close(pipes[i][0]);
                auto [workers, tasks, t_sched, c_sched] = parse_argument_for_generated_run(argc, argv, rng, i);
                auto last_task_string = run_simulation(workers, tasks, t_sched, c_sched, rng, argc, argv);
//                std::cerr << i << " : " << last_task_string << "\n";
                write(pipes[i][1], last_task_string.c_str(), strlen(last_task_string.c_str())+1);
                close(pipes[i][1]);
                exit(0);
            }
            wait(NULL);
        }
        for(int i=0; i<num_invocation; i++) {
            close(pipes[i][1]);
            read(pipes[i][0], &runtimes[i], 100);
            close(pipes[i][0]);
        }
        std::vector<double> results;
        double result = 0;
        for(int i=0; i<num_invocation; i++) {
            string str(runtimes[i]);
            results.push_back(std::stod(str));
            result+=std::stod(str);
        }
        result = result/num_invocation;

        std::cout << "----------------------------------------" << std::endl;
        std::cout.precision(4);
        printf("Minimum Execution Time: %.2lf sec\n", *min_element(results.begin(), results.end()));
        printf("Mean Execution Time:    %.2lf sec\n", result);
        printf("Maximum Execution Time: %.2lf sec\n", *max_element(results.begin(), results.end()));
//        std::cout << "Minimum Execution Time: " << std::to_string(*min_element(results.begin(), results.end())).c_str() << " seconds\n";
//        std::cout << "Mean Execution Time: " << std::to_string(result).c_str() << " seconds\n";
//        std::cout << "Maximum Execution Time: " << std::to_string(*max_element(results.begin(), results.end())).c_str() << " seconds\n";
        std::cout << "----------------------------------------" << std::endl;
    }
    return 0;
}





/**

    if(num_invocation>1) {
        int pipes[num_invocation][2];
        pid_t pid[num_invocation];
        char runtimes[num_invocation][100];
        for(int i=0; i<num_invocation; i++) {
            if (pipe(pipes[i]) != 0) {
                printf("Could not create new pipe %d", i);
                exit(1);
            }
            if ((pid[i] = fork()) == -1) {
                printf("Could not fork() new process %d\n", i);
                exit(1);
            } else if (pid[i] == 0) {
                close(pipes[i][0]);
                auto wms = simulation.add(new wrench::ActivityWMS(std::unique_ptr<wrench::ActivityScheduler>(
                        new wrench::ActivityScheduler(master_storage_service, link_speed, task_scheduling_selection, compute_scheduling_selection, seed+i)),
                                                                  compute_services,
                                                                  storage_services,
                                                                  MASTER
                ));

                wms->addWorkflow(&workflow);
                simulation.launch();
                auto task_termination_timestamps = simulation.getOutput().getTrace<wrench::SimulationTimestampTaskCompletion>();
                if(!task_termination_timestamps.empty()) {
                    auto last_task = task_termination_timestamps.back()->getContent()->getDate();
                    auto last_task_string = std::to_string(last_task).c_str();
                    //printf("Time: %s\n", last_task_string);
                    write(pipes[i][1], last_task_string, strlen(last_task_string)+1);
                }
                close(pipes[i][1]);
                exit(0);
            }
        }
        wait(NULL);
        for(int i=0; i<num_invocation; i++) {
            close(pipes[i][1]);
            read(pipes[i][0], &runtimes[i], 100);
            close(pipes[i][0]);
        }
        std::vector<double> results;
        double result = 0;
        for(int i=0; i<num_invocation; i++) {
            string str(runtimes[i]);
            results.push_back(std::stod(str));
            result+=std::stod(str);
        }
        result = result/num_invocation;

        std::cout << "----------------------------------------" << std::endl;
        std::cout.precision(4);
        std::cout << "Minimum Execution Time: " << std::to_string(*min_element(results.begin(), results.end())).c_str()
                  << " seconds\n";
        std::cout << "Mean Execution Time: " << std::to_string(result).c_str()
                  << " seconds\n";
        std::cout << "Maximum Execution Time: " << std::to_string(*max_element(results.begin(), results.end())).c_str()
                  << " seconds\n";
        std::cout << "----------------------------------------" << std::endl;
    } else {
        auto wms = simulation.add(new wrench::ActivityWMS(std::unique_ptr<wrench::ActivityScheduler>(
                new wrench::ActivityScheduler(master_storage_service, link_speed, task_scheduling_selection, compute_scheduling_selection, seed)),
                                                          compute_services,
                                                          storage_services,
                                                          MASTER
        ));

        wms->addWorkflow(&workflow);
        simulation.launch();
        simulation.getOutput().dumpUnifiedJSON(&workflow, "/tmp/workflow_data.json", false, true, false, false, false);
    }

    return 0;
}
*/

