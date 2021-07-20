import React from "react"
import { Divider, Header } from "semantic-ui-react"
import TeX from "@matejmazur/react-katex"
import LearningObjectives from "../../../components/learning_objectives"
import SimulationActivity from "../../../components/simulation/simulation_activity"
import PracticeQuestions from "../../../components/practice_questions"
import ContentionSimulation from "./contention_simulation"

import TopologyContention from "../../../images/vector_graphs/networking_fundamentals/topology_contention.svg"
import TopologyContentionSizes
  from "../../../images/vector_graphs/networking_fundamentals/topology_contention_different_sizes.svg"
import LinkUtilization from "../../../images/vector_graphs/networking_fundamentals/link_utilization.svg"
import TopologyContentionSimulation
  from "../../../images/vector_graphs/networking_fundamentals/topology_contention_simulation.svg"
import TopologyContentionPractice
  from "../../../images/vector_graphs/networking_fundamentals/topology_contention_practice.svg"
import TopologyContentionQuestions
  from "../../../images/vector_graphs/networking_fundamentals/topology_contention_questions.svg"

const Contention = () => {
  return (
    <>
      <LearningObjectives objectives={[
        "Understand the concept of network contention",
        "Be able to estimate data transfer times in the presence of contention"
      ]} />

      <h2>Networks are Shared</h2>

      <p>
        Typically, several data transfers occur concurrently (i.e., at the same
        time) on a network, and some of these transfers may be using the same
        network links. For instance, two concurrent transfers could be along two
        routes that share a single link. As a result, a data transfer's performance
        can be impacted by other data transfers. When a data transfer goes slower
        than it would go if alone in the network, it is because of <i>contention</i>
        (i.e., competition) for the bandwidth of at least one network link.
      </p>

      <h2>A Simple Example</h2>

      <p>
        Consider the following topology with the two depicted data transfers
        (symbolized by the red and the green arrow), that
        each were started at exactly the same time and transfer 100 MB of data.
      </p>

      {/*<object className="figure" type="image/svg+xml" data={TopologyContention} />*/}
      <TopologyContention />
      <div className="caption"><strong>Figure 1:</strong> A simple example in which two data transfers contend for
        bandwidth.
      </div>

      <p>
        If the green data transfer was by itself, its bandwidth would be 30 MB/sec.
        If the red data transfer was by itself, its bandwidth would be 40
        MB/sec. But when both transfers happen at the same time, they experience
        contention on the link into host C.
      </p>

      <p>
        Contention on this link means that the two transfers <strong>split the link's
        bandwidth</strong>. If this splitting is fair they both
        receive half of the link's bandwidth, 20 MB/sec. (It turns out that bandwidth sharing
        is a bit complicated in practice as it also depends on latencies, but in
        this case both transfers have the same end-to-end latencies, which leads to
        fair sharing (see a Networking <a href="/textbooks">textbooks</a> for more details if interested).
      </p>

      <p>
        Given the above, both transfers proceed at 20 MB/sec, i.e., half the bandwidth of the link into
        host C, which is their bottleneck link.
        Thus, both transfers complete in time:
      </p>

      <TeX math="T = 200 \text{us} + \frac{100 \text{MB}}{20 \text{MB/sec}} = 5.0002 \text{sec}" block />

      <h2>A slightly more complex example</h2>

      <p>
        Consider now another scenario, with the only difference that the "red" transfer now only transfers 50 MB:
      </p>

      {/*<object className="figure" type="image/svg+xml" data={TopologyContentionSizes} />*/}
      <TopologyContentionSizes />
      <div className="caption"><strong>Figure 2:</strong> A slightly more complex example in which one transfer
        operation transfers less data than the other.
      </div>

      <p>In this scenario there are two phases:</p>
      <ol>
        <li>In the first phase both transfers proceed with a bandwidth of 20 MB/sec due to contention;</li>
        <li>In the second phase, after the "red" transfer has completed, the "green" transfer proceeds alone with a
          bandwidth of 30 MB/sec (because its bottleneck link is now the link out of host B!).
        </li>
      </ol>

      <p>Therefore, the "red" transfer completes in:</p>
      <TeX math="T_{red} = 200 \text{us} + \frac{50 \text{MB}}{20 \text{MB/sec}} = 2.5002 \text{sec}" block />

      <p>
        The "green" transfer transfers its first 50 MB of data with a bandwidth of 20 MB/sec and its last 50 MB of data
        with a bandwidth of 30 MB/sec. Therefore, it completes in time:
      </p>
      <TeX math="T_{green} = 200 \text{us} + \frac{50 \text{MB}}{20 \text{MB/sec}} + \frac{50 \text{MB}}{30 \text{MB/sec}} =
      4.1668 \text{sec}" block />

      <p>
        This execution is depicted in
        the figure below, which shows the bandwidth utilization of the network link into host C.
        in the second phase above, part of that link's bandwidth is unused.
      </p>

      {/*<object className="figure" type="image/svg+xml" data={LinkUtilization} />*/}
      <LinkUtilization />
      <div className="caption"><strong>Figure 3:</strong> Bandwidth utilization of the link into host C vs. time,
        showing both the red and the green transfers. Because the green transfer is bottlenecked by a 30 MB/sec link, 10
        MB/sec of bandwidth remain unused for the link into host C.
      </div>

      <Header as="h3" block>
        Simulating Contention
      </Header>

      <p>
        So that you can gain hands-on experience, you can use the simulation Web application below.
        This simulation is for the following scenario in which a number of transfers
        occur concurrently on the same three-link route:
      </p>

      {/*<object className="figure" type="image/svg+xml" data={TopologyContentionSimulation} />*/}
      <TopologyContentionSimulation />
      <div className="caption"><strong>Figure 4:</strong> Simulation scenario.</div>

      <p>
        The simulation app allows you to enter a list of file sizes (in MB). Each
        file size corresponds to one data transfer on the three-link route.
        For example, if you enter just number "100" in the text box, the simulation will be for
        a single 100 MB data transfer and produce this output:
      </p>

      <pre>
        ----------------------------------------{"\n"}
        100 MB transfer completed at time 10.5{"\n"}
        ----------------------------------------
      </pre>

      <p>
        Note that the transfer's completion time is a bit higher than what the computations
        we've done so far would give. We would expect the transfer time to be:
      </p>
      <TeX math="T = 30 \text{us} + \frac{100 \text{MB}}{10 \text{MB/sec}} = 10.00003 \text{sec}." block />

      <p>
        This discrepancy is because the simulator captures some details of
        real-world networks (e.g., the TCP slow-start behavior that you may have read about
        in Networking <a href="/textbooks">textbooks</a>) that are
        not captured by the
        above mathematical expression. Such expressions are
        still useful approximations that we can use to reason about data transfer
        times. However, we should not be surprised that they are "a bit off".
      </p>

      <p>
        Entering "100, 100, 50" in the text box will simulate two 100 MB transfers and one 50 MB transfer, producing
        this output:
      </p>

      <pre>
        ----------------------------------------{"\n"}
        100 MB transfer completed at time 26.25{"\n"}
        100 MB transfer completed at time 26.25{"\n"}
        50 MB transfer completed at time 15.75{"\n"}
        ----------------------------------------
      </pre>

      <p>
        As expected, the 50 MB transfer completes first, and the two 100 MB transfers
        complete at the same time.
      </p>

      <p>
        You should use the simulation to explore different scenarios and test your
        computed data transfer time estimates for various combinations of
        concurrent transfers.
      </p>

      <SimulationActivity panelKey="topology-contention" content={<ContentionSimulation />} />

      <PracticeQuestions
        header={(
          <>
            <p>The following practice questions pertain to this topology:</p>
            {/*<object className="figure" type="image/svg+xml" data={TopologyContentionPractice} />*/}
            <TopologyContentionPractice />
            <div className="caption"><strong>Figure 5:</strong> Topology for practice questions.</div>
          </>
        )}
        questions={[
          {
            key: "A.3.1.p3.1",
            question: "A 100 MB transfer from host A to host C, and a 100 MB transfer from host B to host C start " +
              "at the same time. Do they finish at the same time? Explain your reasoning.",
            content: (
              <>
                Yes! Both transfers are bottlenecked on the link into host C, sharing its
                bandwidth, so that both transfers proceed at bandwidth 20 MB/sec.
              </>
            )
          },
          {
            key: "A.3.1.p3.2",
            question: "A 100 MB transfer from host D to host B, and a 100 MB transfer from host A to host C start " +
              "at time 0. At what time does each of them complete? Show your work and reasoning.",
            content: (
              <>
                <p>
                  The transfer from D to B proceeds at 30 MB/sec as it is bottlenecked
                  on the link into host B. The transfer from A to C proceeds at 40 MB/sec
                  as it is bottlenecked on the link into host C. These two transfers share
                  one network link, but that network link has bandwidth 100 MB/sec, and so
                  there is no contention on that link. Consequently, the transfer times
                  are as follows:
                </p>
                <TeX
                  math="T_{D \rightarrow B} = 200 \text{us} + \frac{100 \text{MB}}{30 \text{MB/sec}} = 3.3335 \text{sec}"
                  block />
                <TeX
                  math="T_{A \rightarrow C} = 200 \text{us} + \frac{100 \text{MB}}{40 \text{MB/sec}} = 2.5002 \text{sec}"
                  block />
                <p>
                  Note that the latency term (the first term) above is negligible when compared to the bandwidth term
                  (the second term).
                </p>
              </>
            )
          },
          {
            key: "A.3.1.p3.3",
            question: "A 100 MB transfer from host B to host C and a 60 MB transfer from host A to host C start " +
              "at time 0. At what time do they complete? Show your work.",
            content: (
              <>
                <p>
                  Both transfers are bottlenecked on the link into host C, sharing its
                  bandwidth so that both transfers proceed at 20 MB/sec. When the 60 MB
                  transfer completes, then the 100 MB transfer still has 40 MB to transfer and
                  proceeds at 30 MB/sec (as it is now bottlenecked on the link from host B). Therefore:
                </p>
                <TeX
                  math="T_{A \rightarrow C} = 200 \text{us} + \frac{60 \text{MB}}{20 \text{MB/sec}} = 3.0002 \text{sec}"
                  block />
                <TeX
                  math="T_{B \rightarrow C} = 200 \text{us} + \frac{60 \text{MB}}{20 \text{MB/sec}} + \frac{40 \text{MB}}{30 \text{MB/sec}} = 4.3335 \text{sec}"
                  block />
                <p>
                  Note that the latency term (the first term) above is negligible when compared to the bandwidth term
                  (the second term).
                </p>
              </>
            )
          }
        ]} />

      <Divider />

      <Header as="h3" block>
        Questions
      </Header>

      <p>Answer the following questions, which pertain to this topology:</p>

      {/*<object className="figure" type="image/svg+xml" data={TopologyContentionQuestions} />*/}
      <TopologyContentionQuestions />
      <div className="caption"><strong>Figure 6:</strong> Topology for questions (lat = "latency"; bw = "bandwidth").
      </div>

      <p>
        <strong>[A.3.1.q3.1]</strong> At time 0, a 10 MB transfer starts from host B to host C, and another 10 MB
        transfer starts from host A to host D. Do they finish at the same time? Show your work. You don't need to
        compute full transfer times but can instead use simple reasoning about bottleneck bandwidths.
      </p>

      <p>
        <strong>[A.3.1.q3.2]</strong> At time 0, a 100 MB transfer starts from host B to host C,
        and a 200 MB transfer starts from host A to host D. At what time do these transfers finish?
        Show your work. Hint: Consider the first phase in which both transfers are ongoing, and the second
        phase in which only one transfer is ongoing.
      </p>

    </>
  )
}

export default Contention
