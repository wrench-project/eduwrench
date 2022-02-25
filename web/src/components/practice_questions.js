import React from "react"
import { Header, Segment } from "semantic-ui-react"
import Numeric from "./practice-questions/numeric";
import MultiChoice from "./practice-questions/multichoice"
import Hint from "./practice-questions/hint"
import GiveUp from "./practice-questions/giveup"

const PracticeQuestions = ({ header = null, questions }) => {

  let questionsHeader = <></>
  const panels = []

  if (header) {
    questionsHeader = (<>{header}</>)
  }

  /* Indexing to go through entries of questions */
  for (const [index, value] of questions.entries()) {
    panels.push({
      key: value.key,
      title: {
        content: (<><strong>[{value.key}]</strong> {value.question}</>)
      },
      content: {
        content: (<Segment style={{ borderLeft: "3px solid #999" }}>{value.content}</Segment>), hint: (<Hint/>), giveup: (<GiveUp/>)}, 
      type: value.type,
      },)
    }

  return (
    <>
      <Header as="h3" block>
        Practice Questions
      </Header>

      {questionsHeader}
      <div>
        {panels.map(({ title, key, type }) => (
            <><p key={key}>{title.content} <Hint/></p> {(type === "textbox") ? <Numeric/> : <MultiChoice/>} <GiveUp/></>
        ))}
      </div>
      
    </> 
  )
}

export default PracticeQuestions;
