import React from "react"
import { Divider, Header } from "semantic-ui-react"
import TeX from "@matejmazur/react-katex"
import LearningObjectives from "../../../components/learning_objectives"
import SimulationActivity from "../../../components/simulation/simulation_activity"
import LoadImbalanceSimulation from "./load_imbalance_simulation"
import PracticeQuestions from "../../../components/practice_questions"

import Utilization from "../../../images/vector_graphs/multi_core/multicore_utilization.svg"

const LoadImbalance = ({module, tab}) => {
    return (
        <>
            <LearningObjectives module={module} tab={tab}
            />

            <h2>Load Imbalance and Idle Time</h2>

            <p>
                One reason why a parallel program’s parallel efficiency can be less than 100% is <strong>idle time</strong>:
                time during which one or more cores are not able to work while other cores are working. A common cause of idle
                time is <strong>load imbalance</strong>.
            </p>

            <p>
                Consider a parallel program that consists of <TeX math="n" /> tasks, each of them running in the same amount of
                time on a core. We run this program on a computer with <TeX math="p" /> cores. If <TeX math="n" /> is not
                divisible by <TeX math="p" />, then at least one core will be idle during program execution. For example, if we
                have 8 tasks, that each run for 1 hour; and 5 cores, all cores will be busy running the first 5 tasks in
                parallel. But once this phase of execution is finished, we have 3 tasks left and 5 available cores.
                So 2 cores will have nothing to do for 1 hour. In this situation, we say that <strong>the load is not
                well-balanced across cores</strong>. Some cores will run two tasks, while others will run only one task.
            </p>

            <p>
                There is a <strong>direct relationship</strong> between idle time and parallel efficiency, assuming idle time is
                the only cause of loss in parallel efficiency. <strong> The parallel efficiency is the sum of the core non-idle
                times divided by the product of the number of cores by the overall execution time.</strong>
            </p>

            <p>
                The above statement may sound complicated, but it is very intuitive on an example. Consider a 2-core computer
                that executes a multi-task program in 35 minutes. One core computes for the full 35 minutes, while the other
                core computes for 20 minutes and then sits idle for 15 minutes. This execution is depicted in the figure below:
            </p>

            <Utilization />
            <div className="caption"><strong>Figure 1:</strong> Example 35-minute execution on a 2-core computer. The white
                area is the core idle time, the yellow area is the core compute time.
            </div>

            <p>
                What the above statement says is that the parallel efficiency is the yellow area divided by the area of the
                whole rectangle. The white area is the number of <i>idle core minutes</i> in the execution. In this case it is
                equal to <TeX math="1 \times 15" /> minutes. <i>The more white in the figure, the lower the parallel
                efficiency.</i> In this example, the parallel efficiency is <TeX
                math="(1 \times 35 + 1 \times 20)/(2 \times 35) = 78.5\%" />. You can note that this is exactly the speedup
                (55/35) divided by the number of cores (2).
            </p>

            <Header as="h3" block>
                Simulating Load Imbalance
            </Header>

            <p>
                To gain hands-on experience, use the simulation app below on your own and to answer the practice questions
                hereafter.
            </p>

            <p>
                This app allows you to pick a number of cores and a number of tasks to run on these cores. Try first with a
                single core running 5 tasks. Note that you can vary the per/task amount of work in Gflop, but this value does
                not impact the overall execution pattern. The "Host Utilization" graph displays the execution as in Figure 1
                above. Now try running a number of tasks and cores where the number of tasks does not evenly divide the number
                of cores. Looking at the host utilization graph again, now you will be able to see idle time for some of the
                cores (in light pink). Whenever there is idle time, parallel efficiency is below 100% and you can easily compute
                its actual value.
            </p>

            <SimulationActivity panelKey="load_imbalance_simulation" content={<LoadImbalanceSimulation />} />

            <Divider />

            <PracticeQuestions questions={[
                {
                    key: "A.2.p2.1",
                    question: "You have a 4-core computer where each core computes at speed 1000 Gflop/sec. You are told that " +
                        "a 10-task parallel program has 30 idle core seconds in total when executed on that computer. All tasks " +
                        "have the same work. What is the task work in Gflop? Show your work and reasoning, and in particular " +
                        "write and solve a simple equation where the task work is the unknown. You can double-check your answer " +
                        "with the simulation app above.",
                    content: (
                        <>
                            <p>
                                Since we have 10 tasks and 4 cores, in the last phase of execution 2 cores are idle while 2 cores
                                compute. Let <TeX math="w" /> be the work of a task. The duration of this last phase is <TeX
                                math="w/1000" /> seconds, i.e., work divided by compute speed. So the total idle core seconds
                                is <TeX math="2 \times w / 1000" />, since 2 cores are idle in the last phase. We know this number to be
                                30 seconds, therefore we simply need to solve:
                            </p>
                            <TeX math="\frac{2 \times w}{1000} = 30" block />
                            <p>which gives us <TeX math="w = 15000" /> Gflop/sec.</p>
                            <p>
                                We can use the simulation app to double-check our result. We just need to enter 1500, instead of 15000,
                                as the task work amount in Gflop since in the simulation the core computes 10 times slower than in this
                                question. The simulation clearly shows that the number of idle seconds is <TeX
                                math="15 \times 2 = 30" />.
                            </p>
                        </>
                    )
                },
                {
                    key: "A.2.p2.2",
                    question: "You are told that a 10-task program runs in 1 hour on a 3-core machine. All tasks execute in " +
                        "the same amount of time on one core. What is the execution time of one task? Show your work and " +
                        "reasoning. You can double-check your answer with the simulation app above.",
                    content: (
                        <>
                            <p>
                                The execution proceeds in 4 phases. If each of the first three phases 3 tasks are executed in parallel.
                                In the last phase a single task executes. Therefore, each phase takes 60/4 = 15 minutes, which is the
                                execution time of a task.
                            </p>
                            <p>
                                You can double-check this in simulation by setting the task work to <TeX
                                math="15 \times 60 \times 100 = 90000" /> , so that each task runs in 15 minutes on a core. The
                                simulation clearly shows a 3600-second execution time, i.e., 1 hour.
                            </p>
                        </>
                    )
                },
                {
                    key: "A.2.p2.3",
                    question: "Assume you have 20 tasks to execute on a multi-core computer, where each task runs in 1 second " +
                        "on a core. By what factor is the overall execution time reduced when going from 4 to 8 cores? Show your " +
                        "work and reasoning. You can double-check your answer in simulation.",
                    content: (
                        <>
                            <p>
                                The total execution time when using 4 cores will be 5 seconds, as each core executes 5 tasks. When
                                increasing from 4 cores to 8 cores, now the total execution time is 3 seconds. This is because the best
                                we can do is have 4 of the cores run 2 tasks and the other 4 run 3 tasks. The overall execution time is
                                reduced by a factor 5/3 = 1.66.
                            </p>
                            <p>
                                This is seen easily in simulation by setting the task work to 100 GFlop.
                            </p>
                        </>
                    )
                },
                {
                    key: "A.2.p2.4",
                    question: (
                        <>
                            You are upgrading your (pre-historic?) single-core computer and you have two new multi-core computers to
                            choose from, one with 5 cores and one with 10 cores. <i>Your only concern is to maximize parallel
                            efficiency.</i> All of the cores are identical. You have 15 tasks to run, each taking 1 second to complete
                            on a core. Which multi-core computer will provide the highest parallel efficiency? Show your work and
                            reasoning.
                        </>
                    ),
                    content: (
                        <>
                            <p>When using only a single core, the 15 tasks will take 15 seconds to complete.</p>
                            <p>When increasing the number of cores to 5, the program runs in 3 seconds, and there is no idle time
                                because 5 divides 15 perfectly. Therefore, parallel efficiency is 100%.</p>
                            <p>When increasing the number of cores to 10, the program runs in 2 seconds. In this scenario, for the
                                last second, 5 out of the 10 cores are idle. Therefore, efficiency is 75%, which is less than 100%.</p>
                            <p>We conclude that we should go with the 5-core computer. Even though the 10-core computer completes the
                                program faster, our concern here was parallel efficiency.</p>
                        </>
                    )
                }
            ]} />

            <Divider />

            <h2>More Load Imbalance with Non-Identical Tasks</h2>

            <p>
                In all the above, we've only considered "identical" tasks: all tasks run in the same amount of time. Therefore,
                the main question was how the number of cores divides the number of tasks. If it divides it perfectly then we
                can have 100% efficiency. <strong>But in many real-world programs tasks are not identical.</strong> Some can
                take longer than the other. This is another possible source of load imbalance, and thus of idle time, and thus
                of loss of parallel efficiency.
            </p>

            <p>
                Consider a 5-task program that runs on a 2-core computer. The tasks take 10s, 16s, 4s, 5s, and 11s,
                respectively. How fast can we run this program? For instance, we could run the first 3 tasks (10s, 16s, and 4s)
                on one core, and the last 2 tasks (5s and 11s) tasks on the other core. The first core would thus work for 30s
                while the second core would work for only 16s. The program thus runs in 30 seconds, and the parallel efficiency
                is <TeX math="46 / (30 \times 2) = 76\%" />.
            </p>

            <p>
                Can we do better? If you think about it, the problem is to split the set of numbers {"{"}10, 16, 4, 5,
                11{"}"} into two parts, so that the sum of the numbers in each part are as close to each other as possible. In
                this case, because we only have 5 numbers, we can look at all options. It turns out that the best option
                is: {"{"}10, 11{"}"} and {"{"}16, 4, 5{"}"}. That is, we run the first and last tasks on one core, and all the
                other tasks on another core. In this case, one core computes for 21s and the other for 25s. The parallel
                efficiency is now 92%.
            </p>

            <p>
                What if we now have 3 cores? Then we have to split our set of numbers into 3 parts that are as "equal" as
                possible. The best we can do is: {"{"}10, 5{"}"}, {"{"}16{"}"}, and {"{"}11, 4{"}"}. In this case, the program
                runs in 16 seconds and the parallel efficiency on 3 cores is almost 96%. It is not useful to use more cores.
                This is because the program can never run faster than 16 seconds as it include a 16-second task.
            </p>

            <p>
                It turns out that splitting sets of numbers into parts with sums as close to each other as possible is a
                difficult problem. We are able to do it for the small examples like above, but as soon as the number of tasks
                gets large, it is no longer humanly possible. And in fact, it is not computer-ly possible either, or at least,
                not quickly. More formally, determining the best split is an NP-complete problem (see
                Algorithms/Theory <a href="/textbooks">textbooks</a>). We will encounter this kind of problem, i.e., how to
                allocate tasks to compute resources, again in upcoming modules.
            </p>

            <Divider />

            <PracticeQuestions questions={[
                {
                    key: "A.2.p2.5",
                    question: "A 5-task program runs optimally (i.e., it’s the best it can possibly do) in 10 seconds on a " +
                        "2-core computer. Tasks 1 to 4 run in 2s, 4s, 3s, and 5s, respectively. Is it possible that Task 5 " +
                        "runs in 7s? Show your work and reasoning.",
                    content: (
                        <>
                            Nope. If Task 5 runs in 7 seconds, then we’d have to split the set {"{"}2, 3, 4, 5, 7{"}"} into two parts
                            that each sum up to 10. One of these parts must contain number 7. So we also put number 3 into that part
                            since then it exactly sums to 10. We are left with numbers 2, 4, and 5, which sum up to 11.
                        </>
                    )
                },
                {
                    key: "A.2.p2.6",
                    question: "Consider a 6-task program. The execution times of 5 of the tasks are: 6, 8, 7, 12, 9. What " +
                        "should the 6th task’s execution time so that this program can run with 100% parallel efficiency on " +
                        "3 cores? Show your work and reasoning.",
                    content: (
                        <>
                            If we run the 6s and the 9s tasks on one core, and the 8s and the 7s tasks on another core, both these
                            cores finish computing in 15s. On the third core we run the 12s task. If the 6th task takes 3s, then all 3
                            cores finish computing in 15s. So the answer is 3 seconds.
                        </>
                    )
                }
            ]} />

            <Divider />

            <Header as="h3" block>
                Questions
            </Header>

            <p>
                <strong>[A.2.q2.1]</strong> What parallel speedup will you observe when running 10 tasks with identical work on
                3 cores? Show your work.
            </p>

            <p>
                <strong>[A.2.q2.2]</strong> The parallel efficiency of a parallel program with 12 identical tasks on a
                multi-core computer is more than 82% but less than 90%. You know this computer has no more than 8 cores. How
                many cores does it have? Show your work. You could try to compute the efficiency for 1 core, 2 cores, etc. But
                try to narrow it down as several numbers of cores clearly cannot lead to a parallel efficiency in the desired
                range. For the remaining numbers, compute the parallel efficiency and see which one falls into that range.
            </p>

            <p>
                <strong>[A.2.q2.3]</strong> You have a 20-task program where each task’s work is 10 Gflop. You currently have a
                4-core computer where each core computes at speed 50 Gflop/sec. For the same amount of money you can either (1)
                increase the speeds of all 4 cores by 20%; or (2) add a 5th 50 Gflop/sec core. What should you do if you want to
                run your program as quickly as possible? Show your work by computing the execution time for each option.
            </p>

            <p>
                <strong>[A.2.q2.4]</strong> Consider a 6-task program to be executed on a 3-core computer. The task execution
                times on one core are: 2s, 4s, 8s, 3s, 9s, and 3s. What is the best possible program execution time on these 3
                cores? Could we do better with 4 cores? Show your work by giving the execution time for both options.
            </p>

        </>
    )
}

export default LoadImbalance
