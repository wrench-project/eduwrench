
#### Learning Objectives
<div class="learningObjectiveBox" markdown="1">
  - Understand the need for and the basics of multi-core computers
  - Undertand the notion of program consisting of independent tasks
  - Understand and apply the concepts of parallel speedup and efficiency
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
must create **tasks** that can run at the same time on different cores.
This is  called **parallelism** and we call this kind of programs
**parallel programs**. There are a few ways in which a program can
implement this notion of tasks, such as having tasks be different
*processes* or different *threads*. See Operating Systems [textbooks](/textbooks)
 for details on processes and threads, and how
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
the L3 cache and the memory bus (we refer you to Computer Architecture
[textbooks](/textbooks) for details on the memory hierarchy). The memory hierarchy is thus
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
In the next tab we explore one of the reasons why such waste occurs.

#### Practice Questions

**[A.2.p1.1]** Consider a parallel program that runs in 1 hour on a single core of a computer. 
The program's execution on 6 cores has 80% parallel efficiency. What is the program's execution time
when running on 6 cores? Show your work.
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


---

#### Questions

**[A.2.q1.1]** You are told that a parallel program runs in 1 hour on a
3-core machine, and that the parallel efficiency is 90%. How long, in
minutes, would the program take if executed using a single core? Show your work.

**[A.2.q1.2]**  You are told that a parallel program runs in 10 hours when using the
4 cores of some computer with parallel efficiency 80%. Using 8 cores, the
program runs in 6 hours. What is the parallel efficiency of this 8-core
execution? Show your work and reasoning.


---
