import React, { useState, useEffect } from "react"
import { Formik } from "formik"
import {Form, Message, Button, Modal, Label, Divider} from "semantic-ui-react"
import axios from "axios"

const PracticeQuestionNumeric = ({question_key, question, answer, explanation, hint, module}) => {
    const [state, setState] = useState('')
    const [completed, setCompleted] = useState(false)
    const [gaveup, setGaveup] = useState(false)
    const [prevAnswer, setPrevAnswer] = useState('')
    let message

    useEffect(() => {
        const userEmail = localStorage.getItem("currentUser")
        const userName = localStorage.getItem("userName");
        axios
            .post(window.location.protocol + "//" + window.location.hostname + ":" + process.env.GATSBY_BACKEND_PORT + "/get/question", {
                userName: userName,
                email: userEmail,
                question_key: question_key,
                type: "numeric",
                module: module
            })
            .then((response) => {
                setCompleted(response.data.completed)
                setPrevAnswer(response.data.previous_answer)
                setGaveup(response.data.giveup)
            })
            .catch(err => {
                console.log(err);
            })
    }, [])

    const onHint = () => {
        const userEmail = localStorage.getItem("currentUser")
        const userName = localStorage.getItem("userName")
        const question = {
            userName: userName,
            email: userEmail,
            question_key: question_key,
            button: 'hint'
        }
        axios
            .post(window.location.protocol + "//" + window.location.hostname + ":" + process.env.GATSBY_BACKEND_PORT + "/update/question", question)
            .then((response) => response)
            .catch(err => {
                console.log(err);
            })
    }

    const onGiveup = () => {
        setCompleted(true);
        setState('GaveUp');
        setGaveup(true);
        setPrevAnswer(`${answer[0]} - ${answer[1]}`)
        const userEmail = localStorage.getItem("currentUser")
        const userName = localStorage.getItem("userName")
        const question = {
            userName: userName,
            email: userEmail,
            question_key: question_key,
            button: 'giveup',
            answer: `${answer[0]} - ${answer[1]}`
        }
        axios
            .post(window.location.protocol + "//" + window.location.hostname + ":" + process.env.GATSBY_BACKEND_PORT + "/update/question", question)
            .then((response) => response)
            .catch(err => {
                console.log(err);
            })
    }

    switch (state) {
        case 'Correct':
            message = <Message icon='check' color='green' content='Answer is correct!'/>
            break
        case 'Incorrect':
            message = <Message icon='x' color='red' content='Answer is incorrect... Try again!'/>
            break
        case 'GaveUp':
            message = <Message icon='frown outline' color='yellow' content='You gave up on this question...' />
            break
        default:
            message = ''
            break
    }

    if (gaveup) {
        const correct_message = "You have given up on this question"
        message = <Message icon='frown outline' color='yellow' content={correct_message} />
        return (
            <>
                <Divider/>
                <strong>[{question_key}]</strong> {question}<br/><br/>
                {message}
                <Label color='grey' size='large'>Answer explanation:</Label><br/><br/>{explanation}
                <br/><br/>
            </>
        )
    }

    if (completed) {
        const correct_message = "You have given a correct answer (" + prevAnswer + ")"
        message = <Message icon='check' color='green' content={correct_message} />
        return (
            <>
                <Divider/>
                <strong>[{question_key}]</strong> {question}<br/><br/>
                {message}
                <Label color='grey' size='large'>Answer explanation:</Label><br/><br/>
                {explanation}
                <br/><br/>
            </>
        )
    }


    return (
        <>
            <Divider/>
            <strong>[{question_key}]</strong> {question}<br/><br/>
            <Formik
                key={question_key}
                initialValues={{input: ''}}
                validateOnBlur={false}
                validateOnChange={false}
                onSubmit={(values, { setSubmitting }) =>{
                    const userEmail = localStorage.getItem("currentUser");
                    const userName = localStorage.getItem("userName");
                    setTimeout(() => {
                        if (parseFloat(values.input) >= answer[0] && parseFloat(values.input) <= answer[1]) {
                            setState("Correct")
                            setCompleted(true)
                        } else {
                            setState("Incorrect")
                        }
                        const question = {
                            userName: userName,
                            email: userEmail,
                            question_key: question_key,
                            answer: values.input,
                            correctAnswer: answer,
                            type: 'numeric',
                            button: "submit",
                            module: module
                        }
                        setPrevAnswer(values.input)
                        axios
                            .post(window.location.protocol + "//" + window.location.hostname + ":" + process.env.GATSBY_BACKEND_PORT + "/update/question", question)
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
                                    label="Enter your answer"
                                    type="number"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.input}
                        />
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
                            />}
                    </Form>
                )}
            </Formik>
            {message}
            {(!completed) ? <Button onClick={onGiveup} color="red" content="Give Up" /> : ''}
            {(hint && !completed) ? <Modal
                trigger={<Button onClick={onHint} content="Hint" />}
                header='Hint'
                content={hint}
                actions={[{ key: 'done', content: 'Done'}]} /> : ''}
        <div>
            <br/>
        </div>
        </>
        )
}


export default PracticeQuestionNumeric