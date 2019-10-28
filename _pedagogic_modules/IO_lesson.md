---
layout: page
title: 'I. Input/Output Effects'
order: 900
usemathjax: true
---



### Learning Objectives

	- Understand the impact of IO operations on computing
	- Understand basics of optimizing computation around IO operations


### Basic Concepts

In computing, the processor will not be able to complete a program start to finish in a vacuum. Programs will often 
need to wait on input or output, referred to as *IO operations*. A couple very common IO operations are reading from 
or writing to disk. As the disk is much slower than the CPU, even small reads or writes will represent a large chunk 
of time that the CPU is sitting idle. 

When it comes to IO operations, not every program is created equal. Some programs will need more IO time than others 
and can even be categorized in this way. If a program requires a lot of IO time, it can be referred to as IO intensive. 
If a program has little need for IO compared to its CPU usage, it is referred to as CPU intensive. 

As mentioned above, reading from and writing to the disk are slow operations compared to the CPU. What also needs to be 
taken into account is that there is a difference between read and write speed as well. Reading from the disk is 
typically faster than writing to the disk by a noticeable margin. On top of this difference, different kinds of memory 
have various speeds as well. To look at the difference between the two main types of main storage, 
Hard Disk Drives (HDD) and Solid State Drives (SSD), the table below contains general figures for consumer-grade 
hardware. 


|     | Read     | Write    |
|-----|----------|----------|
| HDD | 210 MBps | 200 MBps |
| SSD | 550 MBps | 520 MBps |


One generalization we will make in this module is assuming that disk speeds are constant. There are many factors that 
play into the speed of reading and writing to disk, but for our purposes here we can assume consistent performance. 



### How Computation With IO Looks

Let us examine a program that needs to read from disk prior to computation, and then write back to disk afterwards. This
could be applying the oil painting filter to a photograph. Each task will need to load the photograph from disk, 
apply the filter, and then save the new image back to disk. 

<object class="figure" type="image/svg+xml" data="{{ site.baseurl }}/public/img/IO_effects/IO_figure_1.svg">Cyberinfrastructure</object>

$$
\begin{align}

  \text{CPU Utilization} & = \frac{T_{Compute}}{T_{Compute} + T_{Idle}} \\
                         & = \frac{4}{4 + 4} \\
                         & = 0.5

\end{align}
$$

As can be seen in the figure above, at any given time there is only either CPU computation or IO operations ongoing. 
This means that the CPU is idle for the entire time that is spent doing IO and ends up with only 50% utilization. 
This is inefficiency that can be reduced 
 because IO and CPU actions are capable of being done independently. While the CPU is working on the first image, 
the second image can be loaded into memory from disk. This will allow the CPU to immediately begin task two upon 
completion of the first task, and while it is working on task two, the first task is being written to disk.

<object class="figure" type="image/svg+xml" data="{{ site.baseurl }}/public/img/IO_effects/IO_figure_2.svg">Cyberinfrastructure</object>

$$
\begin{align}

  \text{CPU Utilization} & = \frac{T_{Compute}}{T_{Compute} + T_{Idle}} \\
                         & = \frac{4}{4 + 2} \\
                         & = 0.66

\end{align}
$$

As you can see from the above representation, not only does the overall execution time drop by 25%, but the CPU 
is also working for a greater percentage of the time. If there were additional tasks added, the idle time would still 
only occur at the very start and very end of the process. 

This is a very neat situation created for our purposes, and it would not always be realistic. Take the cases below for 
example:

<object class="figure" type="image/svg+xml" data="{{ site.baseurl }}/public/img/IO_effects/IO_figure_3.svg">Cyberinfrastructure</object>

In the first case, we now have read and write times that together require a longer amount of time than it takes the CPU
to process one task. This will make weaving CPU processing and IO together not quite as pretty as we add a third task. 



#### CPU Driven vs. IO Driven Execution Times

Let us return to the first example above: 

<object class="figure" type="image/svg+xml" data="{{ site.baseurl }}/public/img/IO_effects/IO_figure_1.svg">Cyberinfrastructure</object>


In this case, we can string together as many tasks as we would like and the CPU will be utilized continuously apart from
the initial read and the last write. With two tasks the IO time is still a significant portion of the execution time, 
but if we were to have 1000 tasks to complete, suddenly that initial read and last write are a negligible portion of the
total execution time. This is what we can refer to as *CPU Driven* execution time and will occur when read and write 
times are sufficiently short for tasks compared with CPU computation time needed. 

As you may guess, the other side of the coin is *IO Driven* execution times where a task's time spent on IO is longer than the 
CPU time needed. In these cases, CPU utilization will be lower due to the need to wait on IO operations to complete. 


### Considerations for Real World IO

Prior to this, we have glossed over some assumptions that do not necessarily hold true in practice. The first is that we
are free to load any number of tasks into memory. As previous modules have touched on, tasks can have significant memory
requirements and it may not be feasible to pre-load many into memory due to space constraints. It is also important to 
realize that you may be running different tasks that each have their own requirements for IO where we have been assuming
identical tasks. Lastly, relating to the concept of workflows, there can be dependencies between tasks that impact 
execution and what IO is required. 



### Practice Questions

For the purposes of these questions you are working at a company that runs the same identical task repeatedly. Currently 
the hardware available to you can process each task broken down into the following times: 

Read: 2 Seconds  
CPU: 3 Seconds  
Write: 2 Seconds  

**[I.p1.1]** For the same price, you may upgrade your CPU so that it can process each task in 2 seconds, or you may 
upgrade to a SSD from your current HDD which will halve Read/Write times to 1 second each. Which would improve your 
execution time per task the most?

<div class="ui accordion fluid">
  <div class="title">
    <i class="dropdown icon"></i>
    (click to see answer)
  </div>
  <div markdown="1" class="ui segment content">
   Looking at the initial times for each task it should be apparent that these tasks are IO bound and the execution time
   is IO Driven. In this case it will not help to decrease CPU computation time, so we would choose to upgrade our 
   storage to an SSD. This will decrease average time per task from four seconds to three seconds, and it will now be 
   CPU Driven execution time.  

  </div>
</div>

**[I.p1.2]** It is decided to purchase the SSD to replace the HDD currently being used, which decreases read/write to 1 
second each. What is the improvement seen 
from this change in terms of CPU utilization over 5 consecutive tasks?

<div class="ui accordion fluid">
  <div class="title">
    <i class="dropdown icon"></i>
    (click to see answer)
  </div>
  <div markdown="1" class="ui segment content">
  Initially, read/write times are 2 seconds each, adding up to 4 seconds per task, while CPU time needed is 3 seconds 
    per task. The total execution time for five tasks will be 22 seconds, of which 15 seconds of that is CPU time. This 
    leads to a CPU utilization of 15/22 = 0.68. 
    
  When read/write times are decreased to 1 second each, now the full execution time will be just 17 seconds. The CPU 
    time does not change, remaining 15 seconds. This improves our CPU utilization to 15/17 = 0.88.

  </div>
</div>
 

### Questions

**[I.q1.1]**