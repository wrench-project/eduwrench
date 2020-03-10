
#### Learning objectives:

  - Understand the concept of network topology

  - Be able to compute end-to-end latencies and bandwidths
  
  - Be able to compute end-to-end data transfer times

---




#### Network Topologies 

At an abstract level a network topology is a graph.  The edges of the graph
are network links with various latencies and bandwidths.  The vertices of
the graph represent either end-points, i.e., computers connected to the
network, or routers, i.e., devices that are used to connect network links
together.  We are abstracting away here many interesting details of how
network technology makes it possible to implement network topologies. For
instance, we will not discuss how routers work (see a network textbook for all interesting details).

<object class="figure" type="image/svg+xml" data="{{ site.baseurl }}/public/img/networking_fundamentals/topology.svg">topology</object>
<b>Figure 2:</b> An example network topology that interconnects 5 hosts.

The figure above shows an example topology with 5 hosts (the end-points vertices) 4
routers (internal vertices), and 9 network links (the edges). Data communicated on the
network flows through links and routers. The **route** between
two hosts is the sequence of network links (and routers) that the data traverses when 
being communicated from one of the hosts to another. 

<object class="figure" type="image/svg+xml" data="{{ site.baseurl }}/public/img/networking_fundamentals/topology_routes.svg">topology with routes</object>
<b>Figure 1:</b> Two possible routes between host A and host C.

As an example, the figure above shows two possible routes between host A
and host C. The network configuration, the details of which are outside our
scope, defines which route is to be taken, for instance the blue
route.  We will always assume that the routes are static, i.e., data
flowing from one host to another always traverses the same set of links (in the example above, 
one one of the blue and red routes actually exists). 

#### End-to-end Network Routes

Consider two hosts connected via a 3-link route, as depicted in Figure 3 below. 

<object class="figure" type="image/svg+xml" data="{{ site.baseurl }}/public/img/networking_fundamentals/scenario_1.svg">A three-link route</object>
<b>Figure 3:</b> An example 3-link route between two hosts.

In this example, all network links have the same bandwidth, 100 MB/sec.
When transferring data from host A to host B, this transfer thus experiences
a bandwidth of 100 MB/sec but a latency of 50 + 100 + 50 = 200 us, that is,
the **sum of the link latencies**. Remember that in the
"water in pipes" analogy, the latency is the length of a pipe. And so it
makes sense that the length of a sequence of pipes is the sum of the
individual pipe lengths. 

For the route shown in Figure 3, transferring 100 MB of data from
host A to host B will take time:

$$
\begin{align}
T_{100 \text{MB}} & = 200\;\text{us} + \frac{100\;\text{MB}}{100\;\text{MB/sec}} = 1.0002\; \text{sec}
\end{align}
$$


Consider now a similar three-link route, but with different link bandwidths:
<object class="figure" type="image/svg+xml" data="{{ site.baseurl }}/public/img/networking_fundamentals/scenario_2.svg">A different three-link route</object>
<b>Figure 4:</b> Another example 3-link route between two hosts.

In Figure 4, the middle link has a bandwidth of 10 MB/sec (shown in red).
In this case, the data flows only as fast as the slowest link. The middle
link is called the *bottleneck* link, and the other two links are only
partially used (i.e., they can transfer data at 100 MB/sec, but they only
transfer data at 10 MB/sec). This is again consistent with the "water in pipes"
analogy, since the water flow is limited by the width of the narrowest pipe. 
In other words, the bandwidth available in a multi-link route is the **minimum
of the link bandwidths**. 

For the route shown in Figure 4, transferring 100 MB of data from
host A to host B will take time:

$$
\begin{align}
T_{100MB} & = 200\;\text{us} + \frac{100\;\text{MB}}{10\;\text{MB/sec}} = 10.0002\; \text{sec}
\end{align}
$$


#### Putting it all together

Given a route *r*, i.e., a set of network links, and a data transfer of *size* bytes,
the data transfer time through the route is:

$$
\begin{align}
T_{size} & = \sum_{link \in r} latency(link) + \frac{size}{\min\limits_{link \in r} bandwidth(link)} \\
\end{align}
$$

**The latency of the route is the sum of the latencies and the bandwidth of the route
is the minimum of the bandwidths.** 

---

#### Practice questions

To make sure you have understood the above, answer the following practice
questions, which all pertain to this topology:

<object class="figure" type="image/svg+xml" data="{{ site.baseurl }}/public/img/networking_fundamentals/topology_practice.svg">Network topology for practice questions</object>
<b>Figure 5:</b> Network topology for practice questions.


**[C.p2.1]** What is the latency of the route from host E to host D?
<div class="ui accordion fluid">
  <div class="title">
    <i class="dropdown icon"></i>
    (click to see answer)
  </div>
  <div markdown="1" class="ui segment content">
The latency is the sum of the link latencies along the route:

$$
\begin{align}
100\;\text{us} + 50\;\text{us} + 120\;\text{us} = 270\;\text{us}.
\end{align}
$$
  </div>
</div>

<p> </p>

**[C.p2.2]** What is the bandwidth of the route from host E to host D?
<div class="ui accordion fluid">
  <div class=" title">
    <i class="dropdown icon"></i>
    (click to see answer)
  </div>
  <div markdown="1" class="ui segment content">
The bandwidth is the minimum of the link bandwidths along the route:

$$
\begin{align}
\min(20\;\text{MB/sec}, 30\;\text{MB/sec}, 100\;\text{MB/sec}) = 20\;\text{MB/sec}.
\end{align}
$$
  </div>
</div>

<p> </p>

**[C.p2.3]** I am a user sitting at host E and have to download a large file. That file is on a Web site at host A but also on a mirror Web site at host D.  Which mirror should I select?
<div class="ui accordion fluid">
  <div class=" title">
    <i class="dropdown icon"></i>
    (click to see answer)
  </div>
  <div markdown="1" class="ui segment content">
   I should pick the mirror at host D. This is a large file, so the latency
   component of the data transfer time is negligible. So it's all about the
   bandwidth. The bandwidth of the route from host E to host A is 10
   MB/sec, while that of the route from host E to host D is higher at 20 MB/sec. 

  </div>
</div>

<p> </p>

**[C.p2.4]** What is the transfer time for sending 1 MB of data from host E to host D?
<div class="ui accordion fluid">
  <div class=" title">
    <i class="dropdown icon"></i>
    (click to see answer)
  </div>
  <div markdown="1" class="ui segment content">
The data transfer time is:

$$ 
\begin{align}
T = 100\;\text{us} + 50\;\text{us} + 120\;\text{us} + \frac{1\;\text{MB}}{20\;\text{MB/sec}} \simeq .05\;\text{sec}\\
\end{align}
$$
  </div>
</div>

<p> </p>

---

#### Questions

Answer the following questions, which all pertain to this topology:

<object class="figure" type="image/svg+xml" data="{{ site.baseurl }}/public/img/networking_fundamentals/topology_questions.svg">Network topology for questions</object>
<b>Figure 6:</b> Network topology for questions (lat = "latency"; bw = "bandwidth").


**[C.q2.1]** What is the latency of the route from host A to host B?

<p></p>
**[C.q2.2]** What is the bandwidth of the route from host C to host D?

<p></p>
**[C.q2.3]** How long, in seconds, does it take to transfer 100 MB of
  data from host A to host D?

<p></p>
**[C.q2.4]** A lot of users are transferring data from host B to host D,
thus competing for the bandwidth on that route. Would it help to 
purchase an upgrade to the link that connects host B to the network?

<p></p>
**[C.q2.5]** I am am sitting at host D and want to download a tiny file that's mirrored at all other hosts. 
From my perspective, does it matter which mirror I pick, and if yes which one should I pick?

<p></p>
**[C.q2.6]** I am am sitting at host D and want to download a huge file
that's mirrored at all other hosts.  From my perspective, does it matter which mirror I pick,
and if yes which one should I pick?

<p></p>
**[C.q2.7]** Of all the possible routes above, which route has the highest bandwidth?





---
