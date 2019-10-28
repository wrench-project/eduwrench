

When going through these pedagogic modules, you will need to estimate
durations of data transfer times,  which is something you may not have
done previously. Back-of-the-envelope estimates are not difficult to
compute.
For instance, sending 100 MB of data over a network link with an
effective bandwidth of 10 MB/sec and a 0.001s latency would be estimated to take
10.001 seconds. Real-world networks exhibit several hardware and software
effects that are not captured by this estimate.
In the upcoming pedagogic module we do not use real-world
networks and instead we simulate them. But simulations are done using
[WRENCH](http://wrench-project.org/), which is based on the
[SimGrid](http://simgrid.org) simulation framework, which implements
realistic simulation models that do capture many real-world network
effects. So, in our simulations, sending 100 MB of data over a network link
with an effective bandwidth of 10 MB/sec and a 0.001s latency does not take 10.001
seconds (it takes longer, as it would in real-world networks).

Here we have used the term, *effective bandwidth*, to denote the maximum *possible*
throughput that a network link is able to achieve. Due to various network overheads,
a network link can have a throughput of at most 97% its advertised bandwidth. From this
point forward, when we describe the bandwidth of a network link, we are describing
its *effective bandwidth*.

When going through these pedagogic modules and inspecting execution timelines, you
will thus note that your back-of-the-envelope calculations of data transfer
times, which are sufficient to answer all questions, do not exactly align
with the simulation. In other words, it is normal to see some discrepancies
between your estimates and what you observe in simulation.

To make sure you are able to estimate file transfer times and to
demonstrate discrepancies between estimated and simulated times, we present
below three simple scenarios where files need to be sent from one host to
another. For each scenario we explain how data transfer times can be
estimated.

### Scenario 1: A Single file transfer

<object class="figure" type="image/svg+xml" data="{{ site.baseurl }}/public/img/networking_fundamentals/scenario_1.svg">Scenario 1</object>

*About how long should it take to send a single 100 MB file from "host1" to "host2"?*
 The time $T$ it takes to send a file of size $m$ over a single link with a bandwidth $\beta$ and latency $\alpha$,
can be estimate as follows:

$$ T = \alpha + \frac{m}{\beta} .$$

In this scenario, the file transfer goes through a route consisting of 3 network links.
We thus should modify the above equation.
Let $l$ be a link on the route $r$ over which the file is being sent.
Then we can estimate, naively, the file transfer time with the following:

$$
\begin{align}

 T_{1file} & = \sum_{l \in r} Latency(l) + \frac{m}{100\;MB/sec} \\
  & = 3(0.0001\;sec) + \frac{100\;MB}{100\;MB/sec} \\
  & = 1.0003\;seconds.

\end{align}
$$

This is correct because all 3 links have the same bandwidth, i.e., data flows through the end-to-end route at that bandwidth. However, the latency is
the sum of the three latencies (and is a very small fraction of the total transfer time). 
Using [WRENCH](http://wrench-project.org/) to simulate this scenario, we
would observe a file transfer time of 1.0656522 seconds.

### Scenario 2: A bottleneck link

<object class="figure" type="image/svg+xml" data="{{ site.baseurl }}/public/img/networking_fundamentals/scenario_2.svg">Scenario 2</object>

*About how long should it take to send a single 100 MB file from "host1" to "host2" given that the middle network link now
has a bandwidth of only 10 MB/sec?* It is almost always the case in practice that data will be transmitted over a heterogeneous set of
network links. Along a route, the data transfer rate is bounded by the link with the
smallest bandwidth, or the *bottleneck link*. In this scenario, the
bottleneck link is the middle link, which has a bandwidth of 10 MB/sec. We
can thus modify the estimate for the previous scenario by using a $min$
operator:

$$
\begin{align}

T_{1file} & = \sum_{l \in r} Latency(l) + \frac{m}{\min\limits_{l \in r} Bandwidth(l)} \\
  & = 3(0.0001\;sec) + \frac{100\;MB}{10\;MB/sec} \\
  & = 10.0003\;seconds

\end{align}
$$

Simulation results for this scenario show that the date transfer would in fact take 10.5159 seconds. There is thus, here again, a discrepancy.

### Scenario 3: Two concurrent file transfers

<object class="figure" type="image/svg+xml" data="{{ site.baseurl }}/public/img/networking_fundamentals/scenario_3.svg">Scenario 3</object>

*About how long should it take to send two 75 MB files concurrently from "host1" to "host2"?* In this situation,
the bandwidth will be shared amongst the two concurrent file transfers, which are assumed to start at the same time (and will thus terminate at about the same time). Let $n$ be the number of files to send
concurrently. Building off of the previous equation, we have the following:

$$
\begin{align}

T_{2files} & = \sum_{l \in r} Latency(l) + \frac{nm}{\min\limits_{l \in r} Bandwidth(l)} \\
  & = 3(0.0001\;sec) + \frac{2 * 75\;MB}{100\;MB/sec} \\
  & = 1.5003\;seconds

\end{align}
$$

Based on the simulation results, the 2 concurrent file transfers should
take about 1.5867 seconds. Again, the estimate is close, but does not align
perfectly with the simulation.

### Try the file transfer simulation

So that you can gain hands-on experience, use 
the simulation Web application
(see <a href="{{site.baseurl}}/pedagogic_modules/simulation_instructions/index/" target="_blank">instructions</a>),
selecting `Networking Fundamentals` from its menu. 

In simulation you can experiment with different
latencies, bandwidths, and numbers of concurrent file transfers, and check whether
your computed estimates are roughly accurate.  

The only input you need to provide to the simulation is a comma-separated list of file sizes. Clicking
on "Run Simulation" will display (textual) results that show file transfer durations, assuming all
transfers start at the same time and go from host A to host B. 

For example, entering "10, 20" will produce the following output: 

```
------------------------------------
10 MB transfer completed at time 2.102
20 MB transfer completed at time 3.152
------------------------------------
```

As expected, the longer transfer completes last, but it doesn't take twice as long as the first
transfer because once the first transfer has completed the second transfer can use all the bandwidth. 

### Conclusion

Throughout these pedagogic modules activities, you will be asked to estimate
application execution times given specific hardware constraints. 
Estimates as above will be sufficient to answer all questions but you have
to remain aware that they are not 100%
correct. We will be using simulation to see how close the estimates are 
to real network behaviors!
