import React from "react"
import { Header, Segment } from "semantic-ui-react"
import FeedbackQuestion from "./feedback/feedback_question";

const Feedback = ({ header = null, feedbacks }) => {
  let feedbackHeader = <></>
  const panels = []

  if (header) {
    feedbackHeader = <>{header}</>
  }

  /* Indexing to go through entries of questions */
  for (const [index, value] of feedbacks.entries()) {
    panels.push({
      key: value.key,
      title: {
        content: (
          <><strong>[{value.key}]</strong> {value.question}</>
        ),
      },
      feedback: value.feedback,
    })
  }

  return (
    <>
      <Header as="h3" block>
        Feedback
      </Header>

      {feedbackHeader}
      <div>
        {panels.map(({ title, key, feedback }) => (
          <><p key={key}>{title.content}</p><FeedbackQuestion /></>
        ))}
      </div>
    </>
  )
}

export default Feedback;
