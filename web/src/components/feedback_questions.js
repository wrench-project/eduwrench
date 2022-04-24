import React from "react"
import Feedback from "./feedback/feedback"

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
    })
  }

  return (
    <>
      {feedbackHeader}
      <div>
        {panels.map(({ title, key}) => (
          <><p key={key}>{title.content}</p><Feedback feedback_key={key}/></>
        ))}
      </div>
    </>
  )
}

export default FeedbackQuestions;
