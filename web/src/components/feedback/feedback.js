import React, { useState, useEffect } from "react"
import { Formik } from "formik"
import {Form, Message} from "semantic-ui-react"
import axios from "axios"
import FeedbackSignIn from "./feedback_signin"

const Feedback = ({tabkey}) => {
    const [auth, setAuth] = useState("false")
    const [completed, setCompleted] = useState(false)
    const useful = ['Very Useful', 'Useful', 'Neutral', 'Useless']
    const quality = ['Excellent Quality', 'Good Quality', 'Fair Quality', 'Poor Quality']

    useEffect(() => {
        setAuth(localStorage.getItem("login"))
        axios
            .post(window.location.protocol + "//" + window.location.hostname + ":3000/get/feedback", {
                user_name: localStorage.getItem("userName"),
                email: localStorage.getItem("currentUser"),
                tabkey: tabkey,
            })
            .then((response) => {
                setCompleted(response.data.completed)
            })
            .catch(err => {
                console.log(err);
            });
    }, [])

    if (completed) {
        return (
            <Message size='big' color='brown' content='Feedback already provided!'/>
        )
    }
    return (
        auth === "true" ? (
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
                            setCompleted(true)
                            const feedback = {
                                user_name: localStorage.getItem("userName"),
                                email: localStorage.getItem("currentUser"),
                                tabkey: tabkey,
                                useful: values.useful,
                                quality: values.quality,
                                comments: values.comments,
                                module: module
                            }
                            axios
                                .post(window.location.protocol + "//" + window.location.hostname + ":3000/update/feedback", feedback)
                                .then(response => response)
                                .catch(err => {
                                    console.error(err)
                                })
                            setSubmitting(false)
                        }, 400)
                    }}
                    validate={values => {
                        const errors = {}
                        if (!values.useful) {
                            errors.useful = 'Required'
                        }
                        if (!values.quality) {
                            errors.quality = 'Required'
                        }
                        // if (!values.comments) {
                        //   errors.comments = 'Required'
                        // }
                        return errors
                    }}
                >
                    {({
                          values,
                          errors,
                          touched,
                          handleChange,
                          handleBlur,
                          handleSubmit,
                          isSubmitting,
                      }) => (
                        <Form onSubmit={handleSubmit}>
                            <p>
                                <strong>[#1]</strong> How would you rate the <strong>usefulness</strong> of the pedagogic content on this page?
                            </p>
                            {useful.map((useful) =>
                                <Form.Field key={useful}>
                                    <Form.Radio
                                        name="useful"
                                        label={useful}
                                        id={useful}
                                        value={useful}
                                        checked={values.useful === useful }
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                </Form.Field>
                            )}
                            {errors.useful ?
                                <Message negative>{errors.useful}</Message> : ''
                            }
                            <p>
                                <strong>[#2]</strong> How would you rate the <strong>quality</strong> of the pedagogic content on this page?
                            </p>
                            {quality.map((quality) =>
                                <Form.Field key={quality}>
                                    <Form.Radio
                                        name="quality"
                                        label={quality}
                                        id={quality}
                                        value={quality}
                                        checked={values.quality === quality}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                </Form.Field>
                            )}
                            {errors.quality ?
                                <Message negative>{errors.quality}</Message> : ''
                            }
                            <p>
                                <strong>[#3]</strong> Optionally provide constructing comments.
                            </p>
                            <Form.TextArea
                                fluid
                                name="comments"
                                placeholder="Enter text here..."
                                type="text"
                                cols="70"
                                rows="3"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.comments}
                                error={(errors.comments && touched.comments) ? {
                                    content: 'Please provide feedback'
                                } : null}
                            />
                            <Form.Button color="teal" type="submit" disabled={isSubmitting}>
                                Submit
                            </Form.Button>
                        </Form>
                    )}
                </Formik>
            </>
        ) : (
            <FeedbackSignIn />
        )
    )
}

export default Feedback