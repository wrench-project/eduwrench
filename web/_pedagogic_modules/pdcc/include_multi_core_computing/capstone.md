
#### Learning Objectives
<div class="learningObjectiveBox" markdown="1">
- Be able to apply (most of) the concepts in this module to a case-study
</div>

---

### A Bioinformatics program

Below is the DAG for a program that implements bioinformatics computations on a
large database of DNA sequences. A first task applies some
simple cleanup process to the sequences. After that, three tasks need to be
executed to compute different similarity metrics between the sequences in the
database. Once all these metrics are obtained, a complicated machine learning
classification process is applied to the metrics (Task 5). The work and RAM footprint of
each task is shown in the figure below.

<object class="figure" type="image/svg+xml" data="{{ site.baseurl }}/public/img/multi_core_computing/capstone.svg">Capstone program</object>
<p></p>


We have to run this program on a **2-core** Virtual Machine (VM) with 20
GB of RAM, where each core computes with speed 400 Gflop/sec, and data is
read from storage at bandwidth 100 MB/sec.

#### Questions

**[A.2.q6.1]** What is the execution time of this program on this VM?

---

### Saving money?

You've found that the execution time is longer than 1 minute. If not, 
re-check your work for Question #1!

This VM is "leased" from some cloud infrastructure that charges 1c for each
minute of usage. As a result, a program that runs in, say, 61 seconds,
will be charged 2c. If we could run it in under 60 seconds, we could save
your organization 1c for each program execution. This does not sound like a
lot, but this program runs thousands times each day on hundreds of similar
VM instances. So at the end of the year you could have saved a substantial
amount of money.

Given a budget your organization has allocated to making the program run
faster, you have the following options at your disposal:

  - **Option #1**: Upgrade your VM so that the storage read bandwidth is
    150 MB/sec. 

  - **Option #2**: Upgrade your VM so that it has 3 cores and 30 GB of RAM. 

  - **Option #3**: Upgrade your VM so that cores compute at 440 Gflop/sec. 

  - **Option #4**: Pay a software developer to
    re-implement Task 5 so that it exposes some data parallelism. This is
    done by replacing the current Task 5 by a 1000  Gflop task followed by
    $n$ independent tasks, each with work 9000/$n$ Gflop.

Each option above costs money, and you can afford only one of them. But the money spent is
worth it *if it makes the program run in under 60s.*

#### Questions

**[A.2.q6.2]** Which of the options above are worth it?

---
