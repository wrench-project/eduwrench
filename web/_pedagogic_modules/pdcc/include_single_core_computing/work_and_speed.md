
#### Learning Objectives
<div class="learningObjectiveBox" markdown="1">
- Understand the concepts of *work* and of *compute speed*
- Be familiar with Flop as a measure of work and with Flop/sec
  as a measure of compute speed
- Understand the simple relationship between program execution time, 
  work, and compute speed
</div>
---

### Measures of Work and Compute Speed

In these pedagogic modules we rarely consider programs that are
interactive, i.e., that react based on real-time user input via the
keyboard or the mouse. A text editor would fall in this category. Instead,
we almost always consider programs that have some amount of computation,
or **work**, to perform and then terminate. An example would be a program
that mines a cryptocurrency.

The simplest model of performance when executing a non-interactive program
on a core of a computer is to assume that the computer delivers constant
*compute speed*, which is measured by the quantity of work performed per
time unit. For instance, a program with 100 units of work would run in 50
seconds on a core with a speed of 2 units of work per second.
This last number is called the program's **execution time**.

Generalizing the above example, for a given amount of work to
perform there is a linear relationship between the program's execution
time and the speed of the core on which it is executed:

$$
\begin{align}
\text{execution time} & = \frac{\text{work}}{\text{compute speed}}\;.
\end{align}     
$$

There are many options for choosing an appropriate way to quantify work.
One possibility is to use a measure that is specific to what the program
does. For instance, if the program renders movie frames, a good measure of
work would be the number of frames to render.  One would then want to measure a
core's speed in terms of the number of frames that can be rendered per second
(assuming all frames require the same amount of computation). 

Another possibility is to use a more generic measure, for instance, the
number of instructions.  The work of a program would then be measured by
its number of instructions (e.g., the number of hardware instructions the
program performs) and the speed of a core would be in number of
instructions per second. This approach is known to have problems, as
instructions are not all equal, and especially across different families of
processors. Therefore, a processor that delivers fewer instructions per
seconds than another could actually be preferred for running some program.

### Flop and Flop/sec

It turns out that the question of defining a universal unit of work is not
possible, but we haver have to pick a consistent measure in these pedagogic
modules. One option would be Million of Instructions, and thus the
well-known MIPS (Million Instructions Per Second) measure of compute speed.
A problem with this metric is that instructions (i.e., hardware instructions)
are different across microprocessor families, thus leading to
apples-to-oranges comparisons. Another metric, which is more related to
what is being computed is the number of floating-point operations, or
**Flop**, to perform (making the implicit assumptions that the programs we
consider mostly perform floating point computations). This is the metric
that we use in these pedagogic modules, unless specified otherwise.  We
thus measure the speed of a core in Flop/sec, which is commonly used in the
field of high-performance scientific computing.

Like any single measure of work, the Flop count is imperfect (e.g.,
programs do non-floating-point computations, floating-point operations are
not all the same).  Fortunately, all the concepts we learn in these
pedagogic modules are agnostic to the way in which we measure work. And so
we just pick Flop counts to be consistent throughout.

Say a program that performs 100 Tflop ("100 TeraFlop") is executed 
on a core with speed 35 Gflop/sec ("35 GigaFlop per second"). The
program's execution time would then be:

$$
\begin{align}
 \text{execution time} & = \frac{100 \times 10^{12}\; \text{Flop}}{35 \times 10^{9}\; \text{Flop/sec}}\\
   & \simeq 2,857.14\; \text{sec}
\end{align}
$$  

If a program that performs 12 Gflop runs in 5 seconds on a core, then the 
speed of this core in Mflop/sec ("MegaFlop per second") is:

$$
\begin{align}
 \text{speed} & = \frac{12 \times 10^{9}\; \text{Flop}}{5 \; \text{sec}} \times \frac{1}{10^{6}}\\
       & = 2,400 \; \text{Mflop/sec}
\end{align}
$$  

Make sure you know your units:
    - K(ilo): $10^3$
    - M(ega): $10^6$
    - G(iga): $10^9$
    - T(era): $10^12$
    - P(eta): $10^15$
    - E(exa): $10^18$

---

#### Practice Questions


**[A.1.p1.1]** You have to run a program that performs 4000 Gflop, and your
core computes at speed 30 Tflop/sec. How long will the program run for in seconds?

<div class="ui accordion fluid">
  <div class="title">
    <i class="dropdown icon"></i>
    (click to see answer)
  </div>
  <div markdown="1" class="ui segment content">
   $$ \frac{4 \;\text{Tflop}}{30\; \text{Tflop/sec}} \simeq 0.13\; \text{sec} $$
  </div>
</div>

<p> </p>

**[A.1.p1.2]** A program just ran in 0.32 sec on a core with speed 2 Tflop/sec, 
how many Gflop does the program perform?

<div class="ui accordion fluid">
  <div class=" title">
    <i class="dropdown icon"></i>
    (click to see answer)
  </div>
  <div markdown="1" class="ui segment content">
   $$ 2000\; \text{Gflop/sec} \times 0.32\; \text{sec} = 640 \;\text{Gflop} $$
  </div>
</div>

---

#### Questions

**[A.1.q1.1]** You have to run a program that performs 2000 Tflop, and your
core computes at speed 450 Gflop/sec. How long will the program run for in minutes?

**[A.1.q1.2]** A program that performs 3000 Gflop just ran in 1.5 minutes on a core. 
What is the core speed in Tflop/sec? 

**[A.1.q1.3]** On a given core, a program just ran in 14 seconds. By what factor 
should the core speed be increased if you want the program to run in 10 seconds?

---
#### Suggested activities

**[Benchmarking  #1]**: Find on-line resources that provide benchmark results for currently available cores. What is the fastest currently available core in terms of floating point benchmarked performance?  Are there other kinds of benchmarks? 

**[Benchmarking #2]**: Determine the compute speed of a core of your computer by searching for, downloading, and running a freely available floating point benchmark program.

**[Programming]**: Implements a program that performs a large, but known,
number of floating point operations and use it to perform your own
benchmarking of your machine. Implement this program in different
languages and observe whether the Gflop/sec measurement varies across
languages.
