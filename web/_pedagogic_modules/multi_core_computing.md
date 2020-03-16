---
layout: page
title: 'B. Multi-core Computing'
order: 200
usemathjax: true
---

The goal of this module is to introduce you to the basic concepts of running 
multiple instances of single-threaded programs on a multi-core computer.


#### Learning Objectives:

  - Understand the need for using multi-core machines;

  - Understand the concepts of parallel speedup and efficiency;

  - Understand the relationship between idle time, speedup and efficiency;
  
  - Understand the impact of RAM constraints on idle time.

----

<!--
# Multi-Core Computing

1. [Basics](#basics)
2. [Benefits](#benefits)
    * [Speedup](#speedup)
    * [Efficiency](#efficiency)
3. [Exercises](#exercises)
-->

## Basics

Multi-core processors have become ubiquitous due to well-documented issues
with further increasing the performance of a single core.  Each core is
capable of executing code independently of other cores. 
In this module, we take a simplified view of multi-core machines.  We
consider only programs that can use a single core, a.k.a.  single-threaded
programs, and will take a look at  multi-threaded programs later.

We use the term *tasks* to refer to independent executions of one program
but for different input. For instance, we could have 5 tasks where each
task renders a different frame of a movie. Of course, we could also have
each task correspond to a different program, which will be the topic of an
upcoming module. We call the set of tasks we want to execute an **application**.

As mentioned in the [Single Core Computing]({{ site.baseurl
}}/pedagogic_modules/single_core_computing) module, we do not consider time
sharing. That is, we will only consider application executions in which at most one
task runs on a core at a given time. Although Operating Systems allow
time-sharing, we will never start more tasks than cores on the
machine.  Therefore, a task that begins running on a core will run
uninterrupted until completion on that same core.


## Parallelism

One motivation for running the tasks of an application on multiple cores is speed.  For
example, if you have tasks that a single core can complete in one hour, it
will take four hours to complete four tasks. If you have two of these
cores in a dual-core processor, now you can complete the same four tasks in only
two hours. This concept is called **parallelism**: running multiple 
tasks at the same time, or *concurrently*, to complete a set of tasks faster.

Unfortunately, most real-world applications do not have the ideal
parallelism behavior above, that is, executing *n* times faster with *n*
cores. Instead, they execute less than *n* times faster. This may seem
surprising, but comes about due to many reasons.  For instance, when two
tasks execute concurrently on two different cores, they still compete for
the memory hierarchy, e.g., the L3 cache and the memory bus, and we refer
you to Computer Architecture textbooks for more details. In this module,
unless specified otherwise, we assume that two tasks on two different cores
proceed do not compete for the memory hierarchy.  But even so, there  are
still other reasons why an application cannot achieve ideal parallelism.
Before we get to these reasons, let us first define two crucial metrics:
*Parallel Speedup* (or *Speedup*) and *Parallel Efficiency* (or
*Efficiency*).

### Parallel Speedup

Parallel speedup is a metric used to quantify the acceleration in speed due to
using multiple cores.  It is calculated by dividing the execution time of
the application on a single core by the execution time of this same application on
multiple cores, say *p*. The speedup on *p* cores is thus expressed as
follows:

$$
\begin{align}
\text{Speedup}(p) & = \frac{\text{Execution Time}(1)}{\text{Execution Time}(p)}\;
\end{align}     
$$

For instance, if an application runs in 3 hours on 1 core but runs in 2 hours on 2 cores, then its speedup is:

$$
\begin{align}
\text{Speedup}(2) & = \frac{3}{2} = 1.5\;
\end{align}     
$$

In this example, we would be somewhat "unhappy" because although we have 2 cores, we *only* go 1.5 times faster. This leads us to our next metric!


### Parallel Efficiency

The concept of parallel efficiency is essentially about how much useful work the
cores can do for an application, or how much "bang" do you get for your
"buck". The "bang" is the speedup, and the "buck" is the number of cores.
More formally, the efficiency of an application execution on $p$ cores is: 

$$
\begin{align}
\text{Efficiency}(p) & = \frac{\text{Speedup}(p)}{\text{p}}\
\end{align}     
$$

If the parallel speedup on 2 cores is 1.5, then the
efficiency is:

$$
\begin{align}
\text{Efficiency}(2) & = \frac{1.5}{2} = 0.75 = \text{75%}\
\end{align}     
$$

In the best case, the efficiency would be 100% (which corresponds to going
*p* times faster with *p* cores). In the above example, it is only 75%, meaning
that we are "wasting" some of the available compute capacity of our machine during the application's 
execution. 

At this point, you may be wondering, how is this (less than 100% efficiency) possible?


## Load Imbalance and Idle Time

A common cause for sub-100% efficiency is **idle time**, i.e., time during
which one or more cores are not able to work while others are working.
Assuming that all tasks run for the same amount of time, as in this module,
idle time will occur when *n*, the number of tasks, is not divisible by *p*,
the number of cores. For example, if we have 8 tasks that each run  for 1
hour and 5 cores, all cores will be busy for the first 5 tasks, but once
this phase of execution is finished, only 3 of the 5 cores will have
another task to complete. Thus, 2 cores sit idle while 3 work, for 1 hour.
In this situation we says that **the load is not well-balanced across
cores**. With discrete tasks such as these the balance cannot be
improved.

There is **direct relationship** between idle time and parallel efficiency, assumuming idle time is
the only cause of loss in parallel efficiency. *The parallel efficiency is
the sum of the core non-idle times divided by the product of the number of cores by the
overall execution time.*  

The above statement may sound complicated, but it's very intuitive on an example. Consider a dual-core computer that executes an application in 1 hour. 
The first core computes for 30 min, and then is idle for 30 min.
The second core is idle for 15 minutes, and then computes for 45 minutes. This execution is depicted in the 
figure below, where idle time is shown in white and compute time in yellow:


<object class="figure" type="image/svg+xml" data="{{ site.baseurl }}/public/img/multi_core_computing/utilization.svg">Utilization</object>

What the above statement says is that the parallel efficiency is the yellow area divided by the area of the whole rectangle. In other
words, the parallel efficiency is (1 * 30 + 1 * 45) / (2 * 60) = 62.5%. 

The more "white" in the figure, the lower the parallel efficiency. If there is as much white as yellow, then the parallel efficiency
is 50%, because half the compute power is wasted. You get the idea.



### Simulating Load Imbalance

So that you can gain hands-on experience, use 
the simulation Web application
(see <a href="{{site.baseurl}}/pedagogic_modules/simulation_instructions/index/" target="_blank">instructions</a>),
selecting `Multi-core Machines` from its menu. 

This simulation app allows you to pick the number of cores and tasks to run. Try first with a single core running 5 
tasks (ignore the "Ram Needed For Each Task" field, and leave the "Task GFlop" field at 100). 
Take particular notice of the "Host Utilization" graph. Now try running a number of tasks and cores where 
the number of tasks does not evenly divide the number of cores. Looking at the host utilization graph again, now 
you will be able to see idle time for some of the cores represented by pink. Whenever we can see that pink on the graph,
we know that parallel efficiency is below 100%. 


#### Practice Questions

 
**[B.p1.1]** Assume you have 24 tasks to execute on a multi-core computer,
where each task runs in 1 second on a core.  By what factor is the overall
execution time reduced when going from 4 to 6 cores?

<div class="ui accordion fluid">
  <div class="title">
    <i class="dropdown icon"></i>
    (click to see answer)
  </div>
  <div markdown="1" class="ui segment content">
   The total execution time when using 4 cores will be 6 seconds. When
   increasing from 4 cores to 6 cores, now the total execution time is 4
   seconds. The overall execution time is reduced by a factor  6/4 = 1.5.

  </div>
</div>

<p></p>

**[B.p1.2]** Assume you now have 3 tasks to compute, still each taking 1 second
on a core. What is the parallel efficiency on a 4-core computer? 

<div class="ui accordion fluid">
  <div class="title">
    <i class="dropdown icon"></i> (click to see answer)
  </div> <div markdown="1" class="ui segment content">
   When using only a single core, the 3 tasks will take 3 seconds to
   complete. When increasing the number of cores to 4, the same tasks can
   now be done in 1 second. Since *p* the number of cores is greater than
   *n* the number of tasks, we know that it will not be 100% efficiency.
   More precisely, the parallel speedup is 3, and thus the parallel
   efficiency is 3/4 = 75%. 

  </div>
</div>

<p></p>

**[B.p1.3]** You are upgrading your deprecated single core processor and
you have two new multi-core processors to choose from, one with 5 cores and
one with 10 cores.  Your only concern is to maximize parallel efficiency.  All of
the cores are identical.  You have 15 tasks to run, each taking 1 second to
complete on a core.  Which multi-core processor will provide the higher
efficiency?


<div class="ui accordion fluid">
  <div class="title">
    <i class="dropdown icon"></i>
    (click to see answer)
  </div>
  <div markdown="1" class="ui segment content">
   When using only a single core, the 15 tasks will take 15 seconds to
   complete. 

   When increasing the number of cores to 5, the same tasks can now be done
   in 3 seconds, and there is no idle time (since 5 divides 15). Therefore
   parallel efficiency is 100%.

   When increasing the number
   of cores to 10, the tasks take 2 seconds. In this scenario, 
   for the last second, 5 out of the 10 cores are
   idle. Therefore, efficiency is less than 100% (it is 75%). 

   We conclude that we should go with the 5-core processor.

  </div>
</div>


## Adding RAM Constraints

As we talked about previously in [Single Core
Computing]({{site.baseurl}}/pedagogic_modules/single_core_computing), when
a core is executing a task, the task may have a sizable amount of data
that needs to be loaded into RAM. An additional cause for idle time,
besides load imbalance, on a multi-core machine is that all of the cores
share the same amount of RAM.  Therefore, there could be idle cores and
tasks that need to run, but there is not sufficient RAM. Unfortunately, in
this case, we cannot execute these tasks, and the idle cores must remain
idle until more RAM becomes available (i.e., when currently running  tasks
complete).  As a result, parallel efficiency falls below 100%. This is
because we simply don't allow ourselves to use more memory than available
in physical RAM, which would be handled by the Operating Systems (by shuffling data
back and forth between RAM and disks) but would come with unacceptable performance
losses.  


### Simulating RAM Constraints

So that you can gain hands-on experience, use 
the simulation Web application
(see <a href="{{site.baseurl}}/pedagogic_modules/simulation_instructions/index/" target="_blank">instructions</a>),
selecting `Multi-core Machines` from its menu. 

Previously when using the simulation app, you left the "Ram Needed For Each Task" field at zero. This time around, we recognize
that tasks may require RAM. The host we are using has 32 GB of RAM available. First try using 4 Cores for 8 tasks, where each task
uses 8 GB of RAM. 
 
As you will see, there is no idle time with the above situation. The number of tasks we can run at a time is 4, both by 
the amount of cores we have and the amount of ram we have. Now try again, but this time the Task RAM should be set to 
16 GB. There will now be idle time, as only 2 cores can be utilized simultaneously in this situation. 



#### Practice Questions 

**[B.p1.4]** You need to execute 5 tasks that each runs in 1 second on one
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
   On the single-core machine  the RAM constraint was not a problem as
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
  </div>
</div>

<p></p>

**[B.p1.5]** Assume you have a 2-core machine on which you need to run 6 tasks (in any order).
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


<!--  template    
        
<div class="ui accordion fluid">
  <div class="title">
    <i class="dropdown icon"></i>
    (click to see answer)
  </div>
  <div markdown="1" class="ui segment content">
   When using only a single core, the 15 tasks will take 15 seconds to complete. When increasing the number of cores to 
      5,
   the same tasks can now be done in 3 seconds. When increasing the number of cores to 10, the tasks take 2 seconds. What 
   is important to notice is that for the last second, 5 of the cores in the 10 core processor will be idle. Since our main
   concern for this exercise is efficiency rather than raw speed, we would go with the 5 core processor.

$$
\begin{align}
  \text{Speedup}_5 & = \frac{15}{3} = 5\\
  \text{Efficiency}_5 & = \frac{5}{5} = 1 = \text{100% Efficiency}\\
  \text{Speedup}_{10} & = \frac{15}{2} = 7.5\\
  \text{Efficiency}_{10} & = \frac{7.5}{10} = 0.75 = \text{75% Efficiency}
\end{align}
$$
  </div>
</div>
        
-->




<!--
When looking at sequential computing efficiency is a simple concept, the processor is either working a task or the 
program has completed. When looking at multi-core computing however, the notion of efficiency becomes important as part 
of the processor (some cores) may be working while others sit idle, and doubling the number of cores usually will not 
double the speed.  
-->

---

## Questions

Answer the following questions:

##### For These Questions, Tasks require 0 RAM. 

**[B.q1.1]** What is the speedup that you will observe for running 10 identical tasks
             on 1 core versus running these same 10 tasks on 2 cores? What is the efficiency?

**[B.q1.2]** What is the speedup that you will observe for running 10
identical tasks on 1 core versus these same 10 tasks on 3 cores?  What is the efficiency?

##### For These Questions, Task RAM requirements are non-zero. Each task will take 1 second to complete. 

**[B.q1.3]** We are using a computer with 32 GB of RAM. How long does it take
to run 2 tasks on 2 cores if they each require 16 GB of RAM? What if
each task requires 20 GB of RAM?

**[B.q1.4]** You are given a 2-core computer with 15 GB of RAM. On this computer 
you need to execute 6 tasks. The tasks have different RAM requirements (in GB): 
4, 5, 8, 10, 11, 14. Can you achieve 100% parallel efficiency? 



---
