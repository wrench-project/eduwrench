import React from "react"
import { Segment } from "semantic-ui-react"
import { ListSLOs } from "./curriculum_map"

const LearningObjectives = ({ useless }) => {

  const objectives = ListSLOs("A.1", "work_and_speed");
  console.log(objectives)
  const objectivesList = []

  objectives.forEach(function(objective) {
    objectivesList.push(<li key={objective.replace(" ", "_")} style={{ marginBottom: "0.4em" }}>{objective}</li>)
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
