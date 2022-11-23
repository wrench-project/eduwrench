import React, { useState } from "react"
import { Divider, Header } from "semantic-ui-react"
import TeX from "@matejmazur/react-katex"
import LearningObjectives from "../../../components/learning_objectives"
import SimulationActivity from "../../../components/simulation/simulation_activity"
import DataParallelismSimulation from "./data_parallelism_simulation"
import PracticeQuestions from "../../../components/practice_questions_header"

import ExampleDataParallelismDAG from "../../../images/vector_graphs/multi_core/multicore_example_data_parallelism_dag.svg"
import ExampleDataParallelismExposedDAG from "../../../images/vector_graphs/multi_core/multicore_example_data_parallelism_exposed_dag.svg"
import Amdahl from "../../../images/vector_graphs/multi_core/multicore_amdahl.svg"
import FeedbackActivity from "../../../components/feedback/feedback_activity";
import FeedbackQuestions from "../../../components/feedback_questions";
import PracticeQuestionNumeric from "../../../components/practice-questions/numeric";
import PracticeQuestionMultiChoice from "../../../components/practice-questions/multichoice";
import SimNewWindow from "../../../components/simNewWindow";

const DataParallelism = ({module, tab}) => {
    const [newSimWindow, setNewSimWindow] = useState([]);

    function openNewWindow() {
      setNewSimWindow([]);
      setNewSimWindow([...newSimWindow, "data-parallelism"]);
    }

    return (
        <>
            <LearningObjectives module={module} tab={tab}
            />

            <h2>Motivation</h2>

            <p>
                In all we have seen so far in this module, a parallel program consists of a predetermined set of tasks, each of
                them executing on a single core. Many real-world programs are structured in this way, and this is
                called <strong>task parallelism</strong>.
            </p>

            <p>
                Let's now consider one task, which performs some computation on a single core. Perhaps, one can rewrite the code
                of this task to use multiple cores to accelerate its computation. This is done by writing the task's code so
                that it uses multiple threads (see Operating Systems <a href="/textbooks">textbooks</a>). In other terms,
                perhaps the task's computation itself can be <strong>parallelized</strong>.
            </p>

            <h2>An Example</h2>

            <p>
                Consider a transformation of the pixels of an image that makes the image resemble an oil-painting. This can be
                done by updating each pixel's color by some other color based on the color of neighboring pixels. The
                oil-painting transformation has a parameter called the <i>radius</i>, which is the radius of the brush stroke.
                The larger the radius, the more neighboring pixels are used to update the color or a pixel, and the more work is
                required. In fact, the amount of work is <i>quadratic</i> in the radius, meaning that it grows with the square
                of the radius. This is how "oil-painting filters" work in many open-source and commercial image processing
                programs.
            </p>

            <p>
                Consider now a program that is a sequence of two tasks: An "oil" task applies an oil-painting filter to an image
                with a given radius <TeX math="r" />, followed by a "luminence" task that computes the luminence histogram for
                the image, i.e., the statistical distribution of the brightness of its pixels. We can draw the program's DAG as
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
                program's DAG is as follows:
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

            <SimulationActivity panelKey="data-parallelism" content={<DataParallelismSimulation />} />

            <Divider />

            <button onClick={openNewWindow}>Pop Up Simulation</button>
            {newSimWindow.map((item, i) => ( <SimNewWindow><DataParallelismSimulation/></SimNewWindow> ))}
            <Divider />

            <Header as="h3" block>
                Practice Questions
            </Header>

            <PracticeQuestionNumeric
                module={"A.2"}
                question_key={"A.2.p5.1"}
                question={
                    <>
                        Analytically estimate the execution time in seconds of the oil-painting program with radius <TeX math="r=3" /> when
                        it runs on 6 cores.
                    </>
                }
                hint={"You can double-check your result in simulation"}
                answer={[2.5,2.5]}
                explanation={
                    <>
                        The execution time on 6 cores is:
                        <TeX math="T(6) = \frac{100 \times 3^2 / 6}{100} + \frac{100}{100} =  2.50 \text{sec}" block />
                    </>
                }
            />

            <PracticeQuestionMultiChoice
                module={"A.2"}
                question_key={"A.2.p5.2"}
                question={
                    <>
                        Which execution has the best parallel efficiency: A) <TeX math="r=2" /> on 6 cores; or B) <TeX
                        math="r=3" /> on 8 cores? Try to formulate an intuitive answer. Then check your intuition using analytics
                        and/or the simulation.
                    </>
                }
                choices={["Execution A)", "Execution B)"]}
                correct_answer={"Execution B)"}
                explanation={
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
                            You can confirm the above numbers with the simulation (up to round-off errors). The parallel efficiency is <TeX
                            math="E_B = (10/2.125)/8 = 58.82\%" />. Our intuition is confirmed! Execution B has better efficiency!
                        </p>
                    </>
                }
            />

            <PracticeQuestionNumeric
                module={"A.2"}
                question_key={"A.2.p5.3"}
                question={
                    <>
                        A program consists of two tasks that run in sequence. The first runs in 10s and the second
                        in 20 seconds, on one core of a 4-core computer. A developer has an idea to expose data-parallelism
                        in the second task and rewrites it so that it is replaced by 4 independent tasks each with 1/4-th of
                        the original task's work. What is the parallel efficiency in percentage on 4 cores?
                    </>
                }
                answer={[50,50]}
                explanation={
                    <>
                        When running on 4 cores, the program runs in 10 + 20/4 = 15 seconds. So the speedup is 30/15 = 2. So, the
                        parallel efficiency is 50%.
                    </>
                }
            />

            <Divider />

            <h2>Amdahl's Law</h2>

            <p>
                The simulation and practice questions above highlight a simple phenomenon known as <strong>Amdahl's law</strong>.
                This law says that the overall parallel speedup that a program that has a sequential and a parallel part is
                limited by the amount of time spent in the sequential part. This is very intuitive, since in the extreme a
                program is purely sequential and the parallel speedup is always 1 regardless of the number of cores. But the
                surprising thing is how severe the limit is. Let's derive Amdahl's law in the abstract, and then apply it to our
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

            <Amdahl style={{ maxHeight: "400px"}} />
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
                these parts are short, Amdahl's law tells us that they severely limit speedup.
            </p>
            <p>
                Bottom line: achieving high speedup on many cores is not easy. The ability of a program to do so is often
                called <i>parallel scalability</i>. If a program maintains relatively high parallel efficiency as the number of
                cores it uses increases, we say that the program "scales".
            </p>

            <Divider />

            <Header as="h3" block>
                Practice Questions
            </Header>

            <PracticeQuestionNumeric
                module={"A.2"}
                question_key={"A.2.p5.4"}
                question={
                    <>
                        A program that consists of a sequential phase and a perfectly parallelizable phase runs on 1
                        core in 10 minutes and on 4 cores in 6 minutes. How long does the sequential phase run for in minutes?
                    </>
                }
                answer={[4.6, 4.8]}
                explanation={
                    <>
                        Let <TeX math="\alpha" /> be the fraction of the sequential execution time that is parallelizable.
                        Amdahl's law gives us the speedup on 4 cores as:
                        <TeX math="S(4) = \frac{1}{\alpha/4 + 1 - \alpha}" block />
                        Since we know <TeX math="S(4)" /> to be <TeX math="10/6" />, we can just solve for <TeX
                        math="\alpha" />. This gives us <TeX math="\alpha = ((6/10) - 1) / (1/4 - 1) = .53" />.
                        <p>
                            Therefore, the sequential phase lasts for <TeX math="10 \times (1 - .53) = 4.7" /> minutes.
                        </p>
                    </>
                }
            />

            <PracticeQuestionNumeric
                module={"A.2"}
                question_key={"A.2.p5.5"}
                question={
                    <>
                        A program consists of a sequential phase and a perfectly parallelizable phase. When executed
                        on 1 core, the parallel phase accounts for 92% of the execution time. What fraction of the execution
                        time on 6 cores does this phase account for?
                    </>
                }
                answer={[64, 66]}
                explanation={
                    <>
                        Let <TeX math="T(1)" /> be the sequential execution time. The execution time on 6 cores, <TeX
                        math="T(6)" />, is:
                        <TeX math="T(6) = 0.08 \times T(1) + 0.92 \times T(1) / 6" block />
                        and the fraction of T(6) that corresponds to the parallel phase is:
                        <TeX math="T(6) = \frac{0.92 \times T(1) / 6}{0.08  \times T(1) + 0.92 \times T(1) / 6}
              = \frac{0.92 / 6} {0.08 + 0.92 / 6}
              = .65" block />
                        So only 65% of the 6-core execution is spent in the parallel phase.
                    </>
                }
            />

            <PracticeQuestionNumeric
                module={"A.2"}
                question_key={"A.2.p5.6"}
                question={
                    <>
                        40% of the sequential execution time of a program is spent in a phase that could be perfectly
                        parallelized. What is the maximum speedup one could achieve if any number of cores can be used?
                        Show your work and reasoning.
                    </>
                }
                answer={[1.65, 1.67]}
                explanation={
                    <>
                        This is a direct application of Amdahl's law. The upper bound on the speedup is 1/(1 - 0.4) = 1.66. There
                        is really no need to remember the formula by heart. The bound is simply what speedup we would achieved
                        with an infinite number of cores, i.e., when the execution time of the parallel phase is zero.
                    </>
                }
            />

            <Divider />

            <h2>Amdahl's law and our example</h2>

            <p>For our example oil-painting program, we can of course compute the speedup analytically.</p>
            <p>
                To apply Amdahl's law to this program, we need to compute <TeX math="\alpha" />, the fraction of the sequential
                execution time that is parallelizable. Still for a 100 Gflop/sec core, for a given radius <TeX math="r" /> the
                time spent in the "oil" task is <TeX math="r^2" /> seconds. The time spent in the "luminence" task is 1 second.
                Therefore, <TeX math="alpha = (r^2) / (1 + r^2)" />. So, the speedup when running on <TeX math="p" /> cores with
                radius <TeX math="r" />, <TeX math="S(p,r)" />, is:
            </p>
            <TeX math="S(p,r) = \frac{1}{r ^ 2 / (1 + r ^ 2) / p + 1 - r ^ 2 / (1 + r ^ 2)}" block />

            <p>
                You can double-check that this formula matches what we observed in the simulation app. For instance, for <TeX
                math="r=2" />, the speedup using 4 cores would be:
            </p>
            <TeX math="S(4,2) = \frac{1}{(4 / 5) / 4 + 1 - 4 / 5} = 2.5" block />

            <p>
                We could then ask questions like: what is the largest number of cores that can be used without the efficiency
                dropping below 50%? We just need to solve:
            </p>
            <TeX math="\frac{1}{((4 / 5) / n + 1 - 4 / 5)\times n} \geq .50" block />

            <p>
                which gives us <TeX math="n \leq 5" />. So as soon as we use 6 cores or more, parallel efficiency drops below
                50%, meaning that we are "wasting" half the compute power of our computer. We could use more cores effectively
                for larger <TeX math="r" /> because the application would have more (parallelizable) work to do.
            </p>

            <h2>Overhead of Parallelization</h2>

            <p>
                In what we have seen so far, the data-parallelization of a task was "perfect". That is, the original work
                is <TeX math="X" /> and when using <TeX math="p" /> tasks on <TeX math="p" /> cores each task has work <TeX
                math="X / p" />.
            </p>

            <p>
                This is not always the case, as there could be some overhead. This overhead could be a sequential portion that
                remains unparallelized. Or there could be more work to be done by the parallel tasks. We illustrate this in the
                two practice questions below.
            </p>

            <Divider/>

            <Header as="h3" block>
                Practice Questions
            </Header>

            <PracticeQuestionNumeric
                module={"A.2"}
                question_key={"A.2.p5.7"}
                question={
                    <>
                        Consider a program that consists of a single task with work 10,000 Gflop. The developer of the program has
                        an idea to expose data-parallelism. But it is not perfect: the single task is rewritten as a first task
                        with work 500 Gflop, and then <TeX math="n" /> tasks with each work <TeX math="10000 / n" /> Gflop. So the
                        total work of the program is larger and there is still a sequential phase. What would the speedup be if
                        executing the modified code on 4 cores (compared to the original 1-task program on 1 of these cores)? Show
                        your work and reasoning.
                    </>
                }
                answer={[3.3, 3.4]}
                explanation={
                    <>
                        <p>Let <TeX math="s" /> be the core compute speed in Gflop/sec.</p>
                        <p>The sequential program runs in time <TeX math="10000/s" />.</p>
                        <p>The data-parallel program runs in time <TeX math="500/s + (10000/4)/s" />.</p>
                        <p>Therefore, the speedup is:</p>
                        <TeX math="\text{speedup} = \frac{10000 / s}{500 / s + (10000 / 4) / s}
              = \frac{10000}{500 + 2500}
              = 3.33" block />
                    </>
                }
            />

            <PracticeQuestionNumeric
                module={"A.2"}
                question_key={"A.2.p5.8"}
                question={
                    <>
                        Consider a program that consists of a single task with work 10,000 Gflop. The developer of the program has
                        an idea to expose data-parallelism where the code now consists of <TeX math="n" /> tasks, each of them
                        with work <TeX math="(10000 + X) / n" /> (i.e., there is some work overhead for exposing data-parallelism,
                        but there is no sequential phase). What is the largest value of X for which the parallel efficiency would
                        be above 90% when running on an 8-core computer? Show your work and reasoning.
                    </>
                }
                answer={[1110,1112]}
                explanation={
                    <>
                        <p>Let <TeX math="s"/> be the core compute speed in Gflop/sec. The sequential program runs in time <TeX
                            math="10000/s" />, and the data-parallel program runs in time <TeX math="((10000+X)/8)/s" />.</p>
                        <p>Therefore, the speedup is:</p>
                        <TeX math="\text{speedup} = \frac{10000 / s}{((10000 + X) / 8) / s}
              = 8 \times \frac{10000}{10000 + X}" block />
                        <p>The parallel efficiency is <TeX math="\frac{10000}{10000 + X}" />, so we need to solve:</p>
                        <TeX math="\frac{10000}{10000 + X} \geq 0.9" block />
                        <p>which gives <TeX math="X \leq 1111.11" /> Gflop.</p>
                    </>
                }
            />

            <Divider />

            <Header as="h3" block>
                Questions
            </Header>

            <p>
                <strong>[A.2.q5.1]</strong> If the sequential execution of a program spends 30% of its time in a phase that
                could be parallelized perfectly, what would be the parallel efficiency of an execution of this program on 6
                cores (assuming that phase has been parallelized)? Show your work and reasoning.
            </p>

            <p>
                <strong>[A.2.q5.2]</strong> A program consists of a sequential phase and a perfectly parallelizable phase. The
                program runs on 1 core in 20 minutes and on 3 cores in 10 minutes. How long does the sequential phase run for?
                Show your work and reasoning.
            </p>

            <p>
                <strong>[A.2.q5.3]</strong> If a parallel program achieves parallel efficiency of 99% when running on 64 cores,
                what fraction of its sequential execution time was non-parallelizable? Show your work and reasoning. Write and
                solve an equation where the fraction is the unknown.
            </p>

            <p>
                <strong>[A.2.q5.4]</strong> Consider a program that consists of a single task with work 10,000 Gflop.
                Developer <TeX math="A" /> proposes to replace this task with 5 tasks each with work 2,000 Gflop. Developer <TeX
                math="B" /> proposes to replace this task with 4 tasks each with work 3,000 Gflop, followed by a sequential task
                with work 500 Gflop. Which developer's idea should you use when running this program on a 4-core machine? Show
                your work and reasoning. For each option show the execution time as a function of the core speed, and compare.
            </p>

            <p>
                <strong>[A.2.q5.5]</strong> A program currently consists of two tasks, <TeX math="A" /> and <TeX math="B" />,
                that are independent (i.e., they can be performed in parallel). Task <TeX math="A" /> has work 1000 Gflop, while
                task <TeX math="B" /> has work 2000 Gflop. You can either replace task <TeX math="A" /> with two independent
                tasks each with work 600 Gflop, or replace task <TeX math="B" /> with two independent tasks each with work 1900
                Gflop. If running on a 3-core computer, which replacement would be best in terms of program execution time? Sow
                your work and reasoning. For each option determine the execution time, and compare.
            </p>

            <Header as="h3" block>
                You feedback is appreciated
            </Header>

            <FeedbackActivity content={
                <FeedbackQuestions feedbacks={[
                    {
                        tabkey: "data_parallelism",
                        module: "A.2"
                    },
                ]} />
            } />

        </>
    )
}

export default DataParallelism

const text1 = `



        ---

        #### Questions

        Answer the following questions:

        <strong>[A.2.q5.1]</strong> If the sequential execution of a program spends 30% of its
        time in a phase that could be parallelized perfectly, what would be the
        parallel efficiency of an execution of this program on  6 cores  (assuming
        that phase has been parallelized)? Show your work and reasoning.

        <strong>[A.2.q5.2]</strong> A program consists of a sequential phase and a perfectly
        parallelizable phase. The program runs on 1 core in 20 minutes and on 3
        cores in 10 minutes.  How long does the sequential phase run for? Show your
        work and reasoning.

        <strong>[A.2.q5.3]</strong> If a parallel program achieves parallel efficiency of 99%
        when running on 64 cores, what fraction of its sequential execution time
        was non-parallelizable? Show your work and reasoning. Write and solve an equation where
        the fraction is the unknown.

        <strong>[A.2.q5.4]</strong> Consider a program that consists of a single task  with
        work  10,000 Gflop.  Developer <TeX math="A"/> proposes to replace this task with 5
        tasks each with work  2,000 Gflop.  Developer  <TeX math="B"/> proposes to replace this
        task with  4 tasks  each  with  work 3,000 Gflop, followed by a sequential
        task with work  500  Gflop. Which developer's idea  should you use when
        running this program on a 4-core machine? Show your work and reasoning. For each option
        show the execution time as a function of the core speed, and compare.

        <strong>[A.2.q5.5]</strong> A program currently consists of two tasks, <TeX math="A"/>  and <TeX math="B"/>,
        that are independent (i.e., they  can be performed in parallel).  Task <TeX math="A"/>
        has work 1000 Gflop, while task <TeX math="B"/> has work 2000 Gflop.  You  can either
        replace task <TeX math="A"/> with two independent tasks each with work 600 Gflop, or
        replace task <TeX math="B"/> with  two independent tasks each with  work 1900 Gflop.
        If running on a 3-core computer,  which replacement would be best in  terms
        of program execution  time? Sow your work and reasoning. For each option determine the
        execution time, and compare.
        `
