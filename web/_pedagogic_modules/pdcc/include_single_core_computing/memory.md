
#### Learning Objectives
<div class="learningObjectiveBox" markdown="1">
- Understand the concept of memory (RAM)
- Understand how the amount of available memory limits program executions
</div>
---

### Memory

When a program executes on a computer, it uses some of the computer's
memory (a.k.a., Random Access Memory or RAM) to store its "address space". 
The address space consists of all the bytes of content that the program 
needs to execute (the "code", "data", "stack", "heap", "page table", etc.). 
You can learn about details of the structure of address spaces in 
Operating Systems [textbooks](/textbooks). In these pedagogic modules, we simply 
consider that a program needs some number of bytes of RAM to execute.

When not enough RAM is available (e.g., the program's address space is too
big), the Operating System keeps part of the address space on disk and
shuffles content between RAM and disk as necessary. Albeit fascinating,
this comes with a significant performance hit. Our main focus in these
pedagogic modules is performance, and **we will only consider executing
a program if its entire address space fits in RAM**.  

For instance, consider a single-core computer with 4 GB of RAM. We have
three programs *A*, *B*, and *C*, with address spaces of 1 GB, 2 GB, and 3
GB, respectively.  In this case, we cannot run all three programs at the
same time, because 6 GB is larger than the available RAM. But we can run
program *A* and *C* together as they together require 4 GB of RAM.  Note
that in practice such a "tight" fit may not work because the entire RAM is
not available for user processes. For instance, some RAM is used
to store the Operating System's Kernel (see Operating Systems [textbooks](/textbooks)).

If you have been paying attention you may wonder why we are even talking 
about running programs at the same time since 
in [the previous tab]({{ site.baseurl }}/pedagogic_modules/pdcc/single_core_computing/#/time-sharing)
we said we would almost never do it!  We will find out in the 
[Multicore Computing module]({{ site.baseurl }}/pedagogic_modules/pdcc/multi_core_computing/#/ram-and-io)!

---

#### Suggested activities

**[How much RAM on your computer]** Find out how much RAM you have on your computer in total, and how much RAM is available for running new programs on your computer right now.

**[How much RAM for your browser]** Find out how much RAM your Web browser
is using right now on your computer (this could be a substantial amount).
In these pedagogic modules we often assume that programs use a fixed amount
of memory that is allocated throughout the program's execution. But in
fact, programs' memory needs typically evolve throughout their execution.
To see this in action, in your browser open a few tabs to navigate to
content-heavy Web sites (e.g., news sites, social media sites). How much
more memory does your browser use now?

