
#### Learning Objectives
<div class="learningObjectiveBox" markdown="1">
  - Understand and be able to quantify the impact of RAM constraints on parallel performance
  - Understand and be able to quantify the impact of I/O on parallel performance
</div>

----

### RAM Constraints and Parallelism

As seen in the [Memory tab of the Single Core Computing
module]({{site.baseurl}}/pedagogic_modules/pdcc/single_core_computing/#/memory), a task
may have a sizable amount of data that needs to be loaded and/or generated into 
RAM so that it can execute. Recall from that module that we do not allow a program to 
use more memory than available in physical
RAM. Doing so is possible and handled by the Operating Systems (by
shuffling data back and forth between RAM and disk) but comes with
unacceptable performance penalties. So, here again,
we never
exceed the physical memory capacity of a host. If insufficient
RAM is available for a task, this task must wait for currently running
tasks to complete and free up enough RAM. This can cause cores to remain
idle. The worst possible case would be running a single task that uses the
entire RAM, thus leaving all remaining cores idle while it executes. 
Because RAM constraints can cause idle time, they can also cause
loss of parallel efficiency.

#### Simulating RAM Constraints

To gain hands-on experience, use the simulation 
app below.  This app is similar to that in the previous tab,
but now includes a field for specifying the "Ram Needed For
Each Task".  So now, we can simulate the fact that tasks require RAM space
to run.  The host we are simulating has 32 GB of RAM available.

First try using 4 cores for 8 tasks, where each task uses 8 GB of RAM.  As
you will see, there is no idle time. The number of
tasks we can run at a time is 4, given the number of cores and the amount
of RAM available.

Now try again, but this time set the tasks' RAM requirement to 16 GB. There will now be
idle time, as only 2 cores can be utilized simultaneously due to RAM
constraints.

{% include simulator.html src="multi_core_independent_tasks_ram" %}

----

#### Practice Questions 

**[A.2.p3.1]** You need to execute 5 tasks that each run in 1 second on one
core.  Your current single-core processor thus can run these tasks in 5
seconds.  The processor is then upgraded to have 5 cores, each identical in
processing power to the original single core. If the machine has 32 GB of
RAM and each task requires 8 GB of RAM to execute, what is the execution time
on the new 5-core processor? (You can double-check your answer in simulation.) What
is the parallel efficiency?
<div class="ui accordion fluid">
  <div class="title">
    <i class="dropdown icon"></i>
    (click to see answer)
  </div>
  <div markdown="1" class="ui segment content answer-frame">
On the single-core machine the RAM constraint was not a problem as
tasks were executed sequentially (there was never a need for more than 8
GB of RAM). With 5 cores, running all tasks concurrently would
require 5x8 = 40 GB of RAM, but only 32 GB is available. Therefore, we can only run
4 tasks at the same time. So the last task runs by itself, with 4 cores
being idle. The overall execution time is 2 seconds.  This is seen
easily in simulation.

Therefore:

$
\text{Speedup}(5)  = \frac{5}{2} = 2.5
$

and 

$
\text{Efficiency}(5)  = \frac{2.5}{5} = \text{50%}
$

We would have been better off with a 4-core computer (since, likely, it would cost less). 

  </div>
</div>

<p></p>

**[A.2.p3.2]** Assume you have a 2-core machine on which you need to run 6 tasks (in any order).
Each task runs in 1 second on a core. However, the tasks have the following RAM
requirements in GB: 6, 2, 4, 3, 1, 7.  If your machine has a total of 8 GB of RAM, can
you achieve 100% parallel efficiency?
<div class="ui accordion fluid">
  <div class="title">
    <i class="dropdown icon"></i>
    (click to see answer)
  </div>
  <div markdown="1" class="ui segment content answer-frame">
The question really is: Can you always run two tasks at the same time so that the sum
of their RAM requirements never exceeds 8 GB?  The answer is "yes":
  
  - Run the 7 GB and the 1 GB task together
  - Run the 6 GB and the 2 GB task together
  - Run the 4 GB and the 3 GB task together

(the order of the three steps above does not matter). 

  </div>
</div>

---

### I/O and Parallelism

Another common  cause of idle time is I/O. While a task running on a core
performs I/O, the core is (mostly) idle. We learned about  this in the [I/O
tab of the Single Core Computing
module]({{site.baseurl}}/pedagogic_modules/pdcc/single_core_computing/#/io).
In a parallel program this can translate to loss  of parallel efficiency.

Let's consider a simple parallel program: 4 tasks that each read in 10 MB
of input data and then performs 400Gflop of computation.  The 
program's tasks, showing input data files, is depicted below:

<object class="figure" type="image/svg+xml" data="{{ site.baseurl }}/public/img/multi_core_computing/example_io_dag.svg">I/O parallel program</object>
<div class="caption"><strong>Figure 1:</strong>
Example 4-task parallel program with I/IO. </div>

For now, let's consider an execution of this program on a 1-core
computer with a core that computes at 100 Gflop/sec and  a disk with
read bandwidth 10 MB/sec (on which the input data files are located). 
What is the execution time? Based on what we learned about I/O, we
should strive to overlap I/O and computation as much as possible.
For instance, the execution could proceed as follows:

<object class="figure" type="image/svg+xml" data="{{ site.baseurl }}/public/img/multi_core_computing/example_io_dag_1_core.svg">I/O parallel program execution on 1 core</object>
<div class="caption"><strong>Figure 2:</strong>
Execution on 1 core. </div>

It takes 1 second to read an input file, and then a task computes for 4
seconds.  Using overlap of I/O and computation, the execution time is thus
17 seconds (only the first file read is not overlapped with computation).
This is a great utilization of a single core. But what can we gain by
running on multiple cores?

Let's say now that we have 4 cores. One option is for all 4 tasks to start
at the same time, in which case they all read their input data at the same time
from disk. They split the disk bandwidth evenly, and thus it takes 4 seconds
for each task to read its input.  Then each task computes for 4 seconds on its own core. So
the program runs for 8 second on the 4 cores. This execution is
depicted below:

<object class="figure" type="image/svg+xml" data="{{ site.baseurl }}/public/img/multi_core_computing/example_io_dag_4_cores_1.svg">I/O parallel program execution on 4 core</object>
<div class="caption"><strong>Figure 3:</strong>
Execution on 4 cores, with simultaneous I/O. </div>
executions, so that only one file is read from disk at a time,  and so that
I/O is overlapped with computation. This alternative
is depicted below:

<object class="figure" type="image/svg+xml" data="{{ site.baseurl }}/public/img/multi_core_computing/example_io_dag_4_cores_2.svg">I/O parallel program execution on 4 core with staggered task start times</object>
<div class="caption"><strong>Figure 4:</strong>
Execution on 4 cores, with staggered I/O. </div>

The execution time is still 8s, so the two executions are equivalent.   

Overall, we achieve a parallel speedup of 17/8 = 2.125 and a parallel
efficiency of only about 53%. And this is in spite of having 4 identical
tasks and 4 cores, which, without I/O, would be 100% efficient.  Increasing
the parallel efficiency would require, for instance,  upgrading to a disk
with higher read bandwidth.

#### Simulating I/O Operations

The simulation app below allows you to simulation the execution of a
two-task program on a two-core computer. Each task reads its own input file
and writes its own output file.  The program is written such that at any
given time at most one file is being read/written from/to disk at a time (but computation can
happen while I/O is happening). For
instance, if Task #1 starts writing its output file before Task #2, then
Task #2 cannot start writing its output file until Task #1's output file
has been written. In other words, the execution looks like Figure 4 above,
and not like Figure 3 above. 

The app allows you to pick the characteristics (input/output file sizes,
amount of work) for Task #1, while Task #2 has set characteristics.  First
run the app with the default values for the characteristics of Task #1,
which is the easiest case where both tasks are identical. In this case, it
doesn't matter which task reads its input file first. Make sure you understand
the simulation output. Then you can
experiment with different Task #1 characteristics and different orders of
task executions, in particular while answering the practice questions
below.

{% include simulator.html src="multi_core_independent_tasks_io" %}

#### Practice Questions 

**[A.2.p3.3]** A parallel program consists of 2 tasks:

  - Task #1 reads 20 MB of input, computes 500 Gflop, writes back 100 MB of output
  - Task #2 reads 100 MB of input, computes for 500 Gflop, writes back 100 MB of output

We execute this program on a computer with two cores that compute at 
100 Gflop/sec and with a disk with 100 MB/sec read and write bandwidth. 

Is  it better to run Task #1 or Task #2 first? Try to come up with an answer via
reasoning rather than by estimate the execution time of both options and comparing.  You can
double-check your result in simulation.

<div class="ui accordion fluid">
  <div class="title">
    <i class="dropdown icon"></i>
    (click to see answer)
  </div>
  <div markdown="1" class="ui segment content answer-frame">

It's better to run Task #1 first. This is because it has a small input size, so it can start
executing early, and while it computes the input file for Task #2 can be read. This reasoning holds
because both tasks compute for the same time and write the same amount of output. The simulation confirms 
 that running Task #1 first is 0.8 seconds faster than running Task #2 first.

  </div>
</div>

<p></p>


**[A.2.p3.4]** A parallel program consists of 2 tasks:

  - Task #1 reads 120 MB of input, computes 800 Gflop, writes back 20 MB of output
  - Task #2 reads 100 MB of input, computes for 500 Gflop, writes back 100 MB of output

We execute this program on a computer with two cores that compute at 
100 Gflop/sec and with a disk with 100 MB/sec read and write bandwidth. 

Estimate the execution time of the "Task #1 first" option. For what fraction of this execution are both
 cores utilized. Double-check your result in simulation.

<div class="ui accordion fluid">
  <div class="title">
    <i class="dropdown icon"></i>
    (click to see answer)
  </div>
  <div markdown="1" class="ui segment content answer-frame">

Here is the time-line of events:
  - Time 0.0: Task #1 starts reading input
  - Time 1.2: Task #1 starts computing on core 1
  - Time 1.2: Task #2 starts reading input
  - Time 2.2: Task #2 starts computing on core 2
  - Time 7.2: Task #2 start writing output
  - Time 8.2: Task #2 finishes writing output
  - Time 9.2: Task #1 starts writing output
  - Time 9.4: Task #1 finishes writing output
   
Execution time: 9.4 seconds. Both cores are utilized from time 2.2 until time 7.2, that is for 5 seconds, which is
$5 / 9.4 = 53.2\%$ of the execution time.
   
  </div>
</div>

<p></p>

**[A.2.p3.5]** A parallel program consists of 2 tasks:
               
  - Task #1 reads 80 MB of input, computes 200 Gflop, writes back 100 MB of output
  - Task #2 reads 100 MB of input, computes for 500 Gflop, writes back 100 MB of output

We execute this program on a computer with two cores that compute at 
100 Gflop/sec and with a disk with 100 MB/sec read and write bandwidth. 

We consider the "Task #2 first" execution, which leads to some overall execution time. Say we now increase
the work of Task #1. What is the smallest increase that will cause the overall execution time to also increase?

<div class="ui accordion fluid">
  <div class="title">
    <i class="dropdown icon"></i>
    (click to see answer)
  </div>
  <div markdown="1" class="ui segment content answer-frame">

In this execution, Task #2 finishes its computation at time 6, while Task #1 finishes writing its output
at time 100/100 + 80/100 + 200/100 + 100/100 = 4.8. Consequently, Task #1 could compute for 6 - 4.8 = 1.2 seconds longer
without impacting the execution of Task #2. This means that the overall execution time would increase 
when Task #1's work becomes strictly superior to 120 Gflop.

One can double-check this in simulation, which gives the following execution times for different values of Task #1's work:
  - Task #1 work at 200 Gflop: 7.00 seconds (original)
  - Task #1 work at 320 Gflop: 7.00 seconds (no increase)
  - Task #1 work at 321 Gflop: 7.01 seconds (increase)
   
  </div>
</div>

<p></p>


**[A.2.p3.6]** A parallel program consists of 2 tasks:
               
  - Task #1 reads 200 MB of input, computes 300 Gflop, writes back 10 MB of output
  - Task #2 reads 100 MB of input, computes for 500 Gflop, writes back 100 MB of output

We execute this program on a computer with two cores that compute at 
100 Gflop/sec and with a disk with 100 MB/sec read and write bandwidth. 

Which of the two execution options ("Task #1 first" or "Task #2 first") leads to the
highest parallel efficiency? What is that efficiency? 

<div class="ui accordion fluid">
  <div class="title">
    <i class="dropdown icon"></i>
    (click to see answer)
  </div>
  <div markdown="1" class="ui segment content answer-frame">

The simulation gives the following execution times on 2 cores for each option:
 
  - Task #1 first: 9.00 seconds
  - Task #2 first: 7.10 seconds

We now need to determine the sequential execution time for each option. This is similar to 
what we did in the [I/O tab of the Single Core Computing module]({{site.baseurl}}/pedagogic_modules/pdcc/single_core_computing/#/io) when considering
overlap of I/O and computation:

  - Task #1 first: 200/100 + 300/100 + 500/100 + 100/100 = 11.00 seconds
  - Task #2 first: 100/100 + 500/100  + 300/100 + 10/100 = 9.0 seconds
  
Hence the parallel efficiencies:

  - Task #1 first: (11.00 / 9.00) / 2 = 61.1%
  - Task #2 first: (9.00  / 7.10) / 2 = 63.3%
   
The "Task #2 first" option has the higest parallel efficiency, at 63.3%. 
  </div>
</div>

<p></p>

---

#### Questions

**[A.2.q3.1]** We are using a computer with 32 GB of RAM. What is the parallel
efficiency when running 2 tasks on 2 cores if they each require 16 GB of RAM? What if
each task requires 20 GB of RAM?  Show your work. You can answer this question
purely via reasoning (i.e., no math).

**[A.2.q3.2]** You are given a 2-core computer with 15 GB of RAM. On this computer 
you need to execute 6 tasks. The tasks have different RAM requirements (in GB): 
4, 5, 8, 10, 11, 14. Can you achieve 100% parallel efficiency?  Show your reasoning. Consider  the tasks that can be paired (i.e., run simultaneously) and determine whether you can find 3 such pairs.

**[A.2.q3.3]** A program consists of 3 tasks that each takes in 2 GB of input data and
have 30,000 Gflop work. This program is executed on a 2-core computer with
1 Tflop/sec cores and equipped with a disk with 250 MB/sec read bandwidth. What is
the parallel  efficiency if the program can never overlap I/O and computation (but
multiple I/O operations can happen at the same time)? Show your work and reasoning.

**[A.2.q3.4]** Same question as above but now the program always overlaps I/O and
computation. Show your work and reasining.
