
#### Learning Objectives

- Being able to use simulation to compare master-worker scheduling strategies meaningfully

----

In the previous tab, you were able to simulation particular master-worker setups
with different scheduling strategies.  But as we noted, it was  difficult to draw general
conclusions from just a few particular test cases. Instead, what we need to do is
**compare scheduling strategies on many test cases**. 



### Simulating may test cases

Below is a simulation app that makes is possible to evaluate a scheduling
strategy on multiple randomly generated scenarios. The app returns the
minimum, average, and maximum execution times over all these scenarios. 
This makes it possible to draw some informed conclusions on the relative merit
of different strategies. But analysis of experimental data is a complicated matter,
and we're only scratching the surface here.  


The simulation app is a bit more complicated than that in  the previous tab. It allows you to specify:

 - A number of of workers
 - Ranges of worker link bandwidths and worker speeds, from which actual values are sampled randomly
 - A number of of tasks
 - Ranges of task input sizes and works, from which actual values are sampled randomly
 - Task and worker selection strategies
 - A number of experiments to run
 - A seed for the random number generator (changing the seed  to any integer will change the random samplings above)
 
You can  use this application on your own, but below are practice questions that guide you through some
interesting experiments.
 
<div class="ui accordion fluid app-ins">
  <div class="title">
    <i class="dropdown icon"></i>
    (Open simulator here)
  </div>
  <div markdown="0" class="ui segment content sim-frame">
    {% include simulator.html src="master_worker_generated/" %}
  </div>
</div>


**[A.3.3.p2.1]** 


**[A.3.q3.9]** Using random scheduling for both tasks and workers, what is the mean execution time for the default 
inputs over 100 invocations using seed 12345?

**[A.3.q3.10]** If you were to increase the ranges for the attributes of tasks and workers, what would happen to the 
spread between the minimum and maximum execution time for random scheduling?

**[A.3.q3.11]** For the default inputs above with seed 12345, how does random scheduling compare to prioritizing 
highest flop task and the fastest worker?

**[A.3.q3.12]** Keep the default inputs the same except for increasing the range of task input/outputs and worker 
bandwidth to [1,5000]. This simulation may take additional time. How does random scheduling compare to scheduling that 
takes into account task data (highest bytes and best-connected worker first)?

  
  