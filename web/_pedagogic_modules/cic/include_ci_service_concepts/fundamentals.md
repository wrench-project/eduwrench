
#### Learning Objectives

<div class="learningObjectiveBox" markdown="1">
- Understand the principles of cyberinfrastructure services
- Understand the concept of overhead and how it can impact CI services performance
</div>

---

### Basics

The term **cyberinfrastructure** (CI) was introduced in the late 1990s, and 
became popular starting around 2003. Although no strict definition is widely
accepted, all commonly used definitions allude to systems comprising a 
computational _infrastructure_ for enabling breakthrough scientific discoveries. 
In summary, a _cyberinfrastructure_ can be composed of (but not limited to)
the following elements:  
 
- Computational systems (e.g., grids, clouds, clusters, supercomputers, etc.)
- Data and information management systems (e.g., databases, data repositories, etc.)
- Advanced instruments (e.g., telescopes, detectors, etc.)
- Visualization environments (e.g., scientific visualization, data analytics, etc.)
- Advanced networks (e.g., high-bandwidth networks, collaborative networks, etc.)
- Software (e.g., applications, resource scheduling and provisioning, monitoring, 
  fault-tolerance, etc.)
- People (e.g., researchers, developers, etc.)

Typically, cyberinfrastructures leverage several parallel and distributed 
computing technologies for creating solutions organized into sets of **services** 
tailored to support a specific scientific domain or general-purpose scientific 
needs. 

### Cyberinfrastructure Services

A CI is typically composed of several services that together
provide the fundamental abstractions for executing application workloads
conveniently and efficiently. Common CI services  target data storage and
management, data movements over the network, computation on bare-metal or
virtualized compute nodes, web sites that serve as portals for the CI.
In this module, we explore different approaches and
techniques commonly used for using these services in a view to executing
various application workloads.  Note that we do not target any specific CI
service implementations, but instead the main concepts in different service
categories.

The figure below shows an example of a CI composed of four different
services: a _website_, from where users interact with the system to
upload/download data and launch compute tasks; a _Storage service_, where
data can stored and retrieve persistently; a _File Registry service_, which
is a catalog that acts as a bookkeeper for data location; and a _Compute
service_, which can execute compute tasks on demand.

<object class="figure" type="image/svg+xml" data="{{ site.baseurl }}/public/img/cyberinfrastructure/basics.svg">Cyberinfrastructure Setup</object>
<div class="caption">
<strong>Figure 1:</strong> Example of a cyberinfrastructure with a website, a storage service, a file registry service, and a compute service.
</div>

Although the figure above illustrates a simple CI deployment, this
configuration represents a typical infrastructure in which web portals (or
science gateways) utilizes data storage services and file catalogs for data
archival, and compute platforms (e.g., clouds or clusters) for performing
computations (e.g., analysis of data or visualization). CI services are
often connected to each other by a network  topology  with high-speed
network links with small latencies, while connection to the users (client)
are usually subjected to ISP (internet service provider) bandwidths and
latencies (see the [Networking
Fundamentals module]({{site.baseurl}}/pedagogic_modules/pdcc/networking_fundamentals/)
for a discussion of network latencies, bandwidths, and topologies; and see
the [Client-Server
module]({{site.baseurl}}/pedagogic_modules/pdcc/distributed_computing/client_server/#/basics)
to see the implications of low network bandwidth on a distributed
computation).

### CI Service Overhead

In the [Distributed Computing
module]({{site.baseurl}}/pedagogic_modules/pdcc/distributed_computing/) you
have learned how to reason about the performance of distributed programs
and how to estimate their execution times based on network, I/O, and
compute times.  This is certainly a foundation on which we can build to
estimate the execution times of an application running on a set of CI
services, but it does not account for the fact that we're now using a
possibly complicate software infrastructure. In this infrastructure using
each CI service comes with an **overhead**, i.e., there is a delay for
processing each request to the service.

For example, a File Registry service may need to execute a search algorithm
on some large, possible distributed, data structure for finding all storage
services on which a copy of particular file is located. A Compute service
may need to allocate and/or boot virtual machines (VMs) or containers to
perform the requested computation. In addition, overheads compound as
services can interact with each other. For instance, a storage service may
need to interact with a Web server and a File Registry service when a new
file is stored.

Some of these overheads can be at most a few seconds, while others can
be up to several minutes. As a result, predicting the execution of a
possibly complex application workload on a particular CI is not an easy task
when trying to account for these overheads. And yet, not accounting for them
can lead to overly optimistic performance expectations. 

#### Simulating Service Overhead

The simulation app below simulates the execution of the client-server setup
depicted in Figure 1 of the 
[Client-Server module]({{site.baseurl}}/pedagogic_modules/pdcc/distributed_computing/client_server/#/basics).
But here each server is implemented as a
CI service that experience some _overhead_ (a time in seconds) each time a
task is started.  This is the time needed to perform _startup_ operations
to configure the environment for executing the task (e.g., booting a VM
instance). As a result, if it has high overhead, a server may not be as
attractive as it may seem based on purely its network connectivity and
compute speed.

Using the app, experiment with simulating the execution with each server
(use the radio button to select which server to use), leaving all values to
their default. You should notice a difference in execution time. In the
client Client-Server module, Server #2 is able to finish execution more
quickly than Server #1, as the latter is connected to the client via a
low-bandwidth link. Here, using the default overhead values of 1 sec and 5
sec for Server #1 and Server #2 respectively, we observe that Server #1
finishes execution a bit faster. For a task with less computation to do,
Server \#1 would be even more preferable, while Server \#2 would be
the better choice provided the task has enough computation to do. 

<div class="ui accordion fluid app-ins">
  <div class="title">
    <i class="dropdown icon"></i>
    (Open simulator here)
  </div>
  <div markdown="0" class="ui segment content sim-frame">
    {% include simulator.html src="cic_overhead/" %}
  </div>
</div>

---

#### Practice Questions

Answer the practice questions hereafter, which pertain  to the setup in the above simulation (You can use
the simulation to double-check answers). 


**[B.1.p1.1]** Using the default values in the above setup as the base case (Server #1: 1 second; Server #2: 5 seconds; Task: 1000 GFlop), would reducing the
overhead of Server #2 by 1 second make it preferable to Server #1? 
  

<div class="ui accordion fluid">
  <div class="title">
    <i class="dropdown icon"></i>
    (click to see answer)
  </div>
  <div markdown="1" class="ui segment content">
   In the base setup, Server #2 completes the task 1.22 second slower than Server #1. So no, we would have to reduce the
   overhead by more than 1 second. 
  </div>
</div>

<p> </p>

**[B.1.p1.2]** With the default overhead values (1 and 5 seconds), for which value of the task's 
work would both servers complete the task in the same about of time?  Try to come up with an analytical answer 
first. Then use the
simulation to see how close it is to the true value (by doing a by-hand binary search on the execution time difference!).
  

<div class="ui accordion fluid">
  <div class="title">
    <i class="dropdown icon"></i>
    (click to see answer)
  </div>
  <div markdown="1" class="ui segment content">
   Let $x$ be the task's work. The execution time on each server is estimated as:
 
$$
T_{server\#1} = 100 / 10 + 1 + x / 100
$$
and
$$
T_{server\#2} = 100 / 100 + 5 + x / 60
$$

Solving 
$$T_{server\#1}  = T_{server\#2}$$

yields 
$$x = 750\;\text{GFlop}$$. 
    
As we know from previous modules, such estimates can be inaccurate, especially because they cannot
capture the complexity of actual networks. Doing a simple binary search with the simulation app yields
a value of $$x = 818\;\text{GFlop}$$. 


  </div>
</div>

<p> </p>


**[B.1.p1.3]** We have to run a computation on the above two-server system, where Server #1 has a 3 sec task
startup overhead and Server #2 has a 5 sec task startup overhead.  You have a computation to run that has 500 GFlop of work. You have two options:

  - Option #1: run the computation as a single task on one of the servers (whichever one is the fatest)
  - Option #2: split the computation into to 250-GFlop tasks that each read the whole input file, and run them concurrently on the two servers

Using the simulation app figure out which option is best.

<div class="ui accordion fluid">
  <div class="title">
    <i class="dropdown icon"></i>
    (click to see answer)
  </div>
<div markdown="1" class="ui segment content">
   
Using the simulation, we obtain:

  - Running a 500-GFlop task on Server #1: 18.50 sec
  - Running a 500-GFlop task on Server #2: 14.38 sec
  - Running a 250-GFlop task on Server #1: 16.00 sec
  - Running a 250-GFlop task on Server #2: 10.22 sec

So we obtain the execution time for each option:
  
  - Option #1: min(18.50, 14.38) = 14.38 sec
  - Option #2: max(16.00, 10.22) = 10.22 sec
  
We are better off with Option #2!

  </div>
</div>

<p> </p>

---

#### Questions

TBD

---

#### Suggested Activities

  - IDEA: One service that one uses often is ssh (Secure Shell). On Linux machine on which the Ssh daemon is
   running, setup passwordless authentication, such that typing "ssh localhost" does not ask for your password.  Then type the commmand "time ssh localhost sleep 1". What is the overhead of the Ssh service in seconds?

  - IDEA: Pick a cloud provider and measure the overhead for starting a VM instance. 
  
---


