#!/usr/bin/env python3

import sys
import glob
import os
import subprocess
import json
import matplotlib.pyplot as plt
import numpy
from functools import cmp_to_key


from pymongo import MongoClient


def plot_results():

    # Establish mongo connection
    client = MongoClient()
    derrick = client.derrick
    results = derrick.results

    all_results = results.find({})

    all_pstate = []
    all_num_hosts = []

    for result in all_results:
        all_pstate.append(result["pstate"])
        all_num_hosts.append(result["num_hosts"])

    all_pstate = sorted(list(set(all_pstate)))
    all_num_hosts = sorted(list(set(all_num_hosts)))

    # build data to plot
    data = []
    for x in range(0,max(all_pstate)+1):
        l = []
        for y in range(0,max(all_num_hosts)):
            doc = results.find_one({"num_hosts": (y+1), "pstate": x})
            l.append(doc["exec_time"])
        data.append(l)
        

    # plotting
    plt.rcParams.update({'font.size':13})
    plt.rcParams.update({'legend.numpoints':1})

    
    #plt.xticks([r - barWidth for r in range(len(workflow_files))], pretty_workflow_files, rotation=45,ha='right')
    #plt.tight_layout()

    plt.imshow(data, cmap='hot', interpolation='nearest')

    plt.show()
    #plt.savefig(filename, bbox_inchex='tight')
    #print "* Written plot to file " + filename
    #plt.clf()


if __name__ == '__main__':
    
    plot_results()


