
#### Learning Objectives
<div class="learningObjectiveBox" markdown="1">
  - Understand the need for and the basics of multi-core computers
  - Understand and apply the concepts of parallel speedup and efficiency
  - Understand and quantify the relationship between idle time, speedup, and efficiency
</div>

---

### Basic Concept

A multi-core processor provides multiple processing units, or **cores**,
that are capable of executing computer code independently of each other.
 Multi-core processors have become ubiquitous. This is because starting
in the early 2000's it became increasingly difficult, and eventually impossible,
to increase the clock rate of processors. The reasons are  well-documented power/heat
issues (see the 2007 classic 
[The Free Lunch Is Over](http://www.gotw.ca/publications/concurrency-ddj.htm) article).  As  a solution to this problem, microprocessor manufacturers
started producing *multi-core processors*. 


For a program to exploit the compute power of a multi-core processor, it
must create *tasks* that can run at the same time on different cores.
This is  called **parallelism** and we call this kind of programs
**parallel programs**. There are a few ways in which a program can
implement this notion of tasks, such as having tasks be different
*processes* or different *threads*. See operating systems and concurrent
programming courses/textbooks for details on processes and threads, and how
they communicate and/or share memory. In  these pedagogic modules we will
mostly refer to tasks, without needing to specify the underlying
implementation details.

Each task in a parallel program performs some computation on some input
data,  which  can be in RAM or on disk, and which produces some output
data. For instance, we could have a 5-task program where each task renders
a different frame of a movie. Or we could have a program in which tasks do
different things altogether. For instance, a 2-task program could have one
task apply some analysis to a dataset and another task render a live 
visualization of that dataset.

As mentioned in the [Single Core Computing module]({{site.baseurl}}/pedagogic_modules/pdcc/single_core_computing), we do not
consider time sharing. That is, **we will only consider executions in which
at most one task runs on a core at a given time.** Operating
systems do allow time-sharing (as explained in
the [Time Sharing tab of the Single Core Computing module]({{site.baseurl}}/pedagogic_modules/pdcc/single_core_computing/#/time-sharing)). But
time sharing incurs performance penalties. The typical approach
when aiming for high performance is to avoid time sharing altogether. 
Therefore, in all that follows, a task that begins executing on a core executes
uninterrupted and by itself on that same core until completion.

----

### Speedup and Efficiency

A common motivation for running the tasks of a program on multiple cores is
speed. For example, if you have tasks that a single core can complete in
one hour, it will take four hours to complete four tasks. If you have two
cores in a computer, now you can complete the same four
tasks in less time, ideally in two hours. **With parallelism we
can decrease program execution time**. 

Unfortunately, most real-world programs do not have ideal parallelism
behavior. In other words, they do not run $p$ times faster when executed on
$p$ cores. Instead, they execute less than $p$ times faster. This may seem
surprising, but comes about due to many reasons. One of these reasons is
that program tasks running on different cores still compete for 
shared hardware and/or software resources. 
Each time tasks compete for such resources, i.e., one task has
to wait for the other task being done using that resource, there is a loss
in parallel efficiency.  
These resources can include
the network card, the disk, the network, the operating system's kernel data
structures.  One hardware resource for which program tasks that
run on different cores almost always compete is the memory hierarchy, e.g.,
the L3 cache and the memory bus (we refer you to computer architecture
textbooks for details on the memory hierarchy). The memory hierarchy is thus
a notorious culprit for loss of parallel efficiency loss.

In this module, we make the simplifying assumptions that program tasks
running on different cores do not compete for any of the above resources.
*And yet, there are other reasons why a program cannot achieve ideal
parallelism!* Before we get to these reasons, let us first define two
crucial metrics: *Parallel Speedup* and *Parallel Efficiency*.

### Parallel Speedup

Parallel speedup, or just *speedup*, is a metric used to quantify the reduction in execution time of 
a parallel program due to the use
of multiple cores. It is calculated by dividing the execution time of
the program when executed on a single core by the execution time of this same program
when  executed  on multiple cores. Let $p$ be the number of cores used to
execute a program. The speedup 
on $p$ cores is:

$$
\begin{align}
\text{Speedup}(p) & = \frac{\text{Execution Time with 1 core}}{\text{Execution Time with p cores}}\;
\end{align}
$$

For instance, if a program runs in 3 hours on 1 core but runs in 2 hours on 2 
cores, then its speedup is:

$$
\begin{align}
\text{Speedup}(2) & = \frac{3}{2} = 1.5\;
\end{align}
$$

In this example, we would be somewhat "unhappy" because although we have 2 cores, 
we *only* go 1.5 times faster. We would likely be hoping to go twice as fast.
Let's quantify this "disappointment" formally  using another metric!

### Parallel Efficiency

Parallel efficiency, or just **efficiency**, is a  metric that captures how much useful work the
cores can do for a program, or how much "bang" do you get for your
"buck". The "bang" is the speedup, and the "buck" is the number of cores.

More formally, the efficiency of an execution on $p$ cores is: 

$$
\begin{align}
\text{Efficiency}(p) & = \frac{\text{Speedup}(p)}{p}\
\end{align}
$$

If the speedup on 2 cores is 1.5, then the
efficiency on 2 cores is:

$$
\begin{align}
\text{Efficiency}(2) & = \frac{1.5}{2} = 0.75 = \text{75%}\
\end{align}
$$

Ideally, the efficiency would be 100%, which corresponds to going
$p$ times faster with $p$ cores. In the above example, it is only 75%. This
means 
that we are "wasting" some of the available compute capacity of our computer during 
the program's execution. We have 2 cores, but our performance is as if we
had only 1.5 cores. In other terms, we are wasting half the compute
power of a core.

#### Practice Questions

**[A.2.p1.1]** Consider a parallel program that runs in 1 hour on a single core of a computer. 
The program's execution on 6 cores has 80% parallel efficiency. What is the program's execution time
when running on 6 cores?
<div class="ui accordion fluid">
  <div class="title">
    <i class="dropdown icon"></i>
    (click to see answer)
  </div>
  <div markdown="1" class="ui segment content answer-frame">

Let $S$ be the speedup on 6 cores for this program. Since the efficiency is equal to $S/6$,
we have $S/6 = 0.8$, which gives us $S = 4.8$. Therefore, the program runs in 60/4.8 = 12.5 minutes.

  </div>
</div>

<p></p>

**[A.2.p1.2]** A parallel program has a speedup of 1.6 when running on 2 cores, and runs
10 minutes faster when running on 3 cores than when running on 2 cores. Give a formula for $T(1)$ (the execution time
on one core in minutes) as a  function of $T(3)$ (the execution time on 3 cores in minutes). 
<div class="ui accordion fluid">
  <div class="title">
    <i class="dropdown icon"></i>
    (click to see answer)
  </div>
  <div markdown="1" class="ui segment content answer-frame">

Because the speedup on 2 cores is 1.6, we have: $ T(2) = T(1) / 1.6 $

And the 10-minute time reduction gives us: $ T(3) = T(2) -  10$

Therefore, 

$
T(3) = T(1) / 1.6 - 10
$

which we can rewrite as:

$
T(1) = 1.6 \times (T(3) + 10)
$

  </div>
</div>

----

### Load Imbalance and Idle Time

At this point, you may be wondering why, in practice, parallel efficiency
can be less than 100%. One reason is **idle time**. This is the
time during which one or more cores are not able to work while other cores are
working.

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
idle time for some of the cores (in light pink). Whenever we can see idle
time on the graph, parallel efficiency is below 100%.

<div class="ui accordion fluid app-ins">
  <div class="title">
    <i class="dropdown icon"></i>
    (Open simulator here)
  </div>
  <div markdown="0" class="ui segment content sim-frame">
    {% include simulator.html src="multi_core_independent_tasks/" %}
  </div>
</div>

#### Practice Questions

**[A.2.p1.3]** You have a 4-core computer where each core computes at speed 1000 Gflop/sec. 
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

**[A.2.p1.4]** You are told that a 10-task program runs in 1 hour
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

**[A.2.p1.5]** Assume you have 20 tasks to execute on a multi-core computer,
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

**[A.2.p1.6]** You are upgrading your (pre-historic?) single-core computer and
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
problem (see algorithm/theory textbooks/courses). We will encounter this kind of
problem, i.e., how to allocate tasks to compute resources, again in upcoming modules.

----

#### Practice Questions

**[A.2.p1.7]** A 5-task program runs optimally (i.e., it's the best it can
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

**[A.2.p1.8]** Consider a 6-task program. The execution times of 5
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

**[A.2.q1.1]** You are told that a parallel program runs in 1 hour on a
3-core machine, and that the parallel efficiency is 90%. How long, in
minutes, would the program take if executed using a single core?

**[A.2.q1.2]**  You are told that a program runs in 10 hours when using the
4 cores of some computer with parallel efficiency 80%. Using 8 cores, the
program runs in 6 hours. What is the parallel efficiency of this 8-core
execution?

**[A.2.q1.3]** What parallel speedup will you observe when running 10
tasks with identical work on 3 cores?


**[A.2.q1.4]** The parallel efficiency of a parallel program with 12
identical tasks on a multi-core computer is more than 82% but less than 90%.  You know this
computer has no more than 8 cores. How many cores does it have?

**[A.2.q1.5]** You have a 20-task program where each task's work is 10
Gflop. You currently have a 4-core computer where each core computes at
speed 50 Gflop/sec. For the same amount of money you can either (1)
increase the speeds of all 4 cores by 20%; or (2) add a 5th 50 Gflop/sec
core. What should you do if you want to run your program as quickly as
possible?  

**[A.2.q1.6]** Consider a 6-task program to be executed on a 3-core
computer. The task execution times on one core are: 2s, 4s, 8s, 3s, 9s, and
3s. What is the best possible program execution time
on these 3 cores? Could we do better with 4 cores?

---
