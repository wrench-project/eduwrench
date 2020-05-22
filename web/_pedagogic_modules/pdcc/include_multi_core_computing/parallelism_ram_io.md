
#### Learning Objectives:
 
- Understand and be able to quantify the impact of RAM constraints on parallel performance
- Understand and be able to quantify the impact of I/O on parallel performance

----

### RAM Constraints and Parallelism

As seen in the [Single Core Computing
module]({{site.baseurl}}/pedagogic_modules/single_core_computing), a task
may have a sizable amount of data that needs to be loaded and/or generated into RAM so that it can execute. Recall from that module that we do not allow a program to 
use more memory than available in physical
RAM. Doing so is possible and handled by the Operating Systems (by
shuffling data back and forth between RAM and disk) but comes with
unacceptable performance penalties. So, here again,
we never
exceed the physical memory capacity of a host. If insufficient
RAM is available for a task, this task must wait for currently running
tasks to complete and free up enough ram. This can cause cores to remain
idle. The worst possible case would be running a single task that uses the
entire RAM, thus leaving all remaining cores idle while it executes. 
Because RAM constraints can causes idle time, they can also cause
loss of parallel efficiency.

### Simulating RAM Constraints

So that you can gain hands-on experience, use the simulation 
app below.  This app is similar to that in the previous tab,
but now includes a field for specifying the "Ram Needed For
Each Task".  So now we can simulate the fact that tasks require RAM space
to run.  The host we are simulating has 32 GB of RAM available.

First try using 4 cores for 8 tasks, where each task uses 8 GB of RAM.  As
you will see, there is no idle time with the above situation. The number of
tasks we can run at a time is 4, given the number of cores and the amount
of RAM we have.

Now try again, but this time set the tasks' RAM requirement to 16 GB. There will now be
idle time, as only 2 cores can be utilized simultaneously due to RAM
constraints.

<div class="ui accordion fluid app-ins">
  <div class="title">
    <i class="dropdown icon"></i>
    (Open simulator here)
  </div>
  <div markdown="0" class="ui segment content sim-frame">
    {% include simulator.html src="multi_core_independent_tasks_ram/" %}
  </div>
</div>

----

#### Practice Questions 

**[A.2.p2.1]** You need to execute 5 tasks that each runs in 1 second on one
core.  Your current single-core processor thus can run these tasks in 5
seconds.  The processor is then upgraded to have 5 cores, each identical in
processing power to the original single core. If the machine has 8 GB of
RAM and each task requires 2 GB of RAM to execute, what is the parallel
efficiency on the new 5-core processor?
<div class="ui accordion fluid">
  <div class="title">
    <i class="dropdown icon"></i>
    (click to see answer)
  </div>
  <div markdown="1" class="ui segment content answer-frame">
On the single-core machine the RAM constraint was not a problem as
tasks were executed sequentially (there was never a need for more than 2
GB of RAM). With 5 cores, running all tasks concurrently would
require 5x2 = 10 GB of RAM, but only 8GB is available. Therefore, we can only run
4 tasks at the same time. So the last task runs by itself, with 4 cores
being idle. The overall execution time is 2 seconds. Therefore:

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

**[A.2.p2.2]** Assume you have a 2-core machine on which you need to run 6 tasks (in any order).
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

#### I/O and Parallelism

Another common  cause of idle time is I/O. While a task running on a core performs I/O, the core is (mostly) idle. We learned
about  this in the [Single Core Computing
module]({{site.baseurl}}/pedagogic_modules/single_core_computing). In a parallel program this can translate to loss  of parallel efficiency.

Let's consider a simple parallel program: 4 tasks that each read in 10 MB
of input data and then performs 400GFlop of computation.  The 
program's tasks, showing input data files, is depicted below:

<object class="figure" width="300" type="image/svg+xml" data="{{ site.baseurl }}/public/img/multi_core_computing/example_io_dag.svg">I/O parallel program</object>
<div class="caption"><strong>Figure 1:</strong>
Example 4-task parallel program with I/IO. </div>

For now, let's consider an execution of this program on a 1-core
computer with a core that computes at 400 GFlop/sec and  a disk with
read bandwidth 100 MB/sec (on which the input data files are located). 
What is the execution time? Based on what we learned about I/O 
in the [Single Core Computing
module]({{site.baseurl}}/pedagogic_modules/single_core_computing), we
should strive to overlap I/O and computation as much as possible.
For instance, the execution could proceed as follows:

<object class="figure" width="450" type="image/svg+xml" data="{{ site.baseurl }}/public/img/multi_core_computing/example_io_dag_1_core.svg">I/O parallel program execution on 1 core</object>
<div class="caption"><strong>Figure 2:</strong>
Execution on 1 core. </div>

It takes 1 second to read an input file, and then a task computes for 4
seconds.  Using overlap of I/O and computation, the execution time is thus
17 second (only the first file read is not overlapped with computation). This is a great
utilization of a single core. But what can we gain by  running on multiple cores?

Let's say now that we have 4 cores. One option is for all 4 tasks to start
at the same time, in which case they all read their input at the same time
from disk. They split the disk bandwidth evenly, and thus it takes 4 seconds
for each task to read its input.  Then each task computes for 4 seconds on its own core. So
the program runs for 8 second on the 4 cores. This execution is
depicted below:

<object class="figure" type="image/svg+xml" data="{{ site.baseurl }}/public/img/multi_core_computing/example_io_dag_4_cores_1.svg">I/O parallel program execution on 4 core</object>
<div class="caption"><strong>Figure 3:</strong>
Execution on 4 cores, with simultaneous I/O. </div>


One  may wonder whether it may be a  better idea  to stagger the  task
executions, so that only one file is read from disk at a time,  and so that
I/O is overlapped with computation. This alternative
is depicted below:

<object class="figure" type="image/svg+xml" data="{{ site.baseurl }}/public/img/multi_core_computing/example_io_dag_4_cores_2.svg">I/O parallel program execution on 4 core with staggered task start times</object>
<div class="caption"><strong>Figure 4:</strong>
Execution on 4 cores, with staggered I/O. </div>

The execution time is still 8s, so, for this example, the two executions are equivalent. 

Overall, we achieve a parallel speedup of 2 and a parallel efficiency of
only 50%. And this in in spite of have 4 identical tasks and 4 cores.
Increasing the parallel efficiency would require, for instance,  upgrading to a disk with
higher read bandwidth.

#### Practice Questions 

**[A.2.p2.3]** A parallel program consists of 2 tasks:

  - Task #1 reads 20 MB of input, computes 500 GFlop, writes back 10 MB of output
  - Task #2 reads 10 MB of input, computes for 200 GFlop, writes back 20 MB of output

We execute this program on a computer with cores that compute at 
100 GFlop/sec and with a disk with 100 MB/sec read and write bandwidth. 

What is the best parallel speedup  that can be achieved 
when running on 2 cores? 

<div class="ui accordion fluid">
  <div class="title">
    <i class="dropdown icon"></i>
    (click to see answer)
  </div>
  <div markdown="1" class="ui segment content answer-frame">
The execution on 1 core is as follows:
<object class="figure" width="400" type="image/svg+xml" data="{{ site.baseurl }}/public/img/multi_core_computing/example_io_dag_1_core_practice.svg">I/O parallel program execution on 1 core (practice)</object>

and takes 11 seconds. 

The execution on 2 cores is as follows:

<object class="figure" width="400" type="image/svg+xml" data="{{ site.baseurl }}/public/img/multi_core_computing/example_io_dag_2_cores_practice.svg">I/O parallel program execution on 2 cores (practice)</object>

and takes 8 seconds. So the speedup is only 11/8 = 1.375. 

Note that there are other options for running this program. For instance,
we could start with reading the input for  Task #2. This is not
a good idea, be  cause it means that Task #1 (which is much longer  than
Task #2) will start, and thus finish, later. Here is the execution:

<object class="figure" width="400" type="image/svg+xml" data="{{ site.baseurl }}/public/img/multi_core_computing/example_io_dag_2_cores_practice_no_good.svg">I/O parallel program execution on 2 cores (practice)</object>

This execution takes 9s, that is, 1 more second!

You may be wondering what happens if one doesn't stagger the I/O, but instead
starts reading input files of both tasks at once. In this case, due to
disk bandwidth sharing, Task #2 starts at time 2 and Task #1 starts at time 3. So here also, the execution takes 9s. You  can try to draw the execution  timeline  as an exercise.



  </div>
</div>

<p></p>


---

#### Questions

**[A.2.q2.1]** We are using a computer with 32 GB of RAM. What is the parallel
efficiency when running 2 tasks on 2 cores if they each require 16 GB of RAM? What if
each task requires 20 GB of RAM?

**[A.2.q2.2]** You are given a 2-core computer with 15 GB of RAM. On this computer 
you need to execute 6 tasks. The tasks have different RAM requirements (in GB): 
4, 5, 8, 10, 11, 14. Can you achieve 100% parallel efficiency? 

**[A.2.q2.3]** A program consists of 3 tasks that each take in 2 GB of input and
have 30000 GFlop work. This program is executed on a 2-core computer with
1 TFlop/sec cores and equipped with a disk with 250 MB/sec read bandwidth. What is
the parallel  efficiency if the program can never overlap I/O and computation (but
multiple I/O operations can happen at the same time)? 

**[A.2.q2.4]** Same question as above but now the program always overlaps I/O and
computation.

