#!/usr/bin/env python

import numpy as np
import matplotlib.pyplot as plt

plt.rcParams.update({'font.size':12})
plt.rcParams.update({'legend.numpoints':1})

max_cores = 40

num_cores = range(1, max_cores)

circle1 = plt.Circle((20, 10.25), 0.4, color='r', fill=False, linewidth=2)
fig, ax = plt.subplots()
ax.add_artist(circle1)
    

speedup_09 =  [(1 / (0.9/x + 0.1)) for x in num_cores]
speedup_095 =  [(1 / (0.95/x + 0.05)) for x in num_cores]
speedup_099 =  [(1 / (0.99/x + 0.01)) for x in num_cores]
speedup_0999 =  [(1 / (0.999/x + 0.001)) for x in num_cores]

ax = plt.plot(num_cores, num_cores, linewidth=3, label="alpha = 1.0 (ideal)")
plt.plot(num_cores, speedup_09, linewidth=3, label="alpha = 0.9")
plt.plot(num_cores, speedup_095, linewidth=3, label="alpha = 0.95")
plt.plot(num_cores, speedup_099, linewidth=3, label="alpha = 0.99")

plt.xlabel('Number of cores', fontweight='bold')
plt.ylabel('Parallel speedup', fontweight='bold')

plt.grid('on')
plt.ylim([0,  max_cores])

plt.legend(loc='upper left')

filename = "amdahl.svg"
plt.savefig(filename, bbox_inchex='tight')
print "* Written plot to file " + filename


