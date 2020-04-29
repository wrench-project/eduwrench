
#### Learning Objectives:

- Understand the need for using multi-core machines
- Understand the concepts of parallel speedup and efficiency
- Understand the relationship between idle time, speedup and efficiency

---

#### Basic Concepts

Multi-core processors have become ubiquitous due to well-documented issues
with further increasing the performance of a single core. Each core is
capable of executing code independently of other cores. 

We consider programs that need to perform one or more *tasks*, where
each task is a particular computation on some input data (and which
produces some output data). For instance, we could have a 5-task program
where task renders a different frame of a movie. Or we could have a program
in which tasks do different things altogether. For instance, a 2-task program
could have one task apply some analysis to a dataset and
another task uncompress a file on disk. 

As mentioned in the [Single Core Computing]({{ site.baseurl}}/pedagogic_modules/single_core_computing) module, we do not consider time
sharing. That is, **we will only consider executions in which at most one
task runs on a core at a given time.** Although Operating Systems allow
time-sharing, we will never start more tasks than cores on the
machine. Therefore, a task that begins running on a core will run
uninterrupted until completion on that same core.

----

#### Parallelism

One motivation for running the tasks of a program on multiple cores is speed. For
example, if you have tasks that a single core can complete in one hour, it
will take four hours to complete four tasks. If you have two of these
cores in a dual-core processor, now you can complete the same four tasks in less
time, and ideally in 
two hours. This concept is called **parallelism**: running multiple 
tasks at the same time, or *concurrently*, to complete a set of tasks faster.

Unfortunately, most real-world programs do not have ideal
parallelism behavior, that is, executing *n* times faster with *n*
cores. Instead, they execute less than *n* times faster. This may seem
surprising, but comes about due to many reasons. For instance, when two
tasks execute concurrently on two different cores, they still compete for
the memory hierarchy, e.g., the L3 cache and the memory bus. We refer
you to Computer Architecture textbooks for more details. In this module,
unless specified otherwise, we assume that two tasks on two different cores
proceed do not compete for the memory hierarchy. But even so, there are
still other reasons why a program cannot achieve ideal parallelism.
Before we get to these reasons, let us first define two crucial metrics:
*Parallel Speedup* (or *Speedup*) and *Parallel Efficiency* (or
*Efficiency*).

### Parallel Speedup

Parallel speedup is a metric used to quantify the acceleration in speed due to the use
of multiple cores. It is calculated by dividing the execution time of
the program on a single core by the execution time of this same program on
multiple cores, say *p*. The speedup on *p* cores is thus expressed as
follows:

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
we *only* go 1.5 times faster. This leads us to our next metric!

### Parallel Efficiency

The concept of parallel efficiency captures how much useful work the
cores can do for a program, or how much "bang" do you get for your
"buck". The "bang" is the speedup, and the "buck" is the number of cores.
More formally, the efficiency of an execution on $p$ cores is: 

$$
\begin{align}
\text{Efficiency}(p) & = \frac{\text{Speedup}(p)}{\text{p}}\
\end{align}
$$

If the parallel speedup on 2 cores is 1.5, then the
efficiency on 2 cores is:

$$
\begin{align}
\text{Efficiency}(2) & = \frac{1.5}{2} = 0.75 = \text{75%}\
\end{align}
$$

In the best case, the efficiency would be 100% (which corresponds to going
*p* times faster with *p* cores). In the above example, it is only 75%, meaning
that we are "wasting" some of the available compute capacity of our machine during 
the program's execution. 

At this point, you may be wondering how getting less than 100% efficiency
is possible?

----

#### Load Imbalance and Idle Time

A common cause for sub-100% efficiency is **idle time**, i.e., time during
which one or more cores are not able to work while others are working.
Assuming that all tasks run for the same amount of time, 
idle time will occur when *n*, the number of tasks, is not divisible by *p*,
the number of cores. For example, if we have 8 tasks that each run for 1
hour and 5 cores, all cores will be busy for the first 5 tasks, but once
this phase of execution is finished, only 3 of the 5 cores will have
another task to complete. Thus, 2 cores sit idle while 3 work, for 1 hour.
In this situation we says that **the load is not well-balanced across
cores**. With discrete tasks such as these the balance cannot be
improved.

There is a **direct relationship** between idle time and parallel efficiency, assuming 
idle time is the only cause of loss in parallel efficiency. *The parallel efficiency is
the sum of the core non-idle times divided by the product of the number of cores by the
overall execution time.*

The above statement may sound complicated, but it's very intuitive on an example. 
Consider a dual-core computer that executes a multi-task program in 1 hour. 
The first core computes for 30 min, and then is idle for 30 min.
The second core is idle for 15 minutes, and then computes for 45 minutes. This execution 
is depicted in the figure below, where idle time is shown in white and compute time in yellow:

<object class="figure" type="image/svg+xml" data="{{ site.baseurl }}/public/img/multi_core_computing/utilization.svg">Utilization</object>

What the above statement says is that the parallel efficiency is the yellow area 
divided by the area of the whole rectangle. In other words, the parallel efficiency 
is (1 * 30 + 1 * 45) / (2 * 60) = 62.5%. 

The more "white" in the figure, the lower the parallel efficiency. If there is as much 
white as yellow, then the parallel efficiency is 50%, because half the compute power 
is wasted. You get the idea.

### Simulating Load Imbalance

So that you can gain hands-on experience, use the simulation Web application below.

This app allows you to pick a number of cores and an a number of tasks to run on these cores. 
Try first with a single core running 5 tasks (you can vary the tasks' amount
of work by setting the "Task GFlop" field to any value, but it will not change
the overall execution pattern). Take particular notice 
of the "Host Utilization" graph. Now try running a number of tasks and cores where 
the number of tasks does not evenly divide the number of cores. Looking at the 
host utilization graph again, now you will be able to see idle time for some of 
the cores (in pink). Whenever we can see idle time on the graph,
parallel efficiency is below 100%. 

<div class="ui accordion fluid app-ins">
  <div class="title">
    <i class="dropdown icon"></i>
    (Open simulator here)
  </div>
  <div markdown="0" class="ui segment content">
    {% include simulator.html src="multi_core_independent_tasks/" %}
  </div>
</div>


### More Load Imbalance with Non-Identical Tasks

In all the above, we've only considered "identical" tasks: all tasks run in
the same amount of time. Therefore, the main question is how the number of
cores divides the number of tasks (if it divides it perfectly then we can have
100% efficiency). But in many real-world programs tasks are not identical.
Some can take longer than the other. This is another possible source of
load imbalance. 

Consider a 5-task program that runs on a 2-core computer. The tasks take 10s,
16s, 4s, 5s, and 11s, respectively. How fast can we run this program? For instance, we
could run the first 3 tasks (10s, 16s, and 4s) on one core, and the last 2
tasks (5s and 11s) tasks on the other core. The first core would thus work
for 30s while the second core would work for only 16s. This would lead to a
parallel efficiency of 46 / (30 * 2) = 76%. Can we do better? If you think
about it, the problem is to split the set of numbers {10, 16, 4, 5, 11}
into two parts, so that the sum of the numbers in each part are as close to
each other as possible. In this case, because we only have 5 numbers, we
could look at all options. It turns out that the best option is: {10, 11}
and {16, 4, 5}. That is, we run the first and last tasks on one core, and
the other on another core. In this case, one core computes for 21s and the
other for 25s. The parallel efficiency is now 92%.

What if we now have 3 cores? Then we have to split our set of numbers into
3 parts that are as "equal" as possible. The best we can do is: {10, 5},
{16}, and {11, 4}. In this case, the program runs in 16 seconds and the
parallel efficiency on 3 cores is almost 96%. It is not useful to use more
cores, since no matter what the program cannot run faster than 16
seconds.

It turns out that splitting sets of numbers into parts with sums as close
to each other as possible is a difficult problem. We are able to do it for
small examples like above, but as soon as the number of tasks gets large,
it's no longer humanly possible. And in fact, it's not computer-ly
possible either (at least, not quickly). More formally, determining the best split is an NP-complete
problem (see an Algorithm/Theory textbook!). We will encounter this kind of
"scheduling problem" (i.e., how to allocate tasks to processors) again in upcoming modules.

----

#### Practice Questions

**[A.2.p1.1]** You are told that a 10-task program runs in 1 hour with
on a 3-core machine. All tasks execute in the same amount of time on one core. 
What is the execution time of one task?

<div class="ui accordion fluid">
  <div class="title">
    <i class="dropdown icon"></i>
    (click to see answer)
  </div>
  <div markdown="1" class="ui segment content">
    The execution proceeds in 4 phases. If each of the first three phases
   3 tasks are executed in parallel. In the last phase a single task executes. 
   Therefore, each phase takes 15 minutes, which is the execution time of a task.

  </div>
</div>

**[A.2.p1.2]** Assume you have 24 tasks to execute on a multi-core computer,
where each task runs in 1 second on a core. By what factor is the overall
execution time reduced when going from 4 to 6 cores?

<div class="ui accordion fluid">
  <div class="title">
    <i class="dropdown icon"></i>
    (click to see answer)
  </div>
  <div markdown="1" class="ui segment content">
   The total execution time when using 4 cores will be 6 seconds. When
   increasing from 4 cores to 6 cores, now the total execution time is 4
   seconds. The overall execution time is reduced by a factor 6/4 = 1.5.

  </div>
</div>

<p></p>

**[A.2.p1.3]** Assume you now have 3 tasks to compute, still each taking 1 second
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

**[A.2.p1.4]** You are upgrading your (pre-historic?) single core processor and
you have two new multi-core processors to choose from, one with 5 cores and
one with 10 cores. *Your only concern is to maximize parallel efficiency.* All of
the cores are identical. You have 15 tasks to run, each taking 1 second to
complete on a core. Which multi-core processor will provide the higher
efficiency?

<div class="ui accordion fluid">
  <div class="title">
    <i class="dropdown icon"></i>
    (click to see answer)
  </div>
  <div markdown="1" class="ui segment content">
   When using only a single core, the 15 tasks will take 15 seconds to
   complete. 

   When increasing the number of cores to 5, the same tasks can now be completed
   in 3 seconds, and there is no idle time (since 5 divides 15). Therefore
   parallel efficiency is 100%.

   When increasing the number
   of cores to 10, the tasks take 2 seconds. In this scenario, 
   for the last second, 5 out of the 10 cores are
   idle. Therefore, efficiency is less than 100% (it is 75%). 

   We conclude that we should go with the 5-core processor (even though the 10-core
   processor completes the tasks sooner, our concern here is parallel efficiency).

  </div>
</div>

**[A.2.p1.5]** A 5-task program runs optimally (i.e., it's the best it can
possibly do) in 10 seconds on a 2-core computer. Tasks 1 to 4 run in 
2s, 4s, 3s, and 5s respectively. Is it possible that Task 5 runs in 7s?

<div class="ui accordion fluid">
  <div class="title">
    <i class="dropdown icon"></i>
    (click to see answer)
  </div>
  <div markdown="1" class="ui segment content">
Nope. If Task 5 runs in 7 seconds, then we'd have to split the set
{2, 3, 4, 5, 7} into two parts that each sum up to 10. One of these
parts must contain number 7. So we also put number 3 into that part since
then it exactly sums to 10. We are left with numbers 2, 4, and 5, which sum up
to 11.
  </div>
</div>


#### Questions

**[A.2.q1.1]** What speedup will you observe when running 10 identical (in
terms of execution time) tasks on 1 core versus these same 10 tasks on 3
cores?

**[A.2.q1.2]** What would be the parallel efficiency of a 10-task program
execution on a 4-core machine where each task runs in 10 minutes?

**[A.2.q1.3]** You are told that a multi-task program runs in 1 hour on a
3-core machine, and that the parallel efficiency is 90%. How long would the
program take if executed using a single core.

**[A.2.q1.4]** You have a 20-task program where each task's work is 10
GFlop. You currently have a 4-core compute where each core compute at
speed 50 GFlop/sec. For the same amount of money you can either (1)
increase the speeds of all 4 cores by 20%; or (ii) add another 50 GFlop/sec
core. What should you do if you want to run your program as quickly as
possible?

**[A.2.q1.5]** Consider a 6-task program to be executed on a 3-core
computer. The task execution times on one core are: 2s, 4s, 8s, 3s, 9s, and
3s. What is the best possible (i.e., the optimal) program execution time
on these 3 cores? Could we do better with 4 cores?

