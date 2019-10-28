---
layout: page
title: 'G. Workflows and Parallelism'
order: 700     
usemathjax: true
---

1. [Learning objectives](#learning-objectives)
2. [Overview](#overview)
3. [Activity](#activity)
4. [Conclusion](#conclusion)

# Learning Objectives
- Gain exposure to cluster platforms;
- Understand how compute core and compute node parallelism affects workflow execution times;
- Understand the tradeoffs between parallelism and utilization;
- Be able to compare alternative strategies for executing tasks in parallel.

# Overview
## Workflow and Platform Scenario
<object class="figure" type="image/svg+xml" data="{{ site.baseurl }}/public/img/workflow_execution_parallelism/workflow.svg">Workflow</object>

In this activity we use the workflow depicted in Figure 1. It consists of 20 computationally
intensive, independent tasks followed by a less intensive final task that depends on the previous 20 tasks.
Additionally, each task now has a
RAM requirement such that the amount of RAM a task uses is equal the sum of its input and output file sizes.
For instance, each task could read its input in some array allocated in RAM, and generate all its output
in another array allocated in RAM. 

The structure of this workflow appears
to be "joining" multiple tasks into one, so naturally this structure is typically called a "join"
(note that this has nothing to do with a database type of "join").   

<object class="figure" type="image/svg+xml" data="{{ site.baseurl }}/public/img/workflow_execution_parallelism/cyber_infrastructure.svg">Cyberinfrastructure</object>


Figure 2 depicts this activity's cyberinfrastructure. We build upon the
basic cyberinfrastructure that was introduced in the previous modules.
The Compute Service (CS) now has a configurable number of machines on
which it can execute tasks. It has access to several
physical machines, equipped with
dual-core processors and 80 GB of RAM. When the CS receives a job
containing multiple tasks, it may execute these tasks concurrently across
multiple compute nodes. The CS in this activity is what is known as a
**cluster** and can be decomposed into two parts: a **frontend node** and the
**compute node(s)**. The frontend node (*hpc.edu/node_0*) handles job 
requests from the Workflow
Management System (WMS) and dispatches work to the compute node(s) 
(*hpc.edu/node_1*, *hpc.edu/node_2*, etc.).
In this activity, our WMS submits
all workflow tasks to the CS at once, specifying for each task on which
compute node it should run, trying to utilize the available compute nodes
as much as possible.  

Connecting the CS's frontend node and compute nodes are
high-bandwidth, low latency-network links going from each machine to a
centralized switch, which also serves as the gateway for network traffic
entering and exiting the cluster's local area network. This means that
a file being transferred from the Remote Storage Service at
*storage_db.edu* to the CS at *hpc.edu* must travel through two links:
first the link between *storage_db.edu* and the switch, then the link
between the switch and the frontend node at *hpc.edu/node_0*. Say that
the file is 3000 MB, based on what we learned from the
[primer on file transfer times]({{ site.baseurl }}/pedagogic_modules/networking_fundamentals),
we expect the duration of this file transfer to be as follows:

$$
\begin{align}

T_{3000\;MB\;file} & = \sum_{l \in route} Latency(l) + \frac{m}{\min\limits_{l \in route} Bandwidth(l)} \\
                   & = (100us + 10us) + \frac{3000\;MB}{125\;MB/sec} \\
                   & = 0.000110\;sec + 24\;sec \\
                   & = 24.000110\;seconds\\
                   & \simeq 24\;seconds
\end{align}
$$

The front end node has 10 TB of storage, which is called the *scratch storage*. This
is essentially a local storage service. When a compute node reads a file from 
scratch storage, the file
travels through the two links separating the compute node and the frontend
node. For example, if the compute node at *hpc.edu/node_1* reads a 3000 MB
file from the scratch storage at *hpc.edu/node_0*, the expected duration
for that read operation is as follows:

$$
\begin{align}

T_{3000\;MB\;file} & = \sum_{l \in route} Latency(l) + \frac{m}{\min\limits_{l \in route} Bandwidth(l)} \\
                   & = (10us + 10us) + \frac{3000\;MB}{1250\;MB/sec} \\
                   & = 0.000020\;sec + 2.4\;sec \\
                   & = 2.40002\;seconds\\
                   & \simeq 2.4\;seconds

\end{align}
$$

So it's 10 times cheaper to read/write files from/to the cluster's scratch storage than 
from/to the remote SS. 


We will begin  by using a CS with a single compute node.
We will then augment the CS with more cores and more nodes to see how
the execution of our workflow is affected. Individual processor speed and RAM
capacity of compute nodes are kept constant throughout.

## WMS Scenario

<object class="figure" type="image/svg+xml" data="{{ site.baseurl }}/public/img/workflow_execution_parallelism/wms.svg">WMS</object>

The WMS implementation in this activity submits tasks to the CS using the
following scheme regarding file operations: 

  - Read the initial input files from the remote storage service;

  - Write the final output file to the remote storage service;

  - Read and write all other files using the CS's scratch space. 


This scheme is depicted in Figure 3. Having scratch storage on the CS is key to enabling
data locality, which is itself key to better performance, as we learned
in the previous [Worfklows and Data Locality module]({{ site.baseurl }}/pedagogic_modules/workflow_execution_data_locality). 




## Step 1: A Cluster with a Single Compute Node


So that you can gain hands-on experience, use 
the simulation Web application
(see <a href="{{site.baseurl}}/pedagogic_modules/simulation_instructions/index/" target="_blank">instructions</a>),
selecting `Workflow Execution: Parallelism` from its menu.  
The questions below ask you to run particular simulation scenarios.

<object class="figure" type="image/svg+xml" data="{{ site.baseurl }}/public/img/workflow_execution_parallelism/compute_service_1.svg">Compute Service 1</object>

  **[F.q1.1]** Assuming the cluster has 1 single-core compute node (Figure 5), what do you expect the overall execution time of the workflow to be?
  To this end, write a simple formula. In the simulation app,  set the cluster to have 1 single-core node. Run the simulation and check your answer. (Note that you might not be able to see file transfer operations in the displayed Gantt charts because these operations could be very short relatively to the overall execution time.)
  
  
  **[F.q1.2]** Based on the dependencies present in the workflow, what tasks could we potentially execute in parallel if we had 20 cores instead of 1 core?



<object class="figure" type="image/svg+xml" data="{{ site.baseurl }}/public/img/workflow_execution_parallelism/compute_service_2.svg">Compute Service 2</object>

  **[F.q1.3]** Assuming the cluster has 1 10-core compute node (Figure 6), what do you expect the execution time of the workflow to be?
  To this end, write a simple formula. In the simulation app, set the cluster to have 1 10-core node.
   Run the simulation and check your answer.
  
  **[F.q1.4]** By inspecting the Host Utilization Gantt chart in the simulation app, is the parallel efficiency greater than 50%? Explain. 
       **Important: while I/O is going on, we consider that the cores are idle!**
  
  **[F.q1.5]** Write a formula for the parallel efficiency and compute the value as a percentage. 


<object class="figure" type="image/svg+xml" data="{{ site.baseurl }}/public/img/workflow_execution_parallelism/compute_service_3.svg">Compute Service 3</object>

  **[F.q1.6]** Assuming the cluster has 1 15-core compute node (Figure 7), what do you expect the execution time of the workflow to be?
  To this end, write a simple formula. In the simulation app, set the cluster to have 1 15-core node.
  Run the simulation and check your answer.
  
  **[F.q1.7]** If parallel efficiency higher or lower than that computed in question F.q1.5?
  
  **[F.q1.8]** Overall, was it worth it switching from a 10 core node to a 15 core node?

<object class="figure" type="image/svg+xml" data="{{ site.baseurl }}/public/img/workflow_execution_parallelism/compute_service_4.svg">Compute Service 4</object>

Assuming the cluster has 1 20-core node:
  
  **[F.q1.9]** At what time would task T0 start?
  
  **[F.q1.10]** At what time would task T19 start?
  
  **[F.q1.11]** At what time would task T20 start?
  
  **[F.q1.12]** How long can we expect the execution time of this workflow to be? To this end, write a simple formula.
    In the simulation app, set the cluster to have 1 20-core node (Figure 8).
    Run the simulation and check your answer against the results.
  
  **[F.q1.13]** How much faster did we execute the workflow on this platform compared to the initial platform that had only a single core?
  
  **[F.q1.14]** Would adding one extra core to our machine further decrease the workflow execution time? Explain.
  
  **[F.q1.15]** What is the parallel efficiency as a percentage?

## Step 2: Augment the Cluster to Have Multiple Compute Nodes

In Step 1, each workflow task had a RAM requirement such that its RAM
usage was equal to the sum of its input and output file sizes. What about
RAM required for the task itself? That is, real-world workflow tasks (and
programs in general) usually require some amount of RAM for storing program instructions,
possibly large temporary data-structures, the runtime stack, etc. In this step we thus introduce an *additional*
12 GB RAM requirement for each task (Figure 9). For example, *task0* previously required
4 GB of RAM, whereas in this step it requires **16 GB of RAM**.

<object class="figure" type="image/svg+xml" data="{{ site.baseurl }}/public/img/workflow_execution_parallelism/workflow_using_additional_ram.svg">Workflow With Additional RAM Requirement</object>

As we have learned in the
[Multi-core Computing module]({{ site.baseurl }}/pedagogic_modules/multi_core_computing),
if a compute node does not have enough RAM to execute
a task, the task execution must be deferred. Since our hosts have 80 GB of RAM, 
this means that at most 5tasks can run concurrently on a host (because 6 times 16 is greater than
80). The following questions reveal how this requirement forces us to find
another means of utilizing parallelism and increasing workflow execution
performance.

  **[F.q1.16]** Assume that the cluster has 1 20-core node and that **Workflow Tasks each require an additional 12 GB of RAM, meaning that they require 16 GB**.
  What can we expect the execution time of the workflow to be? Write a simple formula. In the simulation app,
  set the simulator to have a single compute node with 20 cores (Figure 8).
  Check the box that says "Workflow Tasks each require an additional 12 GB of RAM". Run the simulation and check your results against the simulator.

  **[F.q1.17]** Set the number of cores to be 32 and check the box that says "Workflow Tasks each require an additional 12 GB of RAM". Run the simulation.
  What is the execution time of the workflow?

  **[F.q1.18]** Why doesn't going to 32 cores improve workflow execution performance?

  **[F.q1.19]** In fact, what is the minimum number of cores on the host that will give us the same performance?

<object class="figure" type="image/svg+xml" data="{{ site.baseurl }}/public/img/workflow_execution_parallelism/compute_service_5.svg">Compute Service 5</object>

  **[F.q1.20]** Assuming the cluster has 4 8-core compute nodes (Figure 10), what can we expect the execution time of the workflow to be?
    Write a simple formula. Now set the simulator to have 4 compute nodes, each with 8 cores. Check the box that
    says "Workflow Tasks each require an additional 12 GB of RAM". Run the simulation and check your results against the simulator.

  **[F.q1.21]** How much faster did the workflow execute in this execution when compared to the previous one (the answer from F.q1.16)?

  **[F.q1.22]** What about the parallel efficiency? Compute it as a percentage using a simple formula.

  **[F.q1.23]** Assuming we had been able to purchase 4 5-core compute nodes instead of 4 8-core compute nodes, what would the parallel efficiency have been?

  **[F.q1.24]** Assuming that you can add an arbitrary number of 5-core nodes, with the same per-core compute speed, is it possible to
          decrease the workflow execution time?

  **[F.q1.25]** What is the minimum number of 3-core nodes that achieves this fastest possible execution time?


# Conclusion

In this activity, you were presented with a workflow containing a set of tasks that could be executed in
parallel. To achieve better performance, you first attempted to "vertically" scale the compute service by adding
more cores to a compute node (in practice, vertically scaling can also mean purchasing a faster processor).
Your results showed that parallel execution of tasks did in fact increase workflow execution performance to a
certain degree. Next, you calculated utilization when using a different number of cores. These results should
have demonstrated to you that one cannot always execute workflows as fast as possible while achieving 100% utilization.

After introducing the concept of utilization, we added
additional RAM requirements to the workflow in order to simulate a situation
more relevant to actual practice. Under those circumstances, the workflow
execution performance collapsed when running this workflow on a single node
CS. Rather than simply adding more cores to the single compute node, you
grew the cluster "horizontally" by adding more compute nodes. Using this strategy, you were
able to increase workflow execution performance up to a certain point.

Sometimes adding more cores or extra machines does nothing except decrease utilization.
But most importantly, both strategies, when used judiciously, can be beneficial. Therefore,
it is crucial to be cognizant of the hardware resources a workflow demands in addition to dependencies
present in its structure.   

---