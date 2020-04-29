
#### Learning Objectives:
 
- Understand the impact of RAM constraints on parallel performance

----

#### Adding RAM Constraints

As seen in the [Single Core Computing
module]({{site.baseurl}}/pedagogic_modules/single_core_computing), a task
may have a sizable amount of data that needs to be loaded into RAM so that
it can execute. An additional cause for idle time, besides load imbalance,
on a multi-core machine is that all of the cores share the RAM. Therefore,
there could be idle cores and tasks that need to run, but not sufficient
RAM. Unfortunately, in this case, the idle cores must remain idle until
more RAM becomes available (i.e., when currently running tasks complete).
As a result, parallel efficiency falls below 100%. This is because we
simply don't allow ourselves to use more memory than available in physical
RAM. Doing so is possible and handled by the Operating Systems (by
shuffling data back and forth between RAM and disks) but comes with
unacceptable performance penalties. So, as in the [Single Core Computing
module]({{site.baseurl}}/pedagogic_modules/single_core_computing), we never
exceed the physical memory capacity of a host.

### Simulating RAM Constraints

So that you can gain hands-on experience, use the simulation Web application below.
This app is similar to that in the previous tab (Parallelism), but now includes
a field for specifying the "Ram Needed For Each Task". 
So now we can simulate the fact that tasks require RAM space to run. Note
that the host we are simulating has 32 GB of RAM available. 
The host we are using has 32 GB of RAM available. 

First try using 4 Cores for 8 tasks, where each task uses 8 GB of RAM.  As
you will see, there is no idle time with the above situation. The number of
tasks we can run at a time is 4, given the number of cores and the amount
of RAM we have.

Now try again, but this time set the Task RAM to 16 GB. There will now be
idle time, as only 2 cores can be utilized simultaneously due to RAM
constraints.

<div class="ui accordion fluid app-ins">
  <div class="title">
    <i class="dropdown icon"></i>
    (Open simulator here)
  </div>
  <div markdown="0" class="ui segment content">
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
  <div markdown="1" class="ui segment content">
   On the single-core machine the RAM constraint was not a problem as
   tasks were executed sequentially (there was never a need for more than 2
   GB of RAM). With 5 cores, running all tasks concurrently would
require 5x2 = 10 GB of RAM, but only 8GB is available. Therefore, we can only run
   4 tasks at the same time, and the last task runs by itself, with 4 cores
   being idle. The overall execution time is 2 seconds. Therefore:

$$
\begin{align}
  \text{Speedup}(5) & = \frac{5}{2} = 2.5\\
  \text{Efficiency}(5) & = \frac{2.5}{5} = \text{50%}
\end{align}
$$

   We would have been better off with a 4-core computer, since, likely, it would cost less. 
  </div>
</div>

<p></p>

**[A.2.p2.1]** Assume you have a 2-core machine on which you need to run 6 tasks (in any order).
Each task runs in 1 second on a core. However, the tasks have the following RAM
requirements in GB: 6, 2, 4, 3, 1, 7.  If your machine has a total of 8 GB of RAM, can
you achieve 100% parallel efficiency?

<div class="ui accordion fluid">
  <div class="title">
    <i class="dropdown icon"></i>
    (click to see answer)
  </div>
  <div markdown="1" class="ui segment content">
   The question really is: Can you always run two tasks at the same time so that the sum
   of their RAM requirements never exceeds 8 GB?  The answer is "yes":
  
  - First, run the 7 GB and the 1 GB task together
  - Then, run the 6 GB and the 2 GB task together
  - Finally, run the 4 GB and the 3 GB task together

(the order of the three steps above does not matter). 


  </div>
</div>


---

#### Questions

**[A.2.q2.1]** We are using a computer with 32 GB of RAM. How long does it take
to run 2 tasks on 2 cores if they each require 16 GB of RAM? What if
each task requires 20 GB of RAM?

**[A.2.q2.2]** You are given a 2-core computer with 15 GB of RAM. On this computer 
you need to execute 6 tasks. The tasks have different RAM requirements (in GB): 
4, 5, 8, 10, 11, 14. Can you achieve 100% parallel efficiency? 
