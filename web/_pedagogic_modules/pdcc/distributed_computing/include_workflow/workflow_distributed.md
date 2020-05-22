
#### Learning objectives

  - XXX TODO XXX

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

The storage site simply hosts a disk with  500 MB/sec read/write bandwidth, and  uses
a buffer size of 1 MB when being accessed remotely  (see the IO tab of the [Single Core
Computing module]({{site.baseurl}}/pedagogic_modules/single_core_computing)). It is
connected to the compute site via a wire-area network link with 100 MB/sec bandwidth
and 100 milli-second latency. 

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

The  above is an estimate because, for instance, reading the input is more complicated. Since the
buffer size is 1 MB, the 200 MB input file is done in 200 phases. In each phase, but for the
first and the last, a 1 MB piece of the file is read from  disk while another 1 MB
piece is sent over to the network. Furthermore, there are network latencies.  You can
go back to the IO tab  of the [Single Core Computing module]({{site.baseurl}}/pedagogic_modules/single_core_computing)
and the [Networking Fundamentals module]({{site.baseurl}}/pedagogic_modules/pdcc/networking_fundamentals)  for the full detail.
But overall, the latencies are small, and the limiting resource in terms of bandwidth is not
the disk, nor the local-area link, but the 100 MB/sec wide-area link. So as an approximation we
simply say that the data is transferred at speed 100 MB/sec.  We will see in simulation
how accurate such back-of-the-envelope estimates are (turns out, they're often pretty good).

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
strategy is very simple, given that our workflow has a simple structure: whenever 
there are sufficient compute resources at a compute host (an idle core and 8 GB of RAM), start
the next to-be-executed pre_* task on it. When all pre_* tasks have been
executed, then the final task can be executed. 

Whenever several pre_* tasks start simultaneously, then also read
their input files simultaneously, thus splitting disk and network bandwidth. And, as
in the previous tab,  a task does not free up its compute resources until its output files
have all been fully written to disk.


#### Simulating Execution

XXXX HENRI WORKS HERE XXXXX

So that you can gain hands-on experience, use 
the simulation Web application
(see <a href="{{site.baseurl}}/pedagogic_modules/simulation_instructions/index/" target="_blank">instructions</a>),
selecting `Workflow Execution Fundamentals` from its menu. 


<div class="ui accordion fluid app-ins">
  <div class="title">
    <i class="dropdown icon"></i>
    (Open simulator here)
  </div>
  <div markdown="0" class="ui segment content">
    {% include simulator.html src="workflow_execution_fundamentals/" %}
  </div>
</div>


---

**Answer these questions based on the textual output above:**
  
  **[E.q1.1]** At what time did the WMS submit *task1* to the compute service?
  
  **[E.q1.2]** From the WMS's perspective, how long did *task1* run for?
    (this duration is called the task's **turnaround-time**)
  
  **[E.q1.3]** The compute service runs on a host with a speed of *1000 GFlop/sec*, and *task1*
    must perform *35 TFlop*. About how long should we expect *task1* to compute for?
  
  **[E.q1.4]** Why is the answer for q1.3 above much shorter than the answer for q1.2?

  
  **[E.q1.5]** About how long would it take to send all of
    *task1*'s input data from *storage_db.edu* to *hpc.edu* and to send all of *task1*'s output data
    from *hpc.edu* to *storage_db.edu*, using the direct link between these two hosts and assuming no other
    network traffic?
  
  **[E.q.6]** Accounting for this I/O *overhead*, does *task1*'s execution time as experienced by the WMS make sense?

##### Interpreting Visual Output from Simulated Workflow Execution

Analyzing the textual simulation output can be tedious, especially when the
workflow comprises many tasks and/or when there are many simulated
services. Fortunately, the simulator can produce a visualization of the
workflow execution as a Gantt chart and show various relevant durations in a table. 
These are shown on the Web app page below the text output. 

---

**Answer these questions based on the visual output:**

  **[E.q1.7]** What fraction of *task0*'s execution time is spent doing I/O?

  **[E.q1.8]** What fraction of *task1*'s execution time is spent doing I/O?

  **[E.q1.9]** Overall, what fraction of the workflow execution is spent doing I/O?

### Data- vs. Compute-intensive Workflow


If you answered question [E.q1.9] correctly, you found that the workflow
execution spends more time computing than doing I/O, overall.  Very broadly
speaking, we call such a workflow *compute-intensive*. The reverse situation would be an *I/O-intensive*.  However,
these notions depend on the hardware on which the workflow is executed. The
faster the network and/or slower to cores, the more compute-intensive the
workflow, and vice-versa.

---

**Answer these questions:**

  **[E.q1.10]** Using analysis (i.e., equations), for what compute speed (in
          GFlop/sec) of the core at site *hpc.edu* would our workflow
          execution being perfectly balanced between computation and I/O.

  **[E.q1.11]** Verify your answer to the previous question using the simulation. How far off were you?

  **[E.q1.12]** Your boss is absolutely intent of making the workflow execution as fast as possible by upgrading the machine at *hpc.edu*. The idea is to make the workflow execution three times as fast (compared to the execution with a 1000 GFlop/sec core) with this upgrade. Is this possible? If not, why not?


---
