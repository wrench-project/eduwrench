---
layout: page
title: 'E. Workflow Execution Fundamentals'
order: 500
usemathjax: true
---

### Learning objectives


  - Understand the fundamental steps involved when executing a workflow on a cyberinfrastructure that comprises storage and compute services;

  - Be able to estimate the time it should take to complete a chain workflow on a simple cyberinfrastructure; 

  - Be able to analyze a (simulated) workflow execution timeline based on textual and graphical simulation output;
      
  - Understand the concept of I/O-intensive vs. compute-intensive workflows.

---

### Scenario

Now that you have been introduced to *workflows*, *cyberinfrastructure*,
and *workflow management systems (WMS)*, you can start looking at actual
workflow executions.  Let's do this for a particular scenario. 

<object class="figure" type="image/svg+xml" data="{{ site.baseurl }}/public/img/
workflow_execution_fundamentals/workflow.svg">Workflow</object>

Figure 1 illustrates the DAG representation of the workflow for our
scenario. *task0* requires the file *task0::0.in* as its input and produces
the file *task0::0.out* as output. *task1* requires the output of *task0*
(file *task0::0.out*) as its input and produces the file *task1::0.out* as
output.  This type of linear workflow is often called a *chain*. In order
to orchestrate the execution of this workflow, a WMS needs access to two
types of resources: persistent storage to read/write files to/from and a
compute resource to perform the computation required by each task.

<object class="figure" type="image/svg+xml" data="{{ site.baseurl }}/public/img/
workflow_execution_fundamentals/platform.svg">Workflow</object>

The platform in Figure 2 depicts the cyberinfrastructure on which we wish
to execute this workflow. The WMS runs on the host
*my_lab_computer.edu*, and has access to both the Storage Service on host
*storage_db.edu* and the Compute Service on host *hpc.edu*.

**Storage Service**. A Storage Service (SS) stores files and handles read and write
requests. For example, if *my_lab_computer.edu* wants to read a file from
*storage_db.edu*, it will make a read request to the SS, which will then
send the file content over the network.

**Compute Service**. A Compute Service (CS) can execute workflow tasks submitted to it by the WMS.  Typically, a compute service will have access to powerful computers.

**Workflow Management System**. The WMS in this scenario greedily submits
tasks to the CS for execution once they become ready. A task is ready to be
submitted by the WMS when its parent task(s) has completed.  In this
scenario, tasks are only submitted for execution to the CS, and all file
read and write operations are to the SS.  The initial input file,
*task0::0.in*, is assumed to already be "staged" at the SS.

### The Workflow Execution

Figure 3 below illustrates the workflow's execution.
In order for the CS to complete each task in its entirety, it must read in the
input file for that task, perform the computation required by that task, and
finally write the output file for that task.  

<object class="figure" type="image/svg+xml" data="{{ site.baseurl }}/public/img/
workflow_execution_fundamentals/workflow_execution.svg">Workflow Execution</object>

Notice that in step 3, the CS writes the output file to the SS, then immediately
reads that file back from the SS in step 4. This happens because the only place in which we can store data (in this scenario) is on the 
SS at *storage_db.edu*. Obviously, this is not great for performance, but 
that's what we are stuck with for now.

Using figure 3 as a guide, and things we've learned in previous modules, we can estimate the workflow execution time, or *makespan*! 
The estimated execution time of *task0* is as follows:

$$
\begin{align}

  T_{task0} & = T_{step1} + T_{step2} + T_{step3} \\
            & = (10\;\text{us} + \frac{200\;\text{MB}}{10\;\text{MB/sec}}) + (\frac{100*10^{12}\;\text{flop}}{10^{12}\;\text{flop/sec}}) + (10\;\text{us} + \frac{400\;\text{MB}}{10\;\text{MB/sec}}) \\
            & = 20.000010 + 100 + 40.000010\;text{sec} \\
            & = 160.000020\;\text{sec}\\
            & \simeq 160\;\text{sec}

\end{align}
$$

Next, the estimated execution time of *task1* is as follows:

$$
\begin{align}

  T_{task1} & = T_{step4} + T_{step5} + T_{step6} \\
            & = (10\;\text{us} + \frac{400\;\text{MB}}{10\;\text{MB/sec}}) + (\frac{35*10^{12}\;\text{flop}}{10^{12}\;\text{flop/sec}}) + (10\;\text{us} + \frac{100\;\text{MB}}{10\;\text{MB/sec}}) \\
            & = 40.000010 + 35 + 10.000010\;text{sec} \\
            & = 85.000020\;\text{sec}\\
            & \simeq 85\;\text{sec}

\end{align}
$$

*task0* and *task1* are executed sequentially, i.e., one after the other, therefore the total estimated
makespan of our workflow will be:

$$
\begin{align}

  T_{\text{workflow\;makespan}} & = T_{task0} + T_{task1} \\
                                & \simeq 160 + 85\;text{sec} \\
                                & = 245\;\text{sec}

\end{align}
$$


### Running a Workflow Execution Simulation

So that you can gain hands-on experience, use 
the simulation Web application
(see <a href="{{site.baseurl}}/pedagogic_modules/simulation_instructions/index/" target="_blank">instructions</a>),
selecting `Workflow Execution Fundamentals` from its menu. 

#### Interpreting Text Output from Simulated Workflow Execution

For now, just hit the "Run Simulation" button (without modifying the value in the text box and leaving it at 1000).  Running the simulation updates the Web page with content below the button. The first such section shows *text output*, and should look like this:

<div class="wrench-output">
<span style="font-weight:bold;color:rgb(187,0,187)">[0.000000][my_lab_computer.edu:wms__3] Starting on host my_lab_computer.edu listening on mailbox_name wms__3<br></span>
<span style="font-weight:bold;color:rgb(187,0,187)">[0.000000][my_lab_computer.edu:wms__3] About to execute a workflow with 2 tasks<br></span>
<span style="font-weight:bold;color:rgb(0,0,187)">[0.000475][my_lab_computer.edu:wms__3] Submitting task0 to compute service on hpc.edu<br></span>
<span style="font-weight:bold;color:rgb(187,0,0)">[163.004555][my_lab_computer.edu:wms__3] Notified that task0 has completed<br></span>
<span style="font-weight:bold;color:rgb(0,0,187)">[163.005030][my_lab_computer.edu:wms__3] Submitting task1 to compute service on hpc.edu<br></span>
<span style="font-weight:bold;color:rgb(187,0,0)">[250.508827][my_lab_computer.edu:wms__3] Notified that task0 has completed<br></span>
<span style="font-weight:bold;color:rgb(187,0,187)">[250.250.508827][my_lab_computer.edu:wms__3] -------------------------------------------------<br></span>
<span style="font-weight:bold;color:rgb(187,0,187)">[250.250.508827][my_lab_computer.edu:wms__3] Workflow execution completed in 250.508199 seconds!<br></span>
</div>

The first part of each line of output is a (simulated) time stamp. The second part is 
split into two sections: hostname, and process name. Last, and most importantly, is a message describing what the process is doing. 
For example, the second line from the output
above: 

`[0.000000][my_lab_computer.edu:wms__3] About to execute a workflow with 2 tasks` 

tells us
that at *simulation time 0.00000*, the WMS named *wms__3*, located on the physical host, *my_lab_computer.edu*, is *"About to execute a workflow with 2 tasks"*.
(The "__3" in the process name is added by the simulator as a unique integer identifier.)
The output only shows a few messages printed by the WMS. The color scheme is 
that general messages are <span style="font-weight:bold;color:rgb(187,0,187)">pink</span>, submissions to the CS are 
<span style="font-weight:bold;color:rgb(0,0,187)">blue</span>, and notifications received from the CS are
<span style="font-weight:bold;color:rgb(187,0,0)">red</span>.  

The last line of output states that the workflow has completed in a bit more than 250 seconds, which is close to
the approximation we computed above on this page (which was 245 seconds). 

---

**Answer these questions based on the textual output above:**
  
  **[E.q1.1]** At what time did the WMS submit *task1* to the compute service?
  
  **[E.q1.2]** From the WMS's perspective, how long did *task1* run for?
    (this duration is called the task's **turnaround-time**)
  
  **[E.q1.3]** The compute service runs on a host with a speed of *1000 GFlop/sec*, and *task1*
    must perform *35 TFlop*. About how long should we expect *task1* to compute for?
  
  **[E.q1.4]** Why does *task1* take longer than what you computed in *question 3*?
  
  **[E.q1.5]** About how long would it take to send all of
    *task1*'s input data from *storage_db.edu* to *hpc.edu* and to send all of *task1*'s output data
    from *hpc.edu* to *storage_db.edu*, using the direct link between these two hosts and assuming no other
    network traffic?
  
  **[E.q.6]** Accounting for this I/O *overhead*, does *task1*'s execution time as experienced by the WMS make sense?

##### Interpreting Visual Output from Simulated Workflow Execution

Analyzing the textual simulation output can be tedious, especially when the
workflow comprises many tasks and/or when there are many simulated
services. Fortunately, the simulator can produce a visualization of the
workflow execution as a Gantt chart and show various relevant durations in a table. 
These are shown on the Web app page below the text output. 

---

**Answer these questions based on the visual output:**

  **[E.q1.7]** What fraction of *task0*'s execution time is spent doing I/O?

  **[E.q1.8]** What fraction of *task1*'s execution time is spent doing I/O?

  **[E.q1.9]** Overall, what fraction of the workflow execution is spent doing I/O?

### Data- vs. Compute-intensive Workflow


If you answered question [E.q1.9] correctly, you found that the workflow
execution spends more time computing than doing I/O, overall.  Very broadly
speaking, we call such a workflow *compute-intensive*. The reverse situation would be an *I/O-intensive*.  However,
these notions depend on the hardware on which the workflow is executed. The
faster the network and/or slower to cores, the more compute-intensive the
workflow, and vice-versa.

---

**Answer these questions:**

  **[E.q1.10]** Using analysis (i.e., equations), for what compute speed (in
          GFlop/sec) of the core at site *hpc.edu* would our workflow
          execution being perfectly balanced between computation and I/O.

  **[E.q1.11]** Verify your answer to the previous question using the simulation. How far off were you?

  **[E.q1.12]** Your boss is absolutely intent of making the workflow execution as fast as possible by upgrading the machine at *hpc.edu*. The idea is to make the workflow execution three times as fast (compared to the execution with a 1000 GFlop/sec core) with this upgrade. Is this possible? If not, why not?


---
