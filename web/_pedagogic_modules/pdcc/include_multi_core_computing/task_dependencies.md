
#### Learning Objectives
<div class="learningObjectiveBox" markdown="1">
- Understand the concept of task dependencies
- Understand and quantify the impact of task dependencies on parallelism
</div>

---

### Basic Concept

So far, we have only considered *independent* tasks in our parallel programs,
i.e., tasks that can be executed in any order and concurrently. In other
words, given a computer with as many cores as tasks and sufficient RAM
capacity, all tasks can run at the same time. 
But in many real-world programs this is not the case.
Instead, tasks exhibit **dependencies**. In other words, some tasks cannot
execute before other tasks are done. This could be because the output
of  a task serves as input to another, or more generally because a
specific ordering of some  tasks is necessary for program correctness.

As an analogy, consider a chef cooking
a meal. First, they need to select and procure the ingredients. Second,
they need to cook these ingredients. Finally, the cooked ingredients must
be plated. None of these tasks may be completed out of order. The "cook
ingredients" task depends on the "procure ingredients" task, and the "plate
meal" task depends on the "cook ingredients" task. A convenient way to
represent such programs is a **Directed Acyclic Graph (DAG)**, in which
*vertices are tasks* and *edges are dependencies*. For the "cook a meal"
program, the DAG representation is straightforward, and depicted in
the figure below:

<object class="figure" type="image/svg+xml" data="{{ site.baseurl }}/public/img/multi_core_computing/example_chain_dag.svg">Chain DAG</object>
<div class="caption"><strong>Figure 1:</strong>
DAG for the "chef" example.
</div>


Here is a typical example of task dependencies in a parallel program.
Consider a program that counts the number of car objects in a set of
compressed street images. Each image needs to be uncompressed,
pre-processed, (e.g., to remove noise), analyzed (to find and count cars). 
Once this has been done for each image, car count statistics need
to be displayed. If we have 5 compressed pictures,
the program's DAG is:

<object class="figure" type="image/svg+xml" data="{{ site.baseurl }}/public/img/multi_core_computing/example_car_dag.svg">InTree DAG</object>
<div class="caption"><strong>Figure 2:</strong>
DAG for the "car counting" example.
</div>

Note that each task above can involve both I/O and computation. For
instance, an "uncompress" task must read in an image file from disk to
uncompress it. 
Then, whether it writes back to
disk the uncompressed image or keeps it in RAM so that the "pre-process"
task can do its job is up to the program's software implementation.
Given that the DAG above does not show any output file for these tasks,
the idea is  to keep everything in RAM and/or I/O operations. 
Clearly keeping things in RAM can avoid costly I/O operation, but as we
know RAM capacity is limited. So, based on what we learned in the previous
tab, we could lose parallel efficiency due to RAM constraints. 


#### Simulating Simple Task Dependencies

For now, to keep things simple, let's assume that tasks take zero RAM and
that they perform no I/O. Let's consider an example program that is used to
analyze some dataset. It begins with a "start" task that does some
pre-processing of the in-RAM dataset. Then, once the pre-processing is done, it
needs to perform three things. Namely, it needs to produce some visualization, perform some
analysis, and compute some statistics:

  - The visualization consists of a sequence of two tasks: "viz" (computes what to visualize) and  "plot" (generates a fancy 3-D plot)
  - The analysis consists of a sequence of two tasks :  "analyze" (performs data analysis) and "summarize" (generates summary analysis results)
  - The statistics consists of a single task: "stats" (computes some statistics)
  
Once all the above is done, a "display" task displays all results.  The "analyze" task has an **amount of work that is user-defined**. The more work, the
more in-depth the analysis results. 

The program's DAG is shown below, with the work of
each task (and just *X* for the analysis task):

<object class="figure" type="image/svg+xml" data="{{ site.baseurl }}/public/img/multi_core_computing/example_simulated_dag.svg">Simulated DAG</object>
<div class="caption"><strong>Figure 3:</strong>
DAG for the "data set analysis" example.
</div>


To gain hands-on experience with the task dependency concept, use the
simulation app below to simulate the execution of the above program
on a 3-core computer, where **each core computes
 at speed 10 Gflop/sec**.  You can pick the amount of work for the
 "analyze" task. The execution strategy used for this execution
is very simple: whenever a task can be executed (because all its parent
tasks have been executed) and a core is (or becomes) idle, then execute
that task on that core immediately. We call  a task whose parents
have all executed a **ready task**.
The following practice questions are based on this simulation app.

{% include simulator.html src="multi_core_dependent_tasks_3_cores" %}

#### Practice Questions

**[A.2.p4.1]**  Say we run the program with an "analyze" task that has 100 Gflop work. What is the parallel efficiency when running the program on the 3-core computer and when using a single analysis task? (feel free to use the simulation app  to help you)

<div class="ui accordion fluid">
  <div class="title">
    <i class="dropdown icon"></i>
    (click to see answer)
  </div>
  <div markdown="1" class="ui segment content answer-frame">
  The sequential program's execution on 1 core, *T(1)*, is simply the sum
  of individual task execution times,

$
\begin{align}
  T(1) & = 5 + 20 + 10 + 10 + 10 + 40 + 1 = 96 \;\text{sec}
\end{align}
$

The simulated execution time on our 3-core computer is:

$
\begin{align}
  T(3) & = 46 \;\text{sec}
\end{align}
$

So the parallel efficiency is $E(3) = (96/46)/3 =$ **69.56%**.
  </div>
</div>

<p></p>

**[A.2.p4.2]** What is the number of idle core seconds when running the
program when the "analyze" task has 300 Gflop work on our 3-core computer?
You can double-check your answer in simulation. 

<div class="ui accordion fluid">
  <div class="title">
    <i class="dropdown icon"></i>
    (click to see answer)
  </div>
  <div markdown="1" class="ui segment content answer-frame">
  
This is a very similar question as the previous one. The sequential
execution time is 126 seconds, and the execution time on 3 cores is still 
46 seconds. Therefore, the number of core idle seconds is $46 \times 3 - 126 = 12$ seconds.

We can double check this answer by counting the number of idle seconds as
shown in the Host Utilization graph of the simulation app. 
 
  </div>
</div>

<p></p>

**[A.2.p4.3]** For what amount of work of the "analyze" task is the
parallel efficiency maximized? You could use the simulation app to "search" 
for the right answer, but that would be really tedious. Try using analysis
and/or intuition first. 

<div class="ui accordion fluid">
  <div class="title">
    <i class="dropdown icon"></i>
    (click to see answer)
  </div>
  <div markdown="1" class="ui segment content answer-frame">

Let's first do a purely analytical solution. 
Let $x$ be the work of the "analyze" task in Gflop. The sequential execution 
time is $x/10 + 86$ seconds. 

The parallel execution time is a bit trickier. 
  
The visualization path takes time $5 + 20 + 10 + 1 = 36$  seconds, which
is shorter  than  the statistics path, which takes 46 seconds. The analysis path takes time
$5 + x/10 + 10 + 1 = 16 + x/10$  seconds. 

So, we have two cases: If $16 + x/10 \leq 46$, that is, if $x \leq 300$, 
  the critical path  is the analysis path, otherwise the critical
  path is the statistics path. So let's examine both cases:
  
  - $x \leq 300$: the parallel execution time is 46 seconds, and so the parallel efficiency
    is equal to  $((x/10 + 86) / 46) / 3$. This is maximized for $x = 300$, and is then equal
    to 84.05%. 
    
  - $x \geq 300$: the parallel execution time is 16 + x/10, and so the parallel efficiency
     is equal to $((x/10 + 86) / (16 + x/10)) / 3$. This is a decreasing function on the [300, infinity] domain,
     and so on  that domain it is maximized for  $x = 300$. 
     
  The final answer is thus 300 Gflop.  

The above is quite formal, but we could have given a purely
common-sense answer.
The parallel efficiency is maximized when all three paths take
time as close as possible as the longest such path, so as have
  cores working as much  as possible. This is the same  *load balancing*
idea that we have seen in the
[Parallelism tab]({{site.baseurl}}/pedagogic_modules/pdcc/multi_core_computing/#/parallelism)
for independent tasks!
This is achieved when the analysis
path and the statistics path are equal (nothing can be done about the
visualization path), that is, when $x = 300$. 

For $x = 300$ the efficiency is 84.05%, which is the best this program can ever achieve.

  </div>
</div>

<p></p>

### Levels, Width, Critical Path

In the previous section, and the practice questions, we touched upon some
fundamental concepts without naming them explicitly. Let's do so now.

A first concept is that of a **DAG level**. A task is on level $n$ of the
DAG if the longest path from the entry task(s) to this task is of length
$n$, **where the path length is measured in number of vertices traversed before
reaching this task**. By this definition, an entry task is
in level 0. Every child task of an entry task is in level 1, and so on.
Formally, the level of a task is one plus the maximum of the levels of its
parent tasks (this is a recursive definition).

For our example DAG in Figure 3 above, we can determine the level of each task:

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

So we say that this DAG has four levels. Note that this does not mean
that the DAG tasks must be executed level by level. For instance, we could execute
task "plot" (level 2) before task "analyze" (level 1).

A second concept is that of **maximum level width**: the maximum
number of tasks in the workflow levels. For instance, for our example DAG, the 
maximum level width is 3
because level 1 has 3 tasks (and all other levels have fewer tasks). 
This means that using 3 cores should lead to better performance than using 2 cores.
If we enforce that tasks are executed level-by-level, then we cannot make use of
more than 3 cores. Otherwise, in general, it may be possible to use more cores
to gain some performance advantage. But this is not the case for the example DAG
in Figure 3, for which a 4th core would never be used. 

A third concept is that of the **critical path**:
the longest path in the DAG from the entry task(s) to the exit
task(s), where **the path length is measured in task durations, including the
entry and the exit task(s)**. 
No matter how many cores are used, the program cannot execute faster than
the length of the critical path. For instance, consider our example 
DAG, assuming that the "analyze" task has work 250 Gflop. There are three paths
from "start" to "display". The length of the visualization path is
5+20+10+1 = 36 seconds. The length of the statistics path is 5+40+1=46 seconds. The
length of the analysis path is 5+25+10+1=41 seconds. And so the critical path
is {"start" -> "stats" -> "display"}, of length 46 seconds. No matter how many 10 Gflop/sec cores
are used to execute this program, it can never run in less than 46 seconds!

#### Practice Questions

**[A.2.p4.4]** For the DAG below, give the number of levels, the maximum level width, and the
length of the critical path in seconds (name and execution time are shown for each task).

<object class="figure" type="image/svg+xml" data="{{ site.baseurl }}/public/img/multi_core_computing/practice_dag_1.svg">Practice Question DAG</object>

<div class="ui accordion fluid">
  <div class="title">
    <i class="dropdown icon"></i>
    (click to see answer)
  </div>
  <div markdown="1" class="ui segment content answer-frame">

  - Number of levels: 4
  - Maximum level width: 3 (level 3 has 3 tasks: G, E, and F)
  - Length of the critical path: 30s (A 1s, D 20s, F 7s, and H 2s)
 
  </div>
</div>

<p></p>


**[A.2.p4.5]** For the DAG below, would it be useful to use more than 3
cores? Can the execution time be ever shorter than 29 seconds? Could you
modify one edge's end point to increase the DAG's maximum level width?

<object class="figure" type="image/svg+xml" data="{{ site.baseurl }}/public/img/multi_core_computing/practice_dag_2.svg">Practice Question DAG</object>

<div class="ui accordion fluid">
  <div class="title">
    <i class="dropdown icon"></i>
    (click to see answer)
  </div>
  <div markdown="1" class="ui segment content answer-frame">

Here is  the set of DAG levels:

|------|-----|
| level | tasks |
|------|-----|
| 0 | A |
| 1 | B, C|
| 2 | D, E, F|
| 3 | G |
| 4 | H |
|---|-----|

It would never be useful to use more than  3 cores  because the width of the DAG is 3  (level 2). The DAG's
critical path is  {A->B->D->G->H}, which has length 28s. So yes, the execution (on 3 cores) could be lower than 29s. 

Replacing the D->G edge by a D->H edge would make the DAG's maximum level width 4 (i.e., level 2 would have 4 tasks in it). 
  </div>
</div>

<p></p>

---

### Choosing which task to run next

In our example dataset analysis program, there was never a *choice* for deciding which task
to run next. First, we have to run "start". Then, we have three tasks that are
**ready**, that is, whose parents have all executed. Since we have 3 cores, we run
all three, each on one core.  In other words, since we have 3 paths in the DAG and
3 cores, we just run each path on its own core. 

In general however, we could have **more ready tasks than idle cores, in which
case  we have to pick which ready  tasks to run**. This, turns out, can be a  difficult
problem known as  "DAG scheduling". We explore this advanced topic in later modules, but
for now we can get a sense for it via our example. 

Let's say that we now must run
the program on a *2-core* computer. We have a choice after "start" completes: 
we have 3 ready tasks 
and only 2 cores. Say we run "analyze" and "stats". If "analyze" completes before "stats",
then we have another choice: 
should we run "viz" or "summarize"? It turns out that some of these choices are better
than others. In this small example the "bad" choices are not terrible, but for larger
DAGs they  could lead to a large performance loss. 
 
There are some rules of thumb for selecting ready tasks. 
A good and popular one is: Whenever there is a choice **pick the task that is 
on  the  critical path.** After all it is critical. But this is not guaranteed to
be always best. It just happens to work well for many DAGs.

#### Simulating Execution on a 2-core Computer

To see the impact of task selection decisions, the simulation app below
allows you to simulate the execution of our dataset analysis program **on 2
cores** while prioritizing some execution paths. For instance, if you
select "viz/analyze", whenever there is a choice, we always pick a
visualization or an analysis task over the "stats" task.

You can experiment yourself with different settings, and use the app to
answer the practice questions thereafter.

{% include simulator.html src="multi_core_dependent_tasks_2_cores" %}

#### Practice Questions

**[A.2.p4.6]** Setting the "analyze" task's work to 10 Gflop, does it matter which paths are prioritized  when  executing the program on  2 cores? 
If so, which ones should
be prioritized? Can you venture an explanation?

<div class="ui accordion fluid">
  <div class="title">
    <i class="dropdown icon"></i>
    (click to see answer)
  </div>
  <div markdown="1" class="ui segment content answer-frame">

Yes, it does matter! Not prioritizing the statistics path is a mistake.
This is because the statistics path is the critical path. Not counting the
"start" and "display" tasks, the visualization path runs in 30s, the
analysis path in 11s, and the stats path in 40s. This is **exactly** the
problem we looked at in the 
[first tab]({{site.baseurl}}/pedagogic_modules/pdcc/multi_core_computing/#/parallelism):
partition a set of numbers into two groups so that their sums are as close to
each other as possible!  The best choice for this grouping here is clearly
{30, 11} and {40}.  In other words, on one core we should run the
visualization and the analysis path, and on the other we should run the
statistics path.

So, if we prioritize both the visualization and  analysis paths after task "start"
completes, they will run on  different cores, which is a bad choice (as the groupings
will be {30} and {11, 40}). Conclusion: the "stats" path should be part of the
two prioritized paths. 

All this can be seen easily in the simulation app.      

  </div>
</div>

<p></p>

**[A.2.p4.7]** Say now  we set the work of the "analyze" task to be 300
Gflop.  What are the execution times with each of the three path
prioritization options? Can  you explain why the results are as they are?

<div class="ui accordion fluid">
  <div class="title">
    <i class="dropdown icon"></i>
    (click to see answer)
  </div>
  <div markdown="1" class="ui segment content answer-frame">
All three prioritization schemes give a 76 second execution time. In other words,
path prioritization does not matter. With a 300 Gflop work for the "analyze" task,
the visualization path takes 30 seconds, and both the analysis and the statistics
paths take 40 seconds. (Without counting the "start" and the "display"
tasks).  No matter what we do, running on two cores three tasks that
take 30s, 40s, and 40s will take 70s. 

If you really want to spell it out, we can just look at all possibilities.  If
both 40s paths start first, each on  a core, then the 30s path starts after
that, for 70s of execution.  If  the 30s path starts with a 40s path, each
on a core, then the 2nd 40s path will start on the core that ran the 30s
path, since it becomes idle first. This, again, is a 70s execution.  So
overall, the execution will always be 5 + 70 + 1 = 76s.

  </div>
</div>

<p></p>


**[A.2.p4.8]** Is it possible that, for some  amount of work of  the "analyze"  task,
all three different prioritizing options lead to three different execution times (when 
executing the program on 2 cores)?  Although you may have a rapid intuition
of whether the answer is yes or no, deriving a convincing argument is not that easy...

<div class="ui accordion fluid">
  <div class="title">
    <i class="dropdown icon"></i>
    (click to see answer)
  </div>
  <div markdown="1" class="ui segment content answer-frame">
This is perhaps not an easy question, as it requires to think about this abstractly
(so as to avoid examining all possibilities). The answer is "no". Let's see
why.

We can look at this question at a very abstract level: we have three
"things" to run, let's call them $A$, $B$, and $C$. (Each of them is one of
our three paths,  excluding the "start" and "display" tasks).  Let
$a$, $b$, and $c$  be their execution times. Say, without loss of
generality, that $a \leq b \leq c$. Then, we can see what runs on each core
for each option that prioritizes two of them:

|-------|--------|--------| 
|  prioritizing | core  #1 | core #2|
|-------|--------|--------| 
|  $A$ and $B$ | $A$ then $C$  |  $B$   |
|  $A$ and $C$ | $A$ then $B$  |  $C$   |
|  $B$ and $C$ | $B$ then $A$  |  $C$   |
|-------|--------|--------| 

The two prioritized things start first. Then the third thing runs on the core that
becomes idle first (i.e., the core that  was running the shortest thing). 

We  note that in the table above, the 2nd and 3rd rows are identical. That is, the cores
finish computing at the same time.  The only  thing that changes is the order in which
things run on core #1 ("$A$ then $B$" or  "$B$ then $A$"). 
Therefore, two of the prioritization options always produce the same outcome in  terms
of overall program execution time! 

  </div>
</div>

<p></p>

---

#### Questions

Answer the following questions:

**[A.2.q4.1]** For the DAG below, where each task has an execution time in
seconds on a core of some computer, give the number of levels, the maximum
level width, and the length of the critical path in seconds.

<object class="figure" type="image/svg+xml" data="{{ site.baseurl }}/public/img/multi_core_computing/question_dag_1.svg">Question DAG</object>
<p></p>

**[A.2.q4.2]** For the DAG in the previous question, what would be the parallel
efficiency on 3 cores? Show your work and reasoning.

**[A.2.q4.3]** We now execute this same DAG on 2 cores. Whenever there is a choice for 
picking a ready task for execution, we always pick the ready task with the largest work 
(this is a "I should do the most time-consuming chores first" approach). What is the 
execution time? Show your work. It's likely a good idea to draw the execution as a Gantt
chart, as seen in the simulation output. 

**[A.2.q4.4]** Still for that same DAG on 2 cores, we now pick the ready task with the 
smallest work first  (this is a "I should do the easiest chores first" approach). What 
is the execution time?  It is better than the previous approach? Show your work. Use the same
approach as in the previous question.

**[A.2.q4.5]** For this new DAG below, executed on 2 cores, what are the execution times of the "pick the 
ready task with the largest work" and "pick the ready task with the smallest work"  
approaches? Which approach is better? Show your work. For each approach it is likely a good
idea to draw the Gantt chart of the application execution for determining the
execution time. 

<object class="figure" type="image/svg+xml" data="{{ site.baseurl }}/public/img/multi_core_computing/question_dag_2.svg">Question DAG</object>
