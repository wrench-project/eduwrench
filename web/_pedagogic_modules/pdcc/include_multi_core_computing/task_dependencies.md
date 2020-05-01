
#### Learning Objectives:

- Understand the concept of task dependencies
- Understand the impact of task dependencies on parallelism

---

#### Basic concept

So far, we've only considered *independent* tasks in our applications,
i.e., tasks that can be executed in any order and concurrently. In other
words, given a computer with as many cores as tasks and sufficient RAM
capacity, But in many, many, real-world applications this is not the case.
Instead, tasks exhibit *dependencies*. In other words, some tasks cannot
execute before other tasks are done. As an analogy, consider a chef cooking
a meal. First, they need to select and procure the ingredients. Second,
they need to cook these ingredients. Finally, the cooked ingredients must
be plated. None of these tasks may be completed out of order. The "cook
ingredients" task depends on the "procure ingredients", and the "plate
meal" task depends on the "cook ingredients" task. A convenient way to
represent such applications is a *Directed Acyclic Graph (DAG)*, in which
*vertices are tasks* and *edges are dependencies*. For the "cook a meal"
application, the DAG representation is straightforward, and depicted in
Figure 1 below:

<object class="figure" type="image/svg+xml" data="{{ site.baseurl }}/public/img/multi_core_computing/example_chain_dag.svg">Chain DAG</object>

Going back to computing, here is a typical example of task dependencies.
Consider an application that counts the number of car objects in a set of
compressed street pictures. Each picture needs to be uncompressed,
pre-processed, (e.g., to remove noise), analyzed (to find and count cars). And
then, once this has been done for each picture, car count statistics need
to be displayed. Say that we have 5 compressed pictures,
the application can be represented as a DAG as in Figure 2 below:

<object class="figure" type="image/svg+xml" data="{{ site.baseurl }}/public/img/multi_core_computing/example_car_dag.svg">InTree DAG</object>

Note that each task above can involve both I/O and computation. For
instance, the "uncompress" task must read in a picture file from disk, and
then execute a decompression algorithm. Then, whether it writes back to
disk the decompressed image or keeps in in RAM so that the "pre-process"
task can do its job is up to the application's implementation in software.
Clearly keeping things in RAM can avoid costly I/O operation, but as we
know RAM capacity is limited.

### Simulating Simple Task Dependencies

For now, to keep things simple, let's assume that tasks take zero RAM and
that they perform no I/O. Let's consider an example program that is used to
analyze some dataset. It begins with a "start" task that does some
preprocessing of the in-RAM dataset. Then, once the preprocessing is done, it
needs to perform three things. Namely, it needs to produce some visualization, perform some
analysis, and compute some statistics:

  - The visualization consists of a sequence of two tasks: "viz" (computes what to visualize) and  "plot" (generate a fancy 3-D plot)
  - The analysis consists of a sequence of two tasks :  "analyze" (performs data analysis) and "summarize" (generates summary analysis results). 
  - The statistics consists of a since task: "stats" (computes some statements)
  
Once all the above is done, then a final task  "display" displays all results.  
The "analyze" task has an **amount of work that is user-defined**. The more work, the
more in-depth the analysis results. 

The figure below shows the DAG for this program, showing the work of
each task (and just *X* for the analysis task):

<object class="figure" type="image/svg+xml" data="{{ site.baseurl }}/public/img/multi_core_computing/example_simulated_dag.svg">Simulated DAG</object>

To gain hands-on experience with the task dependency concept, use
the simulation Web app below to simulate the execution
of our example program on a 3-core computer, where **each core computes
 at speed 10 GFlop/sec**.  You can pick the amount of work for the "analyze" task. The execution strategy used for this execution
is very simple: whenever a task can be executed (because all its parent 
tasks have been executed), whenever a host is idle, then execute that task on
that host immediately. The following practice questions are based on this
simulation. 

<div class="ui accordion fluid app-ins">
  <div class="title">
    <i class="dropdown icon"></i>
    (Open simulator here)
  </div>
  <div markdown="0" class="ui segment content sim-frame">
    {% include simulator.html src="multi_core_dependent_tasks/" %}
  </div>
</div>

#### Practice Questions

**[A.2.p3.1]**  Say we run the program with an "analyze" task with 100 GFlop work. What is the parallel efficiency when running the application on the 3-core computer and when using 
a single analysis task? (feel free to use the simulation app)

<div class="ui accordion fluid">
  <div class="title">
    <i class="dropdown icon"></i>
    (click to see answer)
  </div>
  <div markdown="1" class="ui segment content">
  The sequential program's execution on 1 core, *T(1)*, is simply the sum of individual
  task execution times, 

$$
\begin{align}
  T(1) & = 5  + 20  + 10 + 10  + 10  + 40 + 1 \\
              & = 96 sec
\end{align}
$$

The simulated execution time on our 3-core computer is:

$$
\begin{align}
  T(3) & = 46 sec
\end{align}
$$

  So the parallel efficiency is thus (96/46)/3 = **69.56%**.
  </div>
</div>

<p></p>

**[A.2.p3.2]** What is the number of core idle seconds when running the application with 
"analyze" tasks with 300 GFlop work on our 3-core computer?

<div class="ui accordion fluid">
  <div class="title">
    <i class="dropdown icon"></i>
    (click to see answer)
  </div>
  <div markdown="1" class="ui segment content">
  
  This is a very similar question as the previous one. The sequential execution time
  is 126 seconds, and the  execution time on 3 cores is still 46  seconds. Therefore,
  the number of core idle seconds is 46 * 3 - 126 = 12  seconds. 
  
  </div>
</div>

<p></p>

**[A.2.p3.3]** For what amount of  work of the "analyze" task is the parallel  efficiency
maximized?

<div class="ui accordion fluid">
  <div class="title">
    <i class="dropdown icon"></i>
    (click to see answer)
  </div>
  <div markdown="1" class="ui segment content">

  Let *x* be the work of the "analyze" task. The sequential execution time is *x/10 + 86* seconds. The parallel
  execution time is a bit trickier. 
  
  The visualization path takes time *5 + 20 + 10 + 1 = 36*  seconds, which
  is shorter  than  the statistics path, which takes 46 seconds. The analysis path takes time
  *5 + x/10 + 10 + 1 = 16 + x/10*  seconds. So, we have two cases: If *16 + x/10 <= 46*, or if *x <=300*, 
  the critical path  is the analysis path, otherwise the critical
  path is the statistics path. So let's examine both cases:
  
  - *x <=  300*: the parallel execution time is 46 seconds, and so the parallel efficiency
    is equal to  *((x/10 + 86) / 46) / 3*. This is maximized for x = 300, and is then equal
    to 84.05%. 
    
  - *x >= 300*: the parallel execution time is 16 + x/10, and so the parallel efficiency
     is equal to *((x/10 + 86) / (16 + x/10)) / 3*. This is a decreasing function on the [300, infinity] domain,
     and so on  that domain it is maximized for  x = 300. 
     
  The final answer is thus 300 GFlop.  The above is quite formal, but intuitively it all makes
  sense. The parallel efficiency is maximized when all three paths take time as close as possible to 
  the length of the critical path, so as have cores working as much  as possible. This is achieved when 
  the analysis path and the statistics path are equal (nothing can
  be done about the visualization path), that is, when *x = 300*. This program can never
  achieve efficiency higher than 84.05%.
     
  
  
  </div>
</div>

<p></p>

### Levels, Critical Path

In the previous section, and the practice question, we touched upon some fundamental
concepts without naming them explicitly. Let's do so now.

A first concept is that of a **DAG level**. A task is
on level *n* of the DAG  if the longest path from the entry task(s) to the task is of length *n*,
in number of vertices traversed. By  this definition, an entry task is in level 0. Every child
task of an entry  task is in level 1, and so on.  Formally, the level of a task is one plus  the maximum of the
levels of the tasks parents (this is  a recursive definition)

For our example DAG in Figure 3 above, we can determine level of each task:

| task | level |
|------|-------|
| start| 0|
| viz | 1|
|analyze |1|
|stats| 1|
|plot | 2|
|summarize |2|
|display|3|
|------|-------|

So we say that this graph has four levels. Note that this does not mean
that the DAG tasks must be executed level by level. For instance, we could execute
task "plot" (level 2) before task "analyze" (level 1).

A second concept is that of a **DAG width** (or **DAG parallelism**): the maximum
number of tasks in the workflow levels. For instance, for our example DAG, the parallelism is 3
because level 1 has 3 tasks (and all other levels have fewer tasks). This means that we cannot
make any use of more than 3 cores when executing this graph, as a fourth core would
never have anything to do. 

A third concept is that of the **critical path**:
the longest path in the dag from the entry task(s) to the exit
task(s), where **the path length is measured in task durations**. 
No matter how many cores are used, the program cannot execute faster than
the length of the critical path. For instance, consider our example 
DAG, assuming the the "analyze" task has work of 250 GFlop. There are three paths
from "start" to "display". The length of the visualization path has length
5+20+10+1 = 36s. The length of the statistics path has length 5+40+1=46. The
length o f the analysis path is 5+25+10+1=41. And so the critical path
is {"start" -> "stats" -> "display"} and has length 46. No matter how many 10GFlop/sec cores
are used to execute this program, it can never run in less than 46 seconds!

#### Practice Questions

**[A.2.p3.4]** For the DAG below, give the number of levels, the width, and the
length of the critical path in seconds (the execution time of each task is shown
for each task).

<object class="figure" type="image/svg+xml" data="{{ site.baseurl }}/public/img/multi_core_computing/practice_dag_1.svg">Practice Question DAG</object>

<div class="ui accordion fluid">
  <div class="title">
    <i class="dropdown icon"></i>
    (click to see answer)
  </div>
  <div markdown="1" class="ui segment content">

  - Number of levels: 4
  - Width: 3 (level 3 has 3 tasks: blue 11s, purple 5s, red 7s)
  - Length of the critical path: 30s (green 1s, orange 20s, red 7s, yellow 2s)
 
  </div>
</div>

<p></p>


**[A.2.p3.5]** For the DAG below, would it be useful to use more than 3 cores? Can the execution time
be ever shorter than 28 seconds? Could you remove one edge to increase the DAG width?

<object class="figure" type="image/svg+xml" data="{{ site.baseurl }}/public/img/multi_core_computing/practice_dag_2.svg">Practice Question DAG</object>


<div class="ui accordion fluid">
  <div class="title">
    <i class="dropdown icon"></i>
    (click to see answer)
  </div>
  <div markdown="1" class="ui segment content">

Here is  the set of DAG levels:

|------|-----|
| level | tasks |
|------|-----|
| 0 | green 2s |
| 1 | red 1s, orange 4s|
| 2 | blue 13s, purple 10s, red 4s|
| 3 | blue 2s |
| 4 | yellow 10s |
|---|-----|


It would never be useful to use more than  3 cores  because the width of the DAG is 3  (level 2). The DAG's
critical path has length 27s,  so yes, the execution (on 3 cores) could be lower than 28s. 

removing the edge from red 1s to blue 2s would make the DAG width 4 (i.e., level 2  would have 4 tasks in it). 
  </div>
</div>

<p></p>


### Choosing which task to run next

In our example dataset analysis application, there was never a *choice* for deciding which task
to run next. First we have to run "start". Then, we have three tasks that are
**ready**, that is, whose parents have all executed. Since we have 3 cores, we run
all three, each on one core.  In other words, since we have 3 paths in the DAG and
3 cores, we just run each path on its own core. 

In general however, we could have **more ready tasks than idle cores**, in which
case  we have to *pick which ready  tasks to run*. This, turns out, can be a  difficult
problem known as  "DAG scheduling". We explore this advanced topic in later modules, but
for now we can get a sense for it via our example. 

Let's say that we now must run
the probram on a *2-core* computer. Therefore we have a choice after "start" completes: 
we have 3 ready tasks 
and only 2 cores. Say we run "analyze" and "stats". If "analyze" completes before "stats",
then we have another choice: 
should we run "viz" or "summarize"? It turns out that some of these choices are better
than others. In this small example the "bad" choices are not terrible, but for larger
DAGs they  could correspond to an enormous performance loss. 
 
So we need some rule of thumb for picking a task to run. 
A good and popular rule of thumb is, whenever there is a choice  to make, **pick the task that is 
on  the  critical path.** After all it's critical! 


So see the impact of such decisions, the simulation app below allows
you to simulate application execution while prioritizing some execution paths. For instance,
if you select "viz/analyze", whenever there is a choice, we always pick a visualization or an analysis task
over the "stats" task.  

You can experiment  yourself with different settings,  and use the app to
answer  the practice  questions thereafter.


<div class="ui accordion fluid app-ins">
  <div class="title">
    <i class="dropdown icon"></i>
    (Open simulator here)
  </div>
  <div markdown="0" class="ui segment content sim-frame">
    {% include simulator.html src="multi_core_dependent_tasks_2_cores/" %}
  </div>
</div>

#### Practice Questions

**[A.2.p3.6]** For our example program on our 2-core compute  **using 2 "analyze" tasks**, 
is prioritizing tasks on the critical path a good idea? 

<div class="ui accordion fluid">
  <div class="title">
    <i class="dropdown icon"></i>
    (click to see answer)
  </div>
  <div markdown="1" class="ui segment content">

XXX

  </div>
</div>

<p></p>


**[A.2.p3.7]** Running our program with XXX "analyze" tasks, is prioritizing tasks
on the critical path still a good idea? 

<div class="ui accordion fluid">
  <div class="title">
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

Answer the following questions:
