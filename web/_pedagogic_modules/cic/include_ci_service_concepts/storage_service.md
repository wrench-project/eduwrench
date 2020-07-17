
#### Learning Objectives

- Understand how data services can be used to store, copy, and access data
- Understand the concept of data replicas and how data services can be used to keep track of them

---

### Data Services

In CI, the most common type of service provided by a data service is permanent, 
reliable, and efficient data storage. In addition to storing data in a remote server, 
data services may also provide a number of different capabilities, e.g. 
support for registering metadata for data description, backups, search mechanisms,
data integrity checks, etc. 

A data service is basically composed of the following elements: storage devices 
(e.g, HDD, SSD, RAM, etc.), a file system, and databases (e.g., for keeping track of
file locations and recording metadata). While a data service can be fully set up into 
a single machine, typical CI deployments follow a distributed approach -- i.e.,
multiple data servers or _data nodes_, dedicated nodes for processing query requests, 
etc.; in which services are part of the same local network (LAN) or are distributed
into physical remote sites (connected via WAN). The figure below shows an example of
a data service with a single data node and a file registry, each configured to run on
different machines, but all part of the same local network.

<object class="figure" type="image/svg+xml" data="{{ site.baseurl }}/public/img/cyberinfrastructure/simple_storage.svg">Cyberinfrastructure Setup</object>
<div class="caption">
<strong>Figure 1:</strong> Example of a simple CI data service deployment.
</div>

In the figure above, the simply fact of storing a file into the data service involves
interaction with two services: the storage service, and the file registry service.
The sequence diagram shown on the right side of Figure 1, depicts the sequence of 
operations and time elapsed to store the file in the storage service, and registering
the file location in the file registry. Note that several overheads are incurred 
in this operation:

1. _Client Disk Overhead_: Time to read the file from the client disk into memory 
   -- defined by the client's disk read bandwidth. 
1. _Transfer Overhead_: Time to transfer the file from the client to the storage 
   service -- defined by the network bandwidth and latency between the client and
   the storage service.
1. _Writing Overhead_: Time to write the file contents to the storage server disk
   -- defined by the storage service's disk write bandwidth.
1. _Registration Overhead_: Time to perform a registration operation in the File
   Registry Service -- defined by the network bandwidth and latency between the 
   Storage Service and File Registry Service, and any overhead to process the 
   registration operation on the File Registry Service.

The steps for retrieving the file from the data service are similar to the above
ones but in the reverse order -- instead of an overhead for registering the file
in the file registry, now the overhead would be to resolve the query for finding the
location(s) of the stored file, and then transmit it through the network.

#### Simulating a Data Service

The simulation app below simulates the execution of the data service scenario 
shown in Figure 1. For this simulation,   

<div class="ui accordion fluid app-ins">
  <div class="title">
    <i class="dropdown icon"></i>
    (Open simulator here)
  </div>
  <div markdown="0" class="ui segment content sim-frame">
    {% include simulator.html src="storage_service/" %}
  </div>
</div>

---

### Data Replicas


#### Simulating


<p>&nbsp;</p>

<div class="ui accordion fluid app-ins">
  <div class="title">
    <i class="dropdown icon"></i>
    (Open simulator here)
  </div>
  <div markdown="0" class="ui segment content sim-frame">
    {% include simulator.html src="storage_service_choose/" %}
  </div>
</div>

<p>&nbsp;</p>

<div class="ui accordion fluid app-ins">
  <div class="title">
    <i class="dropdown icon"></i>
    (Open simulator here)
  </div>
  <div markdown="0" class="ui segment content sim-frame">
    {% include simulator.html src="storage_service_multiple/" %}
  </div>
</div>

---
