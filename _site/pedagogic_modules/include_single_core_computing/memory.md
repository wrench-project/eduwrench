
#### Learning objectives:

  - Understand the concept of Memory (RAM)

  - Understand how the amount of available Memory limits program executions

---


### Memory

When a program executes on a computer, it uses some of the computer's
memory (a.k.a., Random Access Memory or RAM) to store its "address space". The
address space consists of all the bytes of content that the program needs
to execute (the "code", "data", "stack", "heap", "page table", etc.). You
can learn about details of the structure of address spaces 
in Operating Systems textbooks. In these pedagogic modules
we simply consider that a program needs some number of bytes of RAM to
execute.

When not enough RAM is available (e.g., the program's address space is too
big), the Operating System keeps part of the address space on disk and
shuffles content between RAM and disk as necessary. Albeit fascinating,
this comes with a significant performance hit. Our main focus in these
pedagogic modules is performance, and *we will only consider executing
a program if its entire address space fits in RAM*.  

For instance, consider a single-core computer with 4 GB of RAM. We have
three programs *A*, *B*, and *C*, with address spaces of 1 GB, 2 GB, and 3
GB, respectively.  In this case, we cannot run all three programs at the
same time, because 6 GB is larger than the available RAM. But we can run
program *A* and *C* together as they only require 3 GB of RAM. 

If you've been paying attention you may wonder why we're even talking about
running programs at the same time since in the previous tab ("Time
Sharing") we said we would almost never do it!  To find out, proceed to the
[Multicore Computing]({{ site.baseurl}}/pedagogic_modules/multi_core_computing) module!


