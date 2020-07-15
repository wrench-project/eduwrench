
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
into physical remote sites (connected via WAN). The figure below shows an example
data service with two data nodes and a file registry, each configured to run on
different machines, but all part of the same local network.

<object class="figure" type="image/svg+xml" data="{{ site.baseurl }}/public/img/cyberinfrastructure/simple_storage.svg">Cyberinfrastructure Setup</object>
<div class="caption">
<strong>Figure 1:</strong> Example of a simple CI data service deployment.
</div>

### Data Replicas


#### Simulating

<div class="ui accordion fluid app-ins">
  <div class="title">
    <i class="dropdown icon"></i>
    (Open simulator here)
  </div>
  <div markdown="0" class="ui segment content sim-frame">
    {% include simulator.html src="storage_service/" %}
  </div>
</div>

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
