import React from "react"
import { Label, Segment } from "semantic-ui-react"
import { StaticImage } from "gatsby-plugin-image"

const SimulationScenario = ({ scenario }) => {
  return (
    <>
      <Segment.Group>
        <Segment color="orange">
          <Label attached="top right" href="https://wrench-project.org" target="_blank" style={{ color: "#C48550" }}>
            <StaticImage
              src="../images/wrench_logo.png"
              width={15}
              height={15}
              alt="WRENCH logo"
              backgroundColor="#e8e8e8"
              style={{ marginRight: "1em" }}
            />
            WRENCH Simulator</Label>
          <strong>Simulation Scenario</strong>
        </Segment>
        <Segment style={{ textAlign: "center" }}>
          {scenario}
        </Segment>
      </Segment.Group>
    </>
  )
}

export default SimulationScenario
