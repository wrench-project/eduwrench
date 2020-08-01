
#### Learning Objectives

<div class="learningObjectiveBox" markdown="1">
- Understand the principles of cyberinfrastructure services
- Understand the concept of overhead and how it can impact CI services performance
</div>

---

### Basics

The term **cyberinfrastructure** (CI) was introduced in the late 1990s, and 
became popular starting around 2003. Although no strict definition is widely
accepted, all commonly used definitions allude to systems comprising a computational _infrastructure_ for enabling breakthrough scientific discoveries. 
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
comnveniently and efficiently. Common CI services  target data storage and
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
service_, which can executes compute tasks on demand.

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
to see the implications of low networkflow bandwidth on a distributed
computation).

### CI Service Overhead

In the [Distributed Computing
module]({{site.baseurl}}/pedagogic_modules/pdcc/distributed_computing/) you
have learned how to reason about the performance of distributed programs
and how to estimate their execution times based on network, I/O, and
compute times.  This is certainly a foundations on which we can build to
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
be up to several minutes. As a result, prodicting the execution of a
possibly complex application workload on a particular CI is not an easy task
when trying to account for these overheads. And yet, not accounting for them
can lead to overly optimistic performance expectations. 

#### Simulating Overhead

The simulation app below simulates the execution of the client-server setup
depicted in Figure 1 of the 
[Client-Server module]({{site.baseurl}}/pedagogic_modules/pdcc/distributed_computing/client_server/#/basics).
But unlike the setup in that module, here each server is implemented as a
CI service that experience some _overhead_ (a time in seconds) each time a
task is started.  This i s the time needed to perform _startup_ operations
to configure the environment for executing the task (e.g., booting a VM
instance). As a result, if it has high overhead, a server may not be as
attractive as it may seem based on purely its network connectivity and
compute speed.

Using the app, experiment with simulating the execution with each server
(use the radio button to select which server to use), leaving all values to
their default. You should notice a difference in execution time. In the
client Client-Server module, Server #2 is able to finish execution more
quickly than Server #1, as the latter is connected to the client via a
low-bandwidth link. Here, using the default overhead values of 4 sec and 7
sec for Server #1 and Server #2 respectively, we observe that Server #1
finishes execution slightly faster. For a task with less computation to do,
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

Answer the practice questions hereafter, using the simulation app above to come up 
with or double-check answers.

IDEAS FOR PRACTICE QUESTIONS:
  - Say Server 2 has overhad Xs. For which value of the overhead on Server 1 is it equivalent to Server 2 

  - If I had two options:
        - Run one big tasks with work X
        - Split it into two tasks with work X/2
    Say the overhead to Server 1 is X and that on Server 2 is Y. What should I do? (Assuming I can can send data for a run task on two different servers concurrencly)

IDEAS FOR ACTIVITIES:

  - One service that one uses often is ssh (Secure Shell). On Linux machine on which the Ssh daemon is
   running, setup passwordless authentication, such that typing "ssh localhost" does not ask for your password.  Then type the commmand "time ssh localhost sleep 1". What is the overhead of the Ssh service in seconds?

  - Pick a cloud provider and measure the overhead for starting a VM instance. 
---
