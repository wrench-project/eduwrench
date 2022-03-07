import React, {useState, useEffect} from "react"
import {Form, Message, Loader} from "semantic-ui-react"
import {Formik} from 'formik'
import axios from "axios"

const MultiChoice = ({question_key, choices, answer}) => {
    const [correct, setCorrect] = useState('')
    const [completed, setCompleted] = useState(false)
    let message

    useEffect(() => {
        axios
            .post('http://localhost:3000/get/question', {question_key:question_key})
            .then((response) => setCompleted(response.data.completed))
            .catch(err => {
                console.log(err);
            })
    }, []);

    switch (correct) {
        case 'Correct':
            message = <Message positive content='Answer is correct!' />
            break;
        case 'Incorrect':
            message = <Message negative content='Answer is incorrect... Try again!' />
            break;
        default:
            message = ''
            break;
    }

    return (
        <>
            <Formik
                initialValues={{selected: ''}}
                validateOnBlur={false}
                validateOnChange={false}
                onSubmit={(values, { setSubmitting }) =>{
                    setTimeout(() => {
                        if (values.selected === answer) {
                            setCorrect("Correct")
                            setCompleted(true)
                        } else {
                            setCorrect("Incorrect")
                        }
                        const question = {
                            question_key: question_key,
                            answer: values.selected,
                            correctAnswer: answer,
                            type: 'multichoice'
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
                {({
                    values,
                    touched,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    isSubmitting
                }) => (
                    <Form onSubmit={handleSubmit}>
                        {choices.map((choice) =>
                            <Form.Field>
                                <Form.Radio name="selected"
                                            label={choice}
                                            id={choice}
                                            value={choice}
                                            checked={(completed) ? choice === answer : values.selected === choice}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            disabled={completed || isSubmitting}
                                />
                            </Form.Field>
                        )}

                        {touched ? message : null}

                        {isSubmitting ?
                            <Form.Button
                                color="teal"
                                content="Submit'"
                                loading
                            /> :
                            <Form.Button
                                color="teal"
                                type="submit"
                                content="Submit"
                                disabled={completed}
                            />}
                    </Form>
                )}
            </Formik>
        </>
    )
}


export default MultiChoice