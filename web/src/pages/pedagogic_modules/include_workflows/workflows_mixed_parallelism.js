import React, {useEffect, useState} from "react"
import { Divider, Header } from "semantic-ui-react"
import TeX from "@matejmazur/react-katex"
import LearningObjectives from "../../../components/learning_objectives"
import SimulationActivity from "../../../components/simulation/simulation_activity"
import WorkflowsMixedParallelismSimulation from "./workflows_mixed_parallelism_simulation"
import PracticeQuestions from "../../../components/practice_questions_header"

import WorkflowsMixedParallelismWorkflow
    from "../../../images/vector_graphs/workflows/workflow_task_data_parallelism_workflow.svg"
import WorkflowsMixedParallelismQuestion
    from "../../../images/vector_graphs/workflows/workflow_task_data_parallelism_workflow_question.svg"
import PracticeQuestionNumeric from "../../../components/practice-questions/numeric";
import PracticeQuestionMultiChoice from "../../../components/practice-questions/multichoice";
import FeedbackActivity from "../../../components/feedback/feedback_activity";
import FeedbackQuestions from "../../../components/feedback_questions";
import SigninCheck from "../../../components/signin_check";

const WorkflowsMixedParallelism = ({module, tab}) => {

    const [auth, setAuth] = useState("false")
    useEffect(() => {
        setAuth(localStorage.getItem("login"))
    })

    return (
        <>
            <LearningObjectives module={module} tab={tab}
            />

            <h2>Basic concept</h2>

            <p>
                So far in this module we have only considered sequential tasks. In other words, each task can only use a single
                core. But in the <a href="/pedagogic_modules/multi_core_computing">Data-Parallelism tab of the Multicore
                Computing module]</a>, we learned about <strong>Data Parallelism</strong>: the notion that a sequential task can
                be rewritten as a set of parallel tasks, with perhaps a remaining sequential portion of the execution. Then, in
                that same tab, we learned about <strong>Amdahl's Law</strong>, which quantifies the data-parallel task's
                execution time on a given number of cores, given what fraction of the task's work has to remain sequential. You
                may want to review this content before proceeding.
            </p>
            <p>
                <i>Let's consider workflows in which some tasks are data-parallel</i>. For these tasks we need to decide
                how many cores they should use. So our workflow has both task-parallelism (like all workflows) and
                data-parallelism. This is often called "mixed" parallelism.
            </p>

            <SigninCheck data={[
                <>


                    <h2>An example</h2>

                    <WorkflowsMixedParallelismWorkflow />
                    <div className="caption"><strong>Figure 1:</strong> A simple workflow with some data-parallel tasks (<TeX
                        math="\alpha" /> is the fraction of the work that is non-parallelizable).
                    </div>

                    <p>
                        Figure 1 above shows an example workflow with both task- and data-parallelism. For simplicity, we completely
                        ignore files and I/O. The green and red tasks are not data-parallel, and can run only on a single core. The
                        blue, yellow, and purple tasks are data-parallel. For each one of these tasks, in addition to its amount of
                        work, we also indicate the value of <TeX math="\alpha" />, the fraction of the work that can be parallelized.
                        Based on Amdahl's law, a data-parallel task with work <TeX math="w" /> Gflop runs on a <TeX math="p" />-core
                        computer, where core speed is <TeX math="s" /> Gflop/sec, in time:
                    </p>
                    <TeX math="T(p) = \frac{\alpha \times \frac{w}{s}}{p} + (1 - \alpha) \times \frac{w}{s}" block />

                    <p>
                        The above equation just means that the parallelizable portion of the sequential execution time (the left term)
                        is accelerated by a factor <TeX math="p" /> when executed in parallel on <TeX math="p" /> cores, while the
                        sequential portion (the right term) remains sequential.
                    </p>

                    <p>
                        Say we are running this workflow on a 4-core computer where cores compute at speed 100 Gflop/sec.
                        We could run each of the data-parallel tasks using 4 cores. In this case, here is the execution time of each
                        task:
                    </p>
                    <ul>
                        <li>Green: <TeX math="1.00" /> sec</li>
                        <li>Blue: <TeX math="10 \times 0.9 / 4 + 10 \times 0.1 = 3.25" /> sec</li>
                        <li>Yellow: <TeX math="20 \times 0.85 / 4 + 20 \times 0.15 = 7.25" /> sec</li>
                        <li>Purple: <TeX math="12 \times 0.80 / 4 + 12 \times 0.20 = 4.80" /> sec</li>
                        <li>Red: <TeX math="1.00" /> sec</li>
                    </ul>

                    <p>
                        No two tasks can run at the same time. So the total execution time is the sum of the task execution times,
                        i.e., 17.30 seconds.
                    </p>

                    <p>
                        There are many other options! For instance, we could run the blue task using 2 cores, the yellow task using 2
                        cores, and the purple task using 4 cores, for the following task execution times:
                    </p>
                    <ul>
                        <li>Green: <TeX math="1.00" /> sec</li>
                        <li>Blue: <TeX math="10 \times 0.9 / 2 + 10 \times 0.1 = 5.50" /> sec</li>
                        <li>Yellow: <TeX math="20 \times 0.85 / 2 + 20 \times 0.15 = 11.5" /> sec</li>
                        <li>Purple: <TeX math="12 \times 0.80 / 4 + 12 \times 0.20 = 4.80" /> sec</li>
                        <li>Red: <TeX math="1.00" /> sec</li>
                    </ul>

                    <p>
                        But now the blue and yellow tasks can run simultaneously! So the execution time is: <TeX
                        math="1 + 11.5 + 4.80 + 1 = 18.30" /> seconds. This option is not as good as the previous one.
                    </p>

                    <p>
                        How many options are there? Well, for each of the 3 tasks we have 4 options, so that is <TeX
                        math="4^3 = 64" /> options!!! One (or more) of these options has to be the best one, and one (or more) has to be
                        the worst one. For instance, running all tasks on a single core would waste 1 core of our 4-core computer, and
                        is clearly not as good as running some of the tasks on 2 cores.
                    </p>

                    <Header as="h3" block>
                        Simulating Task- and Data-Parallelism
                    </Header>

                    <p>
                        The simulation app below makes it possible to simulate the execution of the above example workflow on a platform
                        that comprises <strong>two 3-core hosts</strong>. Again, remember that in this tab we ignore all I/O. The app
                        allows you to pick how many cores are used for the blue, yellow, and purple tasks. The execution strategy, when
                        picking tasks to assign to idle cores, always picks tasks in the order yellow, blue, purple. But turns out this
                        does not matter in terms of application performance (because we have only 3 tasks to run on the 2 compute
                        hosts). You can use this app on your own, but then you should use it to answer the following practice questions.
                    </p>

                    <SimulationActivity panelKey="workflows-mixed-parallelism-simulation"
                                        content={<WorkflowsMixedParallelismSimulation />} />

                    <Divider/>

                    <Header as="h3" block>
                        Practice Questions
                    </Header>

                    <PracticeQuestionNumeric
                        module={"A.3.4"}
                        question_key={"A.3.4.p4.1"}
                        question={
                            <>
                                Estimate the execution time when all data-parallel tasks use 3 cores.
                            </>
                        }
                        hint={"You can double-check your answer in simulation"}
                        answer={[11.5,11.7]}
                        explanation={
                            <>
                                <p>With 3 cores, here are the data-parallel task execution times:</p>
                                <ul>
                                    <li>Blue task: <TeX math="0.90 \times 10 / 3 + 0.10 \times 10 = 4.00" /> seconds</li>
                                    <li>Yellow task: <TeX math="0.85 \times 20 / 3 + 0.15 \times 20 = 8.66" /> seconds</li>
                                    <li>Purple task: <TeX math="0.80 \times 12 / 3 + 0.20 \times 12 = 5.60" /> seconds</li>
                                </ul>
                                <p>The blue and purple tasks run on the same host, for a total time of 9.60 seconds, while the yellow
                                    task runs on the other host.</p>
                                <p>The total execution time is thus 11.60 seconds, which is confirmed by the simulation.</p>
                            </>
                        }
                    />

                    <PracticeQuestionMultiChoice
                        module={"A.3.4"}
                        question_key={"A.3.4.p4.2"}
                        question={
                            <>
                                Say that you must configure two of the data-parallel tasks to use  1 core, and the third one
                                to use 3 cores.  Which task should use 3 cores to achieve the shortest execution time?  Come up with
                                an answer based on reasoning (i.e., without computing anything), and then check your intuition in
                                simulation.
                            </>
                        }
                        choices={[
                            "The blue task",
                            "The yellow task",
                            "The purple task"
                        ]}
                        correct_answer={"The yellow task"}
                        explanation={
                            <>
                                <p>The yellow task has 2000 Gflop work, so, even though its <TeX math="\alpha" /> is not as high as that
                                    of the blue task, we should give it the 3 cores!</p>
                                <p>The simulation gives us the following total execution times:</p>
                                <ul>
                                    <li>when giving 3 cores to the blue task: 22 seconds</li>
                                    <li>when giving 3 cores to the yellow task: 14 seconds</li>
                                    <li>when giving 3 cores to the purple task: 22 seconds</li>
                                </ul>
                                <p> Our intuition is confirmed. The fact that the other two options have the same execution time is simply
                                    because the yellow task is the task that determines the execution time.</p>
                            </>
                        }
                    />

                    <PracticeQuestionMultiChoice
                        module={"A.3.4"}
                        question_key={"A.3.4.p4.3"}
                        question={
                            <>
                                Say we configure each data-parallel to run on 2 cores. Which of these tasks  will run on the
                                same host? Come up with an answer using either reasoning (i.e., don't compute anything), and then
                                double-check it in simulation.
                            </>
                        }
                        choices={[
                            "The blue and yellow tasks",
                            "The blue and purple tasks",
                            "The yellow and purple tasks"
                        ]}
                        correct_answer={"The blue and purple tasks"}
                        explanation={
                            <>
                                When using 2 cores, the yellow task will still be the longest task, so it will be placed by
                                itself on a host. The blue and purple task will run on the same host. This is confirmed in the
                                simulation output.
                            </>
                        }
                    />

                    <PracticeQuestionMultiChoice
                        module={"A.3.4"}
                        question_key={"A.3.4.p4.4"}
                        question={
                            <>
                                Because the yellow task is so expensive, we decide to always run it on 3 cores. Is it better
                                to give 1 core to the blue task and 2 cores to the purple task, or the other way around?
                            </>
                        }
                        choices={[
                            "It's better to give 1 core to the blue tasks and 2 cores to the purple tasks",
                            "It's better to give 2 cores to the blue tasks and 1 core to the purple tasks",
                        ]}
                        correct_answer={"It's better to give 1 core to the blue tasks and 2 cores to the purple tasks"}
                        explanation={
                            <>
                                <p>All data-parallel tasks run simultaneously.</p>
                                <p>First, does this matter? That is, if the yellow task runs for, say 13 seconds, it does not really
                                    matter what we do with the blue and purple tasks. Turns out that the yellow task runs in time <TeX
                                        math="20 \times 0.85 / 3 + 20 \times 0.15 = 8.66" /> seconds. So the yellow task will not determine
                                    the execution time, and yes, the choice in the question matters.</p>
                                <p> If we give 1 core to the blue task, then it runs in 10 seconds, and determines the execution time. If
                                    instead we give 1 core to the purple task, it will run in 12 seconds, and determines the execution time.
                                    So we should give 2 cores to the purple task and 1 core to the blue task.</p>
                            </>
                        }
                    />

                    <Divider />

                    <Header as="h3" block>
                        Questions
                    </Header>

                    <p>Considering the workflow below, answer the following questions.</p>
                    <WorkflowsMixedParallelismQuestion />
                    <br /><br />

                    <p>
                        <strong>[A.3.4.q4.1]</strong> If we are given two hosts with 100 Gflop/sec hosts, where host1 has 20 cores and
                        host2 has 40 cores. Should we run the blue task on host1 or on host2 (if our objective is to run the workflow as
                        quickly as possible)? Show your work, execution each task execution time on each host.
                    </p>

                    <p>
                        <strong>[A.3.4.q4.2]</strong> If, instead, we run the workflow on a single 4-core computer, what is the best
                        approach? Show your work, estimating the execution times of each task on 1, 2, 3, and 4 cores, and considering
                        all ways to assign cores to each task.</p>

                    <p>
                        <strong>[A.3.4.q4.3]</strong> Say now we are running our workflow on a single 40-core host. What is the best way
                        to allocate cores to the blue and purple tasks? If you are really into it, you can do this completely
                        analytically (it requires finding roots of degree-2 polynomials). More easily, you can simply write the
                        execution time as a function of the number of cores allocated to the blue task, and plot this function to find
                        where it attains its minimum visually. There are many websites on which you can do this (search for "graphing
                        calculator"). Show your work.
                    </p>

                    <Header as="h3" block>
                        You feedback is appreciated
                    </Header>

                    <FeedbackActivity content={
                        <FeedbackQuestions feedbacks={[
                            {
                                tabkey: "workflows_mixed_parallelism",
                                module: "A.3.4"
                            },
                        ]} />
                    } />

                </>
            ]} auth={auth} content="this content"></SigninCheck>


        </>
    )
}

export default WorkflowsMixedParallelism
