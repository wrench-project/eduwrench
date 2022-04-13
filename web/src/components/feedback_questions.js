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
      useful: value.useful,
      quality: value.quality,
    })
  }

  return (
    <>
      {feedbackHeader}
      <div>
        {panels.map(({ title, key, useful, quality }) => (
          <><p key={key}>{title.content}</p><Feedback feedback_key={key} useful={useful} quality={quality}/></>
        ))}
      </div>
    </>
  )
}

export default FeedbackQuestions;
