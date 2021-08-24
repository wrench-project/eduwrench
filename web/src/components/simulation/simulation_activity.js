import React from "react"
import { Accordion } from "semantic-ui-react"

const SimulationActivity = ({ panelKey, content }) => {
  return (
    <>
      <Accordion styled className="simulation" defaultActiveIndex={-1} fluid panels={[{
        key: { panelKey },
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
