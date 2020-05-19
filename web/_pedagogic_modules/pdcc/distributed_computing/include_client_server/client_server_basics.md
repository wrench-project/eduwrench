
#### Learning Objectives

  - Understand the basics of the client/server model of computation

  - Be able to reason about the performance of a simple client/server setup

---

In a client/server model a **client**, that is a program  running on some
computer, wishes to perform some *computational task*, but does not want
to or cannot perform it itself (e.g., insufficient hardware resource,
missing necessary software, missing necessary proprietary
data/credentials). Another program, the **server**, is running on another
computer and can perform the task.  The client sends the task's input data
*over the network* to the server, and  the server replies *over the network*
with the task's output data. 
 Many applications and websites are clients, where they receive
information from the end user and forward their request to a server for
actual processing.

The performance of a client-server setup thus depends on the network  on
which the data is transferred back and forth,  and on the hardware at the
server. If a task requires a lot of data compared to its  computation, then
the network will be a  critical  component, otherwise it will be the server
hardware. Furthermore, if multiple  clients use the same server,  the
clients will compete  for the server's hardware. 
Finally, there can be more than one server available, in which
case the client could choose to use the one that would get
 the job done faster.

### An Example: Client-Server Photo Processing 

On your computer, the "client", you have a **100 MB image** in RAM, 
as part of a machine learning program that you want to use to
detect particular objects in images (e.g., count the numbers of cars). But
this program does not implement the fancy algorithm you'd like to apply to
the image, say, because it is proprietary while your program is free
software. However, you can access remote servers on which the software that
implements the algorithm is installed so that you can use it 
over the network. This is provided by the company that develops the fancy
algorithm, as an advertising of its capabilities.   The fancy algorithm
performs **100 GFlop** of work on the 100 MB image. 

The following pictures depicts this setup:
 
<p align="center">
<object class="figure" width="800" type="image/svg+xml" data="{{ site.baseurl }}/public/img/client_server/client_server.svg">Client / Server Topology</object>
</p>
<div class="caption">
<strong>Figure A.3.2.1.1: Example client-server setup with two servers</strong>.
</div>
 
The client can use one of two servers: **Server 1,** which you can access via a network link
with only 10 MB/sec bandwidth, but with a core that computes at speed 100 GFlop/sec; 
and  **Server 2**, which you can access via a 100 MB/sec
network link, but with a core that only computes at speed 60 GFlop/sec. 
The latency for these network links is negligible and
can be disregarded because the image is large. Also, the output of the
algorithm (the number of cars) is only a few bytes, which is negligible.
*So, from a performance perspective, the task's execution consists of two
phases: sending the image data over and applying the algorithm to it.* The
image is sent directly from the RAM on the client to the server program
which receives and keeps in in RAM. **That is, for now, we assume no disk I/O
whatsoever.**


### Simulating the Client-Server Example

Below is a simulation app that you can use to simulate the
above example client-server setup. Try to simulate the application execution with
each server (use the radio button to select the server to use), leaving
all values to their default.  You should notice a difference in
execution time. Even though Server 1 has a better CPU, it it connected
to the client via a low-bandwidth link. Server 2 is thus
able to finish execution more quickly than Server 1. Then,
answer the practice questions hereafter, using the simulation app 
to determine answers or to double-check your answers.


<div class="ui accordion fluid app-ins">
  <div class="title">
    <i class="dropdown icon"></i>
    (Open simulator here)
  </div>
  <div markdown="0" class="ui segment content sim-frame">
    {% include simulator.html src="client_server/" %}
  </div>
</div>


#### Practice Questions

**[A.3.2.p1.1]** The client's link to Server 2 is faster than that to Server 1. 
Is there a bandwidth for Server 1 that would make it equivalent to Server 2 from the client's perspective? 
You can check your answer using the simulation app.
 
 <div class="ui accordion fluid">
   <div class="title">
     <i class="dropdown icon"></i>
     (click to see answer)
   </div>
   <div markdown="1" class="ui segment content">


The task execution time on Server 2 is:

$
T_{\text{server 2}} = \frac{100\; \text{MB}}{100\;\text{MB/sec}} + \frac{1000\; \text{GFlop}}{60\; \text{GFlop/sec}} = 17.66\;\text{sec}
$ 

We can double-check this result in simulation, which gives us an execution time of
17.72 seconds.  The discrepancy is because the
simulation simulates details that our estimate above does not capture. 
(See the [Networking Fundamentals module]({{site.baseurl}}/pedagogic_modules/pdcc/distributed_computing/networking_fundamentals/)).


Let $B$ be the unknown bandwidth  to Server 1, in MB/sec. The task execution time on Server 1
would then be:
        
$
T_{\text{server 1}} = \frac{100\; \text{MB}}{B} + \frac{1000\; \text{GFlop}}{100\; \text{GFlop/sec}}
$

To determine $B$ we just need to solve: 

$
T_{\text{server 1}} = T_{\text{server 2}}
$

which gives us: $B = 13.04 \text{MB/sec}$.

We can double-check this result in simulation by setting the bandwidth to Server 1 to 13 MB/sec (close enough). 
The simulation shows execution times of 17.72 secs for both servers. 

   </div>
 </div>
 
<p></p>


**[A.3.2.p1.2]** What if Server 2 had a CPU with compute speed 20 GFlop/sec, what bandwidth would be necessary for Server 1 to match its 
execution time on this workload?

<div class="ui accordion fluid">
   <div class="title">
     <i class="dropdown icon"></i>
     (click to see answer)
   </div>
   <div markdown="1" class="ui segment content">
   
If the speed of the link to Server 1 is improved to approximately 72 MBps or greater it can match Server 2 for 
execution time on this workload.

   </div>
 </div>
 
 <p></p>

