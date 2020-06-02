
#### Learning objectives

  - Understand how task- and data-parallelism can be mixed
  - Be able to reason about the performance of programs that include both task- and data-parallelism

---


### Basic concept

So far in this module we've only considered sequential tasks. In other words, each task can only use
a single core.  But in the [Data-Parallelism tab of the Multicore Computing module]({{site.baseurl}}/pedagogic_modules/multi_core_computing), we 
learned about **Data Parallelism**: the notion that a sequential task can be rewritten as a set of
parallel tasks, with likely a remaining sequential portion of the execution. Then, in that same module,
we learned about **Amdahl's Law**, which quantifies the data-parallel task's execution time on a given
number of cores, given what fraction of the execution time has to remain sequential. You may want to 
review this content before proceeding. 

*Let's consider workflows in which  some tasks are data-parallel*. For this tasks we need to decide
how many cores they should use. So our workflow has both task-parallelism (like all workflows) and
data-parallelism. This is often called "mixed" parallelism. 

### An example


<object class="figure" type="image/svg+xml" width="300" data="{{ site.baseurl }}/public/img/workflows/workflow_task_data_parallelism_workflow.svg">Example workflow with task- and data-parallelism.</object>
<div class="caption"><strong>Figure 1:</strong> A simple workflow with some data-parallel tasks ($\alpha$ is the fraction of the work that is non-parallelizable)</div>

Figure 1 above shows an example workflow with both task- and data-parallelism. For simplicity, we completely ignore
files and I/O.  The green and red tasks are not data-parallel, and can run only on a single core.  The blue, yellow, and
gree tasks are data-parallel. For each task, in addition to its amount of work, we also indicate the value of $\alpha$,
the fraction of the sequential execution time that can be parallelized. Based on Amdahl's law, a data-parallel task with
work $w$ GFlop runs on a $p$-core computer, where core speed is $s$ GFlop/sec, in time:

$$
T(p) = \frac{\alpha \times \frac{w}{s}}{p} + (1 - \alpha) \times \frac{w}{s})
$$

The above equation just means that the parallizable portion of the sequential execution time (the left term) is accelerated
by a factor $p$ when executed in parallel on $p$ cores, while the sequential portion (the right term) remains sequential. 

So, say we are running this workflow on a 4-core computer where cores compute at speed 100 GFlop/sec. 
We could run each of the data-parallel tasks using 4 cores. In this case, here is the execution time of each task:
 
  - Green: 1.00 sec
  - Blue: $10 \times 0.9 / 4 + 10 \times 0.1$ = 3.25 sec
  - Yellow: $20 \times 0.85 / 4 + 20 \times 0.15$ = 7.25 sec
  - Purple: $12 \times 0.80 / 4 + 12 \times 0.20$ = 4.80 sec
  - Red: 1.00 sec

No two tasks can run at the same time. So the total execution time is the sum of the task execution times, i.e., 17.30 seconds. 

There are may other options! For instance, we could run the blue task using 2 cores, the yellow task using 2 cores,
and the purple tasks using 4 cores, for the following task execution times:

  - Green: 1.00 sec
  - Blue: $10 \times 0.9 / 2 + 10 \times 0.1$ =  5.50 sec
  - Yellow: $20 \times 0.85 / 2 + 20 \times 0.15$ =  11.5 sec
  - Purple: $12 \times 0.80 / 4 + 12 \times 0.20$ = 4.80 sec
  - Red: 1.00 sec

But now the blue and yellow tasks can run in parallel! So the execution time is:
$1 + 11.5 + 4.80 + 1 = $ 18.30 seconds.   This option isn't as good as the previous one. 

How many options are there? Well, for each of the 3 tasks we have 4 options, so that's $4^3 = 64 options!!! One or
more of these options has to be the best one. Some are clearly not great. For instance, running all tasks on a single
core would waste 1 core of our 4-core computer.


#### Simulating task- and data-parellelism

The simulation app below makes it possible to simulate the execution of the above example workflow on
a platform that hosts two 3-core hosts. Again, remember that in this tab we ignore all I/O. The app
allows you to pick how many cores are used for the blue, yellow, and purple tasks. You can use this
app on your own, but then you shold use it to answer the following practice questions.

<div class="ui accordion fluid app-ins">
  <div class="title">
    <i class="dropdown icon"></i>
    (Open simulator here)
  </div>
  <div markdown="0" class="ui segment content">
    {% include simulator.html src="workflow_task_data_parallelism/" %}
  </div>
</div>

---

#### Practice Questions

**[A.3.4.p4.1]**  XXX

<div class="ui accordion fluid">
  <div class=" title">
    <i class="dropdown icon"></i>
    (click to see answer)
  </div>
  <div markdown="1" class="ui segment content">
XXX 
  </div>
</div>
<p></p>

---

#### Questions

**[A.3.4.q4.1]** XXX
