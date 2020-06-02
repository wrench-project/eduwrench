
#### Learning objectives

  - Understand how task- and data-parallelism can be mixed
  - Be able to reason about the performance of programs that include both task- and data-parallelism

---


### XXXXX


### XXXX


<object class="figure" type="image/svg+xml" width="500" data="{{ site.baseurl }}/public/img/workflows/workflow_task_data_parallelism.svg">Example workflow</object>
<div class="caption"><strong>Figure 1:</strong> A simple workflow with some data-parallel tasks ($\alpha$ is the fraction of the work that is non-parallelizable)</div>

Figure 1 above show the compute site for the platform in the previous tab, but
with a new host that is not used for computation but provides access to a 
disk with 500 MB/sec read/write bandwidth.

#### Simulating XXXX

<div class="ui accordion fluid app-ins">
  <div class="title">
    <i class="dropdown icon"></i>
    (Open simulator here)
  </div>
  <div markdown="0" class="ui segment content">
    {% include simulator.html src="workflow_task_data_parallelism/" %}
  </div>
</div>

---

#### Practice Questions

**[A.3.4.p4.1]**  XXX

<div class="ui accordion fluid">
  <div class=" title">
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

**[A.3.4.q4.1]** XXX
