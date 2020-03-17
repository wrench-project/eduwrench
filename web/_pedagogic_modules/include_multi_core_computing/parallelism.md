
#### Learning Objectives:

- Understand the need for using multi-core machines
- Understand the concepts of parallel speedup and efficiency
- Understand the relationship between idle time, speedup and efficiency

---

### Basic Concepts

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

#### Parallelism

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

For instance, if an application runs in 3 hours on 1 core but runs in 2 hours on 2 
cores, then its speedup is:

$$
\begin{align}
\text{Speedup}(2) & = \frac{3}{2} = 1.5\;
\end{align}     
$$

In this example, we would be somewhat "unhappy" because although we have 2 cores, 
we *only* go 1.5 times faster. This leads us to our next metric!

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
that we are "wasting" some of the available compute capacity of our machine during 
the application's execution. 

At this point, you may be wondering, how is this (less than 100% efficiency) possible?

#### Load Imbalance and Idle Time

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

There is **direct relationship** between idle time and parallel efficiency, assumuming 
idle time is the only cause of loss in parallel efficiency. *The parallel efficiency is
the sum of the core non-idle times divided by the product of the number of cores by the
overall execution time.*  

The above statement may sound complicated, but it's very intuitive on an example. 
Consider a dual-core computer that executes an application in 1 hour. 
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

So that you can gain hands-on experience, use the simulation Web application (see 
<a href="{{site.baseurl}}/pedagogic_modules/simulation_instructions/index/" target="_blank">instructions</a>),
selecting `Multi-core Machines` from its menu. 

<div class="ui accordion fluid app-ins">
  <div class="title">
    <i class="dropdown icon"></i>
    (Open simulator here)
  </div>
  <div markdown="0" class="ui segment content">
    {% include simulator.html src="multi_core/" %}
  </div>
</div>

This simulation app allows you to pick the number of cores and tasks to run. 
Try first with a single core running 5 tasks (ignore the "Ram Needed For Each 
Task" field, and leave the "Task GFlop" field at 100). Take particular notice 
of the "Host Utilization" graph. Now try running a number of tasks and cores where 
the number of tasks does not evenly divide the number of cores. Looking at the 
host utilization graph again, now you will be able to see idle time for some of 
the cores represented by pink. Whenever we can see that pink on the graph, we know 
that parallel efficiency is below 100%. 

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
