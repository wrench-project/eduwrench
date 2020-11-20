
#### Learning Objectives
<div class="learningObjectiveBox" markdown="1">
- Be able to apply the concepts learned in this module to reason about
and optimize the performance of a scenario that includes computation activities,
I/O activities, and RAM constraints
</div>

---

### Production Scenario

You are working for a company that uses a single-core computer to run
computational tasks as part of day-to-day business. The specifications 
of the computer and tasks are as follows:

##### Machine

  - 1 1-Core CPU that computes at 50 Gflop/sec
  - 12 GB of RAM
  - 1 HDD with 1TB capacity and 200 MB/sec R/W bandwidth

##### Tasks

Two tasks need to be run back-to-back throughout the day. 
Each task proceeds in three phases: (*i*) it reads its input file fully; 
(*ii*) it computes; and (*iii*) it writes its output file fully. Each task 
has a memory footprint that must be allocated to it throughout its execution 
(i.e., from the time it begins reading its input file until it finishes 
writing its output file). 

  - Task A:
    - 500 Gflop
    - Requires 12 GB of RAM
    - Input File (Read from disk before computation can start): 4 GB
    - Output File (Written to disk after computation has completed): 2 GB

  - Task B:
    - 800 Gflop
    - Requires 12 GB of RAM
    - Input File (Read from disk before computation can start): 2 GB
    - Output File (Written to disk after computation has completed): 4 GB

### Phase #1: Hardware upgrades for the current implementation

In the current implementation of the software that executes the two tasks,
the first task must run to completion (i.e., its output file must be written 
to disk) before the next task cant start executing (i.e., start reading its 
input file from disk). 

Your manager has tasked you with decreasing the total execution time for
executing the two tasks. Ignoring things like hardware wear-and-tear and 
reliability, you have some decisions to make as far as allocating funds to 
upgrade the computer used to run the tasks. Here are possible upgrades:

##### CPU Upgrades
  1. Keep current 50 Gflop/sec CPU for $0
  2. Upgrade CPU to 100 Gflop/sec for $100
  3. Upgrade CPU to 200 Gflop/sec for $250

##### RAM Upgrades
  1. Keep current 12 GB RAM for $0
  2. Upgrade to 16GB RAM for $50
  3. Upgrade to 32GB RAM for $100

##### Storage Upgrades
  1. Keep current 200 MB/sec HDD for $0
  2. Upgrade to SSD with 400 MB/sec R/W for $100  
  3. Upgrade to SSD with 500 MB/sec R/W for $250

Your manager has allocated $250 to spend for upgrades. Leftover
money is encouraged if spending it will not decrease execution time
further.

#### Questions

**[A.1.q5.1]** What is the execution time of this 2-task application on 
that computer? Show your work by computing and adding all I/O and compute times
for each task.

**[A.1.q5.2]** Is the execution I/O-intensive or CPU-intensive?  Explain your reasoning.
  
**[A.1.q5.3]** If you were given only $100 to spend on upgrades, which 
upgrade in the list above would you purchase?  You can answer this question
purely via reasoning without computing anything. Show your work.

**[A.1.q5.4]** What is the optimal way to spend the $250 on upgrades to 
decrease execution time and what is the corresponding execution time? Show your
work by discussing all possible ways to spend the money and estimating the
execution time for each.

**[A.1.q5.5]** Will the execution then be I/O-intensive or CPU-intensive? Explain your reasoning.

----
    
### Phase #2: Hardware upgrades for a better implementation

Before you purchase the upgrades you determined in question A.1.q5.4 above, your manager 
informs you that a software engineer in the company has just rewritten 
the software so that the execution can be more efficient: when the first 
task starts performing its computation, the second task can then start 
reading its input file from disk. However, only one task can compute at 
a time, and only one I/O operation can be performed at a time.  So, for 
instance, if at time $t$ the first task begins computing, which will last 
100 seconds, and the second task begins reading its input file, which will 
last 200 seconds, then the first task will only start writing its output 
file at time $t+200$ (i.e., it has to wait for the disk to be idle). 
The above is only feasible if there is **sufficient RAM to accommodate both 
tasks**. 

In this more complex, but possibly more efficient, implementation, there 
is now a choice of which task to execute first. 

#### Questions

**[A.1.q5.6]** If you execute A before B, what is the best way to spend the
$250 on upgrades? Consider all possible ways to spend the money. Hint: one
upgrade is necessary to make the execution different from that in A.1.q5.4
above.  Show your work by expressing the execution time as a mathematical
expression (it's a good idea to depict the execution as in the figures in
the previous tab), and modifying the terms in this expression based on
different upgrades to compare their effect on execution time.

**[A.1.q5.7]** If you execute B before A, what is the best way to spend 
the $250 on upgrades? Use the same approach as for the previous question and
show your work similarly.

**[A.1.q5.8]** Considering the best of these two options (i.e., A.1.q5.6 and A.1.q5.7), compare and 
contrast to your answer to A.1.q5.4 in terms of money spend and execution 
time achieved. Is the more complex implementation worthwhile? Show your reasoning.

---
