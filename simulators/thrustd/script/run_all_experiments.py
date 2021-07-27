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
  "speed": "0.5217f, 0.6087f, 0.6957f, 0.7826f, 0.8696f, 0.9565f, 1f",
  "min_cores_per_task": 4,
  "max_cores_per_task": 4,
  "pstate": """ + str(pstate) + """,
  "energy_cost_per_mwh": 1000,
  "energy_co2_per_mwh": 3000,
  "value": "98:120, 98:130, 98:140, 98:150, 98:160, 98:170, 98:190"
}
"""
            json_args_file_path = "/tmp/args.json";
            f = open(json_args_file_path, "w");
            f.write(json_args);
            f.close()

            command_line = "../build/simulator " + json_args_file_path + " --wrench-energy-simulation"
            
            output = os.popen(command_line + " 2> /dev/null").read().rstrip()
            json_output = json.loads(output)            
            # CSV printing
            #print(str(pstate) + "," + str(num_hosts) + "," + str(json_output["exec_time"]) + "," + str(json_output["energy_cost"]) + "," + str(json_output["energy_co2"]))

            # Save to MongoDB
            json_output["pstate"] = pstate
            json_output["num_hosts"] = num_hosts
            print(json_output)
            results.insert_one(json_output)

    print("Number of data points generated:" + str(results.find({}).count()))

            

    

