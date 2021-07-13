import React from "react"
import { Accordion } from "semantic-ui-react"

const SimulationActivity = ({ key, content }) => {
  return (
    <>
      <Accordion styled className="simulation" defaultActiveIndex={-1} fluid panels={[{
        key: { key },
        title: "Simulation Activity",
        content: {
          content: (content)
        }
      }]}
      />
    </>
  )
}

export default SimulationActivity
