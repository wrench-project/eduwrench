
#### Learning Objectives
<div class="learningObjectiveBox" markdown="1">
  - Be able to reason about workflow execution performance on
    distributed multi-host/multi-core platforms
</div>
---

### Executing Workflows on Distributed Platforms

Workflows are often comprised of many tasks that are computationally
intensive and/or require large amounts of storage. As a result, one often
does not have the necessary resources on one's local computer to execute them
in any reasonable amount of time.  Instead, one needs to deploy workflow
executions on compute/storage resources that are connected via some
network, a.k.a., distributed computing platforms. You likely have heard of
some of these platforms, such as cloud platforms or high performance
computing (HPC) platforms.  

The goal is to execute a workflow application on these platforms as quickly
as possible, given the underlying network infrastructure (latencies,
bandwidths, network topologies) that interconnects storage (disks) and
compute (multi-core hosts with some RAM) resources.  This is only possible
if an appropriate software infrastructure is provided to use
remote resources. In this module, we just assume that this is the
case, and leave the discussion of the details of the software 
infrastructure for future modules. 

### Example Platform

We consider the following distributed platform with *three sites* on a wide-are network.

<object class="figure" type="image/svg+xml" data="{{ site.baseurl }}/public/img/workflows/workflow_distributed_platform.svg">Distributed platform</object>
<div class="caption"><strong>Figure 1:</strong> Example distributed computing platform.</div>

The site in the bottom-left corner is where the user who wishes to execute the
workflow resides. That user has only some personal computing device, like a laptop computer. 
No workflow data is stored and no workflow computation is performed  on this computer; it is
only used to orchestrate the workflow execution remotely. 
All workflow data is stored on a remote storage site (top center), and
all workflow computation is performed on a remote compute site (top right).  **So workflow
data has to flow back and forth between the storage site and the compute site**. This is
because, for now, the compute site has no persistent storage. 

The storage site simply hosts a disk with  500 MB/sec read/write bandwidth, and uses a 1 MB
buffer when being accessed remotely (see the [Pipelining tab of the Client-Server module]({{site.baseurl}}/pedagogic_modules/pdcc/distributed_computing/client_server/#/pipelining)). 
It is connected to the compute site via a wide-area network link (in fact it is
likely a multi-link network path, but let's keep this simple and assume a single link). This link
has 100 MB/sec bandwidth and 10 millisecond latency.

Let's now look deeper into the setup of the compute site. This site hosts several
computers, each of them with some RAM capacity and multiple cores, and each of them
connected to a switch via a high-speed network link. This setup is depicted
in the figure below:

<object class="figure" type="image/svg+xml" data="{{ site.baseurl }}/public/img/workflows/workflow_distributed_platform_zoom.svg">Distributed platform zoom</object>
<div class="caption"><strong>Figure 2:</strong> Compute resources at the compute site</div>

Each compute host has 32 GB of RAM, cores that compute at 100  Gflop/sec, and up to 8 of these cores. All
compute hosts are connected to the site's switch via a 10 GB/sec network link with 
10 micro-second latency. This switch is connected to the storage site via the wide-area link. 
Therefore, **the network path from the storage resource to each compute host has two links: 
the 100 MB/sec wide-area link, and the 10 GB/sec local-area link**.

Say that a task needs to perform 1000 Gflop, 
requires 10 GB of RAM, reads in a  200 MB input file, and
writes back a 10 MB input file.  We can compute a rough estimate of this task's execution
on one of the compute hosts, assuming that no other task is competing with it, as:

$$
\begin{align}
\text{Task execution time}  & = \text{input read}\; + \;\text{compute}\; + \;\text{output  write}\\
                            & = 200 / 100 + 1000 / 100 + 10 / 100\\
                            & = 12.1\; \text{sec}
\end{align}
$$

The above expression assumes that data is read/written from/to the disk at 100 MB/sec,
the smallest of the disk bandwidth (500 MB/sec) and of the bottleneck link
bandwidth (100 MB/sec). It is only a rough estimate
because it does not account for pipelining and latency, and because, as we have seen several 
times already in these modules, the network's data transfer rate is often not simply 
data size divided by bandwidth. This
is especially true when network latencies are high, which is the case here
with a 10ms latency on the wide-area link that connects the storage
resource to the compute resources.  We will see below how (in)accurate these
estimates can be. But as a general note, as we progress through these
pedagogic modules, platforms become increasingly complex. As a result, we will rely
more and more on simulation results and less and less on
back-of-the-envelope estimates.


### Example Workflow

We consider a simple "in-tree" workflow, depicted in the figure below.

<object class="figure" type="image/svg+xml" data="{{ site.baseurl }}/public/img/workflows/workflow_distributed_workflow.svg">Distributed platform</object>
<div class="caption"><strong>Figure 2:</strong> Example workflow.</div>

This workflow has only two levels, with the first level consisting of
20 tasks and the second level having only one task. The width
of the workflow is thus 20, and the critical path is relatively
short. So, unlike the example workflow in the previous tab, this
workflow should benefit significantly from parallel execution. 

### Executing the workflow on the platform

We wish to execute our workflow on our distributed platform. The workflow
execution strategy is straightforward because our workflow has a simple
structure: whenever there are sufficient compute resources at a compute
host (i.e., at least one idle core and 8 GB of RAM), start the next
to-be-executed `pre_*` task on it. When all `pre_*` tasks have been executed,
then the final task can be executed.

Whenever several `pre_*` tasks start simultaneously, then they also read
their input files simultaneously, thus splitting disk and network bandwidth. And, as
in the previous tab, a task does not free up its compute resources until its output files
have all been fully written to disk.


#### Simulating Distributed Workflow Execution

The simulation app below simulates the execution of our workflow on our platform, and allows
you to pick the number of hosts and of cores per host at the compute site. You can experiment
yourself with this application, but you should then use it for the practice questions hereafter. 

{% include simulator.html src="workflow_distributed" %}

---

####  Practice Questions

**[A.3.4.p2.1]** When executing the workflow with a single 1-core compute host,
what fraction of the time is spent doing actual computation?  Use the simulation to answer this
question, and show your work. 

<div class="ui accordion fluid">
  <div class=" title">
    <i class="dropdown icon"></i>
    (click to see answer)
  </div>
  <div markdown="1" class="ui segment content answer-frame">
  Running the simulation gives us a total execution time of 299.69 seconds. 
  In total, the computation consists of 21,000 Gflop to be performed on a 100 Gflop/sec
  core. So that is 210 seconds of computation. Therefore, the execution
  spends (299.69 - 210)/299.69 = 70% of its time doing computation. The rest
  of the execution is disk and network I/O.  
  </div>
</div>
<p></p>


**[A.3.4.p2.2]** Based on the answer to the previous question, how long would you
expect the execution time to be if the (single) compute host had 2 cores? Show your work, and then
double-check your answer in simulation. 

<div class="ui accordion fluid">
  <div class=" title">
    <i class="dropdown icon"></i>
    (click to see answer)
  </div>
  <div markdown="1" class="ui segment content answer-frame">
  In the previous question, we found out that the computation in total takes
  210 seconds. On 2 cores, this should be 110 seconds (since the 
  final task runs by itself). Therefore we would expect the
  execution time to be 100 second shorter than in the previous question,
  that is, 199.69 seconds.  
  
  The simulation gives 189.77 seconds. This is faster than expected, which
  can be due to several reasons. When running  tasks in parallel, 
  there can be beneficial effects in terms of network bandwidth. In this
  case, this is happening on the wide-area link due to its high latency. 
  This is now a recurring theme in these pedagogic modules: the network
  is complicated and its performance difficult to estimate precisely.
  </div>
</div>
<p></p>

**[A.3.4.p2.3]** For running our workflow, is it better to 
have 5 4-core compute hosts or 4 5-core hosts? Show your work. Check your answer in simulation.
<div class="ui accordion fluid">
  <div class=" title">
    <i class="dropdown icon"></i>
    (click to see answer)
  </div>
  <div markdown="1" class="ui segment content answer-frame">
  
It is better to use 5 4-core hosts because the RAM at each host
if 32 GB. Therefore, no matter how many  cores a host has
it cannot run more than 4 of our `pre_*` tasks in parallel. 

This is seen in simulation:

  - With 4 5-core hosts: 102.67 seconds
  - With 5 4-core hosts: 91.76 seconds
  </div>
</div>
<p></p>

**[A.3.4.p2.4]** What is the parallel efficiency (in terms of cores) of the
execution when using 5 4-core compute hosts? Show your work.  
<div class="ui accordion fluid">
  <div class=" title">
    <i class="dropdown icon"></i>
    (click to see answer)
  </div>
  <div markdown="1" class="ui segment content answer-frame">
  
The speedup is 299.69 / 91.76 = 3.26.  Since we used 20 cores, our parallel
efficiency is 3.26/20 = 16.33%.   This is pretty low, but expected since
we have so much I/O and a level of the workflow has no parallelism
whatsoever. 
  </div>
</div>
<p></p>

**[A.3.4.p2.5]** What overall I/O bandwidth is achieved by the workflow
execution when using a single core? What about when using 5 4-core hosts?  Show your work. 
<div class="ui accordion fluid">
  <div class=" title">
    <i class="dropdown icon"></i>
    (click to see answer)
  </div>
  <div markdown="1" class="ui segment content answer-frame">
  
In total, the execution reads and writes 20*(50 + 100 + 100) + 1 = 5001 MB 
of data. 
Using the same reasoning as in question A.3.4.p2.1 above, we can compute the I/O time
for each execution, and deduce the bandwidth. This is summarized in the table
below:

|---|---|---|---|
| execution | total time | compute time | I/O time | I/O bandwidth|
|---|---|---|---|
| 1x1 core   | 299.69 s | 210 s | 89.69 s | 55.75 MB/s | 
| 5x4 cores  | 91.76 s | 20 s  | 71.76 s |  69.69 MB/s |
|---|---|---|---|

As earlier, we find that doing parallel I/O (over the network) brings
some benefit. However, due to latency effects, we are pretty
far from achieving the peak 100 MB/s bandwidth.  It would be 
pretty difficult to estimate the I/O time of this workflow
execution without the simulation. 
 
  </div>
</div>
<p></p>


---

#### Questions

Consider  the following workflow (all green tasks have identical specs, and so do all  blue tasks):

<object class="figure" type="image/svg+xml" data="{{ site.baseurl }}/public/img/workflows/workflow_distributed_question.svg">Distributed platform</object>

<p><br></p>

**[A.3.4.q2.1]**  You can lease three different platforms to execute this workflow:

  - **Platform A:** Two 4-core hosts, each with 8 GB of RAM, and 120 Gflop/sec core compute speed
  - **Platform B:** Three 6-core hosts, each with 12 GB of RAM, and 50 Gflop/sec core compute speed
  - **Platform C:** One 3-core hosts, with 16 GB of RAM, and 120 Gflop/sec core compute speed
  
  Assuming the I/O and network times are zero, which of the three platforms above is the better choice?
Show your work, estimating the execution time on each platform.

**[A.3.4.q2.2]**  Because tasks in all levels are identical, at any given time either all 
                  running tasks compute, or all running tasks perform I/O. Assuming the 
                  total I/O time, regardless of the number of hosts/cores, is 20
                  seconds, what is the parallel efficiency for the three platforms in the
                  previous question? Show your work, again, estimating the execution time on
                  each platform.

---
