import React from "react"
import { Accordion } from "semantic-ui-react"

const FeedbackActivity = ({ content }) => {
  
  return (
    <>
      <Accordion styled className="feedback" defaultActiveIndex={-1} fluid panels={[{
        title: "Feedback Questions",
        content: {
          content: (content)
        }
      }]}
      />
    </>
  )
}

export default FeedbackActivity
