#!/usr/bin/env python3

import os;
import json;
from pymongo import MongoClient


l_pstate = range(0,7);
l_num_hosts = range(1,129);
#l_pstate = range(0,5);
#l_num_hosts = range(1,20);

if __name__ == '__main__':

    # Connect to MONGO
    client = MongoClient()
    derrick = client.derrick
    results = derrick.results
    results.drop()
    results = derrick.results
       
    for pstate in l_pstate: 
        for num_hosts in l_num_hosts:
            #print(pstate, num_hosts);
            json_args = """{
  "num_hosts": """ + str(num_hosts) + """,
  "cores": 8,
  "workflow_file": "../workflows/bigger-montage-workflow.json",
  "speed": "22.43Gf, 26.17Gf, 29.91Gf, 33.65Gf, 37.39Gf, 41.13Gf, 43Gf",
  "min_cores_per_task": 4,
  "max_cores_per_task": 4,
  "pstate": """ + str(pstate) + """,
  "energy_cost_per_mwh": 1000,
  "energy_co2_per_mwh": 291000,
  "value": "98:98:120, 98:98:130, 98:98:140, 98:98:150, 98:98:160, 98:98:170, 98:98:190",
  "use_cloud": false,
  "num_cloud_hosts": 0,
  "cloud_cores": 0,
  "cloud_bandwidth": "15MBps",
  "cloud_pstate": 0,
  "cloud_speed": "",
  "cloud_value": "",
  "cloud_cost_per_mwh": 0,
  "num_vm_instances": 0,
  "vm_usage_duration": 0,
  "cloud_tasks": ""

}
"""
            json_args_file_path = "/tmp/args.json";
            f = open(json_args_file_path, "w");
            f.write(json_args);
            f.close()

            command_line = "../build/thrustd " + json_args_file_path + " --wrench-energy-simulation"
            
            output = os.popen(command_line + " 2> /dev/null").read().rstrip()
            json_output = json.loads(output)            
            # CSV printing
#            print(str(pstate) + "," + str(num_hosts) + "," + str(json_output["exec_time"]) + "," + str(json_output["energy_cost"]) + "," + str(json_output["energy_co2"]))
            if (json_output["exec_time"] < 180.0):
                print(str(pstate) + "," + str(num_hosts) + "," + str(json_output["exec_time"]) + "," +  str(json_output["energy_co2"]))

            # Save to MongoDB
            json_output["pstate"] = pstate
            json_output["num_hosts"] = num_hosts
            results.insert_one(json_output)

    print("Number of data points generated:" + str(results.find({}).count()))

            

    

