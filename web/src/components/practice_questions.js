import React from "react"
import { Header, Segment } from "semantic-ui-react"
import Textbox from "./practice-questions/textbox";

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
        content: (<Segment style={{ borderLeft: "3px solid #999" }}>{value.content}</Segment>),
        textbox: (<Textbox/>)}
    })
  }

  return (
    <>
      <Header as="h3" block>
        Practice Questions
      </Header>

      {questionsHeader}
      <div>
        {panels.map(({ title, key, content}) => (
            <><p key={key}>{title.content}</p> {content.textbox}</>
        ))}
      </div>

    </>
  )
}

export default PracticeQuestions
