import React from "react"
import { Accordion, Header, Segment } from "semantic-ui-react"

const PracticeQuestions = ({ header = null, questions }) => {

  let questionsHeader = <></>
  const panels = []

  if (header) {
    questionsHeader = (<>{header}</>)
  }

  for (const [index, value] of questions.entries()) {
    panels.push({
      key: value.key,
      title: {
        content: (<><strong>[{value.key}]</strong> {value.question}</>)
      },
      content: {
        content: (<Segment style={{ borderLeft: "3px solid #999" }}>{value.content}</Segment>)
      }
    })
  }

  return (
    <>
      <Header as="h3" block>
        Practice Questions
      </Header>

      {questionsHeader}

      <Accordion exclusive={false} panels={panels} />
    </>
  )
}

export default PracticeQuestions
