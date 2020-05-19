

#### Learning Objectives

  - XXX

---

### When I/O is a bottleneck

In the previous section the disk was much faster than either networks,  but that's
not always the case. As a result, the disk can become a performance bottleneck when
transferring data from the client to the server. 

<div class="ui accordion fluid app-ins">
  <div class="title">
    <i class="dropdown icon"></i>
    (Open simulator here)
  </div>
  <div markdown="0" class="ui segment content sim-frame">
    {% include simulator.html src="client_server_disk_limited/" %}
  </div>
</div>

Now the disk speed in the above simulator is capped at 50 MBps read/write.
You will find this will lead to sharply diminishing returns for any
increases to link speed above that level.

#### Practice Questions

**[A.3.p2.6]** Try running the simulator above twice, selecting Server 1 both times and trying with link speeds of 50 MBps 
and 100 MBps. It was mentioned above that the disk r/w speeds are the bottleneck here, but why does execution time still 
drop slightly with the faster network?

<div class="ui accordion fluid">
  <div class="title">
    <i class="dropdown icon"></i>
    (click to see answer)
  </div>
  <div markdown="1" class="ui segment content">
    Since we have set a buffer size of 2, 5 or 10 MB, the increased bandwidth of the link still has some impact. The network 
    must wait for a chunk to be ready from the disk, but once it is ready, the last chunk being transferred more quickly 
    will still impact overall execution time a tiny bit. 

  </div>
</div>

<p></p>


**[A.3.p2.7]** You have a task that needs to execute on a server. This task requires 400 MB of input to run, and it must be
transferred from the client's disk to the server's RAM. The client disk has a R/W speed of 200 MBps and there is a 1 GBps
network link between the client an server. Latency is negligible and can be disregarded. The task is 1 TFlop and the server's
CPU is capable of 200 GFlop/second. The task can only begin when all input data is available in RAM. For this question,
assume there is no buffering, as soon as data is read from disk it can be sent on the network link utilizing the full
bandwidth. How long is the execution time from start to finish?

<div class="ui accordion fluid">
  <div class="title">
    <i class="dropdown icon"></i>
    (click to see answer)
  </div>
  <div markdown="1" class="ui segment content">
    The 400MB will take 2 seconds to be read from disk. The network link is faster than the disk, so the only additional
     transfer time will be latency which we have been told is negligible. Once the data is on the server, it can complete
      the task in 5 seconds. Total execution time will be 2+5 = 7 seconds.

  </div>
</div>

<p></p>

**[A.3.p2.8]** Consider the previous question's situation, but now the server has moved and the network link has changed
to 10 GBps capacity. Does this change the execution time?

<div class="ui accordion fluid">
  <div class="title">
    <i class="dropdown icon"></i> (click to see answer)
  </div> <div markdown="1" class="ui segment content">
   Compared to the previous answer, upgrading the bandwidth of the network link does nothing as it was never fully
   utilized to begin with. 

  </div>
</div>

<p></p>


#### Questions

**[A.3.q2.1]** Your business has a client/server topology for your computing needs. The client is on-site and there are 
three off-site servers you have access to. The specifications of the client and three servers and their costs are below:

    Client
    Disk: 100 MBps R/W
    
    Server_0
    Cost: $5/HR 
    CPU: 100 GF/s
    Link: 100 MBps
    
    Server_1
    Cost: $10/HR 
    CPU: 200 GF/s
    Link: 100 MBps
    
    Server_2
    Cost: $20/HR 
    CPU: 200 GF/s
    Link: 1 GBps

Latency and RAM can be disregarded when considering these options. Cost calculations include data transfer time as well 
as compute time.

Given a task that has 100 GB input, 100 TFlop computation and 200 GB output, what is the most cost efficient option? What is 
the most time efficient option?

    XXREMOVE MEXX
    ANSWER: Server_0: 1000 seconds input, 1000 seconds comp, 2000 seconds output = 4000 seconds, 66.6 minutes, $5.55 
    Server_1: 1000 seconds input, 500 seconds comp, 2000 seconds output = 3500 seconds, $9.72 
    Server_2: 1000 seconds input, 500 seconds comp, 2000 seconds output = 3500 seconds, $19.44
    
    Server_0 is the most cost efficient, either Server_1 or Server_2 would be more time efficient. Server_2 would be ever so
    slightly faster based on buffering.


**[A.3.q2.2]** Consider the above scenario again, if a disk upgrade is made to the client, is it possible for Server_2 
to be the most cost efficient option? How fast would the read/write speed of the new disk have to be?


    XXREMOVE MEXX
    ANSWER:Yes, if we remove the disk bottleneck entirely we can see that the cost is below that of SERVER_0 calculated above.
    Server_2: 100 seconds input, 500 seconds comp, 200 seconds output = 800 seconds, $4.44
    
    Base cost of computation (not changing) = 500/60/60*20 = $2.78
    SERVER_0 cost $5.55-2.78 = $2.77 of time maximum for data transfer
    $2.77 = ~500 seconds at $20/hr
    
    300 GB/ X = 500 seconds
    300 = 500x
    X = 600 MBps  [3/5 GBps]
    
    If the client's disk had 600 MBps R/W or better it is a superior option for cost efficiency. 
    
    




