
#### Learning Objectives

  - Be able to put together the concepts learned in the previous tabs  

---

### Scenario

Consider the scenario (i.e., a workflow to be executed on a distributed platform)
depicted in this figure: 

<object class="figure" type="image/svg+xml" data="{{ site.baseurl }}/public/img/workflows/workflow_capstone.svg">Capstone scenario</object>

The 4-task workflow needs to be executed on a 2-host platform, with all
workflow data hosted at a remote storage site.  The first task of the
workflow is a data-parallel task; 10% of its sequential execution time
cannot be parallelized (i.e., $\alpha = 0.9$).

Note that in the platform above, we give you the actual data transfer rate
achieved by the wide-area link (20 MB/sec). As we saw in previous tabs, due
to high latencies, the achieved data transfer rate can be well below the
link bandwidth.  We give you the data transfer rate so that it
is straightforward to estimate data transfer times accurately.

### Possible platform upgrades

The compute resources in the platform are really virtual machines that 
you have leased from a cloud provider.  With the current configuration
the workflow executes in 74 seconds, but you want it to run it 
as fast as possible since you want to execute this workflow as many times
as possible per day (with different input data). 

After looking at the cloud provider's web site, you 
figure out you can afford **one** of the following upgrades:

  - **Upgrade #1:** Double the wide-area data transfer rate;
  - **Upgrade #2:** Add 2 cores to each host; or
  - **Upgrade #3:** Add 8 GB of RAM to each host.

<p></p>

#### Questions

[**A.3.4.q5.1]** Which upgrade should you pick?

---
