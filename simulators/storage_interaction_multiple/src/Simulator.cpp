#include <iostream>
#include <random>
#include <string>
#include <algorithm>

#include <simgrid/s4u.hpp>
#include <wrench.h>
#include <nlohmann/json.hpp>
#include <pugixml.hpp>

#include "ActivityWMS.h"

/**
 * @brief Generates a platform with a single multi-core host
 * @param platform_file_path: path to write the platform file to
 *
 * @throws std::invalid_argumemnt
 */
void generatePlatform(std::string platform_file_path, int num_servers, int link_bandwidth[], int chosen_server,
                      bool use_nps) {
    if (platform_file_path.empty()) {
        throw std::invalid_argument("generatePlatform() platform_file_path cannot be empty");
    }
    if (!use_nps) {
        if (chosen_server < 1 || chosen_server > 5) {
            throw std::invalid_argument("invalid choice of server storage");
        }
    }

    // Create the platform file
    std::string xml_string = "<?xml version='1.0'?>\n"
                             "<!DOCTYPE platform SYSTEM \"http://simgrid.gforge.inria.fr/simgrid/simgrid.dtd\">\n"
                             "<platform version=\"4.1\">\n"
                             "   <zone id=\"AS0\" routing=\"Full\">\n"
                             "       <host id=\"ServicesHost\" speed=\"100Gf\" core=\"16\">\n"
                             "       </host>\n"
                             "       <host id=\"ClientHost\" speed=\"100f\" core=\"16\">\n"
                             "           <disk id=\"hard_disk\" read_bw=\"100000TBps\" write_bw=\"100000TBps\">\n"
                             "                            <prop id=\"size\" value=\"5000GiB\"/>\n"
                             "                            <prop id=\"mount\" value=\"/\"/>\n"
                             "           </disk>\n"
                             "       </host>\n";

    for (int i = 1; i <= num_servers; ++i) {
        if (!use_nps && i == chosen_server) {
            xml_string += "       <host id=\"ChosenServerHost\" speed=\"100Gf\" core=\"16\">\n";
        } else {
            xml_string += "       <host id=\"ServerHost_" + std::to_string(i) + "\" speed=\"100Gf\" core=\"16\">\n";
        }

        xml_string += "           <prop id=\"ram\" value=\"32GB\"/>\n"
                      "           <disk id=\"large_disk\" read_bw=\"50MBps\" write_bw=\"50MBps\">\n"
                      "                            <prop id=\"size\" value=\"5000GiB\"/>\n"
                      "                            <prop id=\"mount\" value=\"/\"/>\n"
                      "           </disk>\n"
                      "       </host>\n";
        xml_string += "       <link id=\"network_link_" + std::to_string(i) + "\" bandwidth=\"" +
                      std::to_string(link_bandwidth[i - 1]) + "MBps\" latency=\"20us\"/>\n";
    }

    xml_string += "       <link id=\"servers_link\" bandwidth=\"100MBps\" latency=\"1us\"/>"
                  "       <link id=\"client_link\" bandwidth=\"20MBps\" latency=\"20us\"/>\n"
                  "       <route src=\"ServicesHost\" dst=\"ClientHost\">"
                  "           <link_ctn id=\"client_link\"/>"
                  "       </route>\n";

    for (int i = 1; i <= num_servers; ++i) {
        // client to server route
        if (!use_nps && i == chosen_server) {
            xml_string += "       <route src=\"ClientHost\" dst=\"ChosenServerHost\">";
        } else {
            xml_string += "       <route src=\"ClientHost\" dst=\"ServerHost_" + std::to_string(i) + "\">";
        }
        xml_string += "           <link_ctn id=\"network_link_" + std::to_string(i) + "\"/>\n</route>\n";

        // services to server route
        if (!use_nps && i == chosen_server) {
            xml_string += "       <route src=\"ServicesHost\" dst=\"ChosenServerHost\">";
        } else {
            xml_string += "       <route src=\"ServicesHost\" dst=\"ServerHost_" + std::to_string(i) + "\">";
        }
        xml_string += "           <link_ctn id=\"servers_link\"/>\n</route>\n";

        // server to server routes
        for (int j = i + 1; j <= num_servers; ++j) {
            if (!use_nps && (i == chosen_server || j == chosen_server)) {
                xml_string +=
                        "       <route src=\"ChosenServerHost\" dst=\"ServerHost_" +
                        std::to_string(i == chosen_server ? j : i) + "\">";
            } else {
                xml_string += "       <route src=\"ServerHost_" + std::to_string(i) + "\" dst=\"ServerHost_" +
                              std::to_string(j) + "\">";
            }
            xml_string += "           <link_ctn id=\"servers_link\"/>\n</route>\n";
        }
    }

    xml_string += "   </zone>\n"
                  "</platform>\n";

    pugi::xml_document xml_doc;

    if (xml_doc.load_string(xml_string.c_str(), pugi::parse_doctype)) {
        xml_doc.save_file(platform_file_path.c_str());
        //xml_doc.save(std::cerr);
    } else {
        throw std::runtime_error("something went wrong with parsing xml string");
    }
}

/**
 *
 * @param argc
 * @param argvx
 * @return
 */
int main(int argc, char **argv) {
    wrench::Simulation simulation;
    simulation.init(&argc, argv);

    bool USE_NPS;
    bool USE_VIVALDI;
    std::string NPS_TYPE = "ALLTOALL";
    int FILE_SIZE = 10000000;
    int NUM_SERVER;
    int SERVER_TO_DOWNLOAD = 0;
    int SERVER_LINK_BANDWIDTH[5];
    std::vector<std::string> HOST_LIST;

    //server names
    const std::string CLIENT("ClientHost");
    const std::string SERVICES("ServicesHost");
    std::string SERVER("ServerHost_");

    //setting up random number generator
    std::random_device rd;
    std::mt19937 gen(rd());
    std::uniform_real_distribution<> dis(1,50);

    try {
        USE_NPS = char(tolower(*argv[1])) == 't';

        NUM_SERVER = std::stoi(std::string(argv[2]));
        if (NUM_SERVER < 1 || NUM_SERVER > 5) {
            std::cerr << "Invalid number of storage services. Number must be between one and 5"
                      << std::endl;
            throw std::invalid_argument("invalid number of storage services");
        }

        if (!USE_NPS) {
            SERVER_TO_DOWNLOAD = std::stoi(std::string(argv[3]));
            if (SERVER_TO_DOWNLOAD < 1 || SERVER_TO_DOWNLOAD > NUM_SERVER) {
                std::cerr
                        << "Pick a valid storage service. Number must be between one and " + std::to_string(NUM_SERVER)
                        << std::endl;
                throw std::invalid_argument("invalid storage service chosen");
            }

            if (argc != NUM_SERVER + 4) {
                throw std::invalid_argument("invalid number of arguments");
            }

            for (int i = 0; i < NUM_SERVER; ++i) {
                SERVER_LINK_BANDWIDTH[i] = std::stoi(std::string(argv[i + 4]));
                if (SERVER_LINK_BANDWIDTH[i] < 1 || SERVER_LINK_BANDWIDTH[i] > 1000000) {
                    std::cerr
                            << "Invalid server1 link bandwidth. bandwidth must be in range [1,1000000] MBps"
                            << std::endl;
                    throw std::invalid_argument("invalid server1 link bandwidth");
                }
            }
        } else {
            if (argc != 4) {
                throw std::invalid_argument("invalid number of arguments");
            }

            USE_VIVALDI = char(tolower(*argv[3])) == 't';

            for (int i = 1; i <= NUM_SERVER; ++i) {
                SERVER_LINK_BANDWIDTH[i - 1] = dis(gen);
                HOST_LIST.push_back("ServerHost_" + std::to_string(i));
            }
        }
    } catch (std::invalid_argument &e) {
        std::cerr << e.what() << std::endl;
        std::cerr << "Usage: " << argv[0]
                  << "<use_nps? t or f>  <number_of_servers> <use_vivaldi? t or f>"
                     "<server_to_download_from> "
                     "<server_1_bandwidth> <server_2_bandwidth> <server_3_bandwidth> <server_4_bandwidth> <server_5_bandwidth>"
                  << std::endl;
        std::cerr << "   server_link_bandwidth: Bandwidth must be in range [1,1000000] MBps" << std::endl;
        std::cerr << "" << std::endl;
        return 1;
    }

    // create workflow
    wrench::Workflow workflow;
    workflow.addFile("file_copy", FILE_SIZE);


    // read and instantiate the platform with the desired HPC specifications
    std::string platform_file_path = "/tmp/platform.xml";
    generatePlatform(platform_file_path, NUM_SERVER, SERVER_LINK_BANDWIDTH, SERVER_TO_DOWNLOAD, USE_NPS);
    simulation.instantiatePlatform(platform_file_path);

    std::set<std::shared_ptr<wrench::StorageService>> storage_services;

    //instantiate storage services
    auto client_storage_service = simulation.add(new wrench::SimpleStorageService(
            CLIENT, {"/"},
            {{wrench::SimpleStorageServiceProperty::BUFFER_SIZE, "50000000"}}));
    storage_services.insert(client_storage_service);

    for (int i = 1; i <= NUM_SERVER; ++i) {
        SERVER = (i != SERVER_TO_DOWNLOAD) ? ("ServerHost_" + std::to_string(i)) : "ChosenServerHost";
        auto server_storage_service = simulation.add(new wrench::SimpleStorageService(
                SERVER, {"/"},
                {{wrench::SimpleStorageServiceProperty::BUFFER_SIZE, "50000000"}}));
        storage_services.insert(server_storage_service);
    }

    //instantiate wms and file registry
    auto file_registry = new wrench::FileRegistryService(SERVICES, {}, {});
    auto file_registry_ptr = simulation.add(file_registry);

    if (USE_VIVALDI) {
        NPS_TYPE = "VIVALDI";
    }

    std::cerr << "----------------------------------------" << std::endl;

    for (int i = 0; i < NUM_SERVER; ++i) {
        std::cerr << "Bandwidth of Server " << i+1 << ": " << SERVER_LINK_BANDWIDTH[i] << " Mbps" <<
                  std::endl;
    }

    std::cerr << "----------------------------------------" << std::endl;

    if (USE_NPS) {
        HOST_LIST.push_back(CLIENT);
        auto np_service = simulation.add(new wrench::NetworkProximityService(SERVICES, HOST_LIST,
                {{wrench::NetworkProximityServiceProperty::NETWORK_PROXIMITY_SERVICE_TYPE,
                        NPS_TYPE}}, {}));
        auto wms = simulation.add(
                new wrench::ActivityWMS(file_registry_ptr, {np_service}, storage_services,
                                         CLIENT));
        wms->addWorkflow(&workflow);
    } else {
        auto wms = simulation.add(new wrench::ActivityWMS(file_registry_ptr, {}, storage_services, CLIENT));
        wms->addWorkflow(&workflow);
    }

    //stage file
    auto file = workflow.getFileByID("file_copy");
    simulation.stageFile(file, client_storage_service);
    simulation.launch();

    // Gather the data transfer completion times
    auto file_copy_starts = simulation.getOutput().getTrace<wrench::SimulationTimestampFileCopyStart>();

    std::cerr << "----------------------------------------" << std::endl;
    std::cerr.precision(4);

    for (const auto &file_copy : file_copy_starts) {
        double start_time = file_copy->getDate();
        double end_time = file_copy->getContent()->getEndpoint()->getDate();
        double duration = end_time - start_time;

        std::cerr << file_copy->getContent()->getFile()->getSize() / (1000.0 * 1000.0) <<
        " MB transfer completed at time " << duration << std::endl;
    }
    std::cerr << "----------------------------------------" << std::endl;

    return 0;
}
