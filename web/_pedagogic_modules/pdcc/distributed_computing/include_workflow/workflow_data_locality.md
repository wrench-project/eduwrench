
#### Learning objectives

  - Gain exposure to the concept of data locality.
  - Be able to quantify the impact of data locality on workflow execution.

---


### The need for data locality

In the previous tab, all workflow tasks were reading/writing  data at a
remote  (from their perspective) storage site. Due to the low wide-area
bandwidth  (which is lower than the disk bandwidth)  and latency, the
workflow execution spends a large fraction of its time performing remote
I/O, which in terms hurts performance and parallel efficiency. This is
especially damaging from the "intermediate" data files, that is those
that are output of one task an input to another.  These  files are
written  to the remote storage and then immediately read back from it. 
Keeping these files "close" to the compute hosts would of course be much
more efficient. 

Trying to keep/move data close to where the computation takes place is
often called **improving data locality**  (you may have encountered
this term in Computer Architecture or Operating Systems courses/textbooks). 


### Better data locality for our workflow

Going back to the setup in the previous tab, we want to be able to store
data on the compute site. So let's enhance that site with a bit more hardware!


<object class="figure" type="image/svg+xml" width="500" data="{{ site.baseurl }}/public/img/workflows/workflow_data_locality_platform_zoom.svg">Storage at the compute site</object>
<div class="caption"><strong>Figure 1:</strong> Added storage capability at the compute site.</div>

Figure 1 above show the compute site for the platform in the previous tab, but
with a new host that is not used for computation but provides access to a 
disk with 500 MB/sec read/write bandwidth.

Given the new storage capability, we can now refine the workflow execution
strategy: unless a task is an exit task of the workflow, it stores its output
on the disk at the compute site. In this way, whenever possible, tasks
will read/write data to the local storage rather than the remove storage. The
initial input files to the workflow are still stored at the remove storage site, 
and the output files end up there as well. 

#### Simulating better data locality

The simulation app below simulates workflow execution when the compute site
has 5 4-core hosts (from the previous tab, we know that this makes it
possible to achieves best parallelism). The app allows you to pick the
value of bandwidth of the wide-area network link between the storage site
and the compute site. It also allows you to toggle the use of storage at
the compute site (if not checked, the simulation proceeds as in the
previous tab, with poor data locality). You can use the app on your own,
but then also use it to answer the practice questions hereafter.


<div class="ui accordion fluid app-ins">
  <div class="title">
    <i class="dropdown icon"></i>
    (Open simulator here)
  </div>
  <div markdown="0" class="ui segment content">
    {% include simulator.html src="workflow_data_locality/" %}
  </div>
</div>

---

XXX HENRI WORKING HERE XXX

####  Practice Questions

**[A.3.4.p3.1]** XXXX

<div class="ui accordion fluid">
  <div class=" title">
    <i class="dropdown icon"></i>
    (click to see answer)
  </div>
  <div markdown="1" class="ui segment content">
XXXX
  </div>
</div>
<p></p>


---

### Questions

Consider  the following workflow (all green tasks have identical specs, and so do all  blue tasks):

<object class="figure" type="image/svg+xml" width="500" data="{{ site.baseurl }}/public/img/workflows/workflow_distributed_question.svg">Distributed platform</object>

**[A.3.4.q2.1]**  XXXX
