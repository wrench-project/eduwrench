# Derrick Luyen's M.S. Plan B


### 1. Project Context: The WRENCH project

[http://wrench-project.org](http://wrench-project.org)

  - Project leads:
    - UHM: Henri Casanova
    - USC: Rafael Ferreira da Silva

  - Two main WRENCH artifacts:
    - The WRENCH Simulation framework itself [https://github.com/wrench-project/wrench](https://github.com/wrench-project/wrench)
    - The EduWRENCH Pedagogic site [http://eduwrench.org](http://eduwrench.org)

### 2. Project Objective: Contribute a pedagogic module to EduWRENCH


The current EduWRENCH modules target "basic" knowledge, but we need to add more "case-study" modules:

  - Give a real-world application
  - Give a real-world platform scenario
  - Go through real and interesting design/deployment/decision scenarios
  - Don't teach/define anything new

Developing a module entails developing:

  1. A C++ WRENCH simulator
    - Implemented using WRENCH 
  2. A simulator front-end
    - Implemented using Gatsby/React
  3. A pedagogic narrative supported by the simulator and its front-end
    

### 3. Project Roadmap:

  - **Phase #1:** Learn about what WRENCH is and can do
    - Go through the WRENCH paper, and come back with questions
      - https://rafaelsilva.com/files/publications/casanova2020fgcs.pdf
    - Go through the WRENCH documentation
      - Overview
        - WRENCH 101
        - WRENCH 102
    - Go through the example code in wrench/examples/basic-examples
      - Come back with any questions

  - **Phase #2:** Decide what simulator to implement (i.e., what should the simulator simulate?)
    - Possibilities are being outlined in the Wiki on the EduWRENCH GitHub
      - [https://github.com/wrench-project/eduwrench/wiki/Thrust-D%3A-Case-Studies](https://github.com/wrench-project/eduwrench/wiki/Thrust-D%3A-Case-Studies)

  - **Phase #3:** Develop the simulator in a separate repo in the WRENCH GitHub organization
    - Go through the "Installation" and "Getting Started" parts of the WRENCH Documentation

  - **Phase #4:** Create an EduWRENCH front-end for the simulator and integrate the simulator in EduWRENCH
    - Using the same mechanisms as in the EduWRENCH source for other simulator front-end, which will be finalized sometimes in Spring 2021

  - **Phase #5:** Develop and publish a narrative around the simulator
    - This is a surprisingly difficult part of it, but this is something that Rafael and I will be doing mostly with input from Derrick, but perhaps Derrick will have amazing ideas!

  - **Phase #6:** Write-up a 5-pager about the work that has been done and submit to Henri for graduation



