---
layout: default
order: 0
---

## How to run Simulations in these Pedagogic Modules

When going through these pedagogic modules you will be instructed to run a particular simulation tool. This is done via
a Web application and there are two cases:

**Case #1: You have been pointed to a static Web site that hosts the Web application** (for instance by an instructor in a course): just go to that Web site.


**Case #2: You have not been pointed to a static Web site**: In this case, you must run the Web app on your machine and go to a locally-hosted Web site
    
<div class="ui accordion fluid">
<div class="title">
<i class="dropdown icon"></i>
(see instructions for Case #2)
</div>
<div markdown="1" class="ui segment content">

- **Option #1: Run [Docker](https://docker.com) directly on your machine**: 
  1. install Docker:   
    - [Instructions for Linux](https://docs.docker.com/install/linux/docker-ce/ubuntu/)
    - [Instructions for macOS](https://docs.docker.com/docker-for-mac/install/)
    - [Instructions forW indows 10 Pro](https://docs.docker.com/docker-for-windows/install/)
    
  2. In a terminal type `docker pull wrenchproject/wrench-pedagogic-modules:activity-visualization`

  3. Then type `docker container run -p 3000:3000 -d  wrenchproject/wrench-pedagogic-modules:activity-visualization`

  4. Open a Web browser on your machine and navigate to [localhost:3000/](localhost:3000/)
  
  5. When you are finished with the Web application in that same terminal type `docker kill $(docker ps -a -q  --filter ancestor=wrenchproject/wrench-pedagogic-modules:ics332-activity-visualization)`


- **Option #2: Run Docker within a [Vagrant](https://www.vagrantup.com/) Virtual Machine**:   
  1. Install [VirtualBox](https://www.virtualbox.org/)

  2. Install [Vagrant binary](https://www.vagrantup.com/downloads.html)

  3. Download this [Vagrantfile]({{ site.baseurl }}/public/Vagrantfile)

  4. In a terminal, navigate to the same directory where the `Vagrantfile`
from step 3 is located and run the command `vagrant up` (which may take
a few minutes)

  5. Then, in that same directory, type `vagrant ssh`, which will give you a prompt in a terminal

  6. In this terminal type `docker pull wrenchproject/wrench-pedagogic-modules:activity-visualization`

  7. Then type `docker container run -p 3000:3000 -d  wrenchproject/wrench-pedagogic-modules:activity-visualization`

  8. Open a Web browser on your machine and navigate to [localhost:3000/](localhost:3000/)
  
  9. When you are finished with the Web application in that same terminal type `docker kill $(docker ps -a -q  --filter ancestor=wrenchproject/wrench-pedagogic-modules:ics332-activity-visualization)`

</div>
</div>

---

Once you have navigated to the appropriate Web site, then you simply:

  - Sign in using your academic Google e-mail address (e.g., `<UH Username>@hawaii.edu`)

  - Select whatever simulation tool you were instructed to run

---