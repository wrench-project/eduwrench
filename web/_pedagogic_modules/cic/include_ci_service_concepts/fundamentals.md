
#### Learning Objectives

- Understand the principles of cyberinfrastructure services
- Understand the concept of overhead and how it can impact CI services performance

---

### Basics

The term **cyberinfrastructure** (CI) was introduced in the late 1990s, and 
became largely known since 2003. Although the term is still loosely defined,
all common definitions allude to systems comprising a computational 
_infrastructure_ for enabling breakthrough scientific discoveries. 
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
tailored to support a specific science domain or general purpose science 
needs. 

### Cyberinfrastructure Services

A CI can be composed of several services that together provide the fundamental
infrastructure resources for enabling research or education. Such services 
may include data storage and management, networking solutions, and hosting 
virtualized platforms, websites, and databases. In this module, we explore 
different approaches and techniques commonly used for building CI services.
Notice that we do not target a specific CI service implementation, but the
general concepts related to different service categories. 

The figure below shows an example of a CI composed of four different services: 
a _website_, from where users interact with the system to upload/download 
data and launch computing tasks; a _Storage service_, where data is stored
permanently; a _File Registry service_, a catalog that acts as a
bookkeeper for data location; and a _Compute service_, which executes computing
tasks.    

<object class="figure" type="image/svg+xml" data="{{ site.baseurl }}/public/img/cyberinfrastructure/basics.svg">Cyberinfrastructure Setup</object>
<div class="caption">
<strong>Figure 1:</strong> Example of a cyberinfrastructure with a website, a storage service, a file registry service, and a compute service.
</div>

Although the figure above illustrates a simple CI deployment, this configuration
represents a typical infrastructure in which web portals (or science gateways)
utilizes data storage services and file catalogs for data archival, and 
computing platforms (e.g., clouds or clusters) for performing computations 
(e.g., analysis of data or visualization). Typically, CI services are connected 
among them with high speed network links and small latencies, while connection
to the users (client) are usually subjected to the ISP (internet service provider) 
bandwidth and latencies (see the
[Client-Server module]({{site.baseurl}}/pedagogic_modules/pdcc/distributed_computing/client_server/#/basics)
in which we discussed low-bandwidth implications).

In addition to network bandwidth and latency, and disk I/O bandwidth, CI services
also experience **overheads**, i.e. delays for processing a request. For example,
a File Registry service may need to execute a search algorithm for identifying 
all locations of a file that is stored in a distributed way; a Compute service
may need to allocate and/or boot virtual machines (VMs) or containers to perform 
the computation.

Since a CI can be composed of several services, and each service provides 
different performance behaviors (e.g., time to answer a request, 
queueing time for starting processing a task, etc.), predicting accurate 
performance is not a trivial task. Thus, in this module we mostly rely on
simulation instead of back-of-the-envelope estimates.

#### Simulating Overhead

The simulation app below simulates the execution of the client-server setup
presented in Figure 1 of the 
[Client-Server module]({{site.baseurl}}/pedagogic_modules/pdcc/distributed_computing/client_server/#/basics).
For this simulation, each server yields a different _overhead_ value represented
as the time (in seconds) to start the execution of a task -- let's assume the server
needs to perform some _startup_ operations to configure the environment for 
executing the task. Try to simulate the execution with each server (use the radio 
button to select the server to use), leaving all values to their default. You should 
notice a difference in execution time. In the Client-Server module, Server #2 is 
able to finish execution more quickly than Server #1, as the latter is connected to 
the client via a low-bandwidth link. Here, using start overhead values of 4 sec and 
7 sec for Server #1 and Server #2 respectively, we observe that Server #1 finishes
execution slightly faster.

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

---
