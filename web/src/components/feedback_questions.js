import React from "react"
//import {useEffect} from "react"
import Feedback from "./feedback/feedback"
//import axios from "axios";

const FeedbackQuestions = ({ header = null, feedbacks }) => {
  let feedbackHeader = <></>
  const panels = []

  if (header) {
    feedbackHeader = <>{header}</>
  }

  /* Indexing to go through entries of feedback questions */
  for (const [index, value] of feedbacks.entries()) {
    panels.push({
      tabkey: value.tabkey,
      useful: value.useful,
      quality: value.quality,
      module: value.module
    })
  }

  return (
    <>
      {feedbackHeader}
      <div>
        {panels.map(({ tabkey, useful, quality, module }) => (
          <><Feedback tabkey={tabkey} useful={useful} quality={quality} module={module}/></>
        ))}
      </div>
    </>
  )
}

export default FeedbackQuestions;
