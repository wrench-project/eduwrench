#!/usr/bin/env python3 

import subprocess

ts = {}
ts["0"] = "random"
#ts["1"] = "highest flop"
#ts["2"] = "lowest flop"
#ts["3"] = "highest byte"
#ts["4"] = "lowest byte"
#ts["5"] = "highest flop/byte"
#ts["6"] = "lowest flop/byte"

hs = {}
hs["0"] = "random"
#hs["1"] = "fastest"
#hs["2"] = "best-connected"
#hs["4"] = "ECT"

num_workers     = 20 
min_flops       = 100
max_flops       = 1000
min_bandwidth   = 100
max_bandwidth   = 1000
num_tasks       = 80
min_input       = 100
max_input       = 10000
min_Gflop       = 100
max_Gflop       = 10000
min_output      = 0
max_output      = 0


for i in ts:
    for j in hs:
        cmd = "./master_worker_simulator --generate " + \
            str(num_workers) + " " + \
            str(min_flops) + " " + \
            str(max_flops) + " " + \
            str(min_bandwidth) + " " + \
            str(max_bandwidth) + " " + \
            str(num_tasks) + " " + \
            str(min_input) + " " + \
            str(max_input) + " " + \
            str(min_Gflop) + " " + \
            str(max_Gflop) + " " + \
            str(min_output) + " " + \
            str(max_output) + " " + \
            "--ts " + str(i) + " --cs " + str(j) + \
            " --inv 30 --seed 12345 --log='root.fmt:[%d][%h:%t]%e%m%n'"
        result = subprocess.Popen(cmd, shell=True, stdout=subprocess.PIPE)
        for line in result.stdout.readlines(): 
            print(str(ts[i]) +  " " + str(hs[j]) + ": " + str(line))
            #if str(line).find("Mean") != -1:
            #    tokens = str(line).split(" ")
            #    print("{:<35} {:>8}".format(ts[i] + "/" + hs[j],tokens[3]))

