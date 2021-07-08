import React from "react"
import { Accordion, Header, Segment } from "semantic-ui-react"

const PracticeQuestions = ({ questions }) => {

  const panels = []

  for (const [index, value] of questions.entries()) {
    panels.push({
      key: value.key,
      title: "[" + value.key + "] " + value.question,
      content: {
        content: (<Segment>{value.content}</Segment>)
      }
    })
  }

  return (
    <>
      <Header as="h3" block>
        Practice Questions
      </Header>

      <Accordion exclusive={false} panels={panels} />
    </>
  )
}

export default PracticeQuestions
