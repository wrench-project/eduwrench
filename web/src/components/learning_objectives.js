import React from "react"
import { Segment } from "semantic-ui-react"

const LearningObjectives = ({ objectives }) => {

  const objectivesList = []

  objectives.forEach(function(objective) {
    objectivesList.push(
      <>
        <li style={{ marginBottom: "0.4em" }}>{objective}</li>
      </>
    )
  })

  return (
    <>
      <Segment.Group className="objectives">
        <Segment inverted><strong>Learning Objectives</strong></Segment>
        <Segment style={{ backgroundColor: "#fafafa" }}>
          <ul style={{ backgroundColor: "#fafafa", lineHeight: "1.2em" }}>
            {objectivesList}
          </ul>
        </Segment>
      </Segment.Group>
    </>
  )
}

export default LearningObjectives
