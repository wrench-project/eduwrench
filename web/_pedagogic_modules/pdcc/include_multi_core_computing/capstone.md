
#### Learning Objectives:

- Be able to apply (most of) the concepts in this module to a case-study

---

### A Bioinformatics program

Below is the DAG for a program that implements bioinformatics computations that
reads a large database of DNA sequences (2 GB). A first task applies some
simple cleanup process to the sequences. After that, three tasks need to be
executed to compute different similarity metrics between the sequences in the
database. Once all these metrics are obtained, a complicated machine learning
classification process in invoked (Task 5). 

<object class="figure" type="image/svg+xml" data="{{ site.baseurl }}/public/img/multi_core_computing/capstone.svg">Capstone program</object>


We have to run this program on a **2-core** Virtual Machine  (VM),
where each core computes with speed 400  GFlop/sec, and data is read
from storage at bandwidth 100 MB/sec.

This VM is "leased" from some cloud infrastructure that charges 1c for each
minute of usage. As a result, a program that runs in, say,  61 seconds, will be
charged 2c.  Currently, on this VM, the program runs in  81.5 seconds. If
we could run it in under 60 seconds, we could save our organization 1c for
each  program execution.  This doesn't sound like a lot, but this program runs
thousands times each day on hundreds of similar VM instances. So at the end
of the year we would have saved a  substantial amount of money.

### The options

Given a budget your organization has allocated to making the program run
faster, you have the following options at your disposal:

  - **Option #1**: Upgrade your VM so that the storage read bandwidth is
    150 MB/sec. 

  - **Option #2**: Upgrade your VM so that it has 3 cores and 30 GB of RAM. 

  - **Option #3**: Upgrade your VM so that cores compute at 440 GFlop/sec. 

  - **Option #4**: Pay a software developer to
    re-implement Task 5 so that it exposes some data parallelism. This is
    done by replacing the current Task 5 by a 1000  GFlop task followed 
    $n$ independent tasks, each with work 18000/$n$ GFlop.

Each option above costs money, but it is worth it *if it makes the program run in under 60s.*

### The question

**Which of the options above are worth it?**




---
