
#### Learning Objectives:

- Understand the concept of data parallelism
- Understand and be able to apply Amdahl's law

---

#### An Example

In all we've seen so far in this module, we were given a predetermined 
DAG of tasks, each of them executing on a single core. Many real-world
applications  are structured in this way, and  this  is called
**task parallelism**.  Let's consider one such  task,  which performs some
computation. Perhaps this computation
can be *parallelized*. That is, one can rewrite the code of this task
to use multiple cores to do its computation. This is done by writing the task's code
in  a  way  that is multi-threaded (see any concurrent programming textbook/course). 

Consider a transformation of the pixels of an image, for instance, applying
a filter so that  the image resembles an oil-painting.  This is done by
replacing each pixel color by some other color determined by looking at the
surrounding pixels and performing some computation based on the colors of
those pixels.

Consider a program that is a chain of three tasks. A "read" task loads an image file
from disk into RAM (it thus mostly performs I/O). A "write" task saves the
processed image from RAM to disk (it thus also mostly performs I/O). The
"oil" task is the task that does the processing. Let's say that each pixel
of the image is encoded on 1 byte,  and that oil-painting a pixel
requires 2000 Flops. We can draw the DAG of the program as follows:

<object class="figure" type="image/svg+xml" data="{{ site.baseurl }}/public/img/multi_core_computing/example_chain_dag.svg">Example Image Processing Program</object>
<div class="caption"><strong>Figure A.2.4.1:</strong>
Example image processing program.
</div>

Say we run this program on a computer that has a disk with 
read/write bandwidth 400 MB/sec, and with cores that compute
with speed 100 GFLop/sec. Then the program takes time. 


$$
\begin{align}
\text{T} & = \text{read time} + \text{process time} + \text{write time}\\
         & = \frac{100 \text{MB}}{400 \text{MB/sec}}  +
             \frac{100 \times  2000 \text{MFlop}}{100 \text{GFlop/sec}}
             \frac{100 \text{MB}}{400 \text{MB/sec}}\\
         & = 0.25 + 2  + 0.25 = 2.5s
\end{align}
$$

So, for a 100MB input, our program runs in 2.5 s. So far  so good.

### Data-Parallelism

In our example application, the same transformation is applied to each
pixel of the image (with perhaps special cases for the pixels close to the
borders of the image). You can think of the computation applied to each
pixel as a "micro-task". All these micro-tasks take the same amount of
time, and do the same thing (i.e., they run the same code), but on
different data (the different neighboring pixels of different pixels).
This is called **data parallelism**. This is a bit of a strange term
because it's just like *task parallelism*, just with very fine granularity.
What this means in practice is that it should be easy to perform the
computation on, say, 4 cores: just give each core a quarter of the pixels
to process!

More generally, if the total  work of the "oil" task is *X* and  if we have
*n* cores, we  could create *n* tasks each with *X/n*  work and go *n*
times faster! Of course, this breaks down  if *X* is not much  larger than
*n*.  For instance, if we have 7 pixels to process on 3 cores, we cannot
have 3 tasks with the same amount of work. There would be some load
imbalance (e.g., one task would process 3 pixels, and the other two tasks
would process 2 pixels each).  But let's assume that our image has many,
many more pixels than cores.  Then each task would have work equal to or very close
to *X/n*. So, if we configure our application to execute "oil" using  *n*
tasks, our program's DAG now looks like this:

<object class="figure" type="image/svg+xml" data="{{ site.baseurl }}/public/img/multi_core_computing/example_chain_dag.svg">Example Image Processing Program</object>
<div class="caption"><strong>Figure A.2.4.2:</strong>
Example image processing program with data-parallelism exposed.
</div>

So now, our program can run faster using multiple cores! How fast? Well, the
simulation  app below simulates the execution for particular input sizes
and number of "oil" tasks. You can try it on your own, and use it to answer
the practice questions hereafter.

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
We need to compute &alpha;, the  fraction of the sequential execution time
that is parallelizable. For input size *X* MB, the time spent in the "read"
and "write" tasks is  X/400 seconds, while the time spent in the "oil"
computation is *X* * 2000 / 100000  = *X*  /100. Therefore, &alpha; =
(*X*/100) / (*X*/400 + *X*/100) = .8. So, the speedup when running  on *n*
cores, *S(n)*, is:

$
\begin{align}
S(n)   & = \frac{1}{0.8 / n + 1 -  0.8}
       & = \frac{1}{0.8/n + 0.2}
\end{align}
$$

You can double check that this formula matches what we observed in
simulation. In this example, the speedup does not dependent in the input
size, *X*, because the execution time of all three tasks depends linearly
on *X*. Things would be different if the "oil" task had, for instance, an
execution that is quadratic in terms of *X*.  Then the &alpha; parameters
would depend on *X*. But let's not go there for now.

The parallel  efficiency of our program on *n*  cores  is then:

$
\begin{align}
E(n)  & = \frac{1}{0.8 + 0.2\times n}
\end{align}
$$

And so, for instance, if we're wondering the maximum number of cores we  can use
before parallel efficiency drops below 50%, we can simply solve:

$
\begin{align}
.5  = \frac{1}{0.8 + 0.2\times n}
\end{align}
$$

which gives us *n*  = 6. Using 7 (or more) cores will have parallel efficiency below 50%. 


---

#### Questions

Answer the following questions:
