---
layout: page
title: 'A.3.3 Master Worker'
order: 133
usemathjax: true
submodule: 'distributed_computing'
---



The goal of this module is to introduce you to the basic concepts of running tasks
on a master/worker system.


#### Learning Objectives:

  - Understand master/worker systems

  - Encounter and understand different scheduling philosophies

----



## Basics

When hosts or clusters are referred to as a master or a worker the meaning is reminiscent
of any other area of life. The single master or boss is
 assigning labor amongst an arbitrary number of workers. This allows the workers to be
 simple laborers that do the jobs given to them without worrying about the larger picture,
 and the master is not doing the actual work so they can focus on the larger picture
 working smoothly and efficiently. The success of a master/worker system is predicated on the ability of the
  master to efficiently offload work. This distribution of work is known as scheduling, and there are
  many methodologies to consider when deciding how it should be implemented on the master.


### Parallelism through Master / Worker

Master/Worker can allow for parallel computing in much the same ways as we have previously discussed.
Instead of delegating an entire workload to each host or core, the master can evaluate the workload
and hand off tasks to workers. The worker does the computation as necessary, and returns
 the output to the master when it is finished, signalling that it has completed the assigned work. Once
 a worker is free it can be assigned work again.

 How workload is delegated will depend on that workload and dependencies within it. In a real situation,
 there would also be financial and contractual considerations. A single Master/worker cluster may be
 used by multiple companies or researchers, and those parties will be paying for or assigned a certain level of access.
 This can result in making choices for fairness or financial prudence over efficiency and speed.
 
 


### Scheduling  Philosophies In Master / Worker

You may be familiar with the concept of scheduling for a single processor. In discussions of scheduling on a single
machine where decisions must be made very quickly and efficiently, complex scheduling is not realistic. Your time spent
trying to calculate the most efficient scheduling of tasks takes longer than the gains, or unexpected I/O takes
precedence and necessitates frequent recalculations. When dealing
with large computational workloads the gains from trying more complex scheduling can potentially have a larger payoff.
Scheduling efficiently may cut minutes or hours off of the computation time needed. You don't
have to account for the possibility of unexpected I/O, and workloads can be submitted with an estimate of computation
time and resources needed. For scheduling, having that additional information and payoff could be a game changer.

When scheduling you have two major pieces to consider, the workload/task and the worker that will be assigned
to. You can have a methodology for choosing which task or tasks get executed first and a separate methodology for
which worker that task is assigned to.

In the simulation below we have implemented a number of different methodologies for scheduling each of these components. 
These can be used to explore what the best scheduling philosophy actually is for different situations.
Specifically they are:

Task Selection:
    - random (default)
    - highest flop
    - lowest flop
    - highest bytes
    - lowest bytes
    - highest flop/bytes
    - lowest flop/bytes
Worker Selection:
    - random (default)
    - fastest worker
    - best-connected worker
    - largest compute time/io time ratio
    - earliest completion


### Simulating Master / Worker

<div class="ui accordion fluid app-ins">
  <div class="title">
    <i class="dropdown icon"></i>
    (Open simulator here)
  </div>
  <div markdown="0" class="ui segment content sim-frame">
    {% include simulator.html src="master_worker/" %}
  </div>
</div>

### Practice Questions

**[A.3.p1.1]** What is one example of a scenario where scheduling a series of tasks by highest flop required first is 
optimal? What would a counter example be where it is not optimal? Do such examples and counter-examples exist for 
each time of scheduling?


**[A.3.p1.2]** Consider that you have 7 identical tasks and 3 identical workers to assign them to. Does it matter how 
the tasks are scheduled for improving overall execution time? Check your answer with the simulator. 

**Simulator Input:**
```
Workers: 100 100, 100 100, 100 100
Tasks: 100 100 100, 100 100 100, 100 100 100, 100 100 100, 100 100 100, 100 100 100, 100 100 100
```

**[A.3.p1.3]** Now consider that 3 of the tasks have their input/output bytes tripled, and one worker has its bandwidth to the master 
tripled. If tasks are scheduled such that the highest byte tasks are assigned to the best connected workers first, does 
this change the execution time? Check your answer with the simulator. 

**Simulator Input:**
```
Workers: 100 100, 100 100, 100 300
Tasks: 300 100 300, 300 100 300, 300 100 300, 100 100 100, 100 100 100, 100 100 100, 100 100 100
Task Scheduling: Highest Bytes
Worker Scheduling: Best-Connected Worker
```

**[A.3.p1.4]** What is the best possible execution time given the second version of the scenario described in [A.3.p1.3]?
 How could this be achieved?



### Questions

**[A.3.q1.1]** Say that you have three workers (Worker #0, Worker #1, Worker #2) with 10 GF/s, 100 GF/s and 1000 GF/s 
single-core processors respectively.
All workers are connected to the master by their own 100 MBps link. You must delegate a workload that consists of four
independent tasks (they can be executed in any order). The tasks are as follows:

    Task #0  
    Input: 100 MB  
    Computation: 10 GF  
    Output: 100 MB  
    
    Task #1  
    Input: 100 MB  
    Computation: 1000 GF  
    Output: 100 MB  
    
    Task #2  
    Input: 1 GB  
    Computation: 1000 GF  
    Output: 1 GB  
    
    Task #3 
    Input: 1 GB  
    Computation: 1000 GF  
    Output: 1 GB  

If the tasks are assigned to workers in the order that both are numbered (Task #0 goes to Worker #0, Task #1 to Worker #1,
 Task #2 to Worker #2 and Task #3 to the first worker available) what will the total execution time be? What is one
 example of intelligent scheduling that could improve on this execution time? Verify your answer using the simulator.
 
 **[A.3.q1.2]** You have 3 workers. They are all equipped with 100 GF/s single-core processors and have 100 MBps links
 to the master. You have a workload for 4 tasks that is repeatedly run, outlined below:
 
    Task #0  
    Input: 1 GB  
    Computation: 500 GF    
    Output: 1 GB 
    
    Task #1 
    Input: 1 GB  
    Computation: 500 GF 
    Output: 1 GB 
    
    Task #2 
    Input: 1 GB  
    Computation: 500 GF    
    Output: 1 GB  
    
    Task #3 
    Input: 800 MB  
    Computation: 1 TF  
    Output: 800 MB 
      
 You have the option to upgrade the CPUs to double the compute speed on all of the workers, or upgrading the connection on 
 one of the workers to double the bandwidth. Which of these options is best if you are scheduling on the basis of highest 
 bytes task and best-connection worker? What is the execution time? Check your work on the simulator.
 
 **Simulator Input:**
```
Workers: 100 100, 100 100, 100 100
Tasks: 1000 500 1000, 1000 500 1000, 1000 500 1000, 800 1000 800
Task Scheduling: Highest Bytes
Worker Scheduling: Best-Connected Worker
```


  **[A.3.q1.3]** You have an undisclosed number of tasks and workers of various unknown specifications. On average, 
  what is the best method for scheduling given this lack of information? 
  
  
  **[A.3.q1.4]** Question involving simulating 100x with random... need to build mass sim functionality into javascript 
  first.
  
  **[A.3.q1.5]** TBD
  