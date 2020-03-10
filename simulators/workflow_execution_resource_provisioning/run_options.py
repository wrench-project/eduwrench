#!/usr/bin/env python3.7
#
# Script to run simulations using the different options
# outlined in the Resource Provisining module, then plot the results.
########################################################

from subprocess import Popen, PIPE, STDOUT
from collections import namedtuple
import matplotlib.pyplot as plt
import matplotlib.lines as mlines

Result = namedtuple('Result', ['file_size_in_mb', 'simulated_execution_time', 'estimated_execution_time', 'estimated_utilization'])

class Activity3_Simulator:
    run_command = "./workflow_execution_resource_provisioning_simulator {0} {1} {2} {3} --log=root.thresh:critical"

    def __init__(self, num_cores, ram_in_gb, bandwidth_in_mbps, input_file_size_in_mb, estimated_execution_time_func):
        self.num_cores = num_cores
        self.ram_in_gb = ram_in_gb
        self.bandwidth_in_mbps = bandwidth_in_mbps
        self.input_file_size_in_mb = input_file_size_in_mb
        self.estimated_execution_time_func = estimated_execution_time_func

    def set_input_file_size(self, mb):
        self.input_file_size_in_mb = mb

    def get_estimated_execution_time(self):
        return self.estimated_execution_time_func(self.input_file_size_in_mb)

    def get_estimated_utilization(self):
        return 310 / (self.num_cores * self.get_estimated_execution_time())

    def run(self):
        wrench_process = Popen(Activity3_Simulator.run_command.format(self.num_cores, self.ram_in_gb, self.bandwidth_in_mbps, self.input_file_size_in_mb), shell=True, stdout=PIPE)
        wrench_process.wait()

        simulated_execution_time = float(str(wrench_process.communicate()[0], 'utf-8').strip())
        estimated_execution_time = self.get_estimated_execution_time()
        estimated_utilization = self.get_estimated_utilization()

        return Result(self.input_file_size_in_mb, simulated_execution_time, estimated_execution_time, estimated_utilization)

    def __str__(self):
        return "{0} cores, {1}GB RAM, {2}MBps bw".format(self.num_cores, self.ram_in_gb, self.bandwidth_in_mbps)


if __name__ == '__main__':
    simulators = {
        'base'     : Activity3_Simulator(2, 16, 100, 0,  lambda input_file_size_in_mb : (3 * input_file_size_in_mb / 100) + (3 * 100) + 10 + (0.003 / 100)),
        'option_1' : Activity3_Simulator(2, 32, 1000, 0, lambda input_file_size_in_mb : (3 * input_file_size_in_mb / 1000) + (2 * 100) + 10 + (0.003 / 100)),
        'option_2' : Activity3_Simulator(4, 16, 1000, 0, lambda input_file_size_in_mb : (3 * input_file_size_in_mb / 1000) + (3 * 100) + 10 + (0.003 / 100)),
        'option_3' : Activity3_Simulator(4, 32, 100, 0,  lambda input_file_size_in_mb : (3 * input_file_size_in_mb / 100) + 100 + 10 + (0.003 / 100))
    }

    data = dict()
    # run each option over a range of file sizes to see when one option may be better than another
    input_file_sizes = [i for i in range(100, 10001, 100)]

    for simulator_name, simulator in simulators.items():
        data[simulator_name] = list()

        for input_file_size in input_file_sizes:
            simulator.set_input_file_size(input_file_size)
            data[simulator_name].append(simulator.run())


    # generate the graph
    colors = ['r', 'g', 'b', 'k']
    plt.rc('xtick',labelsize=5)

    # show estimated utilization for each option on the top graph
    plt.subplot(2, 1, 1)
    for name, platform, color in zip(simulators.keys(), [str(simulator) for simulator in simulators.values()], map(lambda x : "-" + x, colors)):
        plt.plot(input_file_sizes, [result.estimated_utilization for result in data[name]], color, label=name + ": " + platform, linewidth=1, markersize=3)

    # mark areas of interest
    plt.axvline(x=2000)
    plt.text(2000, 0.55, '2GB input files', ha='center', va='center',rotation='vertical', backgroundcolor='white', size=6)

    plt.axvline(x=3700)
    plt.text(3700, 0.55, '3.7GB input files', ha='center', va='center',rotation='vertical', backgroundcolor='white', size=6)

    plt.axvline(x=7000)
    plt.text(7000, 0.55, '7GB input files', ha='center', va='center',rotation='vertical', backgroundcolor='white', size=6)

    plt.legend()
    plt.ylabel('Utilization')
    plt.xticks([])
    plt.title('Activity 3 Simulation Data')

    # show actual and estimated simulation times for each option on the bottom graph
    plt.subplot(2, 1, 2)
    for name, color in zip(simulators.keys(), colors):
        plt.plot(input_file_sizes, [result.simulated_execution_time for result in data[name]], "-" + color + "o", linewidth=1, markersize=3)
        plt.plot(input_file_sizes, [result.estimated_execution_time for result in data[name]], "-" + color + "x", linewidth=1, markersize=3)

    # mark areas of interest
    plt.axvline(x=2000)
    plt.axvline(x=3700)
    plt.axvline(x=7000)

    simulation_times = mlines.Line2D([], [], color='#a0a0a0', marker='o', markersize=5, label='simulation times')
    estimated_times = mlines.Line2D([], [], color='#a0a0a0', marker='x', markersize=5, label='estimated times')
    plt.legend(handles=[simulation_times, estimated_times])

    plt.xticks(input_file_sizes, rotation='vertical')
    plt.xlabel('Input File Size (mb)')
    plt.ylabel('Time (s)')

    plt.show()
