import React from "react"
import { Divider, Header } from "semantic-ui-react"
import TeX from "@matejmazur/react-katex"
import LearningObjectives from "../../../components/learning_objectives"
import PracticeQuestions from "../../../components/practice_questions"

const Topologies = () => {
  return (
    <>
      <LearningObjectives objectives={[
        "Understand the concept of network topology",
        "Be able to compute end-to-end latencies and bandwidths",
        "Be able to compute end-to-end data transfer times"
      ]} />

      <h2>Network Topologies</h2>

      <p>
        At an abstract level a network topology is a graph. The edges of the graph are network links with various
        latencies and bandwidths. The vertices of the graph represent either end-points, i.e., computers connected to
        the network, or routers, i.e., devices that are used to connect network links together. We are abstracting away
        here many interesting details of how network technology makes it possible to implement network topologies. For
        instance, we will not discuss how routers work (see Networking <a href="/textbooks">textbooks</a> for all
        interesting details).
      </p>


      <Header as="h3" block>
        Questions
      </Header>


    </>
  )
}

export default Topologies
