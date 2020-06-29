
#### Learning Objectives

- Understand the principles of cyberinfrastructure services

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
data and launch computing tasks; a _storage service_, where data is stored
permanently; a _file registry service_, a catalog that acts as a
bookkeeper for data location; and a _compute service_, which executes computing
tasks.    

<object class="figure" type="image/svg+xml" data="{{ site.baseurl }}/public/img/cyberinfrastructure/basics.svg">Cyberinfrastructure Setup</object>
<div class="caption">
<strong>Figure 1: Example of a cyberinfrastructure with a website, a storage service, a file registry service, and a compute service</strong>.
</div>
