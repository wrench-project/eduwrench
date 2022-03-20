import React, { useState, useEffect } from "react"
import { Formik } from "formik"
import {Form, Message, Loader, TextArea, Button} from "semantic-ui-react"
import axios from "axios"

const FeedbackQuestion = ({feedback}) => {
  
  // const [message, setMessage] = useState("")

  return (
    <>
      <Formik
        initialValues={{ inputFeedback: " " }}

        onSubmit={(values, { setSubmitting }) => {
          setSubmitting(false)
        }}
      >
        {({
          values,
          handleChange,
          handleSubmit,
          isSubmitting,
        }) => (
          <Form onSubmit={handleSubmit}>
            <Form.TextArea
              type="text"
              cols="70"
              rows="3"
              placeholder="Enter answer here..."
              onChange={handleChange}
              value={values.feedback}
            />
            <Form.Button color="teal" type="submit" disabled={isSubmitting}>
              Submit
            </Form.Button>
          </Form>
        )}
      </Formik>
    </>
  )
}

export default FeedbackQuestion