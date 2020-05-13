
#### Learning objectives:

  - Understand the concept of a *workflow*;
  - Be able to reason about the performance of a workflow when run on a single multi-core computer

---

#### What is a workflow?

A **workflow** (a.k.a. "scientific workflow") application is comprised of
individual computational tasks that must all be executed in some particular
sequence to produce a final desired output (e.g., all the steps necessary
to perform some complex genomic analysis can be organized as a
bioinformatics workflow). In practice, **the tasks are stand-alone
executable programs that read in input files and produce output files**.  A file
produced as output by one task can be required as input for another task. *A
task cannot start before all its input files have been generated. Also, a
task's output file is available only once all the task's output files have been
generated.* Consequently, a workflow is a **DAG of tasks** where edges are
file dependencies (see the [Multi Core
Computing]({{site.baseurl}}/pedagogic_modules/multi_core_computing)). 
**For now, we assume that a task can only run using a single core**. 

The figure below depicts an example workflow application:

<object class="figure" type="image/svg+xml" data="{{ site.baseurl }}/public/img/workflows/example_workflow_1.svg">Dag</object>
<div class="caption">
<strong>Figure A.3.4.1.1:</strong> Example workflow
application. Some examples of real-world workflows for scientific
applications, along with their DAG representations, can be found
[here](https://pegasus.isi.edu/application-showcase/).
</div>




### Simulating multi-core workflow execution

To make sure that you master them concepts in the previous modules, we
provide you with a simulation app below and accompanying practice
questions thereafter. **If you find this content too difficult or are missing key
knowledge, you may
want to review the previous modules.**

The  app simulates the execution of the above
example workflow on a computer with 1 or more 50 GFlop/sec cores and 16 GB
of RAM.  Attached to this computer is a disk. The app allows you to pick
the number of cores and the disk read/write bandwidth. 

As these pedagogic modules increase in complexity and sophistication, the
number of execution options also increases.  The example
workflow above is designed to make its execution relatively constrained in terms
of all execution options, but we still need to specify some aspects of the
execution strategy simulated by the app:

  - A core never runs more than one task at time;
  - When there is not enough free RAM on the computer, tasks cannot be
    started;
  - When there are multiple ready tasks, they are started on cores in
    lexicographical order (i.e., "task2" would start before "task3");
  - When two ready tasks are started they immediately read their input
    files.  For instance, if task 3 and task 4 are ready and can both run
    simultaneously (enough cores, enough RAM), they do start at the same time
    and read their input files simultaneously (splitting the disk bandwdith
    equally).

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
computing. The input file to the first task is read once, which takes 4 seconds. 
Each of the other 12 files is written once and read once, which takes
12 * (4 + 4) = 96 seconds.  This is a total of 100 seconds of I/O. 

Overall, the execution spends 90 seconds computing and 100 seconds doing 
file I/O. I should double the disk bandwidth!

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

**[D.q1.3]** If each file is 1GB, how many GB in total are **read** from
the storage server where all files must be stored?

<p></p>
