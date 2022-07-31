#!/usr/bin/env python3

import sys
import glob
import os
import subprocess
import json
import numpy
from functools import cmp_to_key
from pymongo import MongoClient

def binary_search(results, low_num_nodes, high_num_nodes, par_eff, t_1):

    if (high_num_nodes >= low_num_nodes): 
        mid = (high_num_nodes + low_num_nodes) // 2
        
        t_mid = results.find_one({"pstate": t_1["pstate"], "num_hosts": mid},
        {"_id": 0, "pstate": 1, "num_hosts": 1, "exec_time": 1, "energy_cost": 1, "energy_co2": 1})

        par_eff_mid = (t_1["exec_time"] / t_mid["exec_time"]) / mid

        if par_eff_mid == par_eff or high_num_nodes == low_num_nodes:
            return mid
        elif par_eff_mid > par_eff:
            return binary_search(results, mid + 1, high_num_nodes, par_eff, t_1)
        else:
            return binary_search(results, low_num_nodes, mid - 1, par_eff, t_1)

def analyze_results(timeToRun, par_eff_benchmark):

    # Establish mongo connection
    client = MongoClient()
    derrick = client.derrick
    results = derrick.results

    start_string = """{
  "pstate": 0,
  "num_hosts": 0,
  "exec_time": 0,
  "energy_cost": 0,
  "energy_co2": 0
}
"""

    last_item = {}
    json_string = json.loads(start_string)
    all_results = results.find({})

    for result in all_results:
        if ((result["exec_time"] < timeToRun) and (json_string["exec_time"] < result["exec_time"])):
            json_string["pstate"] = result["pstate"]
            json_string["num_hosts"] = result["num_hosts"]
            json_string["exec_time"] = result["exec_time"]
            json_string["energy_cost"] = result["energy_cost"]
            json_string["energy_co2"] = result["energy_co2"]
        last_item = result
    
    t_1 = results.find_one({"pstate": last_item["pstate"], "num_hosts": 1}, 
          {"_id": 0, "pstate": 1, "num_hosts": 1, "exec_time": 1, "energy_cost": 1, "energy_co2": 1})
    t_n = results.find_one({"pstate": last_item["pstate"], "num_hosts": last_item["num_hosts"]},
          {"_id": 0, "pstate": 1, "num_hosts": 1, "exec_time": 1, "energy_cost": 1, "energy_co2": 1})


    ## Question 3
    q3_num_hosts = binary_search(results, 1, last_item["num_hosts"], par_eff_benchmark, t_1)

    pstate_iter = 0
    q3_par_eff = 0
    pstate_to_use = -1

    # We use q3_num_hosts hosts

    while pstate_iter < last_item["pstate"]:
        t_ret = results.find_one({"pstate": pstate_iter, "num_hosts": q3_num_hosts})
        if (t_ret["exec_time"] <= timeToRun):
            pstate_to_use = pstate_iter
            break
        
        #if pstate_iter == 0:
        #    q3_par_eff = t_ret_par_eff
        #else:
        #    if t_ret_par_eff > q3_par_eff:
        #        pstate_to_use = pstate_iter
        #        q3_par_eff = t_ret_par_eff
        pstate_iter += 1

    if (pstate_to_use < 0):
        sys.stderr.write("Q3: couldn't find a feasible pstate. Aborting!\n")
        sys.exit(1)

    q3_ret = results.find_one({"pstate": pstate_to_use, "num_hosts": q3_num_hosts},
        {"_id": 0, "pstate": 1, "num_hosts": 1, "exec_time": 1, "energy_cost": 1, "energy_co2": 1})

    # Compute optimal solution for Question 3
    q3_best_cost = sys.maxsize
    q3_best_config = []
    for num_hosts in range(1, last_item["num_hosts"] + 1):
        for pstate in range(0, last_item["pstate"] + 1):
            res =  results.find_one({"pstate": pstate, "num_hosts": num_hosts})
            if (res["exec_time"] <= timeToRun):
                if (res["energy_cost"] < q3_best_cost):
                    q3_best_cost = res["energy_cost"]
                    q3_best_config = [num_hosts, pstate]
                    




    print()
    print(t_1)
    print(t_n)
    print()

    speedup = t_1["exec_time"] / t_n["exec_time"]
    print("Question #1 Answer: ")
    print("Speedup = " + str(speedup))
    par_eff = speedup / last_item["num_hosts"]
    print("Parallel Efficiency = " + str(par_eff))
    print()

    print("Question #2 Answer: ")
    print(json_string)
    print()

    print("Question #3 Answer: ")
    print(q3_ret)
    print("hosts: " + str(q3_num_hosts))
    print("pstate: " + str(pstate_to_use))
    print("Exec time: " + str(q3_ret["exec_time"]))
    print("cost: " + str(q3_ret["energy_cost"]))
    print("CO2: " + str(q3_ret["energy_co2"]))
    print("Optimal config: " + str(q3_best_config) + "; cost=" + str(q3_best_cost))
    print()

if __name__ == '__main__':

    if (len(sys.argv) != 3):
        sys.stderr.write("Usage: " + sys.argv[0] + " <Q#2 run time in secs> <Q#3 parallel efficiency> \n")
        sys.exit(1)
    
    timeToRun = int(sys.argv[1])
    par_eff_benchmark = float(sys.argv[2])
    analyze_results(timeToRun, par_eff_benchmark)


