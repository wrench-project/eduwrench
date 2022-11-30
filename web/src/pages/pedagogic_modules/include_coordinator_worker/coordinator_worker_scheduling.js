import React, {useEffect, useState} from "react"
import { Accordion, Divider, Header, Segment } from "semantic-ui-react"
import TeX from "@matejmazur/react-katex"
import LearningObjectives from "../../../components/learning_objectives"
import SimulationActivity from "../../../components/simulation/simulation_activity"
import PracticeQuestions from "../../../components/practice_questions_header"
import CoordinatorWorkerSchedulingSimulation from "./coordinator_worker_scheduling_simulation"
import FeedbackQuestions from "../../../components/feedback_questions";
import FeedbackActivity from "../../../components/feedback/feedback_activity";
import PracticeQuestionReveal from "../../../components/practice-questions/reveal";
import SigninCheck from "../../../components/signin_check";

const CoordinatorWorkerScheduling = ({module, tab}) => {

    const [auth, setAuth] = useState("false")
    useEffect(() => {
        setAuth(localStorage.getItem("login"))
    })

    return (
        <>
            <LearningObjectives module={module} tab={tab}
            />

            <p>
                In the previous tab, you were able to simulate particular coordinator-worker setups
                with different scheduling strategies. But it is difficult to draw general
                conclusions from just a few particular test cases. Instead, what we need to do is
                <strong>compare scheduling strategies on many test cases</strong>.
            </p>

            <SigninCheck data={[
                <>

                    <Header as="h3" block>
                        Simulating Many Test Cases
                    </Header>

                    <p>
                        Below is a simulation app that makes is possible to evaluate a scheduling
                        strategy on multiple randomly generated scenarios. The app returns the
                        minimum, average, and maximum execution times over all these scenarios.
                        This makes it possible to draw some informed conclusions on the relative merit
                        of different strategies. But analysis of experimental data is a complicated matter,
                        and we are only scratching the surface here. To do actual "research", we would
                        need a much more comprehensive experimental framework.
                    </p>
                    <p>
                        The simulation app is a bit more complicated than that in the previous tab. It allows you to specify:
                    </p>
                    <ul>
                        <li>A number of workers</li>
                        <li>Ranges of worker link bandwidths and worker speeds, from which actual values are sampled randomly</li>
                        <li>A number of tasks</li>
                        <li>Ranges of task input sizes and works, from which actual values are sampled randomly</li>
                        <li>Task and worker selection strategies</li>
                        <li>A number of experiments to run</li>
                        <li>A seed for the random number generator (changing the seed to any integer will change the random samplings
                            above)
                        </li>
                    </ul>
                    <p>
                        You can use this application on your own, but below are practice questions that guide you through some
                        interesting experiments.
                    </p>

                    <SimulationActivity panelKey="coordinator-worker-scheduling-simulation"
                                        content={<CoordinatorWorkerSchedulingSimulation />} />

                    <Divider />

                    <Header as="h3" block>
                        Practice Questions
                    </Header>

                    <p>In the questions below we follow paths of investigation to
                        confirm some expectations about how different strategies compare
                        and to find out which strategies work best. There are many other
                        paths that we could follow, and many more experiments we could perform
                        to strengthen (or weaken!) our claims.
                    </p>

                    <PracticeQuestionReveal
                        module={"A.3.3"}
                        question_key={"A.3.3.p2.1"}
                        question={
                            <>
                                We have said in previous modules that a good idea is
                                likely to prioritize long tasks. Consider a coordinator-worker setup in
                                which workers are all identical (i.e., they are <i>homogeneous</i>) and tasks
                                have negligible input size but a wide range of work amounts, so that task
                                execution times on the workers are in the [1 sec, 10 sec] range.
                                <p>For this setup, let's consider the following strategies:</p>
                                <ul>
                                    <li>random / fastest</li>
                                    <li>highest work / fastest</li>
                                    <li>lowest work / fastest</li>
                                </ul>
                                <p>How do you think these strategies rank? Explain your reasoning.</p>
                                <p>
                                    Check whether your expectations are confirmed in simulation (by coming up
                                    with appropriate simulation input). Using a small number of workers and,
                                    say, twice as many tasks should be sufficient. Also, do not forget
                                    to run a statistically significant number of experiments (e.g., the "number
                                    of experiments" should be at least 30).
                                </p>
                            </>
                        }
                        explanation={
                            <>
                                <p>
                                    Based on what was said in previous modules, the highest work / fastest
                                    strategy should be best, and lowest work / fastest should be worse or
                                    perhaps comparable to random / fastest. The random strategy should have a
                                    wider min-max range, since it might find a "needle in the hay stack", but
                                    might also do complete nonsense.
                                </p>
                                <p>
                                    Let's use the following setup: 5 workers, with 100 Gflop/sec
                                    speed and 100 MB/sec bandwidth (i.e., speed is in the [100,100] range and
                                    bandwidth in the [100,100] range). On these workers we run 10
                                    tasks, with 1 MB input (i.e., in the [1,1] range) and work in the [100,
                                    1000] range. Let's use the default 12345 seed and 30 experiments.
                                </p>
                                <p>The results are as follows ([min : mean : max]):</p>
                                <ul>
                                    <li>random / fastest: [8.21 sec : 14.62 sec : 19.83 sec]</li>
                                    <li>highest work / fastest: [8.22 sec : 12.11 : 17.04 sec]</li>
                                    <li>lowest work / fastest: [9.08 sec : 14.16 sec : 17.89 sec]</li>
                                </ul>
                                <p>
                                    The expectations are confirmed: highest work is best on average; random is a bit
                                    worse than lowest work on average, but can be better in terms of the min
                                    but also quite a bit worse in terms of the max.
                                </p>
                            </>
                        }
                    />

                    <PracticeQuestionReveal
                        module={"A.3.3"}
                        question_key={"A.3.3.p2.2"}
                        question={
                            <>
                                Say that now, in addition to having task work amounts vary by a 10x factor, worker speeds also
                                vary by a 10x factor. Are results different when comparing the three strategies in the previous
                                question? Discuss.
                            </>
                        }
                        explanation={
                            <>
                                <p>Setting worker speeds in the range [100, 1000], we obtain:</p>
                                <ul>
                                    <li>random / fastest: [1.73 sec : 3.43 sec : 5.68 sec]</li>
                                    <li>highest work / fastest: [1.61 sec : 3.27 sec : 5.96 sec]</li>
                                    <li>lowest work / fastest: [2.01 sec : 3.43 sec : 5.89 sec]</li>
                                </ul>
                                <p>
                                    Results are pretty similar. It seems that the
                                    "highest work" idea
                                    is a good one (at least on average) even when workers are heterogeneous, provided we pick the
                                    fastest workers.
                                </p>
                            </>
                        }
                    />

                    <PracticeQuestionReveal
                        module={"A.3.3"}
                        question_key={"A.3.3.p2.3"}
                        question={
                            <>
                                Let us now consider a fully heterogeneous setup in which we
                                have <strong>20 workers</strong> and <strong>10 tasks</strong> with:
                                <ul>
                                    <li>worker speeds in the [100, 1000] range</li>
                                    <li>worker bandwidths in the [100, 1000] range</li>
                                    <li>task work amounts in the [100, 1000] range</li>
                                    <li>task input data in the [100, 1000] range</li>
                                </ul>
                                <p>
                                    Say we still select tasks based on the "highest work" criterion. Among all
                                    the available worker selection strategies, which one do you think would work
                                    best and why? Confirm your expectation in simulation:
                                </p>
                            </>
                        }
                        explanation={
                            <>
                                <p>
                                    The "fastest" and "best-connected" strategies only consider one
                                    aspect of task executions, and thus they could make very wrong decisions.
                                    Random, as usual, could work well sometimes, but is probably not very
                                    consistent. Earliest completion, does consider both aspects, and should do
                                    the best.
                                </p>
                                <p>Simulation results confirm the above:</p>
                                <ul>
                                    <li>highest work / random: [2.86 sec : 6.46 sec : 12.43 sec]</li>
                                    <li>highest work / fastest: [2.10 sec : 4.74 sec : 8.82 sec]</li>
                                    <li>highest work / best-connected: [2.14 sec : 4.97 sec : 8.24 sec]</li>
                                    <li>highest work / earliest completion: [1.81 sec : 2.41 sec : 3.93 sec]</li>
                                </ul>
                            </>
                        }
                    />

                    <PracticeQuestionReveal
                        module={"A.3.3"}
                        question_key={"A.3.3.p2.4"}
                        question={
                            <>
                                In the previous question, we purposely had more workers than tasks. What if now we were to
                                have, say, 4 times as many tasks as workers. Do you think the different strategies considered in the
                                previous question would be closer together or further apart in terms of their results? Explain.
                                Verify your expectation experimentally. <i>Note that simulation times could be a few seconds with 30 samples</i>
                            </>
                        }
                        explanation={
                            <>
                                <p>
                                    When there are fewer tasks than workers, it is critical to pick the right
                                    workers (which the "earliest completion" strategy does very well). But as we add tasks, all workers are
                                    used to run the first batch of tasks. Then the faster workers will become
                                    idle first, and used again. So as the number of tasks grows, we would
                                    expect all strategies to behave more similarly. This is confirmed in
                                    simulation using 80 tasks and 20 workers (30 samples):
                                </p>
                                <ul>
                                    <li>highest work / random: [9.56 sec : 13.00 sec : 18.21 sec]</li>
                                    <li>highest work / fastest: [9.32 sec : 12.85 sec : 17.95 sec]</li>
                                    <li>highest work / best-connected: [9.42 sec : 12.77 sec : 18.81 sec]</li>
                                    <li>highest work / earliest completion: [9.51 sec : 13.09 sec : 18.02 sec]</li>
                                </ul>
                                <p>
                                    The main observation is that random really looks as good as anything
                                    else now! And in fact, earliest completion is a bit worse! Welcome
                                    to the confusing world of scheduling.
                                </p>
                            </>
                        }
                    />

                    <Divider />

                    <Header as="h3" block>
                        Questions
                    </Header>

                    <p>
                        <strong>[A.3.3.q.2.1]</strong> Create an imbalanced platform in which workers have
                        compute speed in some range <TeX math="[x, 10\times x]" /> but have bandwidths
                        in range <TeX math="[x, 20\times x]" />. In other words, the network plays a bigger
                        role than the computation, assuming that tasks have balanced input sizes
                        and amounts of work (e.g., both are in range <TeX math="[x, 5\times x]" />). Verify
                        experimentally that the "highest byte" task selection strategy is
                        indeed more effective than the "highest work" strategy. What about
                        the "lowest byte" task selection strategy? Do you think it would perform
                        well? Confirm your expectation experimentally.
                    </p>

                    <p>
                        <strong>[A.3.3.q.2.2]</strong> In the practice questions above, we did not consider
                        the "ratio" worker selection strategies (i.e., the "highest work/byte" and
                        "highest byte/work" strategies). Come up with experimental campaigns to
                        determine whether these strategies are worthwhile.
                    </p>



                    <FeedbackActivity content={
                        <FeedbackQuestions feedbacks={[
                            {
                                tabkey: "coordinator_worker_experiments",
                                module: "A.3.3"
                            },
                        ]} />
                    } />

                </>
            ]} auth={auth} content="this content"></SigninCheck>



        </>
    )
}

export default CoordinatorWorkerScheduling
