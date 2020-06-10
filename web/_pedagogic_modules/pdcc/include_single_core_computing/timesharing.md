
#### Learning Objectives

- Understand the concept of time sharing
- Understand how time sharing impacts program execution times

---

### Time Sharing

As you know, you can execute multiple programs at once on your computer
(e.g., your Web browser and a text editor). This is called
multi-programming, something that Operating Systems have known how to 
do since the 1960's.  

Consider multiple (non-interactive) programs that run **on a single core**.
In this case, the Operating System makes it so that the programs alternate
on the core: a program runs for a while, then another, then another, and so
on until we cycle back and repeat. This is called **time sharing**. The
process of going from one running program to another is called **context
switching**. How this is done is one of the core topics of all Operating 
System textbooks.

In these pedagogic modules we take a very high-level, ideal view: When
running *n* programs at the same time on one core, each of them 
proceeds at *1/n*-th of the core's compute speed.  

For instance, if at time
0 I start two programs, each with work 5 Gflop on a single core with speed
1 Gflop/sec, both programs would complete at time 10.  Say now that the
second program has work of 10 Gflop. Then the first program will complete
at time 10, and the second program at time 15. During the first 10 seconds,
both program proceed at speed 0.5 Gflop/sec. At time 10 the first program
thus completes (because it has performed all its work), at which point the
second program proceeds at full 1 Gflop/sec speed. Since the second program
still has 5 units of work to complete, it runs for another 5 seconds and 
completes at time 15. 

In practice, the programs in the above examples would complete later! This
is because in real systems the context switching overhead is non-zero and
because the programs would most likely compete for memory and caches (see 
Computer Architecture and Operating Systems textbooks for all details). 
But the above ideal model will be sufficient for our purposes. 

In fact, we will almost always avoid time sharing altogether by never running two 
programs on a single core. 
However, the reasoning needed to compute
how time sharing would impact program execution times is important and 
applicable to other learning objectives (e.g., networking). This is why we
include below some questions on this topic.

---

#### Practice Questions


**[A.1.p2.1]** At time 0 on a core with speed 2 Tflop/sec you start two 
programs. Program *A*'s work is 200 Gflop, and program *B*'s work is 220 
Gflop. At what times do the programs complete?

<div class="ui accordion fluid">
  <div class="title">
    <i class="dropdown icon"></i>
    (click to see answer)
  </div>
  <div markdown="1" class="ui segment content">

   In a first phase, both programs proceed at speed 1 TFLop/sec. Program 
   *A* completes first at time:
   <br/>

   $$T_{A} = \frac{0.2 \text{Tflop}}{1\; \text{Tflop/sec}} = 0.2\; \text{sec}$$
   <br/><br/>
   At that point, program $B$ still has 20 Gflop left to compute, but it now 
   proceeds at speed 2 Tflop/sec. Therefore, it completes at time:
   <br/>

   $$ T_{B} = T_{A} + \frac{0.02 \text{Tflop}}{2\; \text{Tflop/sec}} = 0.21 \; \text{sec} $$

  </div>
</div>

<p> </p>

**[A.1.p2.2]** Two programs, each with work 800 Tflop, were started at the 
same time on a core and both completed simultaneously after one hour. What is 
the core's speed in Gflop/sec?

<div class="ui accordion fluid">
  <div class=" title">
    <i class="dropdown icon"></i>
    (click to see answer)
  </div>
  <div markdown="1" class="ui segment content">   
   $$ \text{speed} = 2 \times \frac{800000\; \text{Gflop}}{ 3600\; \text{sec}} \simeq 444.44 \;\text{Gflop/sec} $$
  </div>
</div>

---

#### Questions

**[A.1.q2.1]** Two programs are started at the same time on a core. These 
programs both have work 1 Tflop, and both complete after 220 seconds. What 
was the core speed in Gflop/sec?

**[A.1.q2.2]** Three programs, A, B, and C, were started at the same time on 
a core with speed 600 GFLop/sec. After 10 seconds, A and C complete. Then, 
2 seconds later, program B completes. What is the work (in Gflop) of each of 
the three programs?

**[A.1.q2.3]** A program, A, with work 4 Tflop is started on a core of speed 
500 Gflop/sec. 5 seconds later another program B, is started. Both programs 
finish at the same time. What is the work of B in Tflop?

---
