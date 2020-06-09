
#### Learning Objectives

- Understand the basics of the client/server model of computation
- Be able to reason about the performance of a simple client/server setup

---

### Client-Server Model

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

### An Example: Photo Processing 

On your computer, the "client", you have a **100 MB image** in RAM, 
as part of a machine learning program that you want to use to
detect particular objects in images (e.g., count the numbers of cars). But
this program does not implement the fancy algorithm you'd like to apply to
the image, say, because it is proprietary while your program is free
software. However, you can access remote servers on which the software that
implements the algorithm is installed so that you can use it 
over the network. This is provided by the company that develops the fancy
algorithm, as an advertisement of its capabilities.   The fancy algorithm
performs **1000 GFlop** of work on the 100 MB image. 

The following pictures depicts this setup:
 
<object class="figure" type="image/svg+xml" data="{{ site.baseurl }}/public/img/client_server/client_server.svg">Client / Server Setup</object>
<div class="caption">
<strong>Figure 1: Example client-server setup with two servers</strong>.
</div>
 
The client can use one of two servers: **Server #1,** which you can access via a network link
with only 10 MB/sec bandwidth, but with a core that computes at speed 100 GFlop/sec; 
and  **Server #2**, which you can access via a 100 MB/sec
network link, but with a core that only computes at speed 60 GFlop/sec. 
The latency for these network links is negligible and
can be disregarded because the image is large. Also, the output of the
algorithm (the number of cars) is only a few bytes, which is negligible.
*So, from a performance perspective, the task's execution consists of two
phases: sending the image data over and applying the algorithm to it.* The
image is sent directly from the RAM on the client to the server program
which receives it and keeps in in RAM. **That is, for now, we assume no disk I/O
whatsoever.**


### Simulating the Client-Server Example

Below is an app that you can use to simulate the
above example client-server setup. Try to simulate the execution with
each server (use the radio button to select the server to use), leaving
all values to their default.  You should notice a difference in
execution time. Even though Server #1 has a better CPU, it it connected
to the client via a low-bandwidth link. Server #2 is thus
able to finish execution more quickly than Server #1. Then,
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

**[A.3.2.p1.1]** The client's link to Server #2 is faster than that to Server #1. 
Is there a bandwidth for Server #1 that would make it equivalent to Server #2 from the client's perspective? 
You can check your answer using the simulation app.
 
 <div class="ui accordion fluid">
   <div class="title">
     <i class="dropdown icon"></i>
     (click to see answer)
   </div>
   <div markdown="1" class="ui segment content answer-frame">


The task execution time on Server #2 is:

$
T_{\text{server 2}} = \frac{100\; \text{MB}}{100\;\text{MB/sec}} + \frac{1000\; \text{GFlop}}{60\; \text{GFlop/sec}} = 17.66\;\text{sec}
$ 

We can double-check this result in simulation, which gives us an execution time of
17.72 seconds.  The discrepancy is because the
simulation simulates details that our estimate above does not capture. 
(See the [Networking Fundamentals module]({{site.baseurl}}/pedagogic_modules/pdcc/distributed_computing/networking_fundamentals/)).


Let $B$ be the unknown bandwidth  to Server #1, in MB/sec. The task execution time on Server #1
would then be:
        
$
T_{\text{server 1}} = \frac{100\; \text{MB}}{B} + \frac{1000\; \text{GFlop}}{100\; \text{GFlop/sec}}
$

To determine $B$ we just need to solve: 

$
T_{\text{server 1}} = T_{\text{server 2}}
$

which gives us: $B = 13.05 \;\text{MB/sec}$.

We can double-check this result in simulation by setting the bandwidth to Server #1 to 13 MB/sec (close enough). 
The simulation shows execution times of 18.08 secs for Server #1, which is very close
to that for Server #2. 

   </div>
 </div>
 
<p></p>


**[A.3.2.p1.2]** It is possible to set a bandwidth to Server #1 so that the task execution time with that server
is one third of the execution time with the original 10 MB/sec bandwidth?
 
 <div class="ui accordion fluid">
   <div class="title">
     <i class="dropdown icon"></i>
     (click to see answer)
   </div>
   <div markdown="1" class="ui segment content answer-frame">

The original execution time on Server #1, according to the simulation, is 20.50 seconds. So our target is 20.50/3 = 6.83 seconds. 
Since the compute time is 10 seconds, the answer is no, it is not possible to have a task execution time that low.

   </div>
 </div>
 
<p></p>


**[A.3.2.p1.3]** Say you now have **two images** to process, each of them 100 MB and requiring 1000 GFlop of work. Bandwidth
to Server #1 is set to the original 10 MB/sec
 
 Assuming your
client program can do two network transfers at the same time, what would be the total execution time?  

What if
your client program  can only do one network transfer at a time? 
 
 <div class="ui accordion fluid">
   <div class="title">
     <i class="dropdown icon"></i>
     (click to see answer)
   </div>
   <div markdown="1" class="ui segment content answer-frame">

If our client program can do simultaneous network transfers, since the client is connected to the
servers via two different network links, then the execution time 
would be $\max(20.50, 17.72) = 20.50\;\text{seconds}$. 

If our client cannot do simultaneous network transfers, we have two options: either
we first send an image to Server #1 and then send the other image to Server #2, or the other
way around. Let's examine both options, giving the time line of events for each based on back-of-the-envelope calculations:

  - **Server #1 first**: 
    - time 0: start sending an image to Server #1
    - time 10: image received by Server #1, which starts computing; and start sending image to Server #2
    - time 11: image received by Server #2, which starts computing
    - time 10 + 1000/100 = 20: Server #1 finishes computing
    - time 11 + 1000/60 = 27.66: Server #2 finishes computing
        
  - **Server #2 first**:
    - time 0: start sending an image to Server #2
    - time 1: image received by Server #2, which starts computing; and start sending image to Server #1
    - time 11: image received by Server #1, which starts computing
    - time 1 + 1000/60 = 17.66: Server #2 finishes computing
    - time 11 + 1000/100 = 21: Server #1 finished computing
    
The second option is 6.66 seconds faster than the first option. As we've already seen, simulation
results would be a bit different, but not  to the extent that the first option would be faster!

This example highlights
a pretty well-known rule of thumb: trying to get computers to compute  as early as possible is a good idea.
In our case, this works out great because Server #2 can get the image really quickly, and is slower
than Server #1 for computing. So we achieve  much better overlap of communication and computation
with the second option than with the first option. This is exactly the same idea as
overlapping I/O and computation as see in [I/O tab of the Single Core Computing module]({{site.baseurl}}/pedagogic_modules/pdcc/single_core_computing/#/io).

   </div>
 </div>
 
<p></p>

#### Questions

Given the client-server setup below (note that servers are multi-core, and that the task to execute
has both an input and an output file), answer the following  **four questions**:

<object class="figure" type="image/svg+xml" data="{{ site.baseurl }}/public/img/client_server/client_server_question.svg">Client / Server Setup for Question</object>
<div class="caption">
<strong>Figure 2: Another example client-server setup with two servers</strong>.
</div>

Once again, you will answer these questions using back-of-the-envelope estimates, even though simulation
would produce slightly different results. 

**[A.3.2.q1.1]** Assuming that the task can use only 1 core, which server should be used?  

**[A.3.2.q1.2]** Assuming now that the task can run on any number of cores, always with 100% parallel efficiency, which server would be used?

**[A.3.2.q1.3]** It turns out the parallel efficiency of the task is not 100%. You observe that on Server #1 the entire execution takes 15 sec. What is the task's parallel efficiency?

**[A.3.2.q1.4]** Assuming that the task's parallel efficiency is 60%, what should the network bandwidth to Server #1 be for both servers to achieve the exact same task  execution times?
