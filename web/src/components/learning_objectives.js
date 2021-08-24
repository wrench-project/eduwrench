import React from "react"
import { Segment } from "semantic-ui-react"
import { ListSLOs } from "./curriculum_map"

const LearningObjectives = ({ module, tab }) => {

  const objectives = ListSLOs(module, tab);
  const objectivesList = []

  objectives.forEach(function(objective) {
    objectivesList.push(<li key={objective.replace(" ", "_")} style={{ marginBottom: "0.4em" }}>{objective}</li>)
  })

  return (
    <>
      <Segment.Group className="objectives">
        <Segment inverted><strong>Learning Objectives</strong></Segment>
        <Segment style={{ backgroundColor: "#fafafa" }}>
          Be able to...
          <ul style={{ backgroundColor: "#fafafa", lineHeight: "1.2em" }}>
            {objectivesList}
          </ul>
        </Segment>
      </Segment.Group>
    </>
  )
}

export default LearningObjectives
