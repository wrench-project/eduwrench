
#### Learning objectives:

  - Understand the concepts of *work* and of *compute speed*;

  - Be familiar with Flop as a measure of work and with Flop/sec
    as a measure of compute speed;

  - Understand the simple relationship between program execution time, 
    work, and compute speed.

---


### Measures of Work and Compute Speed

In these pedagogic modules we rarely consider programs that are
interactive, i.e., that react based on real-time user input via the
keyboard or the mouse. A text editor would fall in this category. Instead,
we almost always consider programs that have some amount of computation,
or *work*, to perform and then terminate. An example would be a program
that mines a bitcoin.

The simplest model of performance when executing a non-interactive program
on a core of a computer is to assume that the computer delivers constant
*compute speed*, which is measured by the quantity of work performed per
time unit. For instance, a program with 50 units of work would run in 100
seconds on a core with a speed of 2 units of work per second.
 This last number is called the program's
*execution time*.

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
(assuming all frames take the same compute time). 

Another possibility is to use a more generic measure, for instance, the
number of instructions.  The work of a program would then be measured by
its number of instructions (e.g., the number of assembly instructions the
program performs) and the speed of a core would be in number of
instructions per second. This approach is known to have problems, as
instructions are not all equal, and especially across different families of
processors. Therefore, a processor that delivers fewer instructions per
seconds than another could actually be prefered for running some program.


### Flop and Flop/sec

It turns out that the question of modeling/predicting how fast a particular
program will run on a particular core based on a single measure of work and
speed is fraught with peril (the only way to be sure if to actually run the
program!). 

Nevertheless, in these pedagogic modules, unless specified
otherwise, we use a simple measure of work: the number of floating-point
operations, or **Flop**, that the program performs.  We thus measure the
speed of a core in Flop/sec, which is commonly used in the field of
high-performance scientific computing.

Like any single measure of work, the Flop count is imperfect (e.g.,
programs do non-floating-point computations, floating-point operations are
not all the same).  Fortunately, all the concepts we learn in these
pedagogic modules are agnostic to the way in which we measure work. And so
we just pick Flop counts to be consistent throughout.


Say a program that performs 100 TFlop ("100 TeraFlop") is executed 
on a core with speed 35 GFlop/sec ("35 GigaFlop per second"). The
program's execution time would then be:

$$
\begin{align}
 \text{execution time} & = \frac{100 \times 10^{12}\; \text{Flop}}{25 \times 10^{9}\; \text{Flop/sec}}\\
   & \simeq 2,857.14\; \text{sec}
\end{align}
$$  

If a program that performs 12 GFlop runs in 5 seconds on a core, then the speed of this core in MFlop/sec ("MegaFlop per second") is:

$$
\begin{align}
 \text{speed} & = \frac{12 \times 10^{9}\; \text{Flop}}{5 \; \text{sec}} \times \frac{1}{10^{6}}\\
       & = 2,400 \; \text{MFlop/sec}
\end{align}
$$  


---

#### Practice Questions

To make sure the above is crystal clear (and that you know your units!), try to answer the following questions:

**[A.p1.1]** You have to run a program that performs 4000 GFlop, and your
core computes at speed 30 TFlop/sec. How long will the program run for in seconds?

<div class="ui accordion fluid">
  <div class="title">
    <i class="dropdown icon"></i>
    (click to see answer)
  </div>
  <div markdown="1" class="ui segment content">
   $$ \frac{4 \;\text{TFlop}}{30\; \text{TFlop/sec}} \simeq 0.13\; \text{sec}   $$
  </div>
</div>

<p> </p>

**[A.p1.2]** A program just ran in 1640 sec on a core with speed 2 TFlop/sec, 
how many MFlop does the program perform?
<div class="ui accordion fluid">
  <div class=" title">
    <i class="dropdown icon"></i>
    (click to see answer)
  </div>
  <div markdown="1" class="ui segment content">
   $$ \frac{2000000\; \text{MFlop/sec}}{1640\; \text{sec}} \simeq 1219.5 \;\text{MFlop} $$
  </div>
</div>

---

#### Questions


**[A.q1.1]** You have to run a program that performs 2000 TFlop, and your
core computes at speed 450 GFlop/sec. How long will the program run for in minutes?

**[A.q1.2]** A program that performs 3000 GFlop just ran in 1.5 minutes on a core. What is the
core speed in TFlop/sec? 

**[A.q1.3]** On a given core, a program just ran in 14 seconds. By what factor should the core speed
increased if I want the program to run in 10 seconds?









