import React from "react"
import { Segment } from "semantic-ui-react"

const SimulationOutput = ({ output }) => {
  const elements = output.split("@").map(line => <>{line}<br /></>)

  return (
    <>
      <Segment.Group>
        <Segment color="grey"><strong>Simulation Output</strong></Segment>
        <Segment inverted className="simulation-output">
          {elements}
        </Segment>
      </Segment.Group>
    </>
  )
}

export default SimulationOutput
