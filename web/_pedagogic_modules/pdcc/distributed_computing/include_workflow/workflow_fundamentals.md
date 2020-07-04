
#### Learning Objectives

  - Understand the concept of a workflow
  - Be able to reason about the performance of a workflow on a multi-core computer

---

### What is a workflow?

A **workflow** (a.k.a. "scientific workflow") application is comprised of
individual computational tasks that must all be executed in some particular
sequence to produce a final desired output (e.g., all the steps necessary
to perform some complex genomic analysis can be organized as a
bioinformatics workflow). In practice, **the tasks are stand-alone
executable programs that read in input files and produce output files**.  A file
produced as output by one task can be required as input for another task. Consequently, a 
workflow is typically represented as a **DAG of tasks** where edges are
file dependencies (see the [Dependencies tab of the Multi Core
Computing module]({{site.baseurl}}/pedagogic_modules/pdcc/multi_core_computing/#/dependencies) 
in which we already discussed dependencies between tasks). 

There are two typical "rules of execution" in practice:

  - *A task cannot start before all its input files have been generated.*
  - *A task's output file is available only once all of that task's output files have been generated.* 

In other words, a task is considered completed only once it has written all
its output files.  Until then, its output files are "invisible" to
other tasks. This is because, unless we know the details of a task's 
implementation, we can never be sure when an output file is finalized before 
the task's program actually exits.

**For now, we assume that a task can only run using a single core**. 

The figure below depicts an example workflow application:

<object class="figure" type="image/svg+xml" data="{{ site.baseurl }}/public/img/workflows/example_workflow_1.svg">Dag</object>
<div class="caption">
<strong>Figure 1:</strong> Example workflow
application. Some examples of real-world workflows for scientific
applications, along with their DAG representations, can be found
[here](https://pegasus.isi.edu/application-showcase/).
</div>

#### Simulating Multi-core Workflow Execution

This module relies heavily on concepts introduced in previous modules. 
To make sure you master these concepts, we
provide you with a simulation app and accompanying practice
questions thereafter. **If you find this content too difficult or are missing key
knowledge, you may
want to review the previous modules**. In particular, many concepts
come from the [Single Core Computing module]({{site.baseurl}}/pedagogic_modules/pdcc/single_core_computing) 
and the [Multi Core Computing module]({{site.baseurl}}/pedagogic_modules/pdcc/multi_core_computing).

The app below simulates the execution of the
example workflow in Figure 1 on a computer with 50 Gflop/sec cores and 16 GB
of RAM.  Attached to this computer is a disk. The app allows you to pick
the number of cores and the disk read/write bandwidth. 

As these pedagogic modules increase in complexity and sophistication, the
number of execution options also increases.  The example
workflow above is designed to have an execution that is relatively constrained 
in terms
of the number of execution options. But we still need to specify some aspects of the
execution strategy simulated by the app:

  - A core never runs more than one task at time (this is because, as in all 
    previous modules, we disallow time-sharing of cores);
  - When there is not enough free RAM on the computer, tasks cannot be
    started;
  - When there are multiple ready tasks, they are started on cores in
    lexicographical order (i.e., "task2" would start before "task3");
  - When two ready tasks are started they immediately read their input
    files.  For instance, if task2 and task3 are ready and can both run
    simultaneously (enough cores, enough RAM), they do start at the same time
    and read their input files simultaneously. Importantly, 
    these tasks then split the disk bandwidth equally.

<div class="ui accordion fluid app-ins">
  <div class="title">
    <i class="dropdown icon"></i>
    (Open simulator here)
  </div>
  <div markdown="0" class="ui segment content sim-frame">
    {% include simulator.html src="workflow_fundamentals/" %}
  </div>
</div>


---

#### Practice Questions

Answer these practice questions, using the simulation app and/or using 
analysis  (and then using the app for double-checking your results):

**[A.3.4.p1.1]** How many MB of data are read and written by the workflow when executed on this computer?

<div class="ui accordion fluid">
  <div class=" title">
    <i class="dropdown icon"></i>
    (click to see answer)
  </div>
  <div markdown="1" class="ui segment content answer-frame">
This can easily be done analytically. The table below shows for each file the
total amount of read/write it causes in MB:

|------|-----| ------|-----|------|
| file | size in MB | times read | times written | total MB read/written | 
|------|-----| ------|-----|------|
| data    | 500 | 1 | 0 | 500 |
|filtered | 400 | 3 | 1 | 1600 |
|finalA   | 200 | 1 | 1 | 400 |
|finalB   | 200 | 1 | 1 | 400 |
|finalC   | 200 | 1 | 1 | 400 |
|aggBC    | 200 | 1 | 1 | 400 |
|------|-----| ------|-----|------|

So the total amount of data read/written
is $500 + 1600 + 4 \times 400 = 3700$ MB.

We can verify this in simulation. Running the app with 1 core and with disk bandwidth
set to 100, the total execution time is 231 seconds.  The time to perform the computation
is the sum of the task execution times: $10 + 20 + 100 + 20 + 40 + 4 = 194$ seconds.

So the time to perform the I/O is $231 - 194 = 37$ seconds. Since the disk bandwidth
is 100 MB/sec, this means the total data size is: 3700 MB!

  </div>
</div>
<p></p>

**[A.3.4.p1.2]** What is the parallel efficiency when executing the workflow on 3 cores and when the
disk bandwidth is 150 MB/sec?

<div class="ui accordion fluid">
  <div class=" title">
    <i class="dropdown icon"></i>
    (click to see answer)
  </div>
  <div markdown="1" class="ui segment content answer-frame">
  
The simulation shows that the 1-core execution takes time 218.67 seconds,
while the 3-core execution takes time 197.33 seconds. So the speedup
on 3 cores is 218.67 / 197.33 = 1.108.  Meaning that the parallel efficiency
is 1.108/3 = 36.9%.  This is pretty low.
  </div>
</div>
<p></p>

**[A.3.4.p1.3]** Explain why there is never any improvement when going from
a 2-core execution to a  3-core execution for this workflow? 

<div class="ui accordion fluid">
  <div class=" title">
    <i class="dropdown icon"></i>
    (click to see answer)
  </div>
  <div markdown="1" class="ui segment content answer-frame">

The lack of improvement is easy to see in the simulation. In fact, executions look 
identical with 2 and 3 cores.

The width of the DAG is 3, so in principle using 3 cores could be useful. 
The only level of the DAG with 3 tasks is the "blue" level. Unfortunately,
the 3 tasks in that level cannot run concurrently due to RAM constraints.
At most 2 of them can run concurrently (task3 and task4) since together
they use less than 16 GB of RAM. 
 
  </div>
</div>
<p></p>

**[A.2.3.p1.4]**  Consider the execution of this workflow on 2 cores
with disk bandwidth set to 50 MB/sec. Is the disk ever used concurrently
by tasks? How can you tell based on the simulation output?

<div class="ui accordion fluid">
  <div class=" title">
    <i class="dropdown icon"></i>
    (click to see answer)
  </div>
  <div markdown="1" class="ui segment content answer-frame">
Tasks task3 and task4 use the disk concurrently. This is easily seen in the
"Workflow Task Data" section of the simulation output. For instance, task3 spends 16
seconds reading its input file. Given that this file is 400 MB, this means that
task3 experiences a read bandwidth of 400/16 = 25 MB/sec. This is half  of
the disk bandwidth, meaning that the disk is used concurrently by another task (task4),
which also gets half of the disk bandwidth.
 
  </div>
</div>
<p></p>

**[A.2.3.p1.5]** Considering a 1-core execution of the workflow, for which
disk bandwidth would the execution be perfectly balanced between computation time
and I/O time? 

<div class="ui accordion fluid">
  <div class=" title">
    <i class="dropdown icon"></i>
    (click to see answer)
  </div>
  <div markdown="1" class="ui segment content answer-frame">

Let $B$ be the unknown bandwidth. The compute time is, as we
saw in question A.2.3.p1.1 above, 194  seconds. The I/O time,
again based on what we saw in that previous question, is
3700 / $B$ seconds. So we simply need to solve:

$
3700 / B = 194
$

which gives $B$ = 19.07 MB/sec.  We can verify this in simulation by setting
$B$ to 19. The simulation shows a total execution time of 388.7 seconds,
which is almost exactly twice 194. 

  </div>
</div>
<p></p>

**[A.2.3.p1.6]** Considering computation and I/O, what is the length
of the workflow's critical path (in seconds) if the disk bandwidth
is 100 MB/sec?

<div class="ui accordion fluid">
  <div class=" title">
    <i class="dropdown icon"></i>
    (click to see answer)
  </div>
  <div markdown="1" class="ui segment content answer-frame">
In the [Task Dependencies tab of the Multi Core Computing module]({{site.baseurl}}/pedagogic_modules/pdcc/multi_core_computing/#/dependencies)
we defined the critical path without any I/O. Extending this notion to I/O is
 straightforward (one can simply consider file reads and writes as
extra tasks to perform). 

We have 3 possible paths in the workflow, and for each one we can compute
its length (i.e., duration in  seconds), as follows (note that all intermediate files
are both written and read, and hence are counted "twice"):

  - task1->task2->task6: 5 + 10 + 4 + 4 + 20 + 2 + 2 + 4 = 51 seconds
  - task1->task3->task5->task6: 5 + 10 + 4 + 4 + 100 + 2 + 2 + 40 + 2 + 2 + 4 = 175 seconds
  - task1->task4->task5->task6: 5 + 10 + 4 + 4 + 20 + 2 + 2 + 40 + 2 + 2 + 4 = 95 seconds

The critical path (the middle path) has length 175 seconds. No execution can proceed faster
than 175 seconds no matter how many cores are used. 

  </div>
</div>
<p></p>


**[A.2.3.p1.7]** Give your thoughts on why this workflow is poorly suited
for parallel execution in general and on our 3-core computer in particular. 

<div class="ui accordion fluid">
  <div class=" title">
    <i class="dropdown icon"></i>
    (click to see answer)
  </div>
  <div markdown="1" class="ui segment content answer-frame">

There are three clear problems here:

  - *Problem #1:* Only 1 level of the workflow has 3 tasks, and all other levels have
1 task. So this workflow is mostly sequential, and **Amdahl's law** tells us this is bad news.

  - *Problem #2:* The only parallel level (the "blue" level) suffers from high
**load imbalance**. One task runs in 100 seconds, while the other two
run in 20 seconds. So, when running on 3 cores, assuming no I/O, the parallel efficiency is
at most (140/100)/3 = 46.6%. 

  - *Problem #3:* On our particular computer, the **RAM constraints** make things even worse as the
workflow's width becomes essentially 2 instead of 3. We can never run the
3 blue tasks in parallel. 

To get a sense of how "bad" this workflow is, let's assume infinite
disk bandwidth and infinite RAM capacity (which removes Problem #3 above). In this case, on 3 cores,
the workflow would run in time: 10 + 100 + 40 + 4 = 154 seconds. The
sequential execution time would be 194 seconds. So the speedup would only
be 1.26, for a parallel efficiency of only 42%.  *Amdahl's law is never 
good news.*

  </div>
</div>
<p></p>

---

#### Questions


Given the workflow below, answer the following questions:

<object class="figure" type="image/svg+xml" data="{{ site.baseurl }}/public/img/workflows/workflow_fundamental_question.svg">Dag</object>
<p></p>

**[A.2.3.q1.1]** How many MB of data are read during an execution of this workflow? How many are written?
<p></p>

**[A.2.3.q1.2]** Say we run this workflow on a 1-core computer where the core speed is 100 Gflop/sec and the 
disk has read/write bandwidth at 100 MB/sec. What is the workflow execution time?
<p></p>

**[A.2.3.q1.3]** Say now this computer has 2 cores, and the workflow execution strategy is, whenever there is 
a choice, to start the task with the **highest work**.  What is the execution time? What is the parallel efficiency? 
<p></p>

**[A.2.3.q1.4]** Would the result be different if we instead picked
the tasks with the **lowest work** first?
<p></p>

**[A.2.3.q1.5]** Say we now have 4 cores. Explain why there is no way to get the parallel efficiency above 
60% even if the disk can be upgraded at will.
<p></p>

---
