import React from "react"
import { Header } from "semantic-ui-react"
import Feedback from "./feedback/feedback";

const FeedbackQuestions = ({ header = null, feedbacks }) => {
  let feedbackHeader = <></>
  const panels = []

  if (header) {
    feedbackHeader = <>{header}</>
  }

  /* Indexing to go through entries of feedback questions */
  for (const [index, value] of feedbacks.entries()) {
    panels.push({
      key: value.key,
      title: {
        content: (<><strong>[{value.key}]</strong></>),
      },
      feedback: value.feedback,
    })
  }

  return (
    <>
      <Header as="h3" block>
        Feedback Questions
      </Header>

      {feedbackHeader}
      <div>
        {panels.map(({ title, key, feedback }) => (
          <><p key={key}>{title.content}</p><Feedback feedback_key={key} feedback={feedback}/></>
        ))}
      </div>
    </>
  )
}

export default FeedbackQuestions;
