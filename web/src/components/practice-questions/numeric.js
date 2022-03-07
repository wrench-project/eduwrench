import React, { useState, useEffect } from "react"
import { Formik } from "formik"
import {Form, Message, Loader} from "semantic-ui-react"
import axios from "axios"

const Numeric = ({question_key, answer}) => {
    const [correct, setCorrect] = useState('')
    const [completed, setCompleted] = useState(false)
    const [prevAnswer, setPrevAnswer] = useState('')
    let message
    const placeholder = (completed) ? prevAnswer : "Enter answer here..."

    useEffect(() => {
        axios
            .post('http://localhost:3000/get/question', {question_key: question_key})
            .then((response) => {
                setCompleted(response.data.completed)
                setPrevAnswer(response.data.previous_answer)
            })
            .catch(err => {
                console.log(err);
            });
    }, [])


    switch (correct) {
        case 'Correct':
            message = <Message positive content='Answer is correct!'/>
            break
        case 'Incorrect':
            message = <Message negative content='Answer is incorrect... Try again!'/>
            break
        default:
            message = ''
            break
    }

    return (
        <>
            <Formik
                initialValues={{input: ''}}
                validateOnBlur={false}
                validateOnChange={false}
                onSubmit={(values, { setSubmitting }) =>{
                    setTimeout(() => {
                        if (parseInt(values.input) >= answer[0] && parseInt(values.input) <= answer[1]) {
                            setCorrect("Correct")
                            setCompleted(true)
                        } else {
                            setCorrect("Incorrect")
                        }
                        const question = {
                            question_key: question_key,
                            answer: values.input,
                            correctAnswer: answer,
                            type: 'numeric'
                        }
                        axios
                            .post('http://localhost:3000/update/question', question)
                            .then((response) => response)
                            .catch(err => {
                                console.error(err);
                            })
                        setSubmitting(false)
                    }, 400)
                }}
                >
                {({ values,
                      touched,
                      handleChange,
                      handleBlur,
                      handleSubmit,
                      isSubmitting
                }) => (
                    <Form onSubmit={handleSubmit}>
                        <Form.Input fluid name="input"
                                    label="Input"
                                    type="number"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.input}
                                    placeholder={placeholder}
                                    disabled={completed}
                        />
                        {touched ? message : null}
                        {isSubmitting ?
                        <Form.Button
                            color="teal"
                            content='Submit'
                            loading
                            /> :
                            <Form.Button
                                color="teal"
                                type='submit'
                                content='Submit'
                                disabled={completed}
                            />}
                        {isSubmitting ? <Loader active inline /> : null}
                    </Form>
                )}
            </Formik>
        </>
        )
}


export default Numeric