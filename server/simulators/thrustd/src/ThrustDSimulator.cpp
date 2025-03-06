/**
 * Copyright (c) 2020. <ADD YOUR HEADER INFORMATION>.
 * Generated with the wrench-init.in tool.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 */
#include <wrench.h>
#include "ThrustDJobScheduler.h"
#include "ThrustDWMS.h"
#include <nlohmann/json.hpp>
#include <fstream>
#include <chrono>
#include <ratio>

XBT_LOG_NEW_DEFAULT_CATEGORY(simple_simulator, "Log category for Simple WMS");



static bool ends_with(const std::string& str, const std::string& suffix) {
    return str.size() >= suffix.size() && 0 == str.compare(str.size()-suffix.size(), suffix.size(), suffix);
}

int main(int argc, char **argv) {

    // Declaration of the top-level WRENCH simulation object
    auto simulation = wrench::Simulation::createSimulation();

    // Add the --wrench-energy-simulation flag in case user forgot (duplicates don't matter)
    char **new_argv = (char **)calloc(argc+1, sizeof(char*));
    memcpy(new_argv, argv, argc * sizeof(char*));
    new_argv[argc] = strdup("--wrench-energy-simulation");

    argv = new_argv;
    argc++;

    // Initialization of the simulation
    simulation->init(&argc, argv);

    // Parsing of the command-line arguments for this WRENCH simulation
    if (argc != 2) {
        std::cerr << "Usage: " << argv[0] << " <json file>" << std::endl;
        exit(1);
    }

    std::ifstream i(argv[1]);
    nlohmann::json j;
    try {
        j = nlohmann::json::parse(i);
    } catch (std::invalid_argument &e) {
        std::cerr << "Problem parsing JSON input file: " + std::string(e.what()) + "\n";
    }

    // number of compute nodes
    int num_hosts = j.at("num_hosts").get<int>();
    // the number of cores per compute node
    int cores = j.at("cores").get<int>();
    // pstate spec
    int pstate = j.at("pstate").get<int>();
    // compute host speed
    std::string speed = j.at("speed").get<std::string>();
    // pstate value
    std::string pstate_value = j.at("value").get<std::string>();
    // energy cost per MWh ($/MWh)
    double cost = j.at("energy_cost_per_mwh").get<double>();
    // energy CO2 per MWh (CO2/MWh)
    double co2 = j.at("energy_co2_per_mwh").get<double>();

    // whether to use the cloud or not
    bool use_cloud = j.at("use_cloud").get<bool>();
    // number of cloud hosts
    int num_cloud_hosts = j.at("num_cloud_hosts").get<int>();
    // the number of cores per cloud host
    int cloud_cores = j.at("cloud_cores").get<int>();
    // cloud bandwidth
    std::string cloud_bandwidth = j.at("cloud_bandwidth").get<std::string>();
    // cloud pstate spec
    int cloud_pstate = j.at("cloud_pstate").get<int>();
    // cloud compute host speed
    std::string cloud_speed = j.at("cloud_speed").get<std::string>();
    // cloud pstate value
    std::string cloud_pstate_value = j.at("cloud_value").get<std::string>();
    // cloud energy cost per MWh ($/MWh)
    double cloud_cost = j.at("cloud_cost_per_mwh").get<double>();

    // platform description file, written in XML following the SimGrid-defined DTD
    std::string xml = "<?xml version='1.0'?>\n"
                      "<!DOCTYPE platform SYSTEM \"http://simgrid.gforge.inria.fr/simgrid/simgrid.dtd\">\n"
                      "<platform version=\"4.1\">\n"
                      "   <zone id=\"AS0\" routing=\"Full\">\n\n"
                      "       <host id=\"WMSHost\" speed=\"1Gf\" pstate=\"0\" core=\"1\">\n"
                      "           <prop id=\"wattage_per_state\" value=\"0.0:0.0\"/>\n"
                      "           <prop id=\"wattage_off\" value=\"0\"/>\n"
                      "       </host>\n\n"
                      "       <host id=\"storage_host\" speed=\"1Gf\" pstate=\"0\" core=\"1\">\n"
                      "           <disk id=\"hard_drive\" read_bw=\"100MBps\" write_bw=\"100MBps\">\n"
                      "               <prop id=\"size\" value=\"500GB\"/>\n"
                      "               <prop id=\"mount\" value=\"/\"/>\n"
                      "           </disk>\n"
                      "           <prop id=\"wattage_per_state\" value=\"10.00:100.00\"/>\n"
                      "           <prop id=\"wattage_off\" value=\"0\"/>\n"
                      "       </host>\n\n";

    if (use_cloud == true) {
        xml.append("       <host id=\"cloud_provider_host\" speed=\"1Gf\" pstate=\"0\" core=\"1\">\n"
                   "           <disk id=\"hard_drive\" read_bw=\"100MBps\" write_bw=\"100MBps\">\n"
                   "               <prop id=\"size\" value=\"500GB\"/>\n"
                   "               <prop id=\"mount\" value=\"/\"/>\n"
                   "           </disk>\n"
                   "           <prop id=\"wattage_per_state\" value=\"10.00:100.00\"/>\n"
                   "           <prop id=\"wattage_off\" value=\"0\"/>\n"
                   "       </host>\n\n");
        for (int i = 1; i < num_cloud_hosts + 1; i++) {
            xml.append("       <host id=\"cloud_host_" + std::to_string(i)
                       + "\" speed=\"" + cloud_speed + "\" pstate=\"" + std::to_string(cloud_pstate) + "\" core=\""
                       + std::to_string(cloud_cores) + "\">\n" +
                       "           <prop id=\"wattage_per_state\" value=\"" + cloud_pstate_value + "\"/>\n" +
                       "           <prop id=\"wattage_off\" value=\"0\"/>\n" +
                       "       </host>\n");
        }
        xml.append("\n");
    }

    for (int i = 1; i < num_hosts + 1; i++) {
        xml.append("       <host id=\"compute_host_" + std::to_string(i)
                   + "\" speed=\"" + speed + "\" pstate=\"" + std::to_string(pstate) + "\" core=\""
                   + std::to_string(cores) + "\">\n" +
                   "           <prop id=\"wattage_per_state\" value=\"" + pstate_value + "\"/>\n" +
                   "           <prop id=\"wattage_off\" value=\"0\"/>\n" +
                   "       </host>\n");
    }
    xml.append("\n");

    // links between each compute host and storage host (1 to hosts)
    for (int i = 1; i < num_hosts + 1; i++) {
        xml.append("       <link id=\"" + std::to_string(i)
                   + "\" bandwidth=\"5000GBps\" latency=\"0us\"/>\n");
    }

    // link between WMS Host and Storage host
    xml.append("       <link id=\"" + std::to_string(num_hosts + 1)
               + "\" bandwidth=\"5000GBps\" latency=\"0us\"/>\n");

    if (use_cloud == true) {
        // links between each cloud compute host and cloud provider host
        for (int i = num_hosts + 2; i < num_hosts + num_cloud_hosts + 2; i++) {
            xml.append("       <link id=\"" + std::to_string(i)
                       + "\" bandwidth=\"5000GBps\" latency=\"0us\"/>\n");
        }
        // WIDE_AREA_LINK
        xml.append("       <link id=\"WIDE_AREA_LINK\" bandwidth=\"" + cloud_bandwidth + "\" latency=\"0ms\"/>\n");
        // link between Storage Host and Cloud Provider Host
//        xml.append("       <link id=\"" + std::to_string(num_hosts + num_cloud_hosts + 3)
//                   + "\" bandwidth=\"" + cloud_bandwidth + "\" latency=\"0us\"/>\n");
    }

    xml.append("\n");

    // routes between each compute host and storage host (1 to hosts)
    for (int i = 1; i < num_hosts + 1; i++) {
        xml.append("       <route src=\"compute_host_" + std::to_string(i) +
                   "\" dst=\"storage_host\"> <link_ctn id=\"" + std::to_string(i) + "\"/> </route>\n");
    }
    // routes between WMS Host and Storage host
    xml.append("       <route src=\"WMSHost\" dst=\"storage_host\"> "
               "<link_ctn id=\"" + std::to_string(num_hosts + 1) + "\"/> </route>\n");

    if (use_cloud) {
        // routes between each cloud compute host and cloud provider host
        for (int i = num_hosts + 2; i < num_hosts + num_cloud_hosts + 2; i++) {
            xml.append("       <route src=\"cloud_host_" + std::to_string(i - num_hosts - 1) +
                       "\" dst=\"cloud_provider_host\"> <link_ctn id=\"" + std::to_string(i) + "\"/> </route>\n");
        }
        // routes between each compute host and cloud provider host
        for (int i = 1; i < num_hosts + 1; i++) {
            xml.append("       <route src=\"compute_host_" + std::to_string(i) +
                       "\" dst=\"cloud_provider_host\"> <link_ctn id=\"" + std::to_string(i) + "\"/> <link_ctn id=\"WIDE_AREA_LINK\"/> </route>\n");
        }
        // routes between each cloud compute host and Storage Host host
        for (int i = num_hosts + 2; i < num_hosts + num_cloud_hosts + 2; i++) {
            xml.append("       <route src=\"cloud_host_" + std::to_string(i - num_hosts - 1) +
                       "\" dst=\"storage_host\"> <link_ctn id=\"" + std::to_string(i) + "\"/> <link_ctn id=\"WIDE_AREA_LINK\"/> </route>\n");
        }
        // route between WMS Host and Cloud Provider host
        xml.append("       <route src=\"WMSHost\" dst=\"cloud_provider_host\"> "
                   "<link_ctn id=\"WIDE_AREA_LINK\"/> </route>\n");
        // route between Storage Host and Cloud Provider Host
        xml.append("       <route src=\"storage_host\" dst=\"cloud_provider_host\"> "
                   "<link_ctn id=\"WIDE_AREA_LINK\"/> </route>\n");
//                   "<link_ctn id=\"" + std::to_string(num_hosts + num_cloud_hosts + 3) + "\"/> </route>\n");
    }

    xml.append("\n");

    xml.append(
            "   </zone>\n"
            "</platform>\n");

    char const* username = std::getenv("USER");
    std::string platform_file = "/tmp/hosts_" + std::to_string(getuid()) + ".xml";
    auto xml_file = fopen(platform_file.c_str(), "w");
    if (xml_file == NULL) {
        std::cerr << "Cannot open platform (.xml) file" << std::endl;
        exit(1);
    }
    fprintf(xml_file, "%s", xml.c_str());
    fclose(xml_file);

    // workflow description file, written in XML using the DAX DTD
    std::string s = j.at("workflow_file").get<std::string>();
    char *workflow_file = &s[0];

    // Reading and parsing the workflow description file to create a wrench::Workflow object
    WRENCH_INFO("Loading workflow...");
    auto workflow = wrench::Workflow::createWorkflow();

    // min number of cores per task
    int min_cores = j.at("min_cores_per_task").get<int>();

    // max number of cores per task
    int max_cores = j.at("max_cores_per_task").get<int>();

    std::string reference_speed = "43Gf";
    workflow = wrench::WfCommonsWorkflowParser::createWorkflowFromJSON(workflow_file, reference_speed, false,
                                                                     min_cores, max_cores, true);

    WRENCH_INFO("The workflow has %ld tasks", workflow->getNumberOfTasks());

    // Reading and parsing the platform description file to instantiate a simulated platform
    WRENCH_INFO("Instantiating SimGrid platform...");
    simulation->instantiatePlatform(platform_file);
    WRENCH_INFO("SimGrid platform instantiated");

    // Get a vector of all the hosts in the simulated platform
    std::vector<std::string> hostname_list = simulation->getHostnameList();

    // Instantiate a storage service on the local
    std::string storage_host = "storage_host";
    // in xml file, need storage_host w/ disk
    WRENCH_INFO("Instantiating a SimpleStorageService on %s", storage_host.c_str());

    auto storage_service = simulation->add(new wrench::SimpleStorageService(storage_host, {"/"}, {},
                                                                            {
                                                                                    {wrench::SimpleStorageServiceMessagePayload::FILE_LOOKUP_ANSWER_MESSAGE_PAYLOAD, 0.0},
                                                                                    {wrench::SimpleStorageServiceMessagePayload::FILE_LOOKUP_REQUEST_MESSAGE_PAYLOAD, 0.0}
                                                                            }));



    // Create a list of storage services that will be used by the WMS
    std::set<std::shared_ptr<wrench::StorageService>> storage_services;
    storage_services.insert(storage_service);

    std::shared_ptr<wrench::StorageService> cloud_storage_service = nullptr;
    if (use_cloud) {
        // Instantiate a storage service on the cloud host
        std::string cloud_provider_host = "cloud_provider_host";
        // in xml file, need storage_host w/ disk
        WRENCH_INFO("Instantiating a SimpleStorageService on %s", cloud_provider_host.c_str());
        cloud_storage_service = simulation->add(new wrench::SimpleStorageService(cloud_provider_host, {"/"}, {},
                                                                                 {
                                                                                         {wrench::SimpleStorageServiceMessagePayload::FILE_LOOKUP_ANSWER_MESSAGE_PAYLOAD,  0.0},
                                                                                         {wrench::SimpleStorageServiceMessagePayload::FILE_LOOKUP_REQUEST_MESSAGE_PAYLOAD, 0.0}
                                                                                 }));
        storage_services.insert(cloud_storage_service);
    }

    // wms host
    std::string wms_host = storage_host;

    // Create a list of compute services that will be used by the WMS
    std::set<std::shared_ptr<wrench::ComputeService>> compute_services;
    try {
        std::vector<std::string> execution_hosts;
        for (int i = 1; i < num_hosts + 1; i++) {
            execution_hosts.push_back("compute_host_" + std::to_string(i));
        }
        auto baremetal_service = new wrench::BareMetalComputeService(
                wms_host, execution_hosts, "", {}, {});
        compute_services.insert(simulation->add(baremetal_service));
    } catch (std::invalid_argument &e) {
        std::cerr << "Error: " << e.what() << std::endl;
        std::exit(1);
    }

    if (use_cloud) {
        try {
            WRENCH_INFO("Instantiating a CloudComputeService on CloudProviderHost...");
            std::vector<std::string> cloud_hosts;
            for (int i = 1; i < num_cloud_hosts + 1; i++) {
                cloud_hosts.push_back("cloud_host_" + std::to_string(i));
            }
            auto cloud_service = new wrench::CloudComputeService(
                    "cloud_provider_host", cloud_hosts, "", {}, {});
            compute_services.insert(simulation->add(cloud_service));
        } catch (std::invalid_argument &e) {
            std::cerr << "Error: " << e.what() << std::endl;
            std::exit(1);
        }
    }



    // Instantiate a WMS
    auto wms = simulation->add(
            new ThrustDWMS(std::unique_ptr<ThrustDJobScheduler>(
                    new ThrustDJobScheduler(storage_service, cloud_storage_service)),
                           compute_services, storage_services, workflow, wms_host));


    if (use_cloud) {
        // number of cloud vm instances
        int num_vm_instances = j.at("num_vm_instances").get<int>();
        std::string cloud_tasks = j.at("cloud_tasks").get<std::string>();
        wms->setNumVmInstances(num_vm_instances);
        wms->setCloudTasks(cloud_tasks);
    }
    else {
        wms->setNumVmInstances(0);
        wms->setCloudTasks("");
    }

    // Instantiate a file registry service
    std::string file_registry_service_host = hostname_list[(hostname_list.size() > 2) ? 1 : 0];
    WRENCH_INFO("Instantiating a FileRegistryService on %s", file_registry_service_host.c_str());
    auto file_registry_service =
            new wrench::FileRegistryService(file_registry_service_host);
    simulation->add(file_registry_service);

    // It is necessary to store, or "stage", input files
    WRENCH_INFO("Staging input files...");
    auto input_files = workflow->getInputFiles();
    try {
        for (auto const &f : input_files) {
            simulation->stageFile(f, storage_service);
        }
    } catch (std::runtime_error &e) {
        std::cerr << "Exception: " << e.what() << std::endl;
        return 0;
    }

    // Launch the simulation
    WRENCH_INFO("Launching the Simulation...");
    auto start = std::chrono::high_resolution_clock::now();
    try {
        simulation->launch();
    } catch (std::runtime_error &e) {
        std::cerr << "Exception: " << e.what() << std::endl;
        return 0;
    }
    auto end = std::chrono::high_resolution_clock::now();
    auto duration = std::chrono::duration_cast<std::chrono::microseconds>(end - start);
    WRENCH_INFO("Simulation done!");

    // get num hosts powered on and actually used
    std::set<std::string> used_physical_hosts;
    for (auto const &t : workflow->getTasks()) {
        used_physical_hosts.insert(t->getPhysicalExecutionHost());
    }
    int num_used_local_hosts = 0;
    int num_used_cloud_hosts = 0;
    for (const auto &hostname : used_physical_hosts) {
        if (hostname.find("cloud_host_") != std::string::npos) {
            num_used_cloud_hosts++;
        } else {
            num_used_local_hosts++;
        }

    }

    std::cerr << "Num Local Cluster hosts powered on:     " << num_hosts << std::endl;
    std::cerr << "Num Local Cluster hosts actually used: " << num_used_local_hosts << std::endl;
    std::cerr << "Num Remote Cloud hosts powered on:      " << num_cloud_hosts << std::endl;
    std::cerr << "Num Remote Cloud hosts actually used:   " << num_used_cloud_hosts << std::endl;

    auto exit_tasks = workflow->getExitTaskMap();
    auto workflow_finish_time = 0.0;
    for (auto const &t : exit_tasks) {
        workflow_finish_time = std::max<double>(t.second->getEndDate(), workflow_finish_time);
    }

    auto total_energy_cluster = 0;
    total_energy_cluster += simulation->getEnergyConsumed("WMSHost");
    total_energy_cluster += simulation->getEnergyConsumed("storage_host");
    for (int i = 1; i < num_hosts + 1; i++) {
        total_energy_cluster += simulation->getEnergyConsumed("compute_host_" + std::to_string(i));
    }
    auto total_energy_cloud = 0;
    if (use_cloud) {
        total_energy_cloud += simulation->getEnergyConsumed("cloud_provider_host");
        for (int i = 1; i < num_cloud_hosts + 1; i++) {
            total_energy_cloud += simulation->getEnergyConsumed("cloud_host_" + std::to_string(i));
        }
    }
    auto total_energy = total_energy_cluster + total_energy_cloud;
    auto total_energy_in_wh = (total_energy / (3.6 * 1000.0));

    // 1 MWh = 3,600 MJ = 3,600,000,000 J
    auto total_cost = (cost / 3600000000) * total_energy_cluster;
    auto total_co2 = (co2 / 3600000000) * total_energy_cluster;

    char energy_buf[25];
    char cost_buf[25];
    char co2_buf[25];
    char exec_time_buf[25];
    sprintf(energy_buf, "%.2f", total_energy_in_wh);
    sprintf(cost_buf, "%.2f", total_cost);
    sprintf(co2_buf, "%.2f", total_co2);
    sprintf(exec_time_buf, "%.2f", workflow_finish_time);


    std::cerr << "Energy Consumption: " << energy_buf << " Wh" << std::endl;
//    std::cerr << "Total Energy Monetary Cost: $" << cost_buf << std::endl;
    std::cerr << "Energy CO2 Cost:    " << co2_buf << " gCO2e" << std::endl;
    std::cerr << "Execution time:     " << exec_time_buf << " sec" << std::endl;
//    std::cerr << "(Simulation time: " << duration.count() << " microseconds)" << std::endl;

    nlohmann::json output_json =
            {
                    {"energy_consumption", total_energy_in_wh},
                    {"energy_cost", total_cost},
                    {"energy_co2", total_co2},
                    {"exec_time", exec_time_buf}
            };

    std::cout << output_json.dump() << std::endl;

    // simulation->getOutput().enableDiskTimestamps(true);
    simulation->getOutput().dumpUnifiedJSON(workflow, "/tmp/workflow_data.json",
                                            false,
                                            true,
                                            false,
                                            false,
                                            false,
                                            false,
                                            true);

    return 0;
}

