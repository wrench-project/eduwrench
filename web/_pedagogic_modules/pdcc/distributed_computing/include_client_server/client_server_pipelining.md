
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
below shows an example timeline for sending a 10MB file stored on disk
to the network using a 2MB buffer:

<p align="center">
<object class="figure" width="800" type="image/svg+xml" data="{{ site.baseurl }}/public/img/client_server/client_server_pipelining.svg">Pipelining example</object>
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
the data transferred is large. But now that we split that data into potentially many very small
"chunks", the latency may play an important role!



If the buffer size is too small 
(the extreme being be a 1-byte buffer), in our example the network latency could
become a problem (and there is also a disk latency). If the buffer size is too big
(the extreme being the entire image size), there we have Problem #2 above.  
So one must pick a reasonable buffer size so that there is some pipelining but so that 
the execution does not become latency-bound. 

The pipelining technique is used in many programs. For instance, the <tt>Scp</tt> secure
file copy program uses pipelining of disk and I/O operation with a buffer size of 16 KiB. 


### Simulating Pipelining

So that you can experiment with how pipelining works, here is an app below that
allows you to simulate the execution of our client-server example application
with a disk on the client site and with various buffer sizes for pipelining. 
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



