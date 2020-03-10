---
layout: page
title: 'D. Workflow Fundamentals'
order: 400
usemathjax: true
---

#### Learning objectives:

  - Understand the concept of a *workflow*;
  
  - Understand the structure of cyberinfrastructures on which one can execute
    workflows;

  - Understand the concept of a workflow management system (WMS).

---


1. [What is a workflow?](#what-is-a-workflow)
2. [What kind of resources and infrastructures are necessary to execute a workflow?](#what-kind-of-resources-and-infrastructures-are-necessary-to-execute-a-workflow)
3. [What is a workflow management system?](#what-is-a-workflow-management-system)

## What is a workflow?

**Workflows**. A workflow (a.k.a. "scientific workflow") application is comprised of individual computational tasks that must all be executed in some particular sequence to produce a final desired output (e.g., all the steps necessary to perform some complex genomic analysis can be organized as a bioinformatics workflow). In many relevant cases, the tasks, which can be many and computationally intensive, correspond to executables that read in input files and produce output files.  A file produced as output by one task can be required as input for another task, thus creating dependencies between tasks.

**Simple Workflow Analogy**. Consider a chef tasked with cooking a meal. The entire task can be split up into three steps. First, they need to select and procure the ingredients. Second, they need to cook these ingredients. Finally, the cooked ingredients must be plated. None of these tasks may be completed out of order. Now consider a scientist with terabytes of raw data tasked with analyzing that data. First, they need to do some preliminary processing of the raw data to transform it into a workable format. Second, the formatted data must go through a computationally intensive process that outputs a human readable visualization of the formatted data. Finally, the scientist analyzes the data and distills some useful information about the origins of our universe. Again, none of these tasks may be done out of order. Although the two workflows mentioned above come from entirely different domains, they share several characteristics. First, the initial task may be started immediately because it has no dependencies (some workflows may have multiple initial tasks without any dependencies). Second, subsequent tasks can only be started once their "parent" tasks have completed. This leads to a simple representation of workflows as tasks graphs.

**Workflows as DAGs**. Workflows can be represented as graphs in which
tasks are vertices and task dependencies are edges. In many cases, these
workflow graphs are Directed Acyclic Graphs (DAGs) because there are no
circular task dependencies.  Once formalized as DAGs, it is possible to
reason about workflow structure so as to organize workflow execution as
best as possible.

The figure below depicts example workflows. Each task is shown as a circle. In a workflow
some tasks may be executed at the same time (in parallel). For instance, for the workflow
in Fig. 2 below, tasks 2, 3 and 4 can be executed in parallel if one has 3 cores. These tasks
are called **independent**, meaning that they are neither successors or predecessors of
each other. 

In these pedagogic modules we assume that we know the computational cost of
each task (in number of floating point operations, or FLOPS). Workflow
files, which are taken as input and produced as output of the tasks, are
shown as rectangle. In these pedagogic modules we assume that we know all
file sizes (in bytes). **We also assume, unless specified otherwise, that
a task can only run on a single thread** (i.e., each task is a single-threaded program). 

<object class="figure" type="image/svg+xml" data="{{ site.baseurl }}/public/img/workflow_fundamentals/dag.svg">Dag</object>

Some examples of real-world workflows for scientific applications, along with their DAG representations, can be found [here](https://pegasus.isi.edu/application-showcase/).

## What kind of resources and infrastructures are necessary to execute a workflow?

Workflows are often comprised of many tasks that are computationally intensive and require large amounts of storage. As a result, it is necessary to deploy their executions on multiple compute/storage resources connected via some network, i.e., distributed computing platforms. These hardware resources are managed by software infrastructures, together forming a "*cyberinfrastructure*" (a term you may have encountered before). Examples of such infrastructures include cloud services that rely on virtual machines,  batch-scheduled high performance computing (HPC) clusters (a.k.a. [supercomputers](https://www.top500.org/)), clusters that run [Hadoop](https://hadoop.apache.org/) or [Spark](https://spark.apache.org/), publicly available data stores that provide data access using various network protocols, and compositions of any number of theses over possibly wide-area networks, etc. Communications between these resources are subject to network latency and bandwidth constraints. Therefore the underlying network infrastructure, in conjunction with the specifications of the interconnected storage and compute resources,  constrains the performance of distributed applications, in our case workflow applications. Figure 3 below shows a simple depiction of a cyberinfrastructure with a cloud, and HPC cluster, and a data server. 


<object class="figure" type="image/svg+xml" data="{{ site.baseurl }}/public/img/workflow_fundamentals/infrastructure.svg">Infrastructure</object>

## What is a Workflow Management System?

Due to the complexity and diversity of these infrastructures, users are not left to their own devices for executing workflows. Instead, they rely 
on a *Workflow Management System (WMS)*, i.e., a software system that automatically orchestrates the execution of workflows on cyberinfrastructures. To do so, most WMSs implement decision-making algorithms for optimizing workflow execution performance given available hardware resources. WMSs and the algorithms they employ are the object of extensive research in the field of distributed computing.


---

#### Practice Questions

Here are a few practice questions about the above material:


**[D.p1.1]** Given the workflow in Figure 1, that is executed on a 
single computer with a single core, would it help to upgrade
the computer by adding one core to it?


<div class="ui accordion fluid">
  <div class=" title">
    <i class="dropdown icon"></i>
    (click to see answer)
  </div>
  <div markdown="1" class="ui segment content">
No, it wouldn't. This workflow is a "chain" workflow, in which
each task is done in sequence. Since we assume that each task
can utilize a single core, then there is no way to use more than
one core at a time. Upgrading to add more cores to the computer
won't help.
  </div>
</div>

**[D.p1.2]** Given the workflow in Figure 2, assume that each task
has work 1 GFlop, and that each file is 0-byte (i.e., it takes time zero to
read/write those files). If I execute this workflow on a dual-core computer
where each core has speed 0.1 GFlop/sec, what is the parallel speedup? What
is the parallel efficiency?


<div class="ui accordion fluid">
  <div class=" title">
    <i class="dropdown icon"></i>
    (click to see answer)
  </div>
  <div markdown="1" class="ui segment content">
A task runs on a core in 10 seconds.  The sequential execution time is thus
90 seconds, because we have 9 tasks.  On a dual-core machine, 
the execution time would be 10 + 20 + 10 + 20 + 10 = 70 seconds. 
This is because the 1st, 3rd, and 5th level of the workflow
each has a single task, and thus runs in 10 seconds. The 2nd
and 4th level have three tasks. On two cores, we can run
two of these tasks in parallel, and then the third task
by itself. Therefore, these three tasks can run in 20 seconds. 

The parallel speedup is 90/70 = 1.28. The parallel
efficiency is thus 1.28/2 = 64.28%. 
 
  </div>
</div>

**[D.p1.3]** Given the workflow in Figure 2, assume that each task
has work 1 GFlop, and that each file is 0-byte (i.e., it takes time zero to
read/write those files). What is the best parallel speedup
I can achieve assuming I can use as many cores as I want?

<div class="ui accordion fluid">
  <div class=" title">
    <i class="dropdown icon"></i>
    (click to see answer)
  </div>
  <div markdown="1" class="ui segment content">

I can use at most three cores since at any given time there
are only three tasks that can be executed in parallel. Using
three cores, each level of the workflow runs in 10 seconds.
Therefore, the total execution times is 60 seconds, for a 
speedup of 90/60 = 1.5. 

This is not a good parallel efficiency (50%). The fact that
some levels of the workflow have a single task really 
hurts the speedup because while that task executes 
two cores are left idle. 
 
  </div>
</div>

**[D.p1.4]** Given the workflow in Figure 2, let's assume that each task
has work 10 GFlop, and that each file is 2 GB. We execute this workflow on
a single-core computer that reads/writes files to/from some storage server.
The core has speed 1 GFlop/sec, and the bandwidth to the storage server is
500 MB/sec. If I have a choice of two upgrades, either double the core
speed or double the bandwidth to the storage server, which one should I
pick to get the best improvement in overall execution time?


<div class="ui accordion fluid">
  <div class=" title">
    <i class="dropdown icon"></i>
    (click to see answer)
  </div>
  <div markdown="1" class="ui segment content">

In total, there are 9 tasks so the original computer will spend 90 seconds
computing. The input file to the first task is read once, which takes 5 seconds. 
Each of the other 12 files is written once and read once, which takes
12 * (5 + 5) = 120 seconds. 

Overall, the execution spends 90 seconds computing and 125 seconds doing 
file I/O. I should double the disk bandwidth!

This is not a good parallel efficiency (50%). The fact that
some levels of the workflow has a single task really 
hurts the speedup because while that task executes 
two cores are left idle. 
 
  </div>
</div>


---

#### Questions

Answer the following questions, all of which pertain to the workflow
disk below:

<object class="figure" type="image/svg+xml" data="{{ site.baseurl }}/public/img/workflow_fundamentals/dag_questions.svg">Dag</object>

<p></p>

**[D.q1.1]** Given the workflow above, assuming that all files are of
size zero and all tasks have work 10 GFlop, what is the best possible
execution time on a dual-core computer where cores have speed 2 GFlop/sec?

<p></p>

**[D.q1.2]** With the same assumption as the question above, what is the
best parallel speedup one can achieve?  What is the parallel efficiency?

<p></p>

**[D.q1.3]** If each file if 1GB, how many GB in total are **read** from
the storage server where all files must be stored?

<p></p>








<p> </p>

