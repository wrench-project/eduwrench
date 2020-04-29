
#### Learning Objectives:

- Understand the concept of task dependencies
- Understand the impact of task dependencies on parallelism

---

#### Basic concept

So far, we've only considered *independent* tasks in our applications,
i.e., tasks that can be executed in any order and concurrently. In other
words, given a computer with as many cores as tasks and sufficient RAM
capacity, But  in many, many, real-world applications this is not the case.
Instead, tasks exhibit *dependencies*. In other words, some tasks cannot
execute before other tasks are done. As an analogy, consider a chef cooking
a meal.  First, they need to select and procure the ingredients. Second,
they need to cook these ingredients. Finally, the cooked ingredients must
be plated.  None of these tasks may be completed out of order. The "cook
ingredients" task depends on the "procure ingredients", and the "plate
meal" task depends on the "cook ingredients" task.  A convenient way to
represent such applications is a *Directed Acyclic Graph (DAG)*, in which
*vertices are tasks* and *edges are dependencies*. For the "cook a meal"
application, the DAG representation is straightforward, and depicted in
Figure 1 below:

<object class="figure" type="image/svg+xml" data="{{ site.baseurl }}/public/img/multi_core_computing/example_chain_dag.svg">Chain DAG</object>

Going back to computing, here is a typical example of task dependencies.
Consider an application that counts the number of car objects in a set of
compressed street pictures. Each picture needs to be uncompressed,
pre-processed, (e.g., to remove noise), analyzed (to find and count cars).  And
then, once this has been done for each picture, car count statistics need
to be displayed.  Say that we have 5 compressed pictures,
the application can be represented as a DAG as in Figure 2 below:

<object class="figure" type="image/svg+xml" data="{{ site.baseurl }}/public/img/multi_core_computing/example_car_dag.svg">InTree DAG</object>

Note that each task above can involve both I/O and computation. For
instance, the "uncompress" task must read in a picture file from disk, and
then execute a decompression algorithm.  Then, whether it writes back to
disk the decompressed image or keeps in in RAM so that the "pre-process"
task can do its job is up to the application's implementation in software.
Clearly keeping things in RAM can avoid costly I/O operation, but as we
know RAM capacity is limited.

### Simulating Simple Task Dependencies

For now, to keep things simple, let's assume that tasks take zero RAM and
that they perform no I/O. Let's consider an example program that is used to
analyze some dataset. It starts with a "start" task that does some
preprocessing of the dataset. Then, once the preprocessing is done, it
needs to perform three things: produce some visualization, perform some
analysis, and compute some statistics. The visualization and the statistics
are compute in spearate tasks, "viz" and "stats". The analyzes, however, is
quite expensive. And so the developer of the program has made it possible
use multiple tasks to do it. Instead of a single massive task, there is
first a "split" tasks that partitions the dataset into pieces, and then a
configurable number of "analyze" tasks, that each work on a piece. The
developer did this knowing that the application can be executed on
multi-core architectures. Finally, once all the above tasks has completed,
the program performs a "display" task that displays results. The figure below
shows the DAG for this program when it uses 3 analyze tasks, showing the work of
each task:

<object class="figure" type="image/svg+xml" data="{{ site.baseurl }}/public/img/multi_core_computing/example_simulated_dag.svg">Simulated DAG</object>

The total work for analyzing the dataset is 3000 GFlop, which
is divided as equally as possible across the individual
"analyze" tasks (which is why in the example above each of them has
work of 1000 GFlop).

To gain hands-on experience with the task dependency concept, use
the simulation Web app below to simulate the execution
of our example program on a 6-core computer, varying the number of analysis
tasks between 1 and 6 (no point using more than 6 analysis tasks since we have
only 6 cores). The execution strategy used for this execution
is very simple: whenever a task can be executed (because all its parent 
tasks have been executed), whenever a host is idle, then execute that task on
that host immediately. First run the simulation with the
default number of analysis tasks (3), and make sure that the simulation
output makes sense to you  (in particular the order of task executions).

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

tied to the simulation above

**[XXX]** XXXXX

<div class="ui accordion fluid">
  <div class="title">
    <i class="dropdown icon"></i>
    (click to see answer)
  </div>
  <div markdown="1" class="ui segment content">


$$
\begin{align}
  T(1) & = 4  \times ( 6 / 2 + 100 / 10 )\\
              & = 52 sec
\end{align}
$$

  </div>
</div>

<p></p>


### Levels, Critical Path

The above example  was really a simple because we don't really have a choice. Say now that
we have only 2 cores to run the application. 

Concept of critical path

### Choosing which task to run next

Concept of scheduling

Simulation with different schedules:
    [only 2 tasks, because after all, only 2 cores!]



#### Questions

Answer the following questions:
