import React, {useEffect, useState} from "react"
import { Divider, Header } from "semantic-ui-react"
import TeX from "@matejmazur/react-katex"
import LearningObjectives from "../../../components/learning_objectives"
import FeedbackActivity from "../../../components/feedback/feedback_activity";
import FeedbackQuestions from "../../../components/feedback_questions";
import PracticeQuestionNumeric from "../../../components/practice-questions/numeric";
import PracticeQuestionReveal from "../../../components/practice-questions/reveal";
import SigninCheck from "../../../components/signin_check";

const TaskParallelism = ({module, tab}) => {

    const [auth, setAuth] = useState("false")
    useEffect(() => {
        setAuth(localStorage.getItem("login"))
    })

    return (
        <>
            <LearningObjectives module={module} tab={tab}
            />

            <h2>Basic Concept</h2>

            <p>
                A multi-core processor provides multiple processing units, or cores, that are capable of executing computer code
                independently of each other. Multi-core processors have become ubiquitous. This is because starting in the early
                2000’s it became increasingly difficult, and eventually impossible, to increase the clock rate of processors.
                The reasons are well-documented power/heat issues (see the 2007 classic <a
                href="http://www.gotw.ca/publications/concurrency-ddj.htm" target="_blank" rel="noreferrer"> The Free Lunch Is Over </a>
                article). As a solution to this problem, microprocessor manufacturers started producing multi-core processors.
            </p>

            <p>
                For a program to exploit the compute power of a multi-core processor, it must create <strong>tasks</strong> that
                can run at the same time on different cores. This is called <strong> parallelism </strong> and we call this kind
                of programs <strong>parallel programs</strong>. There are a few ways in which a program can implement this
                notion of tasks, such as having tasks be different processes or different threads. See Operating Systems <a
                href="/textbooks/">textbooks</a> for details on processes and threads, and how they communicate and/or share
                memory. In these pedagogic modules we will mostly refer to tasks, without needing to specify the underlying
                implementation details.
            </p>

            <p>
                Each task in a parallel program performs some computation on some input data, which can be in RAM or on disk,
                and which produces some output data. For instance, we could have a 5-task program where each task renders a
                different frame of a movie. Or we could have a program in which tasks do different things altogether. For
                instance, a 2-task program could have one task apply some analysis to a dataset and another task render a live
                visualization of that dataset.
            </p>

            <p>
                As mentioned in the <a href="/pedagogic_modules/single_core_computing">Single Core Computing</a> module, we do
                not consider time sharing. That is, <strong>we will only consider executions in which at most one task runs on a
                core at a given time</strong>. Operating systems do allow time-sharing (as explained in the <a
                href="/pedagogic_modules/single_core_computing">Time Sharing tab of the Single Core Computing module</a>). But
                time sharing incurs performance penalties. The typical approach when aiming for high performance is to avoid
                time sharing altogether. Therefore, in all that follows, a task that begins executing on a core executes
                uninterrupted and by itself on that same core until completion.
            </p>

            <Divider />

            <h2>Speedup and Efficiency</h2>

            <p>
                A common motivation for running the tasks of a program on multiple cores is speed. For example, if you have
                tasks
                that a single core can complete in one hour, it will take four hours to complete four tasks. If you have two
                cores
                in a computer, now you can complete the same four tasks in less time, ideally in two hours. <strong>With
                parallelism we can decrease program execution time</strong>. Note that another common term for "execution time"
                is <i>makespan</i>.
            </p>

            <p>
                Unfortunately, most real-world programs do not have ideal parallelism behavior. In other words, they do not
                run <TeX math="p" /> times faster when executed on <TeX math="p" /> cores. Instead, they execute less
                than <TeX math="p" /> times faster. This may seem surprising, but comes about due to many reasons. One of these
                reasons is that program tasks running on different cores still compete for shared hardware and/or software
                resources. Each time tasks compete for such resources, i.e., one task has to wait for the other task being done
                using that resource, there is a loss in parallel efficiency. These resources can include the network card, the
                disk, the network, the operating system’s kernel data structures. One hardware resource for which program tasks
                that run on different cores almost always compete is the memory hierarchy, e.g., the L3 cache and the memory
                bus (we refer you to Computer Architecture <a href="/textbooks/">textbooks</a> for details on the memory
                hierarchy). The memory hierarchy is thus a notorious culprit for loss of parallel efficiency loss.
            </p>

            <p>
                In this module, we make the simplifying assumptions that program tasks running on different cores do not compete
                for any of the above resources. <i>And yet, there are other reasons why a program cannot achieve ideal
                parallelism!</i> Before we get to these reasons, let us first define two crucial metrics: <i>Parallel Speedup
                and Parallel Efficiency.</i>
            </p>

            <h2>Parallel Speedup</h2>

            <p>
                Parallel speedup, or just <i>speedup</i>, is a metric used to quantify the reduction in execution time of a
                parallel program due to the use of multiple cores. It is calculated by dividing the execution time of the
                program when executed on a single core by the execution time of this same program when executed on multiple
                cores. Let <TeX math="p" /> be the number of cores used to execute a program. The speedup on
                <TeX math="p" /> cores is:
            </p>

            <TeX math="\text{Speedup}(p) = \frac{\text{Execution Time with 1 core}}{\text{Execution Time with p cores}}"
                 block />

            <p>
                For instance, if a program runs in 3 hours on 1 core but runs in 2 hours on 2 cores, then its speedup is:
            </p>

            <TeX math="\text{Speedup}(2) = \frac{3}{2} = 1.5" block />

            <p>
                In this example, we would be somewhat "unhappy" because although we have 2 cores, we only go 1.5 times faster.
                We would likely be hoping to go twice as fast. Let’s quantify this "disappointment" formally using another
                metric!
            </p>

            <h2>Parallel Efficiency</h2>

            <p>
                Parallel efficiency, or just <strong>efficiency</strong>, is a metric that captures how much useful work the
                cores can do for a program, or how much "bang" do you get for your "buck". The "bang" is the speedup, and the
                "buck" is the number of cores.
            </p>

            <p>
                More formally, the efficiency of an execution on p cores is:
            </p>

            <TeX math="\text{Efficiency}(p) = \frac{\text{Speedup}(p)}{p}" block />

            <p>
                If the speedup on 2 cores is 1.5, then the efficiency on 2 cores is:
            </p>

            <TeX math="\text{Efficiency}(2) = \frac{1.5}{2} = 0.75 = 75\%" block />

            <p>
                Ideally, the efficiency would be 100%, which corresponds to going <TeX math="p" /> times faster with <TeX
                math="p" /> cores. In the above example, it is only 75%. This means that we are "wasting" some of the available
                compute capacity of our computer during the program’s execution. We have 2 cores, but our performance is as if
                we had only 1.5 cores. In other terms, we are wasting half the compute power of a core. In the next tab we
                explore one of the reasons why such waste occurs.
            </p>

            <Divider />

            <Header as="h3" block>
                Practice Questions
            </Header>

            <SigninCheck data={[
                <>

                    <PracticeQuestionNumeric
                        module={"A.2"}
                        question_key={"A.2.p1.1"}
                        question={
                            <>
                                Consider a parallel program that runs in 1 hour on a single core of a computer. The program's
                                execution on 6 cores has 80% parallel efficiency. What is the program’s execution time in minutes when running on
                                6 cores?
                            </>
                        }
                        answer={[12.5,12.5]}
                        explanation={
                            <>
                                Let <TeX math="S" /> be the speedup on 6 cores for this program. Since the efficiency is equal
                                to <TeX math="S/6" />, we have <TeX math="S/6 = 0.8" />, which gives us <TeX math="S = 4.8" />.
                                Therefore, the program runs in <TeX math="60/4.8 = 12.5" /> minutes.
                            </>
                        }
                        hint={"First compute the parallel speedup, and form it infer the execution time"}
                    />

                    <PracticeQuestionReveal
                        module={"A.2"}
                        question_key={"A.2.p1.2"}
                        question={
                            <>
                                A parallel program has a speedup of 1.6 when running on 2 cores, and runs 10 minutes faster when running
                                on 3 cores than when running on 2 cores. Give a formula for <TeX math="T(1)" /> (the execution time on one
                                core in minutes) as a function of <TeX math="T(3)" /> (the execution time on 3 cores in minutes).
                            </>
                        }
                        explanation={
                            <>
                                <p>Because the speedup on 2 cores is 1.6, we have: <TeX math="T(2) = T(1) / 1.6" /></p>
                                <p>And the 10-minute time reduction gives us: <TeX math="T(3) = T(2) -  10" /></p>
                                <p>Therefore, <TeX math="T(3) = T(1) / 1.6 - 10" /></p>
                                <p>which we can rewrite as: <TeX math="T(1) = 1.6 \times (T(3) + 10)" /></p>
                            </>
                        }
                    />

                </>
            ]} auth={auth} content="practice questions"></SigninCheck>


            <Divider />

            <Header as="h3" block>
                Questions
            </Header>

            <SigninCheck data={[
                <>

                    <p>
                        <strong>[A.2.q1.1]</strong> You are told that a parallel program runs in 1 hour on a 3-core machine, and that
                        the parallel efficiency is 90%. How long, in minutes, would the program take if executed using a single core?
                        Show your work.
                    </p>

                    <p>
                        <strong>[A.2.q1.2]</strong> You are told that a parallel program runs in 10 hours when using the 4 cores of some
                        computer with parallel efficiency 80%. Using 8 cores, the program runs in 6 hours. What is the parallel
                        efficiency of this 8-core execution? Show your work and reasoning.
                    </p>

                </>
            ]} auth={auth} content="questions"></SigninCheck>

            <Header as="h3" block>
                Your feedback is appreciated
            </Header>

            <FeedbackActivity content={
                <FeedbackQuestions feedbacks={[
                    {
                        tabkey: "task_parallelism",
                        module: "A.2"
                    },
                ]} />
            } />

        </>
    )
}

export default TaskParallelism
