
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
has storage capabilities. The app is similar to that in the previous
tab, but allows you to pick the
value of bandwidth of the wide-area network link between the storage site
and the compute site. It also allows you to toggle the use of storage at
the compute site (if not checked, the simulated execution behaves as in the
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

####  Practice Questions

**[A.3.4.p3.1]** When executing the workflow with a 100 MB/sec wide-area link
bandwidth and using a single core, how much
time is saved when storing intermediate files at the compute site? If you 
do a back-of-the-envelope estimation of the time saved based on data sizes
and bandwidths, do you get the same answer? 

<div class="ui accordion fluid">
  <div class=" title">
    <i class="dropdown icon"></i>
    (click to see answer)
  </div>
  <div markdown="1" class="ui segment content">
This can be answered by just running the simulation:

  - With only remote storage: 299.69 seconds
  - With local storage: 239.91 seconds
  
Thus the saving is 59.78 seconds. 

The only  difference  in the two executions is the I/O times for the
intermediate files. In both cases, $2 \times 20 \times 100 = 4000$ MB
of data are being read/written from/to storage. To the remote storage, this
should  take time 4000/100 = 40 seconds. To the local storage, this 
should take time 4000/500  = 8 seconds.  So we'd  expect a saving of
$40 - 8 = 32$ seconds. In fact the saving is twice as much. 

This is because
the wide-area data transfer rate is not 100 MB/sec, due to the high latency.  
We saw this in the previous tab but can re-iterate it here. 
The application, when not using any local storage, reads/write a total  of
$20 \times 50 + 2 \times 20 \times 100 + 1 = 5001$ MB of data. Since the
application computes for 210 seconds, this means that it spends 299.69 - 210 = 89.69 seconds 
transferring the data. The the data transfer rate is 5001/89.69 = 55.75  MB/sec, a far cry
from he peak 100 MB/sec!  

So if we re-compute our saving estimate above using this effective data transfer
rate we obtain: 4000/55.75 - 4000/500 = 63.64 seconds. This is much closer to what
the simulation gives us. The remaining discrepancy is due to other effects/overheads 
captured by the simulation (which we will mention in upcoming modules).  
  
  </div>
</div>
<p></p>

**[A.3.4.p3.2]** Still using a 100 MB/sec wide-area link bandwidth, what parallel efficiency can we achieve when using 5 4-core hosts and local storage? 

<div class="ui accordion fluid">
  <div class=" title">
    <i class="dropdown icon"></i>
    (click to see answer)
  </div>
  <div markdown="1" class="ui segment content">
As we saw in the previous question, the sequential (1-core) execution time
is 239.91 seconds when using local storage. Using the simulation to determine
the parallel execution time we get: 41.86 seconds. 

So the parallel efficiency is (239.91 / 41.86) / 20 = 28.6%. This is better
than without using local storage, but still not great. 
   
  </div>
</div>
<p></p>


**[A.3.4.p3.3]**  What is the parallel efficiency when doubling the wide-area link bandwidth?
<div class="ui accordion fluid">
  <div class=" title">
    <i class="dropdown icon"></i>
    (click to see answer)
  </div>
  <div markdown="1" class="ui segment content">

Using the simulation again, we get: (239.91 / 36.61) / 20 = 32.7%. 
   
  </div>
</div>
<p></p>


**[A.3.4.p3.4]** Now set the wide-area link bandwidth to a high 500 MB/sec. Do we see big jump in
efficiency? What is the effective wide-area data transfer rate? Is it anywhere close to 500 MB/sec?
<div class="ui accordion fluid">
  <div class=" title">
    <i class="dropdown icon"></i>
    (click to see answer)
  </div>
  <div markdown="1" class="ui segment content">

Using the simulation again, we get: (239.91 / 33.45) / 20 = 35.8%.  This is *not*  a big
jump at all. 
   
From the simulation output, we see that it takes 4.49 seconds for all tasks to read their
input  from remote storage. That's for a total of $20\times 50 = 1000$ MB. So the data
transfer rate is 1000/4.49 = 222.71 MB/sec. This is not even half of 500 MB/sec. The large
latency is preventing us from achieving the peak data transfer rate.

  </div>
</div>
<p></p>

**[A.3.4.p3.5]** Assuming the wide-area latency was not a problem, and that we would
achieve 500 MB/sec data transfer rate, what would the parallel efficiency be?  How close
is it from the efficiency when assuming that all I/O take zero time. 
<div class="ui accordion fluid">
  <div class=" title">
    <i class="dropdown icon"></i>
    (click to see answer)
  </div>
  <div markdown="1" class="ui segment content">

Instead, of 4.49 seconds, the tasks would take "only" 1000/500 = 2 seconds to read their input.
So we would shave 2.49 seconds off the execution time. (In fact we'd also save a tiny bit 
for the transfer of the workflow's 1 MB output file.) So the efficiency would be: 
(239.91 / (33.45 - 2.49)) / 20 = 38.7%. 

If I/O took zero time, the sequential (1-core) execution time would be
(20000 +  1000)/100 = 210 and the parallel execution time would be: 20 seconds. 
So the efficiency would be (210/20) / 20 = 52%.  

So with 35.8% we're still pretty fact from the ideal parallel efficiency. 

  </div>
</div>
<p></p>


---

### Questions

Consider  the following workflow:

<object class="figure" type="image/svg+xml" width="200" data="{{ site.baseurl }}/public/img/workflows/workflow_data_locality_question.svg">Distributed platform</object>

<p></p>

**[A.3.4.q3.1]** Say we execute this workflow at a compute site with 
two 100 GFlop/sec cores. All data is read/written from/to a remote
storage site. How many bytes are read/written in total?

**[A.3.4.q3.2]** Say that the read/write data rate for the remote storage
site is 200 MB/sec (which has we know from
the simulation above could be well below the actual bandwidth). What is the
workflow execution time? hint: be careful about how the two blue tasks split the
read bandwidth.

**[A.3.4.q3.3]** We now have local storage at the compute site, with data
access rate 500 MB/sec. What is the workflow execution time now? What is the
parallel efficiency? 





