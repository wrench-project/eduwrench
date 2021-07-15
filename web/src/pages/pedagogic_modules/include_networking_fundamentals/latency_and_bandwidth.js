import React from "react"
import { Divider, Header } from "semantic-ui-react"
import TeX from "@matejmazur/react-katex"
import LearningObjectives from "../../../components/learning_objectives"

const LatencyAndBandwidth = () => {
  return (
    <>
      <LearningObjectives objectives={[
        "Understand the concepts of latency and bandwidth",
        "Be able to estimate data transfer time through a network link"
      ]} />

      <h2>Link Latency and Bandwidth</h2>

    </>
  )
}

export default LatencyAndBandwidth
