import React from "react"
import { Divider, Header } from "semantic-ui-react"
import TeX from "@matejmazur/react-katex"
import LearningObjectives from "../../../components/learning_objectives"
import ClientServerBasicsSimulation from "./client_server_basics_simulation"
import SimulationActivity from "../../../components/simulation/simulation_activity"
import PracticeQuestions from "../../../components/practice_questions_header"

import ClientServerImage from "../../../images/vector_graphs/client_server/client_server.svg"
import ClientServerQuestion from "../../../images/vector_graphs/client_server/client_server_question.svg"
import FeedbackActivity from "../../../components/feedback/feedback_activity";
import FeedbackQuestions from "../../../components/feedback_questions";
import PracticeQuestionNumeric from "../../../components/practice-questions/numeric";
import PracticeQuestionMultiChoice from "../../../components/practice-questions/multichoice";

const ClientServerBasics = ({module, tab}) => {
    return (
        <>
            <LearningObjectives module={module} tab={tab}
            />

            <h2>Client-Server Model</h2>

            <p>
                In a client/server model a <strong>client</strong>, that is a program running on some
                computer, wishes to perform some <i>computational task</i>, but does not want
                to or cannot perform it itself (e.g., insufficient hardware resource,
                missing necessary software, missing necessary proprietary
                data/credentials). Another program, the <strong>server</strong>, is running on another
                computer and can perform the task. The client sends the task's input data
                <i>over the network</i> to the server, and the server replies <i>over the network</i>
                with the task's output data.
                Many applications and websites are clients, where they receive
                information from the end user and forward their request to a server for
                actual processing.
            </p>

            <p>
                The performance of a client-server setup thus depends on the network on
                which the data is transferred back and forth, and on the hardware at the
                server. If a task requires a lot of data compared to its computation, then
                the network will be a critical component, otherwise it will be the server
                hardware. Furthermore, if multiple clients use the same server, the
                clients will compete for the server's hardware.
                Finally, there can be more than one server available, in which
                case the client could choose to use the one that would get
                the job done faster.
            </p>

            <h2>An Example: Photo Processing</h2>

            <p>
                On your computer, the "client", you have a <strong>100 MB image</strong> in RAM,
                as part of a machine learning program that you want to use to
                detect particular objects in images (e.g., count the numbers of cars). But
                this program does not implement the fancy algorithm you would like to apply to
                the image, say, because it is proprietary while your program is free
                software. However, you can access remote servers on which the software that
                implements the algorithm is installed so that you can use it
                over the network. This is provided by the company that develops the fancy
                algorithm, as an advertisement of its capabilities. The fancy algorithm
                performs <strong>1000 Gflop</strong> of work on the 100 MB image.
            </p>

            <p>The following picture depicts this setup:</p>

            <ClientServerImage />
            <div className="caption"><strong>Figure 1:</strong> Example client-server setup with two servers.</div>

            <p>
                The client can use one of two servers: <strong>Server #1</strong>, which you can access via a network link
                with only 10 MB/sec bandwidth, but with a core that computes at speed 100 Gflop/sec; and <strong>Server
                #2</strong>, which you can access via a 100 MB/sec network link, but with a core that only computes at speed 60
                Gflop/sec. The latency for these network links is negligible and can be disregarded because the image is large.
                Also, the output of the algorithm (the number of cars) is only a few bytes, which is negligible. <i>So, from a
                performance perspective, the task's execution consists of two phases: sending the image data over and applying
                the algorithm to it.</i> The image is sent directly from the RAM on the client to the server program which
                receives it and keeps in RAM. <strong>That is, for now, we assume no disk I/O whatsoever.</strong>
            </p>

            <Header as="h3" block>
                Simulating Client-Server Execution
            </Header>

            <p>
                Below is an app that you can use to simulate the
                above client-server setup. Try to simulate the execution with
                each server (use the radio button to select the server to use), leaving
                all values to their default. You should notice a difference in
                execution time. Even though Server #1 has a better CPU, it is connected
                to the client via a low-bandwidth link. Server #2 is thus
                able to finish execution more quickly than Server #1. Then,
                answer the practice questions hereafter, using the simulation app
                to come up with or double-check answers.
            </p>

            <SimulationActivity panelKey="client-server-basics-simulation" content={<ClientServerBasicsSimulation />} />

            <Divider />

            <Header as="h3" block>
                Practice Questions
            </Header>

            <PracticeQuestionNumeric
                module={"A.3.2"}
                question_key={"A.3.2.p1.1"}
                question={
                    <>
                        The client's link to Server #2 is faster than that to Server #1. What should the bandwidth to
                        Server #1 be, in MB/sec, so that Server #1 would be equivalent to Server #2 from the client's perspective?
                    </>
                }
                hint={"You should write (and solve) and equation where the bandwidth to Server #1 is the unknown. You can check your answer using the simulation app."}
                answer={[13.04, 13.06]}
                explanation={
                    <>
                        The task execution time on Server #2 is:
                        <TeX
                            math="T_{\text{server 2}} = \frac{100 \text{MB}}{100 \text{MB/sec}} + \frac{1000 \text{Gflop}}{60 \text{Gflop/sec}} = 17.66 \text{sec}"
                            block />

                        <p>
                            We can double-check this result in simulation, which gives us an execution time of
                            17.72 seconds. The discrepancy is because the
                            simulation simulates details that our estimate above does not capture.
                            (See the <a href="/pedagogic_modules/networking_fundamentals/">Networking Fundamentals module</a>).
                        </p>

                        <p>
                            Let <TeX math="B" /> be the unknown bandwidth to Server #1, in MB/sec. The task execution time on Server
                            #1 would then be:
                        </p>
                        <TeX math="T_{\text{server 1}} = \frac{100 \text{MB}}{B} + \frac{1000 \text{Gflop}}{100 \text{Gflop/sec}}"
                             block />

                        <p>To determine <TeX math="B" /> we just need to solve:</p>
                        <TeX math="T_{\text{server 1}} = T_{\text{server 2}}" block />

                        <p>which gives us: <TeX math="B = 13.05 \text{MB / sec}" />.</p>

                        <p>
                            We can double-check this result in simulation by setting the bandwidth to Server #1 to 13 MB/sec (close
                            enough). The simulation shows execution times of 18.08 secs for Server #1, which is very close
                            to that for Server #2.
                        </p>
                    </>
                }
            />

            <PracticeQuestionMultiChoice
                module={"A.3.2"}
                question_key={"A.3.2.p1.2"}
                question={
                    <>
                        It is possible to set a bandwidth to Server #1 so that the task execution time with that server
                        is one third of the execution time with the original 10 MB/sec bandwidth? Show your work and reasoning.
                    </>
                }
                choices={["Yes","No"]}
                correct_answer={"No"}
                explanation={
                    <>
                        The original execution time on Server #1, according to the simulation, is 20.50 seconds. So our target is
                        20.50/3 = 6.83 seconds. Since the compute time is 10 seconds, the answer is no, it is not possible to have
                        a task execution time that low.
                    </>
                }
            />

            <PracticeQuestionNumeric
                module={"A.3.2"}
                question_key={"A.3.2.p1.3"}
                question={
                    <>
                        Say you now have <strong>two images</strong> to process, each of them 100 MB and requiring 1000 Gflop of
                        work. Bandwidth to Server #1 is set to the original 10 MB/sec.

                        <p>Assuming your client program can do two network transfers at the same time, what would be the total
                            execution time in seconds (using both servers)?</p>
                    </>
                }
                answer={[20.5,20.5]}
                explanation={
                    <>
                        If our client program can do simultaneous network transfers, since the client is connected to the servers
                        via two different network links, then the execution time would be:
                        <TeX math="\max(20.50, 17.72) = 20.50 \text{seconds}." block />
                    </>
                }
            />

            <PracticeQuestionNumeric
                module={"A.3.2"}
                question_key={"A.3.2.p1.4"}
                question={
                    <>
                        In the context of the previous question, what would be the best possible execution time, in seconds, if
                        your client program can only do one network transfer at a time?
                    </>
                }
                answer={[21, 21]}
                explanation={
                    <>
                        <p>If our client cannot do simultaneous network transfers, we have two options: either
                            we first send an image to Server #1 and then send the other image to Server #2, or the other
                            way around. Let's examine both options, giving the timeline of events for each based on
                            back-of-the-envelope calculations:</p>

                        <ul>
                            <li><strong>Server #1 first:</strong></li>
                            <ul>
                                <li>time 0: start sending an image to Server #1</li>
                                <li>time 10: image received by Server #1, which starts computing; and start sending image to Server
                                    #2
                                </li>
                                <li>time 11: image received by Server #2, which starts computing</li>
                                <li>time 10 + 1000/100 = 20: Server #1 finishes computing</li>
                                <li>time 11 + 1000/60 = 27.66: Server #2 finishes computing</li>
                            </ul>
                        </ul>

                        <ul>
                            <li><strong>Server #2 first:</strong></li>
                            <ul>
                                <li>time 0: start sending an image to Server #2</li>
                                <li>time 1: image received by Server #2, which starts computing; and start sending image to Server
                                    #1
                                </li>
                                <li>time 11: image received by Server #1, which starts computing</li>
                                <li>time 1 + 1000/60 = 17.66: Server #2 finishes computing</li>
                                <li>time 11 + 1000/100 = 21: Server #1 finished computing</li>
                            </ul>
                        </ul>

                        <p>The second option is 6.66 seconds faster than the first option. As we have already seen, simulation
                            results would be a bit different, but not to the extent that the first option would be faster!</p>

                        <p>This example highlights a pretty well-known rule of thumb: trying to get computers to compute as early
                            as possible is a good idea. In our case, this works out great because Server #2 can get the image really
                            quickly, and is slower than Server #1 for computing. So we achieve much better overlap of communication
                            and computation with the second option than with the first option. This is exactly the same idea as
                            overlapping I/O and computation as see in the <a href="/pedagogic_modules/single_core_computing">I/O tab
                                of the Single Core Computing module</a>.</p>
                    </>
                }
            />

            <Divider />

            <Header as="h3" block>
                Questions
            </Header>

            <p>
                Given the client-server setup below (note that servers are multi-core, and that the task to execute
                has both an input and an output file), answer the following <strong>four questions</strong>:
            </p>

            <ClientServerQuestion />
            <div className="caption"><strong>Figure 2:</strong> Another example client-server setup with two servers.</div>

            Once again, you will answer these questions using back-of-the-envelope estimates, even though simulation
            would produce slightly different results.

            <p>
                <strong>[A.3.2.q1.1]</strong> Assuming that the task can use only 1 core, which server should be used? Show your
                work.
            </p>

            <p>
                <strong>[A.3.2.q1.2]</strong> Assuming now that the task is data-parallel and can run on
                any number of cores, always with 100% parallel efficiency, which server
                would be used? Show your work.
            </p>

            <p>
                <strong>[A.3.2.q1.3]</strong> It turns out the parallel efficiency of the data-parallel
                task is not 100%. You observe that on Server #1 the execution, using all 4
                cores, takes 15 sec. What is the task's parallel efficiency? Show your work. Write
                an equation where the parallel efficiency is the unknown and solve it.
            </p>

            <p>
                <strong>[A.3.2.q1.4]</strong> Assuming that the task's parallel efficiency is 60%
                regardless of the number of cores, what should the network bandwidth to
                Server #1 be for both servers to complete the task in the same amount of
                time (including the time to get the task's input data)? Show your work.
                Write an equation where the bandwidth is the unknown and solve it.
            </p>

            <Header as="h3" block>
                You feedback is appreciated
            </Header>

            <FeedbackActivity content={
                <FeedbackQuestions feedbacks={[
                    {
                        tabkey: "client_server_basics",
                        module: "A.3.2"
                    },
                ]} />
            } />

        </>
    )
}

export default ClientServerBasics
