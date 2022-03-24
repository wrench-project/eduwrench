import React, { useState, useEffect } from "react"
import { Formik } from "formik"
import {Form, Message, Loader, TextArea, Button} from "semantic-ui-react"
import axios from "axios"

const FeedbackQuestion = ({feedback}) => {
  
  // const [message, setMessage] = useState("")

  /* useEffect(() => {
    axios
        .post('http://localhost:3000/get/feedback', {question_key: question_key})
        .then((response) => {
            setPrevAnswer(response.data.previous_answer)
        })
        .catch(err => {
            console.log(err);
        });
}, []) */

  return (
    <>
      <Formik
        initialValues={{ 
          HowUseful: 1,
          RateQuality: 1,
          ProvideComments: '' }}

        onSubmit={(values, { setSubmitting }) => {
          setSubmitting(false)
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
            <p><strong>[#1]</strong> How useful did you find the modules in learning the topic?</p>
            <Form.Input fluid name="HowUseful"
                        //label="[#1] How useful did you find the modules in learning the topic?"
                        placeholder="Please provide a number in the range of [1, 5]"
                        type="number"
                        min={1}
                        max={5}
                        onChange={handleChange}
                        onBlur={handleBlur}
            />
            <p><strong>[#2]</strong> Rate the quality of the modules?</p>
            <Form.Input fluid name="RateQuality"
                        //label="[#2] Rate the quality of the modules?"
                        placeholder="Please provide a number in the range of [1, 5]"
                        type="number"
                        min={1}
                        max={5}
                        onChange={handleChange}
                        onBlur={handleBlur}
            />
            <p><strong>[#3]</strong> Please provide constructing comments to improve the content</p>
            <Form.TextArea  fluid name="ProvideComments"
                            // label="[#3] Please provide constructing comments to improve the content"
                            placeholder="Enter answer here..."
                            type="text"
                            cols="70"
                            rows="3"
                            onChange={handleChange}
                            onBlur={handleBlur}
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