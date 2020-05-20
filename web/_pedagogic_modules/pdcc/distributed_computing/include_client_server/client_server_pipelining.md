
#### Learning Objectives

  - Understand the need for and the mechanics of pipelining
  - Be able to reason about how pipelining impacts performance

---

### Adding I/O on the Client

In the previous tab we have not considered disk I/O at all, which made
things simple. But in mare real-world cases, data is stored on disk. So let's
revisit our simple client-server example, but with a *disk on the client*. 

The image to be processed resides on disk as an image file. 
The client program then reads it from disk into RAM and
sends it over to the server. This now adds a third phase to the execution
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
and the disk are two different hardware components, so they can work *at
the same time.*  


### Pipelining

A way to solve both problems above is to use **pipelining**.  As
opposed to reading the whole image into RAM, we read only a part of it into
a  **buffer**, i.e., a relatively small zone of RAM. Let's say our **buffer
size** is 4 KB, as an example. Then while
we send the data in the buffer to the server, we read another 4 KB of the
image into a second buffer. We wait until the first buffer has been sent
over to the server, and now we repeat, swapping the buffers (that is, we
now send the data in the second buffer to the server, and load data from
disk into the first buffer).  

With pipelining we are able have each 
hardware resource participate in each step of the execution
simultaneously.
The only exception is
the first time data is read from the disk into a buffer (during which the network is idle) 
and the last time data is sent from a buffer to the  server (during which the disk is idle).
If the disk read time is equal to the network transfer time  (i.e., we experience
the same bandwidths on both), then we say that the pipeline is **balanced**. In this case, 
save for the first and last execution step, both hardware resources are used constantly throughout
the whole execution. 


A simple real-world analogy is a washer and a dryer. If you have to do multiple loads of laundry,
you typically use pipelining: while you are drying a load you are washing the next load. This is almost never
 a balanced pipeline because drying takes longer than washing. As a result, the washer often sits
idle with wet clothes in it waiting to be dried. This is your clothes buffer that has gone 
through the first stage of the pipeline (the washer), but not through the second stage (the dryer)


Although the principle of pipelining is simple, one question is that of the **buffer size**. 
If the buffer size is too small 
(the extreme being be a 1-byte buffer), in our example the network latency could
become a problem (and there is also a disk latency). If the buffer size is too big
(the extreme being the entire image size), there we have Problem #2 above.  
So one must pick a reasonable buffer size so that there is some pipelining but so that 
the execution does not become latency-bound. 

This pipelining technique is used in many programs. For instance, the <tt>Scp</tt> secure
file copy program uses pipelining of disk and I/O operation with a buffer size of 16 KiB. 


### Simulating pilelining


<div class="ui accordion fluid app-ins">
  <div class="title">
    <i class="dropdown icon"></i>
    (Open simulator here)
  </div>
  <div markdown="0" class="ui segment content sim-frame">
    {% include simulator.html src="client_server_full/" %}
  </div>
</div>

#### Practice Questions

**[A.3.p2.3]** In the Simulator just above that includes options for buffer size, please run the default options 
except select the 10 MB buffer and mark the checkbox to use the disk. What time is the last chunk read from disk?

<div class="ui accordion fluid">
   <div class="title">
     <i class="dropdown icon"></i>
     (click to see answer)
   </div>
   <div markdown="1" class="ui segment content">
        The last read should begin at approximately 8.42 seconds
   </div>
 </div>

<p></p>

**[A.3.p2.4]** Estimate the total execution time if you were to set the buffer size to 100 MB, would this increase or 
decrease total execution time? (This is not an option on 
the simulator, you will need to think about it.)


<div class="ui accordion fluid">
   <div class="title">
     <i class="dropdown icon"></i>
     (click to see answer)
   </div>
   <div markdown="1" class="ui segment content">
        The total execution time with a 100 MB buffer will be longer because the network link will not start transferring 
        data for a longer period of time. There will be no overlap between disk I/O and network transfer so it is less 
        efficient.
   </div>
 </div>

<p></p>

**[A.3.p2.5]** Compared to the previous answer, will execution time be shorter or longer with a buffer size of 1 GB?


<div class="ui accordion fluid">
   <div class="title">
     <i class="dropdown icon"></i>
     (click to see answer)
   </div>
   <div markdown="1" class="ui segment content">
        The total execution time would be the same for this workload, the data input is 100 MB, whether the buffer is 
        100 MB or 1 GB it will load the entire amount from disk first and then start the network transfer. 
   </div>
 </div>

<p></p>



