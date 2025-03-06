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
#include "GcfJobScheduler.h"
#include "GcfWMS.h"
#include <nlohmann/json.hpp>
#include <fstream>

int main(int argc, char **argv) {

  // Declaration of the top-level WRENCH simulation object
  auto simulation = wrench::Simulation::createSimulation();

  // Initialization of the simulation
  simulation->init(&argc, argv);

  // Parsing of the command-line arguments for this WRENCH simulation
  if (argc != 2) {
    std::cerr << "Usage: " << argv[0] << " <json file>" << std::endl;
    exit(1);
  }

  // parse json input file
  std::ifstream i(argv[1]);
  nlohmann::json j;
  try {
    j = nlohmann::json::parse(i);
  } catch (std::invalid_argument &e) {
    std::cerr << "Problem parsing JSON input file: " + std::string(e.what()) + "\n";
  }

  // time for function exec
  double func_exec_time = j.at("func_exec_time").get<double>();
  // num instances
  int num_instances = j.at("num_instances").get<int>();
  // min & max num requests that arrive per sec (max / min sleep time)
  int max_req = j.at("max_req").get<int>();
  int min_req = j.at("min_req").get<int>();
  // probability of change
  double change_probability = j.at("change_probability").get<double>();
  // maximum change
  double max_change = j.at("max_change").get<double>();
  // timeout time
  double timeout = j.at("timeout").get<double>();

  // platform description file, written in XML following the SimGrid-defined DTD
  std::string xml = "<?xml version='1.0'?>\n"
                    "<!DOCTYPE platform SYSTEM \"http://simgrid.gforge.inria.fr/simgrid/simgrid.dtd\">\n"
                    "<platform version=\"4.1\">\n"
                    "   <zone id=\"AS0\" routing=\"Full\">\n\n"
                    "       <host id=\"WMSHost\" speed=\"1Gf\" core=\"1\">\n"
                    "       </host>\n\n";

  // creation of hosts aka instances
  for (int i = 1; i < num_instances + 1; i++) {
    xml.append("       <host id=\"instance_" + std::to_string(i) + "\" speed=\"1f\" core=\"1\">\n" +
               "       </host>\n");
  }
  xml.append("\n");

  // create WIDE AREA LINK, for use between WMSHost and all instance hosts
  xml.append("       <link id=\"WIDE_AREA_LINK\" bandwidth=\"5000GBps\" latency=\"0ms\"/>\n");
  xml.append("\n");

  // routes between each instance and WMSHost
  for (int i = 1; i < num_instances + 1; i++) {
    xml.append("       <route src=\"instance_" + std::to_string(i) +
               "\" dst=\"WMSHost\"> <link_ctn id=\"WIDE_AREA_LINK\"/> </route>\n");
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

  // Reading and parsing the platform description file to instantiate a simulated platform
  // std::cerr << "Instantiating SimGrid platform..." << std::endl;
  simulation->instantiatePlatform(platform_file);

  // Get a vector of all the hosts in the simulated platform
  // std::vector<std::string> hostname_list = simulation->getHostnameList();

  std::string wms_host = "WMSHost";
  // Create a list of compute services that will be used by the WMS
  std::set<std::shared_ptr<wrench::ComputeService>> compute_services;
  std::vector <std::string> instances;
  for (int i = 1; i < num_instances + 1; i++) {
    try {
      instances.clear();
      instances.push_back("instance_" + std::to_string(i));
      auto baremetal_service = new wrench::BareMetalComputeService(
          wms_host, instances, "", {}, {});
      compute_services.insert(simulation->add(baremetal_service));
    } catch (std::invalid_argument &e) {
      std::cerr << "Error: " << e.what() << std::endl;
      std::exit(1);
    }
  }

  // Instantiate a WMS
  auto wms = simulation->add(
          new GcfWMS(compute_services, wms_host));
  // TO BE CHANGED BASED ON ARGS
  wms->setNumInstances(num_instances);
  wms->setReqArrivalRate(min_req, max_req);
  wms->setChangeProb(change_probability);
  wms->setMaxChange(max_change);
  wms->setTaskFlops(func_exec_time);
  wms->setTimeout(timeout);


  // Launch the simulation
  // std::cerr << "Launching the Simulation..." << std::endl;
  try {
    simulation->launch();
  } catch (std::runtime_error &e) {
    std::cerr << "Exception: " << e.what() << std::endl;
    return 0;
  }
  // std::cerr << "Simulation done!" << std::endl;

  return 0;
}

