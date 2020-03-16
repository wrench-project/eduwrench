
#### Learning objectives:

  - Understand the concept of contention

  - Be able to estimate data transfer times in the presence of contention
  

---


#### Networks are shared

Typically, several data transfers occur concurrently (i.e., at the same
time) on a network, and some of these transfers may be using the same
network links. For instance, two concurrent transfers could be along two
routes that share a single link. As a result, a data transfer's performance
can be impacted by other data transfers. When a data transfer goes slower
than it would go if alone in the network, it is because of *contention*
(i.e., competition) for the bandwidth of at least one network link.

#### A Simple example

Consider the following topology with the two depicted data transfers (symbolized by the red and the green arrow), that
each were started at exactly the same time and transfer 100 MB of data.

<object class="figure" type="image/svg+xml" data="{{ site.baseurl }}/public/img/networking_fundamentals/topology_contention.svg">topology with contention</object>
<b>Figure 1:</b> A simple example in which two data transfers contend for bandwidth.

If the green data transfer were by itself, its bandwidth would be 30 MB/sec.
If the red data transfer were by itself, its bandwidth would be 40
MB/sec. But when both transfers happen at the same time, they experience
contention on the link into host C. 

Contention on this link means that the two transfers *share the link's
bandwidth*. If this sharing is fair they both
receive half of the link's bandwidth, 20 MB/sec. (It turns out that bandwidth sharing
is a bit complicated in practice as it also depends on latencies, but in
this case both transfers have the same end-to-end latencies, which leads to
fair sharing - see a networking textbook for more details if interested).

Given the above, both transfers proceed at 20 MB/sec, i.e., half the bandwidth of the link into
host C, which is their bottleneck link. 
Thus both transfers complete in time:

$$
T = 200\;\text{us} + \frac{100 \text{MB}}{20 \text{MB/sec}} = 5.0002\;\text{sec}
$$


#### A slightly more complex example

Consider now another scenario, with the only difference that the "red" transfer now only transfers 50 MB:

<object class="figure" type="image/svg+xml" data="{{ site.baseurl }}/public/img/networking_fundamentals/topology_contention_different_sizes.svg">topology with contention and different transfer sizes</object>
<b>Figure 2:</b> A slightly more complex example in which one transfer transfers less data than the other.

In this scenario there are two phases:

  1. In the first phase both transfers proceed with a bandwidth of 20 MB/sec due to contention;
  2. In the second phase, after the "red" transfer has completed, the "green" transfer proceeds alone with a bandwidth of 30 MB/sec (because its bottleneck link is now the link out of host B!).

Therefore, the "red" transfer completes in:

$$
T_{red} = 200\;\text{us} + \frac{50\;\text{MB}}{20\;\text{MB/sec}} = 2.5002\;\text{sec}
$$

The "green" transfer transfers its first 50 MB of data with a bandwidth of 20 MB/sec and its last 50 MB of data with
a bandwidth of 30 MB/sec. Therefore, it completes in time:

$$
T_{green} = 200\;\text{us} + \frac{50\;\text{MB}}{20\;\text{MB/sec}} + \frac{50\;\text{MB}}{30\;\text{MB/sec}} = 4.1668\;\text{sec}
$$

#### Testing your understanding using simulation

So that you can gain hands-on experience, use 
the simulation Web application
(see <a href="{{site.baseurl}}/pedagogic_modules/simulation_instructions/index/" target="_blank">instructions</a>),
selecting `Networking Fundamentals` from its menu. 

This simulation is for the following
scenario in which a number of transfers occur concurrently on the same
three-link route:

<object class="figure" type="image/svg+xml" data="{{ site.baseurl }}/public/img/networking_fundamentals/topology_contention_simulation.svg">simulation scenario</object>
<b>Figure 3:</b> Simulation scenario.

On the simulation Web application tool  you can enter a list of file sizes (in MB). Each file size corresponds to
one data transfer on a three-link route.

For example, if you enter just number "100" in the text box, the simulation will be for
a single 100 MB data transfer and produce this output:

```
----------------------------------------
100 MB transfer completed at time 10.5
----------------------------------------
```

Note that the transfer's completion time is a bit higher than what the computations
we've done so far would give. We would expect the transfer time to be:

$$
T = 30\;\text{us} + \frac{100 \text{MB}}{10 \text{MB/sec}} = 10.00003\;\text{sec}.
$$

This discrepancy is because the simulator captures some details of
real-world networks (e.g., the TCP slow-start behavior that you may have read about
in a Networking textbook) that are 
not captured by the
above mathematical expression. Such expressions are
still useful approximations that we can use to reason about data transfer
times. However, we should not be surprised that they are a bit "off".

Entering "100, 100, 50" in the text box will simulate two 100 MB transfers and one 50 MB transfer, producing this output:

```
----------------------------------------
100 MB transfer completed at time 26.25
100 MB transfer completed at time 26.25
50 MB transfer completed at time 15.75
----------------------------------------
```

As expected, the 50 MB transfer completes first, and the two 100 MB transfers
complete at the same time.

Feel free to run simulations to explore different scenarios and test your 
computed data transfer time estimates for various combinations of concurrent
transfers.

--- 

#### Practice questions

The following practice questions pertain to this topology:

<object class="figure" type="image/svg+xml" data="{{ site.baseurl }}/public/img/networking_fundamentals/topology_contention_practice.svg">simulation scenario for practice questions</object>
<b>Figure 4:</b> Topology for practice questions.


**[C.p3.1]** A 100 MB transfer from host A to host C, and a 100 MB transfer
	 from host B to host C start at the same time. Do they finish at
	 the same time?


<div class="ui accordion fluid">
  <div class="title">
    <i class="dropdown icon"></i>
    (click to see answer)
  </div>
  <div markdown="1" class="ui segment content">
   Yes! Both transfers are bottlenecked on the link into host C, sharing its
   bandwidth, so that both transfers proceed at bandwidth 20 MB/sec.
  </div>
</div>

<p> </p>


**[C.p3.2]** A 100 MB transfer from host D to host B, and a 100 MB transfer
         from host A to host C start at time 0. At what time
         does each of them complete? 
<div class="ui accordion fluid">
  <div class="title">
    <i class="dropdown icon"></i>
    (click to see answer)
  </div>
  <div markdown="1" class="ui segment content">
   The transfer from D to B proceeds at 30 MB/sec as it is bottlenecked
   on the link into host B. The transfer from A to C proceeds at 40 MB/sec
   as it is bottlenecked on the link into host C. These two transfers share
   one network link, but that network link has bandwidth 100 MB/sec, and so
   there is no contention on that link.  Consequently, the transfer times
   as follows:

$$
\begin{align}
  T_{D \rightarrow B} & = 250\;\text{us} + \frac{100\;\text{MB}}{30\;\text{MB/sec}} = 3.3335\;\text{sec}\\
  T_{A \rightarrow C} & = 250\;\text{us} + \frac{100\;\text{MB}}{40\;\text{MB/sec}} = 2.5002\;\text{sec}
\end{align}
$$
  </div>
</div>

<p> </p>


**[C.p3.3]** A 100 MB transfer from host B to host C and a 60 MB transfer 
from host A to host C start at time 0. At what time do they complete?
<div class="ui accordion fluid">
  <div class="title">
    <i class="dropdown icon"></i>
    (click to see answer)
  </div>
  <div markdown="1" class="ui segment content">
   Both transfers are bottlenecked on the link into host C, sharing its
   bandwidth so that both transfers proceed at 20 MB/sec. When the 60 MB
transfer completes, then the 100 MB transfer still has 40 MB to transfer and
proceeds at 30 MB/sec (as it is now bottlenecked on the link from host B). Therefore:

$$
\begin{align}
  T_{A \rightarrow C} & = 250\;\text{us} + \frac{60\;\text{MB}}{20\;\text{MB/sec}} = 3.0002\;\text{sec}\\
  T_{B \rightarrow C} & = 250\;\text{us} + \frac{60\;\text{MB}}{20\;\text{MB/sec}} + \frac{40\;\text{MB}}{30\;\text{MB/sec}} = 4.3335\;\text{sec}
\end{align}
$$
  </div>
</div>

<p> </p>


--- 

#### Questions

Answer the following questions, which pertain to this topology:

<object class="figure" type="image/svg+xml" data="{{ site.baseurl }}/public/img/networking_fundamentals/topology_contention_questions.svg">simulation scenario for questions</object>
<b>Figure 5:</b> Topology for questions (lat = "latency"; bw = "bandwidth").


**[C.q3.1]** At time 0, a 10 MB transfer starts from host B to host C, and another 10 MB transfer starts from host A to host D. Do they finish at the same time?

<p></p>

**[C.q3.2]** At time 0, a 100 MB transfer starts from host B to host C
and a 200 MB transfer starts from host A to host D. At what time do these transfers finish?

<p></p>



--- 

