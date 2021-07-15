import React from "react"
import { Divider, Header } from "semantic-ui-react"
import TeX from "@matejmazur/react-katex"
import LearningObjectives from "../../../components/learning_objectives"
import SimulationActivity from "../../../components/simulation_activity"
import DataParallelismSimulation from "./data_parallelism_simulation"
import PracticeQuestions from "../../../components/practice_questions"

import ExampleDataParallelismDAG from "../../../images/svgs/multicore_example_data_parallelism_dag.svg"
import ExampleDataParallelismExposedDAG from "../../../images/svgs/multicore_example_data_parallelism_exposed_dag.svg"
import Amdahl from "../../../images/svgs/multicore_amdahl.svg"

const DataParallelism = () => {
  return (
    <>
      <LearningObjectives objectives={[
        "Understand the concept of data-parallelism",
        "Understand and be able to apply Amdahl's law",
        "Understand and be able to reason about the performance of data-parallel programs"
      ]} />

      <h2>Motivation</h2>

      <p>
        In all we have seen so far in this module, a parallel program consists of a predetermined set of tasks, each of
        them executing on a single core. Many real-world programs are structured in this way, and this is
        called <strong>task parallelism</strong>.
      </p>

      <p>
        Let’s now consider one task, which performs some computation on a single core. Perhaps, one can rewrite the code
        of this task to use multiple cores to accelerate its computation. This is done by writing the task’s code so
        that it uses multiple threads (see Operating Systems <a href="/textbooks">textbooks</a>). In other terms,
        perhaps the task’s computation itself can be <strong>parallelized</strong>.
      </p>

      <h2>An Example</h2>

      <p>
        Consider a transformation of the pixels of an image that makes the image resemble an oil-painting. This can be
        done by updating each pixel’s color by some other color based on the color of neighboring pixels. The
        oil-painting transformation has a parameter called the <i>radius</i>, which is the radius of the brush stroke.
        The larger the radius, the more neighboring pixels are used to update the color or a pixel, and the more work is
        required. In fact, the amount of work is <i>quadratic</i> in the radius, meaning that it grows with the square
        of the radius. This is how "oil-painting filters" work in many open-source and commercial image processing
        programs.
      </p>

      <p>
        Consider now a program that is a sequence of two tasks: An "oil" task applies an oil-painting filter to an image
        with a given radius <TeX math="r" />, followed by a "luminence" task that computes the luminence histogram for
        the image, i.e., the statistical distribution of the brightness of its pixels. We can draw the program’s DAG as
        follows:
      </p>

      <ExampleDataParallelismDAG />
      <div className="caption"><strong>Figure 1:</strong> Example image processing program.</div>

      <p>
        If we were to run this program on a core that computes at speed 100 Gflop/sec, and using <TeX math="r=3" /> for
        the "oil" task, the program would take time:
      </p>

      <TeX math="\text{T} = \frac{100 \times 3^{2} \text{Gflop}}{100 \text{Gflop/sec}} + \frac{100 \text{Gflop}}{100 \text{Gflop/sec}}
         = 10\text{sec}" block />

      <h2>Data-Parallelism</h2>

      <p>
        In the oil-painting transformation the same computation is used for each pixel of the image (with perhaps
        special cases for the pixels close to the borders of the image). You can think of the computation applied to
        each pixel as a "micro-task". All these micro-tasks have the same work and do the same thing (i.e., they run the
        same code), but on different data (the neighboring pixels of different pixels). This is called <strong>data
        parallelism</strong>. It is a bit of a strange term because it is just like <i>task parallelism</i>, but with
        very fine granularity. Regardless, it should be straightforward to perform the transform on, say, 4 cores: just
        give each core a quarter of the pixels to process!
      </p>

      <p>
        A simple general model is: if the total work of the "oil" task is <TeX math="X" /> and if we have <TeX
        math="n" /> cores, we could perform the work using <TeX math="n" /> tasks each with <TeX math="X/n" /> work.
        This assumes <TeX math="X" /> is divisible by <TeX math="n" />. This is likely not quite the case in practice,
        but a very good approximation if the number of pixels is much larger than the number of cores, which we will
        assume here.
      </p>

      <Header as="h3" block>
        Simulating Data-Parallelism
      </Header>

      <p>
        After exposing data-parallelism in our example program, i.e., by rewriting the code of the "oil" task, the
        program’s DAG is as follows:
      </p>

      <ExampleDataParallelismExposedDAG />
      <div className="caption"><strong>Figure 2:</strong> Example image processing program with data-parallelism
        exposed.
      </div>

      <p>
        The program can run faster using multiple cores! How fast? The simulation app below simulates the execution for
        particular values of the radius <TeX math="r" /> and a number of cores (using one "oil" task per core). You can
        use the simulation to explore data-parallelism on your own, but also to answer some of the practice questions
        below.
      </p>

      <SimulationActivity key="data-parallelism" content={<DataParallelismSimulation />} />

      <Divider />

      <PracticeQuestions questions={[
        {
          key: "A.2.p5.1",
          question: (
            <>
              Analytically estimate the execution time of the oil-painting program with radius <TeX math="r=3" /> when
              it runs on 6 cores. Show your work, then check your results with the simulation app.
            </>
          ),
          content: (
            <>
              The execution time on 6 cores is:
              <TeX math="T(6) = \frac{100 \times 3^2 / 6}{100} + \frac{100}{100} =  2.50 \text{sec}" block />
            </>
          )
        },
        {
          key: "A.2.p5.2",
          question: (
            <>
              Which execution has the best parallel efficiency: A) <TeX math="r=2" /> on 6 cores; or B) <TeX
              math="r=3" /> on 8 cores? Try to formulate an intuitive answer. Then check your intuition using analytics
              and/or the simulation. Show your work and reasoning.
            </>
          ),
          content: (
            <>
              <p>
                Intuitively, when going from execution A to execution B the total work grows roughly by a factor 9/4
                while the number of cores grows by a much smaller factor 8/6. So execution B should be more efficient.
              </p>
              <p>The execution times for execution A on 1 and 6 cores are:</p>
              <TeX math="T_A(1) = \frac{100 \times 2^2}{100} + \frac{100}{100} = 5 \text{sec}" block />
              <TeX math="T_A(6) = \frac{100 \times 2^2 / 6}{100} + \frac{100}{100} = 1.66 \text{sec}" block />
              <p>
                You can confirm the above numbers with the simulation. The parallel efficiency
                is <TeX math="E_A = (5.0/1.66)/6 = 50.20\%" />
              </p>
              <p>
                Similarly for execution B on 1 and 8 cores: <TeX
                math="T_B(1) = \frac{100 \times 3^2}{100} + \frac{100}{100} = 10 \text{sec}" />
              </p>
              <TeX math="T_B(8) = \frac{100 \times 3^2 / 8}{100} + \frac{100}{100} = 2.125 \text{sec}" block />
              <p>
                You can confirm the above numbers with the simulation. The parallel efficiency is <TeX
                math="E_B = (10/2.125)/8 = 58.82\%" />. Our intuition is confirmed! Execution B has better efficiency!
              </p>
            </>
          )
        },
        {
          key: "A.2.p5.3",
          question: "A program consists of two tasks that run in sequence. The first runs in 10s and the second " +
            "in 20 seconds, on one core of a 4-core computer. A developer has an idea to expose data-parallelism " +
            "in the second task and rewrites it so that it is replaced by 4 independent tasks each with 1/4-th of " +
            "the original task’s work. What is the parallel efficiency on 4 cores? Show your work.",
          content: (
            <>
              When running on 4 cores, the program runs in 10 + 20/4 = 15 seconds. So the speedup is 30/15 = 2. So, the
              parallel efficiency is 50%.
            </>
          )
        }
      ]} />

      <Divider />

      <h2>Amdahl’s Law</h2>

      <p>
        The simulation and practice questions above highlight a simple phenomenon known as <strong>Amdahl’s law</strong>.
        This law says that the overall parallel speedup that a program that has a sequential and a parallel part is
        limited by the amount of time spent in the sequential part. This is very intuitive, since in the extreme a
        program is purely sequential and the parallel speedup is always 1 regardless of the number of cores. But the
        surprising thing is how severe the limit is. Let’s derive Amdahl’s law in the abstract, and then apply it to our
        example oil painting program.
      </p>

      <p>
        Consider a program that runs on 1 core in time <TeX math="T" />. This program consists of two main phases, one
        that is inherently sequential and one that can be parallelized. Let <TeX math="\alpha" /> be the fraction of the
        execution time spent in the parallelizable phase. We can thus write the execution time on 1 core, <TeX
        math="T(1)" />, as:
      </p>

      <TeX math="T(1) = \alpha T(1) + (1 - \alpha) T(1)" block />

      <p>
        Now, if we run the program on <TeX math="p" /> cores, assuming perfect parallelization of the parallelizable
        phase, we obtain the execution time on <TeX math="p" /> cores, <TeX math="T(p)" />, as:
      </p>

      <TeX math="T(p) = \alpha T(1) / p + (1 - \alpha) T(1)" block />

      <p>
        The above just says that the parallel part goes <TeX math="p" /> times faster, while the sequential part is
        unchanged.
      </p>

      <p>
        The parallel speedup on <TeX math="p" /> cores, <TeX math="S(p)" />, is then:
      </p>

      <TeX
        math="S(p) = \frac{\alpha T(1) + (1 - \alpha) T(1)}{\alpha T(1) / p + (1 - \alpha) T(1)} = \frac{1}{ \alpha/p + 1 - \alpha}"
        block />

      <p>
        As <TeX math="p" />, the number of cores, grows, <TeX math="S(p)" /> increases (as expected). Amdahl's law is
        the observation that no matter how large <TeX math="p" /> gets, the speedup is limited by a constant:
      </p>

      <TeX math="S(p) < \frac{1}{1 - \alpha}" block />

      <p>
        So, for instance, if 90% of the sequential execution time can be parallelized, then the speedup will be at most
        1/(1-0.9) = 10.
      </p>

      <p>
        For instance, if running on 8 cores, the speedup would be 1/(0.9/8 + 1 - 0.9) = 4.7, for a parallel efficiency
        below 60%.
      </p>

      <p>
        The "non-intuitiveness" of Amdahl's law, for some people, is that having 10% of the execution sequential does
        not seem like a lot, but seeing only a 4.7 speedup with 8 cores seems really bad. The graph below shows speedup
        vs. number of cores for different values of <TeX math="\alpha" />:
      </p>

      <Amdahl />
      <div className="caption"><strong>Figure 3:</strong> Speedup vs. number of cores for different values of the
        fraction of the sequential execution time that is parallelizable.
      </div>

      <p>
        The main message of Figure 3 is that even with seemingly small non-parallelizable portions, program speedup
        drops well below the number of cores quickly. For instance, the data point circled in red shows that if as
        little as 5% of the sequential execution time is non-parallelizable, running on 20 cores only affords a 10x
        speedup (i.e., parallel efficiency is only 50%).
      </p>
      <p>
        This is bad news since almost every program has inherently sequential phases. In our example program the
        sequential phase is the "luminence" task. But even without this task, there are many parts of a program that are
        sequential. For instance, a program typically needs to write output using sequential I/O operations. Even if
        these parts are short, Amdahl’s law tells us that they severely limit speedup.
      </p>
      <p>
        Bottom line: achieving high speedup on many cores is not easy. The ability of a program to do so is often
        called <i>parallel scalability</i>. If a program maintains relatively high parallel efficiency as the number of
        cores it uses increases, we say that the program "scales".
      </p>

      <PracticeQuestions questions={[
        {
          key: "A.2.p5.4",
          question: "A program that consists of a sequential phase and a perfectly parallelizable phase runs on 1 " +
            "core in 10 minutes and on 4 cores in 6 minutes. How long does the sequential phase run for? Show your " +
            "work and reasoning.",
          content: (
            <>
              Let <TeX math="\alpha" /> be the fraction of the sequential execution time that is parallelizable.
              Amdahl’s law gives us the speedup on 4 cores as:
              <TeX math="S(4) = \frac{1}{\alpha/4 + 1 - \alpha}" block />
              Since we know <TeX math="S(4)" /> to be <TeX math="10/6" />, we can just solve for <TeX
              math="\alpha" />. This gives us <TeX math="\alpha = ((6/10) - 1) / (1/4 - 1) = .53" />.
              <p>
                Therefore, the sequential phase lasts for <TeX math="10 \times (1 - .53) = 4.7" /> minutes.
              </p>
            </>
          )
        }
      ]} />

    </>
  )
}

export default DataParallelism

const text1 = `



**[A.2.p5.4]** A program that consists of a sequential phase and a perfectly
parallelizable phase runs on 1 core in 10 minutes and on  4 cores in 6 minutes.
How long does  the sequential phase run for? Show your work and reasoning.

<div class="ui accordion fluid">
  <div class="title">
    <i class="dropdown icon"></i>
    (click to see answer)
  </div>
  <div markdown="1" class="ui segment content answer-frame">

    Let $\alpha$ be the fraction of the sequential execution time that
    is parallelizable. Amdahl's law gives us the speedup on 4 cores as:

    $
    
    $

    Since we know $S(4)$ to be 10/6, we can just solve for $\\alpha$. This gives
    us $\\alpha = ((6/10) - 1) / (1/4 - 1) = .53$.

    Therefore, the sequential phase lasts for $10 \\times (1 - .53)$ = 4.7
    minutes.

  </div>
</div>

<p></p>


**[A.2.p5.5]** A program consists of a sequential phase and a perfectly parallelizable
phase. When executed on 1 core, the parallel phase accounts for 92% of
the execution time.  What fraction of the execution time on 6 cores does
this phase account for? Show your work and reasoning.

<div class="ui accordion fluid">
  <div class="title">
    <i class="dropdown icon"></i>
    (click to see answer)
  </div>
  <div markdown="1" class="ui segment content answer-frame">
    Let $T(1)$ be the sequential execution time. The
    execution time on 6 cores, $T(6)$, is:

    $
    T(6) = 0.08 \\times T(1) + 0.92 \\times T(1) / 6
    $

    and the fraction of T(6) that corresponds to the parallel phase is:

    $
    T(6) = \\frac{0.92 \\times T(1) / 6}{0.08  \\times T(1) + 0.92 \\times T(1) / 6}
    = \\frac{0.92 / 6} {0.08 + 0.92 / 6}
    = .65
    $

    So only 65% of the 6-core execution is spent in the parallel phase.

  </div>
</div>

<p></p>

**[A.2.p5.6]** 40% of the sequential execution time of a program is spent
in a phase that could be perfectly parallelized. What is  the maximum  speedup
one could achieve if any number of cores  can be used? Show your work and reasoning.

<div class="ui accordion fluid">
  <div class="title">
    <i class="dropdown icon"></i>
    (click to see answer)
  </div>
  <div markdown="1" class="ui segment content answer-frame">
    This is a direct application of Amdahl's law. The upper bound on the
    speedup is 1/(1 - 0.4) = 1.66. There is really no need to remember
    the formula by heart. The bound is simply what speedup we would achieved
    with an infinite number of cores, i.e., when the execution time of the
    parallel phase is zero.
  </div>
</div>
<p></p>

---

### Amdahl's law and our example

For our example oil-painting program, we can of course compute the speedup analytically.
To apply Amdahl's  law to this program,  we need to compute $\alpha$, the fraction
of the sequential execution time
that is parallelizable. Still for a 100 Gflop/sec core, for a given
radius $r$ the time spent in the "oil" task is $r^2$ seconds. The time spent
in the "luminence" task is 1 second.
Therefore, $\alpha = (r^2) / (1 + r^2)$. So, the speedup when running on $p$
cores with radius $r$, $S(p,r)$, is:

$
S(p,r)   = \\frac
{
  1
}
{
  r ^ 2 / (1 + r ^ 2) / p + 1 - r ^ 2 / (1 + r ^ 2)
}
$

You can double-check that this formula matches what we observed in
the simulation app. For instance, for $r=2$, the
speedup using 4 cores would be:

$
S(4,2)   = \\frac
{
  1
}
{
  (4 / 5) / 4 + 1 - 4 / 5
}
=  2.5
$

We could then ask questions like: what is the largest number of cores
that can be used without the efficiency dropping below 50%? We just
need to solve:

$
\\frac
{
  1
}
{
  ((4 / 5) / n + 1 - 4 / 5)\\times
  n
}
\\geq .50
$

which gives us $n \leq 5$. So as soon as we use 6 cores or more, parallel efficiency
drops below 50%, meaning that we are "wasting" half the compute power of our computer.
We could use more cores effectively for larger $r$  because the application
would have more (parallelizable) work to do.



### Overhead of Parallelization

In what  we have seen so far, the data-parallelization of a task  was
"perfect". That is, the original work is $X$ and when using $p$ tasks on $p$ cores
each task has work $X/p$.

This is not always the case, as there could be some overhead. This overhead
could be a sequential portion that remains unparallelized.
Or there could be more work to be done by the parallel tasks. We illustrate
this in the two practice questions below.

#### Practice Questions


**[A.2.p5.7]** Consider a program that consists of a single task with work
10,000 Gflop. The developer of the program has an idea to expose
data-parallelism. But it is not perfect: the single task is rewritten as a
first task with work 500 Gflop, and then $n$ tasks with each work $10000/n$
Gflop. So the total work of the program is larger and there is still a sequential phase. What would the speedup
be if executing the modified code on 4 cores (compared to the original
1-task program on 1 of these cores)? Show your work and reasoning.

<div class="ui accordion fluid">
  <div class="title">
    <i class="dropdown icon"></i>
    (click to see answer)
  </div>
  <div markdown="1" class="ui segment content answer-frame">

    Let $s$ be the core compute speed in Gflop/sec.

    The sequential program runs in time $10000/s$.

    The data-parallel program runs in time $500/s + (10000/4)/s$.

    Therefore, the speedup is:

    $
    \\text{speedup} = \\frac{10000 / s}{500 / s + (10000 / 4) / s}
    = \\frac{10000}{500 + 2500}
    = 3.33
    $

  </div>
</div>

<p></p>


**[A.2.p5.8]** Consider a program that consists of a single task with work
10,000 Gflop. The developer of the program has an idea to expose
data-parallelism where the code now consists of $n$ tasks, each of them
with work $(10000+X)/n$ (i.e., there is some work overhead for exposing
data-parallelism, but there is no sequential phase). What is the largest value of X
for which the parallel efficiency would be above 90%
when running on an 8-core computer? Show your work and reasoning.

<div class="ui accordion fluid">
  <div class="title">
    <i class="dropdown icon"></i>
    (click to see answer)
  </div>
  <div markdown="1" class="ui segment content answer-frame">

    Let $s$ be the core compute speed in Gflop/sec. The sequential program runs
    in time $10000/s$, and the
    data-parallel program runs in time $((10000+X)/8)/s$.

    Therefore, the speedup is:

    $

    \\text{speedup} = \\frac{10000 / s}{((10000 + X) / 8) / s}
    = 8 \\times \\frac{10000}{10000 + X}

    $

    The parallel efficiency is $\\frac{10000}{10000 + X}$, so we need to solve:

    $
    \\frac{10000}{10000 + X} \\geq 0.9
    $

    which gives $X \leq 1111.11$ Gflop.

  </div>
</div>


<p></p>


---

#### Questions

Answer the following questions:

**[A.2.q5.1]** If the sequential execution of a program spends 30% of its
time in a phase that could be parallelized perfectly, what would be the
parallel efficiency of an execution of this program on  6 cores  (assuming
that phase has been parallelized)? Show your work and reasoning.

**[A.2.q5.2]** A program consists of a sequential phase and a perfectly
parallelizable phase. The program runs on 1 core in 20 minutes and on 3
cores in 10 minutes.  How long does the sequential phase run for? Show your
work and reasoning.

**[A.2.q5.3**] If a parallel program achieves parallel efficiency of 99%
when running on 64 cores, what fraction of its sequential execution time
was non-parallelizable? Show your work and reasoning. Write and solve an equation where
the fraction is the unknown.

**[A.2.q5.4]** Consider a program that consists of a single task  with
work  10,000 Gflop.  Developer $A$ proposes to replace this task with 5
tasks each with work  2,000 Gflop.  Developer  $B$ proposes to replace this
task with  4 tasks  each  with  work 3,000 Gflop, followed by a sequential
task with work  500  Gflop. Which developer's idea  should you use when
running this program on a 4-core machine? Show your work and reasoning. For each option
show the execution time as a function of the core speed, and compare.

**[A.2.q5.5]** A program currently consists of two tasks, $A$  and $B$,
that are independent (i.e., they  can be performed in parallel).  Task $A$
has work 1000 Gflop, while task $B$ has work 2000 Gflop.  You  can either
replace task $A$ with two independent tasks each with work 600 Gflop, or
replace task $B$ with  two independent tasks each with  work 1900 Gflop.
If running on a 3-core computer,  which replacement would be best in  terms
of program execution  time? Sow your work and reasoning. For each option determine the
execution time, and compare.
`
