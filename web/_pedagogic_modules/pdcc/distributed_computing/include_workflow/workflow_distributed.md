
#### Learning objectives

  - Be able to reason about workflow execution performance on
    distributed, multi-core, multi-host platforms

---


### Executing Workflows on Distributed Platforms

Workflows are often comprised of many tasks that are computationally
intensive and/or require large amounts of storage. As a result, one often
doesn't have the necessary resources on one's local compute to execute them
in any reasonable amount of time.  Instead, one needs to deploy their
executions on compute/storage resources that are connected via some
network, i.e., distributed computing platforms. You likely have heard of
some of these platforms, such as cloud platforms or high performance
computing (HPC) platforms.  

The goal is to execute a workflow application on these platforms as quickly
as possible, given the underlying network infrastructure (latencies,
bandwidths, network topologies) that interconnects storage (disks) and
compute (multi-core hosts with some RAM) resources.  This is only possible
if an appropriate software infrastructure is provided to use
remote resources. In this module we just assume that this is the
case, and leave the discussion of more details about the software 
infrastructure for future modules. 

### Example Platform

We consider the following distributed platform with *three sites* on a wide-are network.

<object class="figure" type="image/svg+xml" data="{{ site.baseurl }}/public/img/workflows/workflow_distributed_platform.svg">Distributed platform</object>
<div class="caption"><strong>Figure 1:</strong> Example distributed computing platform.</div>

The site in the bottom-left corner is where the user who wishes to execute the
workflow. That user has only some personal computing device, like a laptop computer,
on which workflow data is not stored and workflow computation is not performed. 
Instead, all workflow data is stored on a remote storage site (top center), and
all workflow computation is performed on a remove compute site (top right).  **So workflow
data has to flow back and forth between the storage site and the compute site**. Indeed,
the compute site has no persistent storage. 

The storage site simply hosts a disk with  500 MB/sec read/write bandwidth, and uses a 100 MB
buffer when being accessed remotely (see the Pipelining tab of the [Client-Server module]({{site.baseurl}}/pedagogic_modules/pdcc/distributed_computing/client_server)). It is
connected to the compute site via a wire-area network link with 100 MB/sec bandwidth
and 10 millisecond latency. 

Let's now look deeper into the setup of the compute site. This site hosts a number
of computers, each of them with some RAM capacity and multiple cores, and each of them
connected to the switch via a high-speed network link. This setup is depicted
in the figure below:

<object class="figure" type="image/svg+xml" data="{{ site.baseurl }}/public/img/workflows/workflow_distributed_platform_zoom.svg">Distributed platform zoom</object>
<div class="caption"><strong>Figure 2:</strong>Compute resources at the compute site</div>

Each compute host has 32 GB of RAM, cores that compute at 100  GFlop/sec, and up to 8 cores. All
compute hosts are connected to the site's switch via a 10 GB/sec network link with 
10 micro-second latency. This switch is connected to the storage site via the wide-area link. 
Therefore, **the network path from the storage resource to each compute host has two links: the 100 MB/sec wide-area link
and the 10 GB/sec local-area link**.

Say that a task needs to perform 1000 GFlop, 
requires 10 GB of RAM, reads in a  200 MB input file, and
writes back a 10 MB input file.  We can compute a rough estimate of this task's execution
on one of the compute hosts, assuming that no other task is competing with it, as:

$$
\begin{align}
\text{Task execution time}  & = \text{input read time}\; + \;\text{compute time}\; + \;\text{output  write time}\\
                            & = 200 / 100 + 1000 / 100 + 10 / 100
                            & = 12.1 \text{sec}
\end{align}
$$
The above assumes that data is read/written from/to the disk at 100 MB/sec, the smallest of the disk bandwidth (500 MB/sec) and
of the bottleneck link bandwidth (100 MB/sec). The above equation is only a rough estimate
because, as we've seen several time already in these 
modules, the network behavior is more complex than the above equation makes it out to be.
This is especially true when network latencies are high, which is the case here with a 10ms
latency on the wide-area link that connects the storage resource to the compute resources.  
We'll see below how (in)accurate these estimates can be. But as a general note, as we progress
through these pedagogic modules and platforms become increasingly complex, we will rely more and
more on simulation results and less and less on back-of-the-envelope estimates. 


### Example Workflow

We consider a simple "in-tree" workflow, depicted in the figure below.

<object class="figure" type="image/svg+xml" data="{{ site.baseurl }}/public/img/workflows/workflow_distributed_workflow.svg">Distributed platform</object>
<div class="caption"><strong>Figure 2:</strong> Example workflow.</div>

This workflow has only two levels, with the first level consisting of
20 parallel tasks and the second level having only one task. The width
of the workflow DAG is thus 20, and the critical path is relatively
short. So, unlike the example workflow in the previous tab, this
workflow should benefit significantly from parallel execution. 

### Executing the Workflow on the Platform

We wish to execute our workflow  on our distributed platform. The workflow execution
strategy is very simple because our workflow has a simple structure: whenever 
there are sufficient compute resources at a compute host (i.e., at least one idle core and 8 GB of RAM), start
the next to-be-executed pre_* task on it. When all pre_* tasks have been
executed, then the final task can be executed. 

Whenever several pre_* tasks start simultaneously, then also read
their input files simultaneously, thus splitting disk and network bandwidth. And, as
in the previous tab, a task does not free up its compute resources until its output files
have all been fully written to disk.


#### Simulating Execution

The simulation app below simulates the execution of our workflow on our platform, and allows
you to pick the
number number hosts at the compute site, and the number of cores on each such host. You can experiment
yourself with this application, but you should then use it for the practice questions hereafter. 

<div class="ui accordion fluid app-ins">
  <div class="title">
    <i class="dropdown icon"></i>
    (Open simulator here)
  </div>
  <div markdown="0" class="ui segment content">
    {% include simulator.html src="workflow_distributed/" %}
  </div>
</div>

---

####  Practice Questions

**[A.3.4.q2.1]** When executing the workflow with a single 1-core compute host,
what fraction of the time is spent doing actual computation? 

<div class="ui accordion fluid">
  <div class=" title">
    <i class="dropdown icon"></i>
    (click to see answer)
  </div>
  <div markdown="1" class="ui segment content">
  Running the simulation gives us a total execution time of 299.69 seconds. 
  In total, we have 21 1000 GFlop tasks that run on a 100 GFlop/sec
  core. So that's 210 seconds of computation. Therefore, the execution
  spends (299.69 - 210)/299.69 = 70% of its time doing computation. The rest
  of the execution is disk and network I/O.  
  </div>
</div>
<p></p>


**[A.3.4.q2.2]** Based on the answer to the previous question, how long would you
expect the execution time to be if the (single) compute host had 2 cores? Double-check
your expectation in simulation.

<div class="ui accordion fluid">
  <div class=" title">
    <i class="dropdown icon"></i>
    (click to see answer)
  </div>
  <div markdown="1" class="ui segment content">
  In the previous question, we found out that the computation was
  210 seconds. On 2 cores, this should be 110 seconds (since the 
  final task runs by itself). Therefore we'd expect the
  execution time to be 100 second shorter than in the previous question,
  that is, 199.69 seconds.  
  
  The simulation gives 189.77 seconds. This is faster than expected, which
  can be due to several reasons. When running  tasks in parallel, 
  there can be beneficial effects in terms of network bandwidth. In this
  case, this is happening on the wide-area link due to its high latency. 
  This is now a recurring theme in these pedagogic modules: the network
  is complicated.  This is why, as stated earlier, less and less do we rely
  on back-of-the-envelope estimates. 
    
  </div>
</div>
<p></p>

**[A.3.4.q2.3]** For running our workflow, is it better to 
have 5 4-core compute hosts or 4 5-core hosts? Check your answer in simulation.
<div class="ui accordion fluid">
  <div class=" title">
    <i class="dropdown icon"></i>
    (click to see answer)
  </div>
  <div markdown="1" class="ui segment content">
  
It's better to use 5 4-core hosts because the RAM at each host
if 32 BG. Therefore, no matter how many  cores a host has
it cannot run more than 4 of our pre_* tasks in parallel. 

This is seen in simulation:

  - With 4 5-core hosts: 102.67 seconds
  - With 5 4-core hosts: 91.76 seconds
  
  </div>
</div>
<p></p>


---

### Questions