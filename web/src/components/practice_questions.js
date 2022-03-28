import React from "react"
import { Header, Segment } from "semantic-ui-react"
import Numeric from "./practice-questions/numeric";
import MultiChoice from "./practice-questions/multichoice"

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
        content: (<Segment style={{ borderLeft: "3px solid #999" }}>{value.content}</Segment>) },
      type: value.type,
      choices: value.choices,
      answer: value.answer,
      hint: value.hint,
      giveup: value.giveup
      },)
    }

  return (
    <>
      <Header as="h3" block>
        Practice Questions
      </Header>

      {questionsHeader}
      <div>
        {panels.map(({ title, key, type, choices, answer, hint, giveup }) => (
            <>
              <div>
                <p key={key}>{title.content}</p>
                {(type === "textbox") ? <Numeric question_key={key} answer={answer} giveup={giveup} hint={hint}/>
                    : <MultiChoice question_key={key} choices={choices} answer={answer} giveup={giveup} hint={hint}/>}
              </div>
            </>
        ))}
      </div>
      
    </> 
  )
}

export default PracticeQuestions;
