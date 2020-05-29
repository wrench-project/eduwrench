
#### Learning Objectives

- Being able to use simulation to compare master-worker scheduling strategies meaningfully

----


#### Questions Featuring Large Sample Size

<div class="ui accordion fluid app-ins">
  <div class="title">
    <i class="dropdown icon"></i>
    (Open simulator here)
  </div>
  <div markdown="0" class="ui segment content sim-frame">
    {% include simulator.html src="master_worker_generated/" %}
  </div>
</div>

 

You will notice that the simulator just above is slightly different. Initially you were giving a fixed number of 
workers and tasks with fixed specifications, so most scenarios would have been deterministic. We have now changed how the 
 simulation is done; instead of specifying specific hosts and tasks, you can just specify ranges. The ranges you specify
  will be used to randomly generate the number of workers and tasks you specified. 
 
This can be helpful in assessing whether a certain method of scheduling is valid under varying conditions or just 
 specific ones. The number of invocations can be increased to provide a larger sample size. Seed is used so that we can 
 have random yet deterministic inputs for comparison.

**[A.3.q3.9]** Using random scheduling for both tasks and workers, what is the mean execution time for the default 
inputs over 100 invocations using seed 12345?

**[A.3.q3.10]** If you were to increase the ranges for the attributes of tasks and workers, what would happen to the 
spread between the minimum and maximum execution time for random scheduling?

**[A.3.q3.11]** For the default inputs above with seed 12345, how does random scheduling compare to prioritizing 
highest flop task and the fastest worker?

**[A.3.q3.12]** Keep the default inputs the same except for increasing the range of task input/outputs and worker 
bandwidth to [1,5000]. This simulation may take additional time. How does random scheduling compare to scheduling that 
takes into account task data (highest bytes and best-connected worker first)?

  
</div>
  