---
layout: page
title: 'A.3.2 Client Server'
order: 132
usemathjax: true
submodule: 'distributed_computing'
---

The goal of this module is to introduce you to the client/server model of
computation.


#### Learning Objectives:

  - Understand the  client/server model of computation

  - Understand how to reason about the performance of a client/server setup

----

## Basics

In a client/server model a *client*, that is a program  running on some
computer, wishes to perform some computation, or *task*, but does not want
to or cannot perform it itself (e.g., insufficient hardware resource,
missing necessary software, missing necessary proprietary
data/credentials). Another program, the *server*, is running on another
computer and can perform the task.  The client sends the task's input data
over  the network to the server, and  the server replies over the network
with the task's output data. There can be more than one server, in which
case the client could choose which one is more efficient.  This setup
allows both client and server hardware some level of specialization and
autonomy. Many applications and websites are clients, where they receive
information from the end user and forward their request to a server for
actual processing. This can keep the application lightweight and widely
accessible, while still allowing for resource-intensive activities to be
done on the server, the hardware of which can be powerful and upgraded if
need be, at client request.

The performance of a client-server setup thus depends on the network  on
which the data is transferred back and forth,  and on the hardware at the
server. If a task requires a lot of data compared to its  computation, then
the network will be a  critical  factor, otherwise it will be the server
hardware. Furthermore, if multiple  clients use the same server,  the
clients will compete  for the server's hardware. If there are multiple
servers, then a client can choose which one may deliver the best
performance, that is, the earliest task completion date.


### An Example: Photo Processing

On your computer, the "client", you have a 100 MB image file in RAM, for
instance as part of a machine learning program that you want to use to
detect particular objects in images (e.g., count numbers of cars). But
this program does not implement the fancy algorithm you'd like to apply to
the image, say, because it is proprietary while your program is free
software. However, you can access remote servers that have software that
implements the algorithm installed, and that make it possible to use it
over the network. This is provided by the company that develops the fancy
algorithm, as an advertising of its capabilities. There are two of these
"servers" you can access. Server 1, which you can access via a network link
with only 10 MBps bandwidth, but that can analyze a 100 MB image in XXX
seconds of computation. Server 2, which you can access via a 100 MBps
network link, but that is only able to analyze a 100 MB image in XXX
seconds of computation. Latency for these network links is negligible and
can be disregarded because the image is large. Also, the output of the
algorithm (the number of cars) is only a few bytes, which is negligible.
So, from a performance perspective, the task's execution consists of two
phases: sending the image data over and applying the algorithm to it. The
image is sent directly from the RAM on the client to the server program
which receives and keeps in in RAM. That is, for now, we assume no disk I/O
whatsoever.

<p align="center">
<object class="figure" type="image/svg+xml" data="{{ site.baseurl }}/public/img/client_server/client_server.svg">Client / Server Topology</object>
</p>

### Simulating a Client and Server


<div class="ui accordion fluid app-ins">
  <div class="title">
    <i class="dropdown icon"></i>
    (Open simulator here)
  </div>
  <div markdown="0" class="ui segment content sim-frame">
    {% include simulator.html src="client_server/" %}
  </div>
</div>

This simulation app allows you to see the differences in execution time
between the two servers. Try to simulate the application execution with
each server (check the radio button for Server 1 and for Server 2). Leave
all other values to their default. You should notice a large difference in
execution time. Even though Server 1 has a better CPU, it is bottlenecked
by the speed at which it can receive data over the link. Server 2 is thus
able to finish execution much more quickly than Server 1.

#### Practice Questions

**[A.3.p2.1]** We can see that Server 2 has a faster link than Server 1 by default. Is there a bandwidth for Server 1
 that would make it equivalent to Server 2?
 
 <div class="ui accordion fluid">
   <div class="title">
     <i class="dropdown icon"></i>
     (click to see answer)
   </div>
   <div markdown="1" class="ui segment content">
        (answer should be no)
   </div>
 </div>
 
 <p></p>


**[A.3.p2.2]** What if Server 1 were twice as fast? 

<div class="ui accordion fluid">
   <div class="title">
     <i class="dropdown icon"></i>
     (click to see answer)
   </div>
   <div markdown="1" class="ui segment content">
        (a)nswer should be yes)
   </div>
 </div>
 
 <p></p>

### Adding I/O, and Buffering

We have assumed no disk I/O to make things simple, but often the input data
does reside on disk. The application then reads it from disk into RAM and
sends it over to the server. This now adds a third phase to the execution
so that it proceeds as:

  1. Read data from disk into RAM
  2. Send data from RAM to the server
  3. Compute on the server and reply to the client

The above has problems. First, what if the image does not fit in RAM? Now,
this is unlikely for this application, as even high-res, uncompressed
images can typically fit in RAM given current RAM sizes. But client-server
could be used for applications for which data is large. For instance, you
can surely upload a large file, larger than your RAM, to a server, and the
program that does the upload thus cannot store that file in RAM!

The second problem is poor performance. This is because phase 2 above has
to wait for phase 1 to complete. So while the disk is doing its job, the
network is idle.  We should be able to do better because the network card
and the disk are two different hardware components, so they can work *at
the same time.*  To make it so we use a simple **buffering** idea.  As
opposed to reading the whole image into RAM, we read only a part of it into
a  "buffer", that is, a relatively small zone of RAM, say 4 KB. Then while
we send the data in the buffer to the server, we read another 4 KB of the
image into a second buffer. We wait until the first buffer has been sent
over to the server, and now we repeat, swapping the buffers (that is, we
not send the data in the second buffer to the server, and load data from
disk into the first buffer).  With this scheme, both the disk and the
network work simultaneously, save for the first time data is read from the
disk into a buffer and the last time data is sent from a buffer to the
server.  One must just pick a buffer size, making sure  it's not too small
(the extreme being be a 1-byte buffer), as otherwise network latency would
become a problem.

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

**[A.3.p2.3]** In this Simulator just above that now includes options for buffer size, please run the default options 
except select the 10 MB buffer. What time is the last chunk read from disk?

<div class="ui accordion fluid">
   <div class="title">
     <i class="dropdown icon"></i>
     (click to see answer)
   </div>
   <div markdown="1" class="ui segment content">
        The last read should begin at approximately 8.60 seconds
   </div>
 </div>

<p></p>

**[A.3.p2.4]** Estimate the total execution time if you were to set the buffer size to 20 MB? (This is not an option on 
the simulator, you will need to calculate it.)


<div class="ui accordion fluid">
   <div class="title">
     <i class="dropdown icon"></i>
     (click to see answer)
   </div>
   <div markdown="1" class="ui segment content">
        The total execution time with a 20 MB buffer should be approximately 11 seconds.
   </div>
 </div>

<p></p>

### When I/O is a bottleneck

In the previous section the disk was much faster than either networks,  but that's
not always the case. As a result, the disk can become a performance bottleneck when
transferring data from the client to the server. 

XXXX Make a scenario with a  smaller disk Bandwidth, so that the "over the fast network" server  is no longer the best choice! XXXX

#### Practice Questions

**[A.3.p2.5]** You have a task that needs to execute on a server. This task requires 400 MB of input to run, and it must be
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

**[A.3.p2.6]** Consider the previous question's situation, but now the server has moved and the network link has changed
to 10 GBps capacity. Due to the longer distance, there is now 100 μs latency. Does this change the execution time?

<div class="ui accordion fluid">
  <div class="title">
    <i class="dropdown icon"></i> (click to see answer)
  </div> <div markdown="1" class="ui segment content">
   Compared to the previous answer, upgrading the bandwidth of the network link does nothing as it was never fully
   utilized to begin with. Since we are going from negligible latency to 100 μs latency, our answer would be increased
   by that amount. Transfer time will extend past the time it takes to read from disk by the amount of latency.

  </div>
</div>

<p></p>

