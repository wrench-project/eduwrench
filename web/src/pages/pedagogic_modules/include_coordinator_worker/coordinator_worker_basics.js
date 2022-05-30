import React from "react"
import { Accordion, Divider, Header, Segment } from "semantic-ui-react"
import TeX from "@matejmazur/react-katex"
import LearningObjectives from "../../../components/learning_objectives"
import SimulationActivity from "../../../components/simulation/simulation_activity"
import CoordinatorWorkerBasicsSimulation from "./coordinator_worker_basics_simulation"
import PracticeQuestions from "../../../components/practice_questions_header"

import CoordinatorWorkerNarrative
    from "../../../images/vector_graphs/coordinator_worker/coordinator_worker_narrative.svg"
import { StaticImage } from "gatsby-plugin-image"

const CoordinatorWorkerBasics = ({module, tab}) => {
    return (
        <>
            <LearningObjectives module={module} tab={tab}
            />

            <h2>Basics</h2>

            <p>
                The term <strong>coordinator-worker</strong><sup>1</sup> makes a reference to a typical
                real-life scenario in which a coordinator (or boss) assigns labor to
                workers. The workers just do the tasks assigned to them without knowing or
                worrying about the larger picture. Only the coordinator focuses on the
                larger picture and tries to achieve some performance goal. For instance, it
                may want to minimize overall execution time (or "makespan"), i.e., the time
                at which the last task finishes.
            </p>

            <p>
                The problem is to design a coordinator that assigns work to workers
                judiciously so at to achieve the intended goal. More precisely, the
                coordinator must decide which task should be sent to which worker and when.
                These are called <strong>scheduling decisions</strong>, and there are many <strong>scheduling
                strategies</strong> that a coordinator could employ. The objective of this module
                is not to teach deep scheduling concepts and algorithms, of which there are
                many, but rather to provide you with an introduction to this complex topic
                and give your a feel for it via hands-on experiments.
            </p>

            <h2>Parallelism through Coordinator-Worker</h2>

            <CoordinatorWorkerNarrative />
            <div className="caption"><strong>Figure 1:</strong> Coordinator-worker setup.</div>

            <p>
                Figure 1 above shows the typical view of a coordinator-worker setup. <strong>You will note that this is
                very similar to the client-server setup that we studied in the previous module.</strong> In fact,
                one can view coordinator-worker as an extension of client-server in which the client (the coordinator)
                uses the servers (the workers) to perform many tasks in parallel. You may recall that in the client-server
                module,
                practice question <i>A.3.2.p1.3</i> touched on the notion that the client could have more than
                one task to perform. This was really a coordinator-worker scenario. For simplicity, we
                assume that all data is in RAM (i.e., no disks).
            </p>

            <p>
                Given a set of tasks to perform, <i>whenever there is at least an idle
                worker</i> the coordinator decides which task should be executed next and on
                which idle worker. The input data of the task is sent to the chosen worker,
                which then performs the task's computation. In this module, we consider
                that the client has a set of <strong>independent tasks</strong>, i.e., tasks can be
                completed in any order. In the next module, we consider distributed
                computing with <i>dependent tasks</i>.
            </p>

            <h2>Coordinator-Worker Scheduling Strategies</h2>

            <p>
                You have likely already heard of <i>scheduling</i> in real-world contexts (train schedules, classroom
                schedules). At the most abstract level, scheduling is about assigning work to resources throughout a time
                period. We have briefly encountered the concept of scheduling in the <a
                href="/pedagogic_modules/multi_core_computing">Task Dependencies of the Multicore computing module</a>. You
                may also have encountered the term in Operating Systems <a href="/textbooks"
                                                                           style={{ backgroundColor: "#f7f7f7" }}>textbooks</a>.
                The OS constantly makes
                scheduling decisions regarding which program runs next on which core and for how long.
            </p>

            <p>
                Here, we consider the following <strong>scheduling problem</strong>: given a set of tasks, each with some input
                data, and a set of workers, each connected to the coordinator via a separate network link, how should tasks be
                sent to the (idle) workers so that the last task to complete finishes as early as possible?
            </p>

            <p>
                It turns out that there are many possible <strong>scheduling strategies</strong>. The template for
                the scheduling strategy used by our coordinator will be as follows:
            </p>

            <pre>
  while there is a task to execute:{"\n"}
                {"  "}if there is at least one idle worker:{"\n"}
                {"    "}a) choose a task to execute{"\n"}
                {"    "}b) choose an idle worker{"\n"}
                {"    "}c) trigger the execution of the chosen task on the chosen worker{"\n"}
                {"  "}else:{"\n"}
                {"    "}wait for a worker to be idle{"\n"}
      </pre>

            <br></br>
            <p>
                Step a) and b) define the strategy, and it is easy to come up with a bunch of options. Here are "a few":
            </p>

            <ul>
                <li><strong>a) Task selection options:</strong></li>
                <ul>
                    <li>Pick a random task</li>
                    <li>Pick the task with the highest work (i.e., highest Flop)</li>
                    <li>Pick the task with the lowest work (i.e., lowest Flop)</li>
                    <li>Pick the task with the highest input data size</li>
                    <li>Pick the task with the lowest input data size</li>
                    <li>Pick the task with the highest work/data ratio</li>
                    <li>Pick the task with the lowest work/data ratio</li>
                </ul>
            </ul>

            <ul>
                <li><strong>b) Worker selection options:</strong></li>
                <ul>
                    <li>Pick a random worker</li>
                    <li>Pick the fastest worker (i.e., highest Flop/sec)</li>
                    <li>Pick the best-connected worker (i.e., highest link MB/sec)</li>
                    <li>Pick the worker that can complete the task the earliest (based on a back-of-the-envelope estimate)</li>
                </ul>
            </ul>

            <p>
                The above defines <TeX math="7 \times 4 = 28" /> different scheduling strategies, and we
                could come up with many more! The big question of course is whether any of
                these strategies are good. Intuitively, it would seem that doing random
                task selection and random worker selection would be less effective than,
                e.g., picking the task with the highest work and running it on the worker
                that can complete it the earliest. The only way to know whether this
                intuition holds is to try it out.
            </p>

            <p>
                For Step c) we simply assume that the coordinator can <i>trigger</i> a task execution on an
                idle workers (which will entail sending input, computing, and receiving output) and
                immediately proceed to the next iteration of the while loop.
            </p>

            <Accordion style={{ border: "1px solid #333", borderRadius: "0.2em" }} panels={[
                {
                    key: "latency-water-pipe",
                    title: {
                        content: (
                            <strong>
                                Click to see mode details about Step c)
                            </strong>
                        )
                    },
                    content: {
                        content: (
                            <>
                                <Segment style={{ border: 0, backgroundColor: "#f7f7f7" }}>
                                    <p style={{ backgroundColor: "#f7f7f7" }}>
                                        Say that we have 10 workers that compute at 1 Gflop/sec, each connected to
                                        the coordinator by a 1 GB/sec link, and that we have 10 tasks that each
                                        have 1 GB of input and 1 Gflop of work. Then, each task completes in 2
                                        seconds (a bit more due to network effects that we are overlooking here),
                                        and all tasks run completely in parallel, so that they all complete at the
                                        same time.
                                    </p>

                                    <p style={{ backgroundColor: "#f7f7f7" }}>
                                        This is only possible if step c) takes zero (or very little) time in the
                                        strategy, so that the coordinator can trigger task executions
                                        instantly and, importantly, <i>asynchronously</i>. The work
                                        "asynchronous" here means that the coordinator triggers a task execution and can
                                        continue immediately without having to wait for that task to be completed.
                                    </p>

                                    <p style={{ backgroundColor: "#f7f7f7" }}>
                                        There are many ways to implemented step c) in software. For instance, a
                                        commonplace approach would be to start a separate "thread" to handle each
                                        new task execution (see Operating
                                        Systems <a href="/textbooks" style={{ backgroundColor: "#f7f7f7" }}>textbooks</a> for more
                                        details).
                                    </p>
                                </Segment>
                            </>
                        )
                    }
                }
            ]} />

            <Header as="h3" block>
                Simulating Coordinator-Worker
            </Header>

            <p>
                The simulation app below allows you to simulate arbitrary coordinator-worker scenarios. Task and worker
                specifications are entered using the format indicated in the input form, separated by commas. You can also pick
                which scheduling strategy is used. You can use this app on your own, but you should use it to answer
                some of the practice questions below.
            </p>

            <SimulationActivity panelKey="coordinator-worker-basics-simulation"
                                content={<CoordinatorWorkerBasicsSimulation />} />

            <Divider />

            <PracticeQuestions questions={[
                {
                    key: "A.3.3.p1.1",
                    question: "If all tasks have the same specifications and all the workers have the same specifications, " +
                        "does it matter which options are picked for task and worker selection? Explain your reasoning.",
                    content: (
                        <>
                            No, it does not matter. Since every task looks like every other task and every worker looks like
                            every other worker, all options will lead to the same schedule. If a task runs on a worker in
                            10 seconds, and if we have <strong>n</strong> tasks and <strong>m</strong> workers, then the total execution time will
                            be <TeX math="\lceil n/m \rceil \times 10" /> for all scheduling strategies. You can verify this with the
                            simulation app.
                        </>
                    )
                },
                {
                    key: "A.3.3.p1.2",
                    question: (
                        <>
                            Consider a scenario in which we have 5 tasks and 3 workers.
                            Workers have the following specs:
                            <ul>
                                <li>Worker #1: 10 MB/sec link; 100 Gflop/sec speed</li>
                                <li>Worker #2: 30 MB/sec link; 80 Gflop/sec speed</li>
                                <li>Worker #3: 20 MB/sec link; 150 Gflop/sec speed</li>
                            </ul>
                            <p>and tasks have the following specs:</p>
                            <ul>
                                <li>Task #1: 100 MB input; 2000 Gflop work</li>
                                <li>Task #2: 100 MB input; 1500 Gflop work</li>
                                <li>Task #3: 200 MB input; 1000 Gflop work</li>
                                <li>Task #4: 200 MB input; 1500 Gflop work</li>
                                <li>Task #5: 300 MB input; 2500 Gflop work</li>
                            </ul>
                            <p>So the simulation input for this scenario would be:</p>
                            <pre>
                Workers: 10 100, 30 80, 20 150{"\n"}
                                Tasks: 100 2000, 100 1500, 200 1000, 200 1500, 300 2500
              </pre>
                            <p>
                                If we use the "highest work first" task selection strategy, and the "fastest host first" host
                                selection strategy, what is the total execution time (as given by the simulation)?
                                Can you, based on simulation output, confirm that the scheduling strategy works as expected?
                            </p>
                            <p>
                                What is the execution time if we switch from "highest work first" to "lowest work first"? Do you have
                                any intuition for why the result is at it is?
                            </p>
                        </>
                    ),
                    content: (
                        <>
                            <p>
                                The execution completes in <strong>61.51 seconds</strong>. Inspecting the task execution timeline
                                we find that the coordinator makes the first three scheduling decisions as follows:
                            </p>
                            <ul>
                                <li>Task #5 (2500 Gflop) on worker #3 (150 Gflop/sec)</li>
                                <li>Task #1 (2000 Gflop) on worker #1 (100 Gflop/sec)</li>
                                <li>Task #2 (1500 Gflop) on worker #2 (80 Gflop/sec)</li>
                            </ul>
                            <p>These decisions correspond to the "highest work first / highest speed first" strategy.</p>
                            <p>
                                When going from "highest work first" to "lowest work first", the execution time becomes <strong>82.01
                                seconds</strong>, that is 20.50 seconds slower! One intuition for this is that if we run first the
                                "quick" tasks, then at the end of the execution one can be left waiting for a long task to finish. This
                                is exactly what is happening here as seen in the task execution timeline. We see that Task #5 starts
                                last. Due to bad luck, it starts on Worker #1, the only idle host at that time. This is a worker with
                                low bandwidth and not great speed. Since Task #5 has high data and high work, any scheduled in which it
                                does not start early is not going to be great.
                            </p>
                        </>
                    )
                },
                {
                    key: "A.3.3.p1.3",
                    question: (
                        <>
                            We consider the same setup as in the previous question. In the previous question we
                            took a "let's care about work only" approach. Let's now take a "let's care about data only"
                            approach.<br /><br />
                            <p>
                                What is the execution time when using the "highest data" task selection strategy, and the "best
                                connected" worker selection strategy? Explain how the result changes when we switch to the "lowest data"
                                task selection strategy? How do these results compare to those in the previous section?
                            </p>
                        </>
                    ),
                    content: (
                        <>
                            <p>Here are the execution time, including those in the previous question:</p>
                            <ul>
                                <li>highest work / fastest: 61.51 seconds</li>
                                <li>lowest work / fastest: 82.01 seconds</li>
                                <li>highest data / best-connected: 51.01 seconds</li>
                                <li>lowest data / best-connected: 70.25 seconds</li>
                            </ul>
                            <p>
                                Using "highest data / best-connected" is the better option here, and going to "lowest data" is worse.
                                Just like in the previous question, the "lowest xxx" task selection option is a mistake. This makes
                                sense from a load-balancing perspective. We do not want to be "stuck" with a long task
                                at the end of the execution.
                            </p>
                            <p>
                                These results mean that, <strong>for this setup,</strong> caring about data is more important than
                                caring about computation. Such statements need to be taken with a grain of salt since
                                they may not be generalizable to other setups.
                            </p>
                        </>
                    )
                },
                {
                    key: "A.3.3.p1.4",
                    question: "Still for the same setup as in the previous question, run the purely random/random strategy " +
                        "10 times (or more). Report on the worst and best execution times it achieves. How does this seemingly " +
                        "bad approach compare to the previous approaches? Discuss. (hint: if you run this sufficiently many " +
                        "times, you should see some good results).",
                    content: (
                        <>
                            <p>
                                Here are times obtained with 10 experiments: 56.50, 82.01, 47.67, 50.76, 61.26, 56.01, 64.00, 61.51,
                                56.51, 54.26. Of course you may
                                have obtained different results, but if you ran more than 10 experiments you probably saw all the above
                                numbers at least once, and others.
                            </p>
                            <p>
                                The worst time above is 82.01 seconds, which is equivalent to the "lowest work / fastest" strategy. But
                                we see a very low 47.67 seconds result! This is
                                much better than anything we saw above. Here is the set of decisions:
                            </p>
                            <ul>
                                <li>[0.00][coordinator] Launching execution of Task #2 on Worker #3</li>
                                <li>[0.00][coordinator] Launching execution of Task #4 on Worker #2</li>
                                <li>[0.00][coordinator] Launching execution of Task #1 on Worker #1</li>
                                <li>[15.25][coordinator] Notified that Task #2 has completed</li>
                                <li>[15.25][coordinator] Launching execution of Task #5 on Worker #3</li>
                                <li>[25.75][coordinator] Notified that Task #4 has completed</li>
                                <li>[25.75][coordinator] Launching execution of Task #3 on Worker #2</li>
                                <li>[30.50][coordinator] Notified that Task #1 has completed</li>
                                <li>[45.26][coordinator] Notified that Task #3 has completed</li>
                                <li>[47.67][coordinator] Notified that Task #5 has completed</li>
                            </ul>
                            <p>with the following task execution timeline:</p>
                            <StaticImage
                                src="../../../images/gantt_screenshot.jpg"
                                alt="gantt screenshot"
                                backgroundColor="#fff"
                                style={{ marginRight: "1em", maxWidth: "75%" }}
                            />
                            <p>
                                This is a particularly good execution as Task #5 and Task #3 finish almost at the same time. There may
                                be even better options. You can double-check with the simulation that <strong>none</strong> of the other
                                strategies come up with this execution.
                            </p>
                            <p>
                                So, there are some "needles in the haystack", but finding them is difficult. Sometimes, "random/random"
                                finds one, but sometimes it is not so lucky and performs rather poorly. One would rather have a strategy
                                that is never bad, even though it may never find the needles in the haystack.
                            </p>
                        </>
                    )
                },
                {
                    key: "A.3.3.p1.5",
                    question: "Come up with input to the simulation app for 2 workers and 4 tasks, such that the \"highest " +
                        "work first / fastest\" strategy is not as good as the \"highest work first / earliest completion\" " +
                        "strategy.",
                    content: (
                        <>
                            <p>
                                The trick here is to deal with data, since the "earliest completion" strategy should take
                                the data transfers into account. The way to construct a counter-example is to look
                                at two very different workers and to "force" one of the strategies to make a very
                                wrong decision. Let's consider these two workers:
                            </p>
                            <ul>
                                <li>Worker #1: 2000 MB/sec link; 500 Gflop/sec speed</li>
                                <li>Worker #2: 20 MB/sec link; 1000 Gflop/sec speed</li>
                            </ul>
                            <p>Let's use these four tasks:</p>
                            <ul>
                                <li>Task #1: 1000 MB input; 310 Gflop work</li>
                                <li>Task #2: 300 MB input; 300 Gflop work</li>
                                <li>Task #3: 10 MB input; 10 Gflop work</li>
                                <li>Task #4: 10 MB input; 10 Gflop work</li>
                            </ul>
                            <p>
                                Tasks #1 and #2 will be scheduled first (because they have the highest work). The
                                "fastest" host selection strategy will put Task #1 on Worker #2 and Task #2
                                on Worker #1, since it only looks at compute speeds. But this is a poor
                                decision because Task #1 has the largest input size, and Worker #2 has
                                low bandwidth. Instead, the "earliest completion" strategy should avoid this
                                mistake because it accounts for both data and computation.
                            </p>
                            <p>Let's verify this in simulation with the following simulator input:</p>
                            <pre>
              Workers: 2000 500, 20 1000{"\n"}
                                Tasks: 1000 310, 300 300, 10 10, 10 10
              </pre>
                            <br />
                            <p>The simulated execution times are:</p>
                            <ul>
                                <li>"highest work first / fastest": 52.81 seconds</li>
                                <li>"highest work first / earliest completion": 16.05 seconds</li>
                            </ul>
                        </>
                    )
                },
                {
                    key: "A.3.3.p1.6",
                    question: "Come up with a simple scenario (e.g., 2 workers and 2 tasks) for which none of the strategies " +
                        "above is optimal. In other words, for that scenario, you can yourself come up with a solution that is " +
                        "better than that that produced by all the strategies.",
                    content: (
                        <>
                            <p>
                                Say we have two identical tasks, with negligible input size. We have two workers,
                                one that is very fast and one that is very slow. The best approach is to run both
                                tasks on the very fast worker and completely give up on trying to use the very slow
                                worker. But the strategies above always assign tasks to workers whenever possible (i.e.,
                                whenever there is a yet-to-be-executed task and an idle worker). And so, in this simple
                                scenario, none of them can produce the optimal execution.
                            </p>
                            <p>
                                This is an example in which adding one extra worker (the slow one), hurts overall execution time.
                                To remedy this situation, we need a much smarter scheduling strategy that would say: "don't assign
                                work to an idle worker, A, if a faster worker, B, will become idle and then complete that task
                                before A would". This leads us down the path of a "planning" strategy that comes up
                                with the schedule ahead of time.
                            </p>
                        </>
                    )
                }
            ]} />

            <Divider />

            <h2>Beyond our simple Coordinator-Worker setup</h2>

            <p>
                We have made several assumptions regarding our
                coordinator-worker setup. Our goal was not to consider all possible
                setups, but instead to consider a simple one that is sufficient to introduce
                you to notions of scheduling.
            </p>
            <p>
                For instance, we have assumed that all data is in RAM, so that we do not need to take disk I/O into account.
                This is still realistic for some setups. For instance, if the coordinator has a fast disk, does efficient
                pipelining of disk I/O and network communications (see the <a href="/pedagogic_modules/client_server">Pipelining
                tab of the Client-Server module</a>), and workers keep all data in RAM. But we could have considered a scenario
                in which both the coordinator and the workers have relatively slow disks and do arbitrary pipelining. In this
                case it becomes even more difficult to reason about the execution (let's be thankful for having simulation!).
            </p>
            <p>
                We have also assumed that each worker is connected to the coordinator via
                a single, private link. But many other practical situations can occur. For
                instance, the network could be such that all workers are connected to the
                coordinator via a single shared network link, in which case data transfers
                experience contention on that link. In this case, it may not be judicious
                to trigger task executions on all idle workers as aggressively. Or there
                could be a two-link network path from the coordinator to each worker, where
                the first link is shared by all workers, but the second link is dedicated
                to the worker. This would resemble more closely real-world network setups.
                Regardless, when moving away from individual private links, reasoning about
                the execution becomes much more difficult (let's <i>again</i> be thankful for
                simulation!).
            </p>
            <p>
                Also, we have only focused on overall execution time as our performance metric. But
                many other metrics are possible, such as monetary cost (in case each worker charges
                some hourly rate as in commercial clouds) or energy consumption (as different
                workers may be more or less power-efficient). Considering different metrics
                leads to different results for scheduling strategies, and typically suggests
                new strategies. One can even try to target multiple metrics at once. For instance,
                one could say "I want to execute the tasks as fast as possible but without exceeding
                some energy budget".
            </p>
            <p>
                Exploring these more realistic, but often more relevant to practice, setups
                can take you down fascinating paths that lead to Computer Science research. But
                for now, how about just answering the questions below?
            </p>

            <Divider />

            <Header as="h3" block>
                Questions
            </Header>

            <p>Say that you have three workers with the following specs:</p>
            <ul>
                <li>Worker #1: 1 GB/sec link; 50 Gflop/sec speed</li>
                <li>Worker #2: 100 MB/sec link; 100 Gflop/sec speed</li>
                <li>Worker #3: 100 MB/sec link; 1000 Gflop/sec speed</li>
            </ul>
            <p>On these workers, we need to run the following four tasks:</p>
            <ul>
                <li>Task #1: 100 MB input; 10 Gflop work</li>
                <li>Task #2: 100 MB input; 100 Gflop work</li>
                <li>Task #3: 1 GB input; 500 Gflop work</li>
                <li>Task #4: 1 GB input; 1500 Gflop work</li>
            </ul>

            <p><strong>[A.3.3.q1.1]</strong> If the tasks are assigned to workers in the order that
                both are numbered (Task #1 goes to Worker #1, Task #2 to Worker #2, Task #3
                to Worker #3, and Task #4 to the first worker that becomes idle). What will
                the total execution time be? Show your work. In particular, give the
                completion times of the first 3 tasks, so as to determine the completion
                time of the fourth task.
            </p>

            <p><strong>[A.3.3.q1.2]</strong> Could you find one of the above scheduling strategies
                (i.e., those implemented in the simulation) that improves on the execution
                time in the previous question? Try to develop an intuition before verifying
                your answer using the simulation app. Show your work and reasoning. Hint:
                think of why the schedule in the previous question is inefficient, and of
                what we could do to make it better (it all has to do with the 4th task).
            </p>

            <Divider />

            <p>
                Say you have three identical workers, all with 100 MB/sec links and 100
                Gflop/sec speed. On these workers you need to run the following workload:
            </p>
            <ul>
                <li>Task #1: 2 GB input; 500 Gflop work</li>
                <li>Task #2: 2 GB input; 500 Gflop work</li>
                <li>Task #3: 2 GB input; 500 Gflop work</li>
                <li>Task #4: 1.6 GB input; 1 Tflop work</li>
            </ul>
            <p>The coordinator software implements the "highest data / best-connected" scheduling strategy.</p>
            <p>So the simulator input would be:</p>
            <pre>
      Workers: 100 100, 100 100, 100 100{"\n"}
                Tasks: 2000 500, 2000 500, 2000 500, 1600 1000{"\n"}
                Task Scheduling: Highest data{"\n"}
                Worker Scheduling: Best-connected worker
      </pre>
            <br />
            <p>
                <strong>[A.3.3.q1.3]</strong> Estimate the total execution time, showing your work. Then verify your answer
                in simulation.
            </p>

            <p>
                <strong>[A.3.3.q1.4]</strong> You have the option to upgrade the CPUs to double the
                compute speed on all of the workers, or to upgrade the connection on one of
                the workers, doubling its bandwidth. Which of these options is best
                (assuming the coordinator still uses the "highest data / best-connected"
                scheduling strategy). Come up with an answer just by reasoning first, showing your work. Then
                check your answer in simulation.
            </p>

            {/*<p><strong>[A.3.3.q1.5]</strong> Pick two scheduling strategies (or more exactly to pairs or task/worker selection strategies), ignoring*/}
            {/*the random strategies. Come up with a coordinator-worker setup in which the first strategy does well and for which*/}
            {/*the second strategy does worse. Then come up with another coordinator-worker setup in which the situation is reversed.*/}
            {/*Alternately, you can try to argue why one of the two strategies is always better than the other.</p>*/}

            <Divider />

            <div className="footnote">
                <sup>1</sup> In an attempt to suppress oppressive language, we have renamed the commonly
                used <i>master-worker</i> term by <i>coordinator-worker</i> as suggested in <a
                href="https://tools.ietf.org/id/draft-knodel-terminology-00.html#rfc.section.1.1"
                target="_blank" rel="noreferrer">this article</a>.
            </div>

        </>
    )
}

export default CoordinatorWorkerBasics
