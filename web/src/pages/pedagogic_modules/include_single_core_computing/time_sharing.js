import React from "react"
import { Divider, Header } from "semantic-ui-react"
import TeX from "@matejmazur/react-katex"
import LearningObjectives from "../../../components/learning_objectives"
import PracticeQuestions from "../../../components/practice_questions_header"
import FeedbackQuestions from "../../../components/feedback_questions"
import FeedbackActivity from "../../../components/feedback/feedback_activity"
import PracticeQuestionNumeric from "../../../components/practice-questions/numeric";

const TimeSharing = ({module, tab}) => {
    return (
        <>
            <LearningObjectives module={module} tab={tab}
            />

            <h2>Time Sharing</h2>

            <p>
                As you know, you can execute multiple programs at once on your computer (e.g., your Web browser and a text
                editor). This is called multi-programming, something that Operating Systems have known how to do since the
                1960's. Considering <strong>a single core</strong>, the Operating System allows a program to run for a while,
                then another program, and so on until we cycle back and repeat. This is called <strong>time sharing</strong>.
                How this is done is one of the core topics of all Operating System <a href="/textbooks">textbooks</a>.
            </p>

            <p>
                In these pedagogic modules we take a very high-level, ideal view: When running n programs at the same time on
                one core, each of them proceeds at <i>1/n</i>-th of the core’s compute speed. This is not true in practice, as
                time sharing has some overhead. Also, programs compete for some hardware resources, such as caches (see Computer
                Architecture and Operating Systems <a href="/textbooks">textbooks</a> for all details), and thus can slow each
                other down.
            </p>

            <p>
                With our ideal model, say that at time 0 two programs are started on a single core with speed 1Gflop/sec. If
                both programs have work 5 Gflop, then they both complete at time 10 sec. Say now that the second program has
                work of 10 Gflop. Then the first program will complete at time 10, and the second program at time 15. During the
                first 10 seconds, both programs proceed at speed 0.5 Gflop/sec. At time 10 the first program thus completes
                (because it has performed all its work), at which point the second program proceeds at full 1 Gflop/sec speed.
                Since the second program still has 5 units of work to complete, it runs for another 5 seconds and completes at
                time 15.
            </p>

            <p>
                As you go through upcoming models, you will not that we almost always avoid time sharing altogether by never
                running two programs at the same time on a single core. This is typical when one focuses on high performance.
                However, the reasoning needed to compute how time sharing would impact program execution times is general and
                applicable to other settings (e.g., sharing of network bandwidth). This is why we include below some questions
                on this topic.
            </p>

            <Divider />

            <Header as="h3" block>
                Practice Questions
            </Header>

            <PracticeQuestionNumeric
                module={"A.1"}
                question_key={"A.1.p2.1"}
                question={
                    <>
                        At time 0 on a core with speed 2 Tflop/sec you start two programs. Program A's work is
                        200 Gflop, and program B’s work is 220 Gflop. At what times do the programs complete?
                    </>
                }
                hint={
                    <>
                        Think of the execution proceeding in two distinct phases, and add up the execution time of each phase.
                    </>
                }
                answer={[0.2,0.21]}
                explanation={
                    <>
                        In a first phase, both programs proceed at speed 1 TFLop/sec. Program A completes first at time:
                        <TeX math="T_{A} = \frac{0.2 \text{Tflop}}{1 \text{Tflop/sec}} = 0.2 \text{sec}" block />
                        At that point, program <TeX math="B" /> still has 20 Gflop left to compute, but it now proceeds at speed
                        2 Tflop/sec. Therefore, it completes at time:
                        <TeX math="T_{B} = T_{A} + \frac{0.02 \text{Tflop}}{2 \text{Tflop/sec}} = 0.21 \text{sec}" block />
                    </>
                }
            />

            <PracticeQuestionNumeric
                module={"A.1"}
                question_key={"A.1.p2.2"}
                question={
                    <>
                        Two programs, each with work 800 Tflop, were started at the same time on a core and
                        both completed simultaneously after one hour. What is the core's speed in Gflop/sec?
                    </>
                }
                answer={[444,445]}
                explanation={
                    <>
                        <TeX
                            math="\text{speed} = 2 \times \frac{800000 \text{Gflop}}{ 3600 \text{sec}} \simeq 444.44 \text{Gflop/sec}"
                            block />
                    </>
                }
            />

            <Divider />

            <Header as="h3" block>
                Questions
            </Header>

            <p>
                <strong>[A.1.q2.1]</strong> Two programs are started at the same time on a core. These programs both have work 1
                Tflop, and both complete after 220 seconds. What was the core speed in Gflop/sec? Show your work.
            </p>

            <p>
                <strong>[A.1.q2.2]</strong> Three programs, A, B, and C, were started at the same time on a core with speed 600
                GFLop/sec. After 10 seconds, A and C complete. Then, 2 seconds later, program B completes. What is the work (in
                Gflop) of each of the three programs? Show your work.
            </p>

            <p>
                <strong>[A.1.q2.3]</strong> A program, A, with work 4 Tflop is started on a core of speed 500 Gflop/sec. 5
                seconds later another program B, is started. Both programs finish at the same time. What is the work of B in
                Tflop? Show your work.
            </p>

            <Divider />

            <Header as="h3" block>
                Feedback Questions
            </Header>

            <FeedbackActivity content={
                <FeedbackQuestions feedbacks={[
                    {
                        key: "Feedback A.1.2",
                        feedback: "feedback",
                    },
                ]} />
            } />
        </>
    )
}

export default TimeSharing
