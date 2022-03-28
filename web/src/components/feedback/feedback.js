import React, { useState, useEffect } from "react"
import { Formik } from "formik"
import {Form, Message, Loader, TextArea, Button} from "semantic-ui-react"
import axios from "axios"

const Feedback = ({feedback_key, feedback}) => {
  const [feedbackMsg, setFeedbakMsg] = useState('')

  useEffect(() => {
    axios
        .post('http://localhost:3000/get/feedback', {feedback_key: feedback_key})
        .then((response) => {
          setFeedbakMsg(response.data.feedbackMsg)
        })
        .catch(err => {
            console.log(err);
        });
}, [])

  return (
    <>
      <Formik
        initialValues={{
          useful: '',
          quality: '',
          comments: '',
        }}
        validateOnBlur={false}
        validateOnChange={false}
        onSubmit={(values, { setSubmitting }) => {
          setTimeout(() => {
            const feedback = {
              feedback_key: feedback_key,
              useful: values.useful,
              quality: values.quality,
              comments: values.comments,
            }
            axios
              .post("http://localhost:3000/update/feedback", feedback)
              .then(response => response)
              .catch(err => {
                console.error(err)
              })
            setSubmitting(false)
          }, 400)
        }}
      >
        {({
          values,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
        }) => (
          <Form onSubmit={handleSubmit}>
            <p>
              <strong>[#1]</strong> How useful did you find the modules in
              learning the topic?
            </p>
            <Form.Input
              fluid 
              name="useful"
              placeholder="Please provide a number in the range of [1(Poor) - 5(Excellent)]"
              type="number"
              min={1}
              max={5}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.useful}
            />
            <p>
              <strong>[#2]</strong> Rate the quality of the modules?
            </p>
            <Form.Input
              fluid
              name="quality"
              placeholder="Please provide a number in the range of [1(Poor) - 5(Excellent)]"
              type="number"
              min={1}
              max={5}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.quality}
            />
            <p>
              <strong>[#3]</strong> Please provide constructing comments to
              improve the content
            </p>
            <Form.TextArea
              fluid
              name="comments"
              placeholder="Enter answer here..."
              type="text"
              cols="70"
              rows="3"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.comments}
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

export default Feedback