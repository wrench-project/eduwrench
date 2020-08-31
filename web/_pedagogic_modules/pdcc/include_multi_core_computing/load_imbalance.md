
#### Learning Objectives
<div class="learningObjectiveBox" markdown="1">
  - Understand the concept of load imbalance and how it causes idle time
  - Understand and quantify the relationship between idle time, speedup, and efficiency
</div>

---


### Load Imbalance and Idle Time

One reason why a parallel program's parallel efficiency can be less than 100% is
 **idle time**: 
time during which one or more cores are not able to work while other cores are
working. A common cause of idle time is **load imbalance**. 

Consider a parallel program that consists of $n$  tasks, each of them
running in the  same amount of time on a core. We run this program on a
computer with $p$ cores.  If $n$ is not divisible by $p$,  then at least
one core will be idle during program execution.  For example, if we have 8
tasks, that each run for 1 hour; and 5 cores, all cores will be busy
running the first 5 tasks in parallel.  But once this phase of execution is
finished, we have 3 tasks left and 5 available cores. So 2 cores will have nothing to do for
1 hour.  In this situation, we say that **the load is not well-balanced
across cores**. Some cores will run two tasks, while others will run only one task.

There is a **direct relationship** between idle time and parallel
efficiency, assuming idle time is the only cause of loss in parallel
efficiency. **The parallel efficiency is the sum of the core non-idle times
divided by the product of the number of cores by the overall execution
time.**

The above statement may sound complicated, but it is very intuitive on an example. 
Consider a 2-core computer that executes a multi-task program in 35 minutes. 
One core computes for 
the full 35 minutes, while the other core computes for 20 minutes
and then sits idle for 15 minutes.  
This execution is depicted in the figure below:

<object class="figure" type="image/svg+xml" data="{{ site.baseurl }}/public/img/multi_core_computing/utilization.svg">Utilization</object>
<div class="caption"><strong>Figure 1:</strong>
Example 35-minute execution on a 2-core computer. 
The white area is the core idle time, 
the yellow area is the  core compute time.</div>

What the above statement says is that the parallel efficiency is the yellow
area divided by the area of the whole rectangle. The white area is the
number of *idle core minutes* in the execution. In this case it is equal to $1 \times 15$ minutes. 
*The more white in the figure, the lower the parallel efficiency.*
In this example, the
parallel efficiency is $(1 \times 35 + 1 \times 20) / (2 \times 35)$ = 78.5%. 
You can note that this is exactly the speedup (55/35) divided by the number
of cores (2). 


#### Simulating Load Imbalance

To gain hands-on experience, use the simulation app below on your own and
to answer the practice questions hereafter.

This app allows you to pick a number of cores and a number of tasks to run
on these cores.  Try first with a single core running 5 tasks. Note  that you can vary
the per/task amount of work in Gflop, but this value does not impact the
overall execution pattern. The "Host Utilization" graph displays the
execution as  in Figure 1 above. Now try running a number of tasks and
cores where the number of tasks does not evenly divide the number of cores.
Looking at the host utilization graph again, now you will be able to see
idle time for some of the cores (in light pink). Whenever there is idle
time, parallel efficiency is below 100% and you can easily compute
its actual value. 

{% include simulator.html src="multi_core_independent_tasks" %}

#### Practice Questions

**[A.2.p2.1]** You have a 4-core computer where each core computes at speed 1000 Gflop/sec. 
You are told that a 10-task parallel program has 30 idle core seconds in total when executed
on that computer. All tasks have the same work. What is the task work in  Gflop? You can double-check
your answer with the simulation app above.
<div class="ui accordion fluid">
  <div class="title">
    <i class="dropdown icon"></i>
    (click to see answer)
  </div>
  <div markdown="1" class="ui segment content answer-frame">
  Since we have 10 tasks and 4 cores, in the last phase of execution 2 cores are idle
  while 2 cores compute. Let  $w$ be the work of a task. The duration of this last
  phase is $w / 1000$ seconds, i.e., work divided by compute speed. So the total idle core seconds is $2 \times w / 1000$, since 2 cores are idle in the last phase. We know this
  number to be 30 seconds, therefore we simply need to solve:

$
\frac{2\times w}{1000} = 30
$

which gives us $w = $ 15000 Gflop/sec. 

We can use the simulation app to double-check our result. We just need to enter 1500, instead of 15000,
as the task work amount in Gflop since in the simulation the core computes 10 times slower than in this
question. The simulation clearly shows that the number of idle seconds is $15 \times 2 = 30$. 

  </div>
</div>
<p></p>

**[A.2.p2.2]** You are told that a 10-task program runs in 1 hour
on a 3-core machine. All tasks execute in the same amount of time on one core. 
What is the execution time of one task? You can double-check
your answer with the simulation app above.

<div class="ui accordion fluid">
  <div class="title">
    <i class="dropdown icon"></i>
    (click to see answer)
  </div>
  <div markdown="1" class="ui segment content answer-frame">
The execution proceeds in 4 phases. If each of the first three phases
3 tasks are executed in parallel. In the last phase a single task executes. 
Therefore, each phase takes 60/4 = 15 minutes, which is the execution time of a task.

You can double-check this in simulation by setting the task work to $15\times 60 \times 100 = 90000$, so
that each task runs in 15 minutes on a core. The simulation clearly shows a 3600-second execution time,
i.e., 1 hour. 
  </div>
</div>
<p></p>

**[A.2.p2.3]** Assume you have 20 tasks to execute on a multi-core computer,
where each task runs in 1 second on a core. By what factor is the overall
execution time reduced when going from 4 to 8 cores? You can double-check
your answer in simulation. 
<div class="ui accordion fluid">
  <div class="title">
    <i class="dropdown icon"></i>
    (click to see answer)
  </div>
  <div markdown="1" class="ui segment content answer-frame">
The total execution time when using 4 cores will be 5 seconds, as each
core executes 5 tasks. When increasing from 4 cores to 8 cores, now the
total execution time is 3 seconds. This is because the best we can do is
have 4 of the cores run 2 tasks and the other 4 run 3 tasks. The
overall execution time is reduced by a factor 5/3 = 1.66.

This is seen easily in simulation by setting the task work to 100 GFlop. 
  </div>
</div>
<p></p>

<!--
**[A.2.p1.6]** Assume you now have 3 tasks to compute, still taking 1 second each
on a core. What is the parallel efficiency on a 4-core computer? 
<div class="ui accordion fluid">
  <div class="title">
    <i class="dropdown icon"></i> (click to see answer)
  </div> <div markdown="1" class="ui segment content answer-frame">
When using only a single core, the 3 tasks will take 3 seconds to
complete. When increasing the number of cores to 4, the same tasks can
now be done in 1 second. Since $p$ the number of cores is greater than
$n$ the number of tasks, we know that it will not be 100% efficiency.
More precisely, the parallel speedup is 3, and thus the parallel
efficiency is 3/4 = 75%. 
  </div>
</div>
<p></p>
-->

**[A.2.p2.4]** You are upgrading your (pre-historic?) single-core computer and
you have two new multi-core computers to choose from, one with 5 cores and
one with 10 cores. *Your only concern is to maximize parallel efficiency.* All of
the cores are identical. You have 15 tasks to run, each taking 1 second to
complete on a core. Which multi-core computer will provide the highest
parallel efficiency?
<div class="ui accordion fluid">
  <div class="title">
    <i class="dropdown icon"></i>
    (click to see answer)
  </div>
  <div markdown="1" class="ui segment content answer-frame">
When using only a single core, the 15 tasks will take 15 seconds to
complete. 

When increasing the number of cores to 5, the program runs
in 3 seconds, and there is no idle time because 5 divides 15 perfectly. Therefore,
parallel efficiency is 100%.

When increasing the number
of cores to 10, the program runs in 2 seconds. In this scenario, 
for the last second, 5 out of the 10 cores are
idle. Therefore, efficiency is 75%, which is less than 100%.

We conclude that we should go with the 5-core computer. Even though the 10-core
computer completes the program faster, our concern here was parallel efficiency.
  </div>
</div>
<p></p>

---

### More Load Imbalance with Non-Identical Tasks

In all the above, we've only considered "identical" tasks: all tasks run in
the same amount of time. Therefore, the main question was how the number of
cores divides the number of tasks. If it divides it perfectly then we can have
100% efficiency. **But in many real-world programs tasks are not identical.**
Some can take longer than the other. This is another possible source of
load imbalance, and thus of idle time, and thus of loss of parallel efficiency.

Consider a 5-task program that runs on a 2-core computer. The tasks take 10s,
16s, 4s, 5s, and 11s, respectively. How fast can we run this program? For instance, we
could run the first 3 tasks (10s, 16s, and 4s) on one core, and the last 2
tasks (5s and 11s) tasks on the other core. The first core would thus work
for 30s while the second core would work for only 16s. The program thus
runs in 30 seconds, and the parallel efficiency is 
$46 / (30 \times 2)$ = 76%. 

Can we do better? If you think
about it, the problem is to split the set of numbers {10, 16, 4, 5, 11}
into two parts, so that the sum of the numbers in each part are as close to
each other as possible. In this case, because we only have 5 numbers, we
can look at all options. It turns out that the best option is: {10, 11}
and {16, 4, 5}. That is, we run the first and last tasks on one core, and
all  the other tasks on another core. In this case, one core computes for 21s and the
other for 25s. The parallel efficiency is now 92%.

What if we now have 3 cores? Then we have to split our set of numbers into
3 parts that are as "equal" as possible. The best we can do is: {10, 5},
{16}, and {11, 4}. In this case, the program runs in 16 seconds and the
parallel efficiency on 3 cores is almost 96%. It is not useful to use more
cores. This is because the program can never run faster than 16
seconds as it include a 16-second task.

It turns out that splitting sets of numbers into parts with sums as close
to each other as possible is a difficult problem. We are able to do it for
the small examples like above, but as soon as the number of tasks gets large,
it is no longer humanly possible. And in fact, it is not computer-ly
possible either, or at least, not quickly. More formally, determining the best split is an NP-complete
problem (see Algorithms/Theory [textbooks](/textbooks)). We will encounter this kind of
problem, i.e., how to allocate tasks to compute resources, again in upcoming modules.

----

#### Practice Questions

**[A.2.p2.5]** A 5-task program runs optimally (i.e., it's the best it can
possibly do) in 10 seconds on a 2-core computer. Tasks 1 to 4 run in 
2s, 4s, 3s, and 5s, respectively. Is it possible that Task 5 runs in 7s?
<div class="ui accordion fluid">
  <div class="title">
    <i class="dropdown icon"></i>
    (click to see answer)
  </div>
  <div markdown="1" class="ui segment content answer-frame">
Nope. If Task 5 runs in 7 seconds, then we'd have to split the set
{2, 3, 4, 5, 7} into two parts that each sum up to 10. One of these
parts must contain number 7. So we also put number 3 into that part since
then it exactly sums to 10. We are left with numbers 2, 4, and 5, which sum up
to 11.
  </div>
</div>
<p></p>

**[A.2.p2.6]** Consider a 6-task program. The execution times of 5
of the tasks are: 6, 8, 7, 12, 9. What should the 6th task's execution
time so that this program can run with 100% parallel efficiency
on 3 cores? 
<div class="ui accordion fluid">
  <div class="title">
    <i class="dropdown icon"></i>
    (click to see answer)
  </div>
  <div markdown="1" class="ui segment content answer-frame">

If we run the 6s and the 9s tasks on one core, and the
 8s and the 7s tasks on another core, both these cores
finish computing in 15s. On the third core we run the 12s
task. If the 6th task takes 3s, then all 3 cores
finish computing in 15s. So the answer is 3 seconds.

  </div>
</div>
<p></p>

---

#### Questions

**[A.2.q2.1]** What parallel speedup will you observe when running 10
tasks with identical work on 3 cores?


**[A.2.q2.2]** The parallel efficiency of a parallel program with 12
identical tasks on a multi-core computer is more than 82% but less than 90%.  You know this
computer has no more than 8 cores. How many cores does it have?

**[A.2.q2.3]** You have a 20-task program where each task's work is 10
Gflop. You currently have a 4-core computer where each core computes at
speed 50 Gflop/sec. For the same amount of money you can either (1)
increase the speeds of all 4 cores by 20%; or (2) add a 5th 50 Gflop/sec
core. What should you do if you want to run your program as quickly as
possible?  

**[A.2.q2.4]** Consider a 6-task program to be executed on a 3-core
computer. The task execution times on one core are: 2s, 4s, 8s, 3s, 9s, and
3s. What is the best possible program execution time
on these 3 cores? Could we do better with 4 cores?

---
