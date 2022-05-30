// import React from "react"
// import { Header, Segment } from "semantic-ui-react"
// import Numeric from "./practice-questions/numeric";
// import MultiChoice from "./practice-questions/multichoice"
// import Reveal from "./practice-questions/reveal"
//
// const PracticeQuestionsHeader = ({ header = null, questions }) => {
//
//   let questionsHeader = <></>
//   const panels = []
//
//   if (header) {
//     questionsHeader = (<>{header}</>)
//   }
//
//   // /* Indexing to go through entries of questions */
//   // for (const [index, value] of questions.entries()) {
//   //   panels.push({
//   //     key: value.key,
//   //     title: {
//   //       content: (<><strong>[{value.key}]</strong> {value.question}</>)
//   //     },
//   //     content: {
//   //       content: (<Segment style={{ borderLeft: "3px solid #999" }}>{value.content}</Segment>) },
//   //     type: value.type,
//   //     choices: value.choices,
//   //     correct_answer: value.correct_answer,
//   //     explanation: value.explanation,
//   //     hint: value.hint,
//   //     giveup: value.giveup,
//   //     module: value.module
//   //   },)
//   // }
//
//   return (
//       <>
//         <Header as="h3" block>
//           Practice Questions
//         </Header>
//
//         {questionsHeader}
//         {/*<div>*/}
//         {/*  {panels.map(({ title, key, type, choices, correct_answer, explanation, hint, giveup, module }) => (*/}
//         {/*      <>*/}
//         {/*        <div>*/}
//         {/*          <p key={key}>{title.content}</p>*/}
//         {/*          {(type === "textbox") ? <Numeric question_key={key} answer={correct_answer} explanation={explanation} hint={hint} module={module}/>*/}
//         {/*              : (type === "multichoice") ? <MultiChoice question_key={key} choices={choices} correct_answer={correct_answer} explanation={explanation} hint={hint} module={module}/>*/}
//         {/*                  : (type === "reveal") ? <Reveal question_key={key}  hint={hint} explanation={explanation} module={module}/> :*/}
//         {/*                      ""}*/}
//         {/*        </div>*/}
//         {/*        <br></br>*/}
//         {/*      </>*/}
//         {/*  ))}*/}
//         {/*</div>*/}
//
//       </>
//   )
// }
//
// export default PracticeQuestionsHeader;
