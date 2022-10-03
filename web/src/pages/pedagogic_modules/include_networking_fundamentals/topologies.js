import React, {useEffect, useState} from "react"
import { Divider, Header } from "semantic-ui-react"
import TeX from "@matejmazur/react-katex"
import LearningObjectives from "../../../components/learning_objectives"
import PracticeQuestions from "../../../components/practice_questions_header"

import Topology from "../../../images/vector_graphs/networking_fundamentals/topology.svg"
import TopologyRoutes from "../../../images/vector_graphs/networking_fundamentals/topology_routes.svg"
import Scenario1 from "../../../images/vector_graphs/networking_fundamentals/scenario_1.svg"
import Scenario2 from "../../../images/vector_graphs/networking_fundamentals/scenario_2.svg"
import TopologyPractice from "../../../images/vector_graphs/networking_fundamentals/topology_practice.svg"
import TopologyQuestion from "../../../images/vector_graphs/networking_fundamentals/topology_questions.svg"
import FeedbackQuestions from "../../../components/feedback_questions";
import FeedbackActivity from "../../../components/feedback/feedback_activity";
import PracticeQuestionNumeric from "../../../components/practice-questions/numeric";
import PracticeQuestionMultiChoice from "../../../components/practice-questions/multichoice";
import SigninCheck from "../../../components/signin_check";

const Topologies = ({module, tab}) => {
    const [auth, setAuth] = useState("false")
    useEffect(() => {
        setAuth(localStorage.getItem("login"))
    })

    return (
        <>
            <LearningObjectives module={module} tab={tab}
            />

            <h2>Network Topologies</h2>

            <p>
                At an abstract level a network topology is a graph. The edges of the graph are network links with various
                latencies and bandwidths. The vertices of the graph represent either end-points, i.e., computers connected to
                the network, or routers, i.e., devices that are used to connect network links together. We are abstracting away
                here many interesting details of how network technology makes it possible to implement network topologies. For
                instance, we will not discuss how routers work (see Networking <a href="/textbooks">textbooks</a> for all
                interesting details).
            </p>

            <Topology />
            <div className="caption"><strong>Figure 1:</strong> An example network topology that interconnects 5 hosts.</div>

            <p>
                The figure above shows an example topology with 5 hosts (the end-point vertices), 4
                routers (internal vertices), and 9 network links (the edges). Data communicated on the
                network flows through links and routers. The <strong>route</strong> between
                two hosts is the sequence of network links (and routers) that the data traverses when
                being communicated from one of the hosts to another.
            </p>

            <TopologyRoutes />
            <div className="caption"><strong>Figure 2:</strong> Two possible routes between host A and host C.</div>

            <p>
                As an example, the figure above shows two possible routes between host A
                and host C. The network configuration, the details of which are outside our
                scope, defines which route is to be taken, for instance the blue
                route. We will always assume that the routes are static, i.e., data
                flowing from one host to another always traverses the same set of links. So in the example above,
                we assume that either the blue route or the red route exists.
            </p>

            <h2>End-to-end Network Routes</h2>

            <SigninCheck data={[
                <>

                    <p>Consider two hosts connected via a 3-link route, as depicted in the figure below.</p>

                    <Scenario1 />
                    <div className="caption"><strong>Figure 3:</strong> An example 3-link route between two hosts.</div>

                    <p>
                        In this example, all network links have the same bandwidth, 100 MB/sec.
                        When transferring data from host A to host B, this transfer thus experiences
                        a bandwidth of 100 MB/sec but a latency of 50 + 100 + 50 = 200 us, that is,
                        the <strong>sum of the link latencies</strong>. Remember that in the "water in pipes" analogy in
                        the <a href="/pedagogic_modules/networking_fundamentals">previous tab</a>,
                        the latency is the length of a pipe. And so it
                        makes sense that the length of a sequence of pipes is the sum of the
                        individual pipe lengths.
                    </p>

                    <p> For the route shown in Figure 3, transferring 100 MB of data from host A to host B will take time:</p>

                    <TeX math="T_{100 \text{MB}} = 200 \text{us} + \frac{100 \text{MB}}{100 \text{MB/sec}} = 1.0002 \text{sec}"
                         block />

                    <p>Consider now a similar three-link route, but with different link bandwidths:</p>

                    <Scenario2 />
                    <div className="caption"><strong>Figure 4:</strong> Another example 3-link route between two hosts.</div>

                    <p>
                        In Figure 4, the middle link has a bandwidth of 10 MB/sec (shown in red).
                        In this case, the data flows only as fast as the slowest link. The middle
                        link is called the <i>bottleneck</i> link, and the other two links are only
                        partially used (i.e., they can transfer data at 100 MB/sec, but they only
                        transfer data at 10 MB/sec). This is again consistent with the "water in pipes"
                        analogy, since the water flow is limited by the width of the narrowest pipe.
                        In other words, the bandwidth available in a multi-link route is the <strong>minimum
                        of the link bandwidths</strong>.
                    </p>

                    <p>
                        For the route shown in Figure 4, transferring 100 MB of data from
                        host A to host B will take time:
                    </p>

                    <TeX math="T_{100MB} = 200 \text{us} + \frac{100 \text{MB}}{10 \text{MB/sec}} = 10.0002 \text{sec}" block />

                    <h2>Putting it all together</h2>

                    <p>
                        Given a route <TeX math="r" />, i.e., a sequence of connected network links, and a data transfer
                        of <i>size</i> bytes, the data transfer time through the route is:
                    </p>

                    <TeX math="T_{size} = \sum_{link \in r} latency(link) + \frac{size}{\min\limits_{link \in r} bandwidth(link)}"
                         block />

                    <p>
                        <strong>The latency of the route is the sum of the latencies, and the bandwidth of the route
                            is the minimum of the bandwidths.</strong>
                    </p>

                    <Divider />

                    <Header as="h3" block>
                        Practice Questions
                    </Header>

                    <p>All practice questions hereafter pertain to this topology:</p>

                    <TopologyPractice />
                    <div className="caption"><strong>Figure 5:</strong> Network topology for practice questions.</div>

                    <PracticeQuestionNumeric
                        module={"A.3.1"}
                        question_key={"A.3.1.p2.1"}
                        question={
                            <>
                                What is the latency, in microseconds, of the route from host E to host D?
                            </>
                        }
                        answer={[270,270]}
                        explanation={
                            <>
                                The latency is the sum of the link latencies along the route:
                                <TeX math="100 \text{us} + 50 \text{us} + 120 \text{us} = 270 \text{us}" block />
                            </>
                        }
                    />

                    <PracticeQuestionNumeric
                        module={"A.3.1"}
                        question_key={"A.3.1.p2.2"}
                        question={
                            <>
                                What is the bandwidth, in MB/sec, of the route from host E to host D?
                            </>
                        }
                        answer={[20,20]}
                        explanation={
                            <>
                                The bandwidth is the minimum of the link bandwidths along the route:
                                <TeX math="\min(20 \text{MB/sec}, 30 \text{MB/sec}, 100 \text{MB/sec}) = 20 \text{MB/sec}" block />
                            </>
                        }
                    />

                    <PracticeQuestionMultiChoice
                        module={"A.3.1"}
                        question_key={"A.3.1.p2.3"}
                        question={
                            <>
                                I am a user sitting at host E and have to download a large file. That file is on a Web site
                                at host A but also on a mirror Web site at host D.  Which mirror should I select?
                            </>
                        }
                        choices={["Mirror on host A", "Mirror on host D"]}
                        correct_answer={"Mirror on host D"}
                        explanation={
                            <>
                                I should pick the mirror at host D. This is a large file, so the latency
                                component of the data transfer time is negligible. So it's all about the
                                bandwidth. The bandwidth of the route from host E to host A is 10
                                MB/sec, while that of the route from host E to host D is higher at 20 MB/sec.
                            </>
                        }
                    />

                    <PracticeQuestionNumeric
                        module={"A.3.1"}
                        question_key={"A.3.1.p2.4"}
                        question={
                            <>
                                What is the transfer time, in seconds, for sending 1 MB of data from host E to host D?
                            </>
                        }
                        answer={[0.05, 0.051]}
                        explanation={
                            <>
                                The data transfer time is:
                                <TeX
                                    math="T = 100 \text{us} + 50 \text{us} + 120 \text{us} + \frac{1 \text{MB}}{20 \text{MB/sec}} \simeq .05 \text{sec}"
                                    block />
                            </>
                        }
                    />

                    <Divider />

                    <Header as="h3" block>
                        Questions
                    </Header>

                    <p>Answer the following questions, which all pertain to this topology:</p>

                    <TopologyQuestion />
                    <div className="caption"><strong>Figure 6:</strong> Network topology for questions (lat = "latency"; bw =
                        "bandwidth").
                    </div>

                    <p>
                        <strong>[A.3.1.q2.1]</strong> What is the latency of the route from host A to host B? Show your work.
                    </p>
                    <p>
                        <strong>[A.3.1.q2.2]</strong> What is the bandwidth of the route from host C to host D? Show your work.
                    </p>
                    <p>
                        <strong>[A.3.1.q2.3]</strong> How long, in seconds, does it take to transfer 100 MB of
                        data from host A to host D? Show your work by writing (and solving) a simple equation.
                    </p>
                    <p>
                        <strong>[A.3.1.q2.4]</strong> A lot of users are transferring data from host B to host
                        D, thus competing for the bandwidth on that route. Would it help to
                        purchase an upgrade to the link that connects host B to the network?
                        Explain why or why not.
                    </p>
                    <p>
                        <strong>[A.3.1.q2.5]</strong> I am sitting at host D and want to download a tiny file
                        that is mirrored at all other hosts. From my perspective, does it matter
                        which mirror I pick, and if yes which one should I pick? Show your work and reasoning. You can answer this
                        question purely via reasoning (i.e., you don't need to compute anything).
                    </p>
                    <p>
                        <strong>[A.3.1.q2.6]</strong> I am sitting at host D and want to download a huge file
                        that is mirrored at all other hosts. From my perspective, does it matter which mirror I pick,
                        and if yes which one should I pick? Show your work and reasoning. You can answer this
                        question purely via reasoning (i.e., you don't need to compute anything).
                    </p>
                    <p>
                        <strong>[A.3.1.q2.7]</strong> Of all the possible routes above, which route has the highest bandwidth? Show your
                        work and
                        reasoning.
                    </p>

                    <Divider/>

                    <Header as="h3" block>
                        Your feedback is appreciated
                    </Header>

                    <FeedbackActivity content={
                        <FeedbackQuestions feedbacks={[
                            {
                                tabkey: "topologies",
                                module: "A.3.1"
                            },
                        ]} />
                    } />

                </>

            ]} auth={auth} content="this content"></SigninCheck>


        </>
    )
}

export default Topologies
