import React, { useState } from "react"
import { Segment } from "semantic-ui-react"

const SimulationOutput = ({ output }) => {
  const elements = output.split("@").map(line => <>{line}<br/></>)

  return (
    <>
      <Segment inverted className="simulation-output">
        {elements}
      </Segment>
    </>
  )
}

export default SimulationOutput
