
#### Learning Objectives

  - Understand the need for and the mechanics of pipelining
  - Be able to reason about how pipelining impacts performance

---

### Adding I/O on the Client

In the previous tab we have not considered disk I/O at all, which made
things simple. But in mare real-world cases, data is stored on disk. So let's
consider a similar client-server setup with a client and two servers,
but with a *disk on the client*. 

The 100 MB image to be processed resides on disk as an image file. 
The client program then reads it from disk into RAM and
sends it over to the server, which performs 1000 GFlop of work. 
This now adds a third phase to the execution
so that it would proceed as:

  1. Read data from disk into RAM
  2. Send data from RAM to the server
  3. Compute on the server and reply to the client

Although at first glance this seems fine, there are two problems.

**Problem #1**: What if the image does not fit in RAM? Now,
this is unlikely for this application, as even high-res, uncompressed
images can typically fit in RAM given current RAM sizes on, say, laptop computers. But the client-server model
could be used for applications for which input data is large. For instance, you
can surely upload a large file, larger than your RAM, to a server, and yet the
program that does the upload  cannot store that file in RAM! So the execution cannot
proceed with the three phases above. 

**Problem #2**:
The second problem is poor performance. This is because phase 2 above has
to wait for phase 1 to complete. So while the disk is doing its job, the
network is idle.  We should be able to do better because the network card
and the disk are two different hardware components, so they can, in principle, work *at
the same time.*  


### Pipelining

A way to solve both problems above is to use **pipelining**.  As opposed to
reading the whole image into RAM, we read only a part of it into a
**buffer**, i.e., a relatively small zone of RAM. Let's say our **buffer
size** is 4 KB, as an example. Then while we send the data in the buffer to
the server, we read another 4 KB of the image into a second buffer. We wait
until the first buffer has been sent over to the server, and now we repeat,
swapping the buffers (that is, we now send the data in the second buffer to
the server, and load data from disk into the first buffer).  The picture
below shows an example timeline for sending a 1GB file stored on disk
to the network using a 200MB buffer:

<p align="center">
<object class="figure" width="600" type="image/svg+xml" data="{{ site.baseurl }}/public/img/client_server/client_server_pipelining.svg">Pipelining example</object>
</p>
<div class="caption">
<strong>Figure 1: Pipelining example</strong>.
</div>

In the figure we see that, as expected, there are 5 disk reads and 5 network
sends. Given the bandwidths, each disk
read takes 1 second and each network send takes 2 seconds. 
The execution proceeds in 6 steps. In the first step there is
only a disk read. Then there are 4 steps in which there is
both a disk read and a network send. Finally, in the 6th
and last step there is only a network send.  This makes sense
since  we must begin a lone disk read to fill the "first" buffer,
and finish with a lone network send to send the "last" buffer. 
In all other steps, we  overlap disk and network operations. We can
compute the saving due to pipelining. If no pipelining were to be
used, the total  execution would be 15 seconds (5 seconds of disk read
followed by 10 seconds of network send). Instead, with pipelining
we are able to executed in only 11 seconds, over a 25% reduction in
execution time. 


In this example above, the disk read time is faster than the network
transfer time. So although the network is  used constantly for the entire
execution (save for the initial step), the disk isn't. We call this an
**unbalanced pipeline**. A simple real-world analogy is a washer and a
dryer. If you have to do multiple loads of laundry, you typically use
pipelining: while you are drying a load you are washing the next load. This
is almost never a balanced pipeline because drying takes longer than
washing. As a result, the washer often sits idle with wet clothes in it
waiting to be dried. This is your clothes buffer that has gone through the
first stage of the pipeline (the washer), but not through the second stage
(the dryer). And you allow yourself a single wet cloth buffer 
(you don't want a mountain of wet clothes to accumulate in your laundry room!). 

If the disk read time were equal to the network transfer
time  (i.e., if the disk and the network had the same bandwidth), then we would say we
have a **balanced** pipeline. In this case, save for the first and last
step, both hardware resources are used constantly throughout the
whole execution.



### Buffer size


Although the principle of pipelining is simple, one question is that of the **buffer size**. 
You may have noted in the previous example that there is no downside to making the buffer
as small as possible. In fact, the smaller the buffer size, the more overlap we have
between disk and network activities! This is because with a smaller buffer size, the  first and 
last steps of the execution are shorter, and these are (the only) steps during which there
is no overlap. Pushing this reasoning to the extreme, one would conclude that the best choice is
to use a 1-byte buffer!

If you remember the 
[Network Fundamentals module]({{site.baseurl}}/pedagogic_modules/pdcc/distributed_computing/network_fundamentals),
you may realize why a 1-byte buffer is a bad idea... it's all about **latency**! 

In the example above, and the figure, we didn't say anything about latency. But in fact, each
network link (and also the disk) has a latency. Often we have said we could neglect latency because
the data transferred is large. **But now that we split that data into potentially many very small
"chunks", the latency may play an important role!**

For the above example, say we use  a 1KB buffer size. Then we perform 1 GB / 1 KB = 1,000,000 individual
file transfers. Say the network latency is a very low 1 microseconds. Then we will incur 1,000,000 of these
latencies, for a total of 1 second! So instead of the 11 seconds of execution shown in the figure
we would instead experience 12 seconds. This is still better than with no pilelining. But if the
network latency was 10 microseconds, then we would be better off with no pipelining!

Conversely, say we make the buffer size 500 MB instead of 200 MB. Then our execution time would be
500/200 + 500/100 + 500/100 = 12.5 seconds (plus 2 negligible latencies).  This is worse than with a
200 MB buffer size because we have less pipelining. 

**Bottom line**: if the buffer size is too small, latencies hurt performance; if the buffer
size is too large, less pipelining hurts performance. 
So one must pick a reasonable buffer size so that there is some pipelining but so that 
the execution does not become latency-bound. 

Note that pipelining is used in many programs. These program try to use up a "reasonable"
 buffer size. For instance, many versions of the <tt>Scp</tt> secure
file copy program pipelines disk and I/O operations with a buffer size of 16 KiB. If this
program were to be used on the disk/network setup above, it would be better off with a bigger buffer
size. *But of course, the developers of that program do not know in advance in what setup the
program will be used!* Other versions of <tt>Scp</tt> allow the user
to specify a buffer size.


### Simulating Pipelining

So that you can experiment with how pipelining works, below is an app that
allows you to simulate the execution of a client-server setup where a 1GB file
is stored on  the  disk at the client  and needs to be sent to one of two
servers, which then performs 1000 GFlop of work. You can choose the network
latency for Server #1, and you can pick the buffer size used by the client program. 
You can use this app on your own, but then you should use it to answer
the following practice questions. 


<div class="ui accordion fluid app-ins">
  <div class="title">
    <i class="dropdown icon"></i>
    (Open simulator here)
  </div>
  <div markdown="0" class="ui segment content sim-frame">
    {% include simulator.html src="client_server_disk/" %}
  </div>
</div>

#### Practice Questions

**[A.3.2.p2.1]** When using a 1 GB buffer size (i.e., no pipelining), what would you  expect the execution time
to be when running on Server #2? Check your answer with the simulation.

<div class="ui accordion fluid">
   <div class="title">
     <i class="dropdown icon"></i>
     (click to see answer)
   </div>
   <div markdown="1" class="ui segment content">
        
One would expect the execution time to be:

$
T = \frac{1\;\text{GB}}{400\;\text{MB/sec}} + 10\;\text{us} + \frac{1\;\text{GB}}{600\;\text{MB/sec}} + \frac{1000\;\text{GFlop}}{60\;\text{GFlop/sec}}
$

which  gives $T = 20.83\;\text{sec}$.

The simulation gives us 20.92. As usual our back-of-the-envelope estimate is  a bit optimistic (because it does not capture 
some network behaviors), but it's close. 
        
        
   </div>
 </div>

<p></p>

**[A.3.2.p2.2]** Still on Server #2, what do you think the execution time would be when setting the buffer size to 500 MB? Check your answer in simulation.


<div class="ui accordion fluid">
   <div class="title">
     <i class="dropdown icon"></i>
     (click to see answer)
   </div>
   <div markdown="1" class="ui segment content">
       
With a 500 MB buffer, sending the file over to the server consists of three steps. In the first step, 500 GB of data is read
from the disk into a buffer. This take 500/400 = 1.25 seconds. Then, at the same time, this data is sent to the server and
another 500 MB is read from the disk. Because the network for Server #2 has higher bandwidth than the disk, the disk is the
bottleneck, and so this step also takes 1.25 seconds. Finally, in the third step, 500 MB of data is sent over the network,
which takes time 500/600  = .83 seconds. So overall, the file transfer takes time 1.25 + 1.25 +  .83 = 3.33 seconds. The server
then computes for 1000/60 = 16.66 seconds. So in total, the execution time is 19.99 seconds. 

The simulation gives us 20.04 seconds. 
       
       
   </div>
 </div>

<p></p>

**[A.3.2.p2.3]** Still on Server #2, run with buffer sizes of 100 KB, 500KB, 1MB, 10MB, and 100MB. Report on the time it takes for the
server to receive the data. Discuss/explain what you observe.  What would be an ideal transfer time assuming no latencies whatsoever and maximum
pipelining?  Can we pick a good buffer size that gets close? Is it easy  to pick a good buffer size, or is it like finding a needle in a haystack?



<div class="ui accordion fluid">
   <div class="title">
     <i class="dropdown icon"></i>
     (click to see answer)
   </div>
   <div markdown="1" class="ui segment content">
   
The simulation gives these results:

|---|---|
|buffer size| transfer time|
|---|---|
|100 KB  | 3.05 |
|500 KB  | 2.50 |
|1 MB    | 2.50 |
|5 MB    | 2.51 |
|10 MB   | 2.52 |
|100 MB  | 2.68 |
|---|---|   

With a small buffer size, we don't do great, because of latencies. With a large  buffer size, we don't do great
because of poor pipelining. 

If we had no latencies, we could achieve almost perfect  pipelining (buffer size of 1 byte). The transfer would thus
proceed at the bottleneck bandwidth,  i.e., that of the disk, and  we would get  a transfer time of 1000/400 = 2.5 seconds. So
yes, we can achieve this with  1 MB buffer size!

It is not difficult to pick a good buffer size as between 500KB and 10MB we get really close to the best possible time. 

   </div>
 </div>

<p></p>


**[A.3.2.p2.4]** Switching now to Server #1, say the client is configured to use a 100 KB buffer. Using the simulation, determine the
data transfer time with the original 10 us latency. Say now that the latency is instead 20 us. What is the increase in data
transfer time? For this new latency, can we lower the data transfer time by using a different buffer size?


 
<div class="ui accordion fluid">
<div class="title">
  <i class="dropdown icon"></i>
  (click to see answer)
</div>
<div markdown="1" class="ui segment content">

With a 100 KB buffer and a 10 us latency, the simulation tells us that the data transfer time is 6.55 seconds. If we make
the latency 20 us,  this jumps up to 7.85. This is almost a 20% increase. 
 
It would make sense that using a larger buffer size would make sense, so as to save on latencies. For instance, if we try
a 200 KB buffer size, the data transfer time  goes from 7.85 to 6.55, back to what it was with the lower latency!

So if a client program is told the latency of the network to the server, it could likely  make a good decision. 
 
    </div>
  </div>
 
 <p></p>
 
 
**[A.3.2.p2.5]** Going more extreme, say now that the latency to Server #1 is 1 millisecond, but that the client program
has  not been updated and still uses a 100KB buffer. Can  you come up with a rough estimate of how long the data transfer
will take? Check your answer in simulation. Do the two numbers agree? 


<div class="ui accordion fluid">
<div class="title">
  <i class="dropdown icon"></i>
  (click to see answer)
</div>
<div markdown="1" class="ui segment content">

We have 1 GB / 100 KB = 10,000 different network transfers. Each one incurs a 1 millisecond latency, which adds up
to 10 seconds. So we should go roughly 10 seconds slower, for a total time around 16.55 seconds.

The simulation gives us: 135.40 seconds!!!!

No, the two numbers do not match. Our estimate is way optimistic. Once again, this is because  our estimate fails
to capture complex network behaviors. In this case, when latencies get really high, the network protocol 
that we simulate (TCP) suffers drastic performance penalties. This is something you can find out more about
in advanced networking courses, but for now, let's just remember that  *latency is bad* :)


 
</div>
</div>
 
 <p></p>
 
 
 **[A.3.2.p2.6]** With the 1 millisecond latency to Server #1, is pipelining still useful?  Answer this question
 purely experimentally (since from the previous question we see that our estimates are not useful for such
 high latencies). 
 
 
 <div class="ui accordion fluid">
 <div class="title">
   <i class="dropdown icon"></i>
   (click to see answer)
 </div>
 <div markdown="1" class="ui segment content">
 
 If we set the buffer size to 1 GB (i.e., no pipelining), the data transfer time in simulation is: 7.80 seconds.
 
 If we try a big buffer size of 100 MB, we get a data transfer time of 5.67 seconds! with 80 MB we get 5.66 seconds. This is
 about the best we can do.
 
 So yes, pipelining is still useful!
 
  
 </div>
 </div>
  
  <p></p>




**[A.3.2.p2.7]** You have a task that needs to execute on a server. This task requires 400 MB of input to run, and it must be
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

**[A.3.2.p2.8]** Consider the previous question's situation, but now the server has moved and the network link has changed
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


IN CONSTRUCTION

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
    
    

