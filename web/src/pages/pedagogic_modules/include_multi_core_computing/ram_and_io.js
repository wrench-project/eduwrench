import React, {useEffect, useState} from "react"
import { Divider, Header } from "semantic-ui-react"
import TeX from "@matejmazur/react-katex"
import LearningObjectives from "../../../components/learning_objectives"
import SimulationActivity from "../../../components/simulation/simulation_activity"
import PracticeQuestions from "../../../components/practice_questions_header"
import RAMSimulation from "./ram_simulation"
import IOSimulation from "./io_simulation"

import ExampleIODAG from "../../../images/vector_graphs/multi_core/multicore_example_io_dag.svg"
import ExampleIODAG1Core from "../../../images/vector_graphs/multi_core/multicore_example_io_dag_1_core.svg"
import ExampleIODAG4Cores1 from "../../../images/vector_graphs/multi_core/multicore_example_io_dag_4_cores_1.svg"
import ExampleIODAG4Cores2 from "../../../images/vector_graphs/multi_core/multicore_example_io_dag_4_cores_2.svg"
import FeedbackActivity from "../../../components/feedback/feedback_activity";
import FeedbackQuestions from "../../../components/feedback_questions";
import PracticeQuestionNumeric from "../../../components/practice-questions/numeric";
import PracticeQuestionMultiChoice from "../../../components/practice-questions/multichoice";
import SigninCheck from "../../../components/signin_check";

const RamAndIO = ({module, tab}) => {

    const [auth, setAuth] = useState("false")
    useEffect(() => {
        setAuth(localStorage.getItem("login"))
    })

    return (
        <>
            <LearningObjectives module={module} tab={tab}
            />

            <h2>RAM Constraints and Parallelism</h2>

            <p>
                As seen in the <a href="/pedagogic_modules/single_core_computing/">Memory tab of the Single Core Computing
                module</a>, a task may have a sizable amount of data that needs to be loaded and/or generated into RAM so that
                it can execute. Recall from that module that we do not allow a program to use more memory than available in
                physical RAM. Doing so is possible and handled by the Operating Systems (by shuffling data back and forth
                between RAM and disk) but comes with unacceptable performance penalties. So, here again, we never exceed the
                physical memory capacity of a host. If insufficient RAM is available for a task, this task must wait for
                currently running tasks to complete and free up enough RAM. This can cause cores to remain idle. The worst
                possible case would be running a single task that uses the entire RAM, thus leaving all remaining cores idle
                while it executes. Because RAM constraints can cause idle time, they can also cause loss of parallel efficiency.
            </p>

            <Header as="h3" block>
                Simulating RAM Constraints
            </Header>

            <p>
                To gain hands-on experience, use the simulation app below. This app is similar to that in the previous tab, but
                now includes a field for specifying the "Ram Needed For Each Task". So now, we can simulate the fact that tasks
                require RAM space to run. The host we are simulating has 32 GB of RAM available.
            </p>

            <p>
                First try using 4 cores for 8 tasks, where each task uses 8 GB of RAM. As you will see, there is no idle time.
                The number of tasks we can run at a time is 4, given the number of cores and the amount of RAM available.
            </p>

            <p>
                Now try again, but this time set the tasks' RAM requirement to 16 GB. There will now be idle time, as only 2
                cores can be utilized simultaneously due to RAM constraints.
            </p>

            <SimulationActivity panelKey="multicore_ram" content={<RAMSimulation />} />

            <Divider />

            <Header as="h3" block>
                Practice Questions
            </Header>

            <PracticeQuestionNumeric
                module={"A.2"}
                question_key={"A.2.p3.1"}
                question={
                    <>
                        You need to execute 5 tasks that each run in 1 second on one core. Your current single-core
                        processor thus can run these tasks in 5 seconds. The processor is then upgraded to have 5 cores,
                        each identical in processing power to the original single core. If the machine has 32 GB of RAM and
                        each task requires 8 GB of RAM to execute, what is the parallel efficiency?
                    </>
                }
                hint={"First compute the execution time, then the parallel speedup, and then the parallel efficiency"}
                answer={[50,50]}
                explanation={
                    <>
                        <p>
                            On the single-core machine the RAM constraint was not a problem as tasks were executed sequentially
                            (there was never a need for more than 8 GB of RAM). With 5 cores, running all tasks concurrently would
                            require 5x8 = 40 GB of RAM, but only 32 GB is available. Therefore, we can only run 4 tasks at the same
                            time. So the last task runs by itself, with 4 cores being idle. The overall execution time is 2 seconds.
                            This is seen easily in simulation.
                        </p>
                        <p>Therefore:</p>
                        <TeX math="\text{Speedup}(5) = \frac{5}{2} = 2.5" block />
                        <p>and</p>
                        <TeX math="\text{Efficiency}(5) = \frac{2.5}{5} = 50\%" block />
                        <p>We would have been better off with a 4-core computer (since, likely, it would cost less).</p>
                    </>
                }
            />

            <PracticeQuestionMultiChoice
                module={"A.2"}
                question_key={"A.2.p3.2"}
                question={
                    <>
                        Assume you have a 2-core machine on which you need to run 6 tasks (in any order). Each task
                        runs in 1 second on a core. However, the tasks have the following RAM requirements in GB: 6, 2, 4, 3,
                        1, 7. If your machine has a total of 8 GB of RAM, can you achieve 100% parallel efficiency?
                    </>
                }
                choices={["Yes", "No"]}
                correct_answer={"Yes"}
                explanation={
                    <>
                        <p>
                            The question really is: Can you always run two tasks at the same time so that the sum of their RAM
                            requirements never exceeds 8 GB? The answer is "yes":
                        </p>
                        <ul>
                            <li>Run the 7 GB and the 1 GB task together</li>
                            <li>Run the 6 GB and the 2 GB task together</li>
                            <li>Run the 4 GB and the 3 GB task together</li>
                        </ul>
                        <p>
                            (the order of the three steps above does not matter).
                        </p>
                    </>
                }
            />


            <Divider />

            <h2>I/O and Parallelism</h2>

            <SigninCheck data={[
                <>

            <p>
                Another common cause of idle time is I/O. While a task running on a core performs I/O, the core is (mostly)
                idle. We learned about this in the <a href="/pedagogic_modules/single_core_computing">I/O tab of the Single
                Core Computing module</a>. In a parallel program this can translate to loss of parallel efficiency.
            </p>

            <p>
                Let's consider a simple parallel program: 4 tasks that each read in 10 MB of input data and then performs
                400Gflop of computation. The program’s tasks, showing input data files, is depicted below:
            </p>

            <ExampleIODAG />
            <div className="caption"><strong>Figure 1:</strong> Example 4-task parallel program with I/IO.</div>

            <p>
                For now, let's consider an execution of this program on a 1-core computer with a core that computes at 100
                Gflop/sec and a disk with read bandwidth 10 MB/sec (on which the input data files are located). What is the
                execution time? Based on what we learned about I/O, we should strive to overlap I/O and computation as much as
                possible. For instance, the execution could proceed as follows:
            </p>

            <ExampleIODAG1Core />
            <div className="caption"><strong>Figure 2:</strong> Execution on 1 core.</div>

            <p>
                It takes 1 second to read an input file, and then a task computes for 4 seconds. Using overlap of I/O and
                computation, the execution time is thus 17 seconds (only the first file read is not overlapped with
                computation). This is a great utilization of a single core. But what can we gain by running on multiple cores?
            </p>

            <p>
                Let's say now that we have 4 cores. One option is for all 4 tasks to start at the same time, in which case they
                all read their input data at the same time from disk. They split the disk bandwidth evenly, and thus it takes 4
                seconds for each task to read its input. Then each task computes for 4 seconds on its own core. So the program
                runs for 8 second on the 4 cores. This execution is depicted below:
            </p>

            <ExampleIODAG4Cores1 />
            <div className="caption"><strong>Figure 3:</strong> Execution on 4 cores, with simultaneous I/O.</div>

            <p>
                executions, so that only one file is read from disk at a time, and so that I/O is overlapped with computation.
                This alternative is depicted below:
            </p>

            <ExampleIODAG4Cores2 />
            <div className="caption"><strong>Figure 4:</strong> Execution on 4 cores, with staggered I/O.</div>

            <p>The execution time is still 8s, so the two executions are equivalent.</p>

            <p>
                Overall, we achieve a parallel speedup of 17/8 = 2.125 and a parallel efficiency of only about 53%. And this is
                in spite of having 4 identical tasks and 4 cores, which, without I/O, would be 100% efficient. Increasing the
                parallel efficiency would require, for instance, upgrading to a disk with higher read bandwidth.
            </p>

            <Header as="h3" block>
                Simulating I/O Operations
            </Header>

            <p>
                The simulation app below allows you to simulation the execution of a two-task program on a two-core computer.
                Each task reads its own input file and writes its own output file. The program is written such that at any given
                time at most one file is being read/written from/to disk at a time (but computation can happen while I/O is
                happening). For instance, if Task #1 starts writing its output file before Task #2, then Task #2 cannot start
                writing its output file until Task #1's output file has been written. In other words, the execution looks like
                Figure 4 above, and not like Figure 3 above.
            </p>

            <p>
                The app allows you to pick the characteristics (input/output file sizes, amount of work) for Task #1, while Task
                #2 has set characteristics. First run the app with the default values for the characteristics of Task #1, which
                is the easiest case where both tasks are identical. In this case, it does not matter which task reads its input
                file first. Make sure you understand the simulation output. Then you can experiment with different Task #1
                characteristics and different orders of task executions, in particular while answering the practice questions
                below.
            </p>

            <SimulationActivity panelKey="multicore_io" content={<IOSimulation />} />

            <Divider />

            <Header as="h3" block>
                Practice Questions
            </Header>

            <PracticeQuestionMultiChoice
                module={"A.2"}
                question_key={"A.2.p3.3"}
                question={
                    <>
                        A parallel program consists of 2 tasks:
                        <ul>
                            <li>Task #1 reads 20 MB of input, computes 500 Gflop, writes back 100 MB of output</li>
                            <li>Task #2 reads 100 MB of input, computes for 500 Gflop, writes back 100 MB of output</li>
                        </ul>
                        <p>
                            We execute this program on a computer with two cores that compute at 100 Gflop/sec and with a disk with
                            100 MB/sec read and write bandwidth.
                        </p>
                        <p>
                            Is it better to run Task #1 or Task #2 first? Try to come up with an answer via reasoning rather than by
                            estimating the execution time of both options and comparing.
                        </p>
                    </>
                }
                hint={"You can double-check your results in simulation."}
                choices={["It's better to run Task#1 first", "It's better to run Task#2 first"]}
                correct_answer={"It's better to run Task#1 first"}
                explanation={
                    <>
                        <p>
                            It is better to run Task #1 first. This is because it has a small input size, so it can start executing
                            early, and while it computes the input file for Task #2 can be read. This reasoning holds because both
                            tasks compute for the same time and write the same amount of output. The simulation confirms that
                            running Task #1 first is 0.8 seconds faster than running Task #2 first.
                        </p>
                    </>
                }
            />

            <PracticeQuestionNumeric
                module={"A.2"}
                question_key={"A.2.p3.4"}
                question={
                    <>
                        A parallel program consists of 2 tasks:
                        <ul>
                            <li>Task #1 reads 120 MB of input, computes 800 Gflop, writes back 20 MB of output</li>
                            <li>Task #2 reads 100 MB of input, computes for 500 Gflop, writes back 100 MB of output</li>
                        </ul>
                        <p>
                            We execute this program on a computer with two cores that compute at 100 Gflop/sec and with a disk with
                            100 MB/sec read and write bandwidth.
                        </p>
                        <p>
                            Estimate the execution time of the "Task #1 first" option.
                        </p>
                    </>
                }
                hint={
                    "It could be useful to draw the execution as in the figures earlier in this page. You can double-check your result in simulation."
                }
                answer={[9.39,9.41]}
                explanation={
                    <>
                        Here is the time-line of events:
                        <ul>
                            <li>Time 0.0: Task #1 starts reading input</li>
                            <li>Time 1.2: Task #1 starts computing on core 1</li>
                            <li>Time 1.2: Task #2 starts reading input</li>
                            <li>Time 2.2: Task #2 starts computing on core 2</li>
                            <li>Time 7.2: Task #2 start writing output</li>
                            <li>Time 8.2: Task #2 finishes writing output</li>
                            <li>Time 9.2: Task #1 starts writing output</li>
                            <li>Time 9.4: Task #1 finishes writing output</li>
                        </ul>
                        <p>
                            Execution time: 9.4 seconds (which is confirmed in simulation).
                        </p>
                    </>
                }
            />

            <PracticeQuestionNumeric
                module={"A.2"}
                question_key={"A.2.p3.5"}
                question={
                    <>
                        In the previous question, what is the percentage of the execution time for which both cores are utilized?
                    </>
                }
                answer={[53.1,53.3]}
                explanation={
                    <>
                        Both cores are utilized from time 2.2 until time 7.2, that is for 5
                        seconds, which is <TeX math="5 / 9.4 = 53.2\%" /> of the execution time.
                    </>
                }
            />

            <PracticeQuestionNumeric
                module={"A.2"}
                question_key={"A.2.p3.6"}
                question={
                    <>
                        A parallel program consists of 2 tasks:
                        <ul>
                            <li>Task #1 reads 80 MB of input, computes 200 Gflop, writes back 100 MB of output</li>
                            <li>Task #2 reads 100 MB of input, computes for 500 Gflop, writes back 100 MB of output</li>
                        </ul>
                        <p>
                            We execute this program on a computer with two cores that compute at 100 Gflop/sec and with a disk with
                            100 MB/sec read and write bandwidth.
                        </p>
                        <p>
                            We consider the "Task #2 first" execution, which leads to some overall execution time. Say we now
                            increase the work of Task #1. What is the smallest increase that will cause the overall execution time
                            to also increase?
                        </p>
                    </>
                }
                hint={
                    "It could be useful to draw the execution as in the figures earlier in this page. You can double-check your result in simulation."
                }
                answer={[320,320]}
                explanation={
                    <>
                        <p>
                            In this execution, Task #2 finishes its computation at time 6, while Task #1 finishes writing its output
                            at time 100/100 + 80/100 + 200/100 + 100/100 = 4.8. Consequently, Task #1 could compute for 6 - 4.8 =
                            1.2 seconds longer without impacting the execution of Task #2. This means that the overall execution
                            time would increase when Task #1’s work becomes strictly superior to 200 + 120 = 320 Gflop.
                        </p>
                        <p>
                            One can double-check this in simulation, which gives the following execution times for different values
                            of Task #1’s work:
                        </p>
                        <ul>
                            <li>Task #1 work at 200 Gflop: 7.00 seconds (original)</li>
                            <li>Task #1 work at 320 Gflop: 7.00 seconds (no increase)</li>
                            <li>Task #1 work at 321 Gflop: 7.01 seconds (increase)</li>
                        </ul>
                    </>
                }
            />

            <PracticeQuestionMultiChoice
                module={"A.2"}
                question_key={"A.2.p3.7"}
                question={
                    <>
                        A parallel program consists of 2 tasks:
                        <ul>
                            <li>Task #1 reads 200 MB of input, computes 300 Gflop, writes back 10 MB of output</li>
                            <li>Task #2 reads 100 MB of input, computes for 500 Gflop, writes back 100 MB of output</li>
                        </ul>
                        <p>
                            We execute this program on a computer with two cores that compute at 100 Gflop/sec and with a disk with
                            100 MB/sec read and write bandwidth.
                        </p>
                        <p>
                            Which of the two execution options ("Task #1 first" or "Task #2 first") leads to the highest parallel
                            efficiency?
                        </p>
                    </>
                }
                hint={"Use the simulation to determine the execution times for each option as a first step."}
                choices={["Task #1 first", "Task #2 first"]}
                correct_answer={"Task #2 first"}
                explanation={
                    <>
                        <p>
                            The simulation gives the following execution times on 2 cores for each option:
                        </p>
                        <ul>
                            <li>Task #1 first: 9.00 seconds</li>
                            <li>Task #2 first: 7.10 seconds</li>
                        </ul>
                        <p>
                            We now need to determine the sequential execution time for each option. This is similar to what we did
                            in the <a href="/pedagogic_modules/single_core_computing/">I/O tab of the Single Core Computing
                            module</a> when considering overlap of I/O and computation:
                        </p>
                        <ul>
                            <li>Task #1 first: 200/100 + 300/100 + 500/100 + 100/100 = 11.00 seconds</li>
                            <li>Task #2 first: 100/100 + 500/100 + 300/100 + 10/100 = 9.0 seconds</li>
                        </ul>
                        <p>
                            Hence the parallel efficiencies:
                        </p>
                        <ul>
                            <li>Task #1 first: (11.00 / 9.00) / 2 = 61.1%</li>
                            <li>Task #2 first: (9.00 / 7.10) / 2 = 63.3%</li>
                        </ul>
                        <p>
                            The "Task #2 first" option has the highest parallel efficiency, at 63.3%.
                        </p>
                    </>
                }
            />

            <Divider />

            <Header as="h3" block>
                Questions
            </Header>

            <p>
                <strong>[A.2.q3.1]</strong> We are using a computer with 32 GB of RAM. What is the parallel efficiency when
                running 2 tasks on 2 cores if they each require 16 GB of RAM? What if each task requires 20 GB of RAM? Show your
                work. You can answer this question purely via reasoning (i.e., no math).
            </p>

            <p>
                <strong>[A.2.q3.2]</strong> You are given a 2-core computer with 15 GB of RAM. On this computer you need to
                execute 6 tasks. The tasks have different RAM requirements (in GB): 4, 5, 8, 10, 11, 14. Can you achieve 100%
                parallel efficiency? Show your reasoning. Consider the tasks that can be paired (i.e., run simultaneously) and
                determine whether you can find 3 such pairs.
            </p>

            <p>
                <strong>[A.2.q3.3]</strong> A program consists of 3 tasks that each takes in 2 GB of input data and have 30,000
                Gflop work. This program is executed on a 2-core computer with 1 Tflop/sec cores and equipped with a disk with
                250 MB/sec read bandwidth. What is the parallel efficiency if the program can never overlap I/O and computation
                (but multiple I/O operations can happen at the same time)? Show your work and reasoning.
            </p>

            <p>
                <strong>[A.2.q3.4]</strong> Same question as above but now the program always overlaps I/O and computation. Show
                your work and reasoning.
            </p>


                </>
            ]} auth={auth} content="this content"></SigninCheck>

            <Header as="h3" block>
                Your feedback is appreciated
            </Header>

            <FeedbackActivity content={
                <FeedbackQuestions feedbacks={[
                    {
                        tabkey: "ram_and_io",
                        module: "A.2"
                    },
                ]} />
            } />

            </>
            )
            }

export default RamAndIO
