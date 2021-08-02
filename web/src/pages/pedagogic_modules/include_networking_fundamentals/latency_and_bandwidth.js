import React from "react"
import { Accordion, Divider, Header, Segment } from "semantic-ui-react"
import TeX from "@matejmazur/react-katex"
import LearningObjectives from "../../../components/learning_objectives"
import PracticeQuestions from "../../../components/practice_questions"

const LatencyAndBandwidth = ({module, tab}) => {
    return (
        <>
            <LearningObjectives module={module} tab={tab}
            />

            <h2>Link Latency and Bandwidth</h2>

            <p>
                A network is built from <strong>network links</strong> (in the case of wired networks, these links are network
                cables). Each network link has two important characteristics:
            </p>
            <ol>
                <li><strong>Latency:</strong> the time it takes for one bit of data to travel along the length of the link
                    (measured in second)
                </li>
                <li><strong>Bandwidth:</strong> the maximum number of bits that can be transferred by the link per time unit
                    (measured in bit/second)
                </li>
            </ol>

            <p>
                A popular analogy is to think of a link as a vertical physical pipe that connects a cistern (on top)
                to a pool (on the bottom) . The latency is the time for one drop of water to travel from the top-end
                of the pipe to the other. The bandwidth is how many liters of water can flow out of the end of the
                pipe per second. In this analogy, the <i>latency</i> is the length of the pipe, and the bandwidth is
                its <i>width</i>.
            </p>

            <p>
                We assume that links are bidirectional, meaning that data can flow in both directions at the same time (which is
                unlike water in pipes). This model of a network link is not completely accurate as it abstracts away many of the
                details of actual network technologies and protocols. But it is sufficient for our purpose.
            </p>

            <h2>Data Transfer Time</h2>

            <p>
                Given a network link with latency <TeX math="\alpha" /> and bandwidth <TeX math="\beta" />, the time <TeX
                math="T" /> to transfer an amount of data <TeX math="s" /> over the link can be estimated as a first
                approximation as follows:
            </p>

            <TeX math="T = \alpha + \frac{s}{\beta}." block />

            <p>
                For instance, consider a link with latency 100 microseconds and effective bandwidth 120 MB/sec ("120 MegaBytes
                per second"), transferring 100KiB ("100 KibiBytes per second") of data takes time:
            </p>

            <TeX math="T = 100 \times 10^{-6} + \frac{100 \times 2^{10}}{120 \times 10^6} \simeq .000953 \text{sec}" block />

            <p>
                Make sure you know your units and use them in a consistent manner, knowing when units are powers of 10 or powers
                of 2. In these pedagogic modules, we typically use power-of-10 units (e.g., KB rather than KiB).
            </p>

            <p>
                In some cases the first term above (the latency) can dominate (i.e., with small data sizes and/or large
                bandwidths), or can be negligible (i.e., with large data sizes and/or small bandwidths).
            </p>

            <p>
                Here we have used the term, <i>effective bandwidth</i>, to denote the maximum <i>possible</i> data transfer rate
                that a network link is able to achieve. Due to various network overheads, a network link can have a throughput
                of at most about 97% of its advertised physical bandwidth. Thus, if you purchase a 100 GB/sec physical link, you
                will not be able to transfer data at 100 GB/sec. From this point forward, when we describe the bandwidth of a
                network link, we will always mean its <i>effective bandwidth</i>.
            </p>

            <PracticeQuestions questions={[
                {
                    key: "A.3.1.p1.1",
                    question: "How long, in milliseconds, does it take to transfer 250 MB on a network link with latency 500 " +
                        "microseconds and 20 GB/sec bandwidth? Show your work as a mathematical expression.",
                    content: (
                        <TeX math="T = 500 / 1000 + 1000 × ( 250 \times 10^6 ) / ( 20 \times 10^9 ) = 13 \text{ms}." />
                    )
                },
                {
                    key: "A.3.1.p1.2",
                    question: "How long, in minutes, does it take to transfer 1 GB on a network link with latency 100 " +
                        "microseconds and 520 MB/sec bandwidth? Show your work as a mathematical expression.",
                    content: (
                        <TeX
                            math="T = 100 / (60 \times 10^6) + (1 / 60) \times (1 \times 10^9) / (520 \times 10^6) ≃ 0.032 \text{min} ." />
                    )
                },
                {
                    key: "A.3.1.p1.3",
                    question: "You need to transfer 148 MB of data through a network link with latency 1 ms. What bandwidth, " +
                        "in GB/sec, should the link have so that the data transfer takes 2.5 sec? Show your work by writing " +
                        "(and solving) a simple equation.",
                    content: (
                        <>
                            Let <TeX math="B" /> be the needed bandwidth. We simply need to solve the equation below for <TeX
                            math="B" />:
                            <TeX math="1 / 1000 + ( 148 / 10^3 ) / B = 2.5," block />
                            which gives:
                            <TeX math="B = (148 / 10^3) / (2.5 - 1 / 1000) \simeq .059 \text{GB/sec}." block />
                        </>
                    )
                }
            ]} />

            <Divider />

            <Header as="h3" block>
                Questions
            </Header>

            <p>
                <strong>[A.3.1.q1.1]</strong> How long, in seconds, does it take to transfer 12 GB of data over a link with
                latency 10 ms and bandwidth 500 MB/sec? Show your work as a mathematical expression.
            </p>

            <p>
                <strong>[A.3.1.q1.2]</strong> 3 MB of data was transferred over a link with 18 MB/sec bandwidth in 3.03 sec.
                What is the link’s latency in seconds? Show your work by writing (and solving) a simple equation.
            </p>

            <p>
                <strong>[A.3.1.q1.3]</strong> A data transfer took 14 minutes on a link with latency 100 ms and bandwidth 120
                KB/sec. How much data, in MB, was transferred? Show your work by writing (and solving) a simple equation.
            </p>

            <p>
                <strong>[A.3.1.q1.4]</strong> Say you are sitting at your computer and need to download a 10 GB movie file. The
                file is available at two mirror sites, both of them one network link away from your computer. Mirror A is
                connected to your computer by a link with latency 100 ms and bandwidth 400 MB/sec. Mirror B is connected to your
                computer by a link with latency 300 ms and bandwidth 700 MB/sec. Which mirror should you use and why? Should
                your work and reasoning. You can answer this question purely via reasoning (i.e., you don’t need to compute
                anything).
            </p>

            <Divider />

            <Header as="h3" block>
                Suggested Activities
            </Header>

            <p>
                <strong>[Latencies]</strong> What do you think the network latency is between major U.S. cities? Go to <a
                href="https://ipnetwork.bgtmo.ip.att.net/pws/network_delay.html" target="_blank">this site</a> and find out the
                current network latency between Houston and Seattle and the current latency between New York and Philadephia.
                Which two U.S. cities (among those on that site) are the furthest apart in terms of network latencies?
            </p>

            <p>
                <strong>[Latencies and speed of light]</strong> Assuming that data travels at the speed of light, in a straight
                line, what would be the network latency between New York and Los Angeles? How much bigger is it in reality
                (using the same site as in the previous activity)?
            </p>

            <p>
                <strong>[Bandwidth]</strong> Download a large file from some Web site and measure the (perceived) bandwidth that
                you achieved. For instance, you can download the 100 MB file
                on <a href="https://speed.hetzner.de/" target="_blank">this site</a>. Note that tools (other than Web
                browsers) are available to download files from URLs that print out download times and/or data transfer rates
                (e.g., <code>wget</code> on Linux).
            </p>

        </>
    )
}

export default LatencyAndBandwidth
