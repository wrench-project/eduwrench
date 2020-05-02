
#### Learning Objectives:

- Understand the concept of data parallelism
- Understand and be able to apply Amdahl's law

---

#### An Example

In all we've seen so far in this module, we were given a predetermined DAG
of tasks, each of them executing on a single core. Many real-world
applications  are structured in this way, and  this  is called **task
parallelism**.  Let's consider one such  task,  which performs some
computation. Perhaps this computation can be *parallelized*. That is, one
can rewrite the code of this task to use multiple cores to do its
computation. This is done by writing the task's code so that that code uses
multiple threads (see any concurrent programming textbook/course).

Consider a transformation of the pixels of an image that makes the image
resemble an oil-painting.  This can be done by update each pixel's color by
some other color based on the color of neighboring pixels.  The
oil-painting transformation has a parameter called the *radius*, which is
the radius of the brush stroke. The larger the radius, the more neighboring
pixels are used to update the color or a pixel, and  the more work is
required. In fact, the amount  of work is *quadratic* in the radius,
meaning that in depends  on the square of the radius.  This is how
oil-painting "filters" work in many open-source and commercial image
processing applications.

Consider now a program that is a sequence of two tasks: An "oil" task
applies an oil-painting filter to an image with a given radius *r*,
followed by a "luminence" task that computes the a luminence histogram for
the image (i.e., the statistical distribution of the brightness of its
pixels). We can draw the program's DAG as follows:

<object class="figure" type="image/svg+xml" data="{{ site.baseurl }}/public/img/multi_core_computing/example_data_parallelism_dag.svg">Example Image Processing Program</object>
<div class="caption"><strong>Figure A.2.4.1:</strong>
Example image processing program.
</div>

If we were to run this program on a core that computes at
speed 100 GFLop/sec, and using *r=3* for the "oil" task, the program would take time:

$$
\begin{align}
\text{T} & = \frac{ 100 \times 3^{2} GFlop}{100  GFlop/sec} +  \frac{100 GFlop}{100 GFlop/sec}\\
         & = 10 sec
\end{align}
$$

### Data-Parallelism

In the oil-painting transformation the same computation is used for each
pixel of the image (with perhaps special cases for the pixels close to the
borders of the image). You can think of the computation applied to each
pixel as a "micro-task". All these micro-tasks has the same work and do the
same thing (i.e., they run the same code), but on different data (the
different neighboring pixels of different pixels).  This is called **data
parallelism**. It is a bit of a strange term because it's just like *task
parallelism*, just with very fine granularity.  Regardless, it should be
straightforward to perform the transform on, say, 4 cores: just give each
core a quarter of the pixels to process!

More generally, if the total work of the "oil" task is *X* and  if we have
*n* cores, we could perform the  work using *n* tasks each with *X/n* work.
This assumes *X* is divisible by *n*. This is likely not quite the case,
but a close approximation if the number of pixels is much  larger than the
number of  cores, which will assume here.

The program's DAG now is now as follows:

<object class="figure" type="image/svg+xml" data="{{ site.baseurl }}/public/img/multi_core_computing/example_data_parallelism_exposed_dag.svg">Example Image Processing Program</object>
<div class="caption"><strong>Figure A.2.4.2:</strong>
Example image processing program with data-parallelism exposed.
</div>

The program can run faster using multiple cores! How fast? The simulation
app below simulates the execution for particular values of the radius *r*
and a number of cores (using one "oil" task per core).  You can try it on
your own, and use it to answer the practice questions hereafter.

<div class="ui accordion fluid app-ins">
  <div class="title">
    <i class="dropdown icon"></i>
    (Open simulator here)
  </div>
  <div markdown="0" class="ui segment content">
    {% include simulator.html src="multi_core_data_parallelism/" %}
  </div>
</div>

#### Practice Questions

**[A.2.p4.1]** XXX

<object class="figure" type="image/svg+xml" data="{{ site.baseurl }}/public/img/multi_core_computing/practice_dag_1.svg">Practice Question DAG</object>

<div class="ui accordion fluid">
  <div class="title">
    <i class="dropdown icon"></i>
    (click to see answer)
  </div>
  <div markdown="1" class="ui segment content">

XXX
 
  </div>
</div>

<p></p>


### Amdahl's law

The simulation and practice questions above highlight a simple phenomenon
known as **Amdahl's law**. This law says that the overall parallel speedup
that a program that has a sequential and a parallel part is limited by the
amount of time spent in the sequential part of a program. This is very intuitive,
since in the extreme a program is purely sequential and the parallel speedup is always
1 regardless of the number of cores. But the (to some) surprising thing is how
sever the limit is. Let's derive Amdahl's law int he abstract,  and then apply is
to our example oil painting program. 

Consider a program that runs on 1 core in time *T*. This program consists of two
main phases, one that is inherently sequential and one that can be parallelized. Let
*&alpha;* be the fraction of the execution time spent in the parallelizable phase. We can
thus write the execution time on 1 core, *T(1)*, as:

$$
\begin{align}
T(1) & = \alpha T + (1  - \alpha) T\\
\end{align}
$$

Now,  if we run the program on *n* cores, assuming perfect  parallelization of the parallelizable
phase, we obtain  the  execution  time on  *n*  cores, *T(n)*, as:

$$
\begin{align}
T(n) & = \alpha T / n + (1  - \alpha) T\\
\end{align}
$$

The parallel speedup on *n* cores, *S(n)*, is then:

$$
\begin{align}
S(n) & = \frac{\alpha T + (1  - \alpha) T}{\alpha T / n + (1  - \alpha) T}\\
     & = \frac{1}{ \alpha/n + 1 -  \alpha}
\end{align}
$$

As *n*, the number  of cores, grows, *S(n)* increases (as expected). Amdahl's law  is
the observation that no matter how large *n* gets, the speedup is limited:

$$
\begin{align}
S(n) < \frac{1}{1 - \alpha}
\end{align}
$$

So, for instance, if 90% of the sequential execution time can be
parallelized,  then  the speedup will be at most  1/(1-0.9)  = 10.
Precisely, if running on 8 cores for instance, the speedup would be
1/(0.9/8 + 1 - 0.9) = 4.7. Meaning that the parallel efficiency is below
60%.  The "non-intuitiveness" of Amdahl's law, for some people, is that
having 10% of the execution sequential does  not seem  like a lot, but
seeing only a 4.7 speedup with 8 cores seems really bad.
The graph below shows speedup vs. number of cores  for different
values of *&alpha;*. 

<object class="figure" type="image/svg+xml" data="{{ site.baseurl }}/public/img/multi_core_computing/example_chain_dag.svg">Example Image Processing Program</object>
<div class="caption"><strong>Figure A.2.4.2:</strong>
Speedup vs. #cores for different values of the fraction of the sequential execution time that's parallelizable.
</div>


The graph above shows that even with seemingly very small non-parallelizable portions,
program speedup drops  well below the number of cores quickly. This is bad news since almost
every useful program has inherently sequential phases. In our example program these phases
are I/O phases, but there  are other.  For  instance,  time  spent  to create threads, or time
spent in critical sections. We refer you to  operating systems and concurrent programming
textbooks/courses for all details. Bottom line: achieving high speedup on many cores 
is not easy. The ability to do so for a program is often called *parallel scalability* (i.e., one
says that the program "scales").

#### Practice Questions

**[A.2.p4.X]** XXX

<object class="figure" type="image/svg+xml" data="{{ site.baseurl }}/public/img/multi_core_computing/practice_dag_1.svg">Practice Question DAG</object>

<div class="ui accordion fluid">
  <div class="title">
    <i class="dropdown icon"></i>
    (click to see answer)
  </div>
  <div markdown="1" class="ui segment content">

XXX
 
  </div>
</div>

<p></p>


### Back to the example program

For our example program, we can of course compute the speedup analytically.
We need to compute *&alpha;*, the fraction of the sequential execution time
that is parallelizable. Still for  our 100 GFlop/sec core, for a given a
radius *r* the time spent in the "oil" task is *r^2* seconds. The time spent
in the "luminence" task is 1 second.
Therefore, *&alpha; = (r^2) / (1 + r^2)*. So, the speedup when running on *n*
cores  with radius *r*, *S(n,r)*, is:

$
\begin{align}
S(n,r)   & = \frac{1}{r^2/(1+r^2) / n + 1 -  r^2/(1+r^2)}
\end{align}
$$

You can double-check that this formula matches what we observed in
simulation. For instance, for *r=2*, *&alpha; = 4/5*. And so
the speedup using 4 cores  would be:

$
\begin{align}
S(n,r)   & = \frac{1}{(4/5)/ 4 + 1 - 4/5 }\\
         & =  2.5
\end{align}
$$

We could then ask  questions like: what is the  largest number of cores
that can be used without  the efficiency dropping below 50%?  We just
need to solve:

$$
\begin{align}
\frac{1}{((4/5)/ n + 1 - 4/5)\times n} \geq .50 \\
\end{align}
$$

which gives us *n &le; 5*. So as soon as we use 6 cores or more, parallel efficiency
drops below 50%, meaning that we are "wasting" half the compute power of our computer. 


---

#### Questions

Answer the following questions:
