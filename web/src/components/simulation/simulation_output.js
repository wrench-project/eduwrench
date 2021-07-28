import React from "react"
import { Segment } from "semantic-ui-react"
import "./simulation_output.css"

const SimulationOutput = ({ output }) => {
  const rawElements = output.includes("<br>") ? output.split("<br>") : output.split("</span>")
  const elements = rawElements.map(line => {
    let colors = line.substring(line.indexOf("(") + 1, line.indexOf(")")).split(",")
    if (colors.length === 3) {
      let r = 255 - parseInt(colors[0].trim())
      let g = 255 - parseInt(colors[1].trim())
      let b = 255 - parseInt(colors[2].trim())
      let textColor = "rgb(" + r + "," + g + "," + b + ")"
      return (<li key={Math.random()} style={{ color: textColor }}>{line.replace(/\s*\<.*?\>\s*/g, "")}</li>)
    }
    return (<li key={Math.random()}>{line.replace(/\s*\<.*?\>\s*/g, "")}</li>)
  })

  return (
    <>
      <Segment.Group>
        <Segment color="grey"><strong>Simulation Output</strong></Segment>
        <Segment inverted className="simulation-output">
          <ul>
            {elements}
          </ul>
        </Segment>
      </Segment.Group>
    </>
  )
}

export default SimulationOutput
