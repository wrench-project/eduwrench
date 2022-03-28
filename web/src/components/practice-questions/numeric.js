import React, { useState, useEffect } from "react"
import { Formik } from "formik"
import {Form, Message, Button, Modal, Label} from "semantic-ui-react"
import axios from "axios"

const Numeric = ({question_key, answer, hint, giveup}) => {
    const [state, setState] = useState('')
    const [completed, setCompleted] = useState(false)
    const [gaveup, setGaveup] = useState(false)
    const [prevAnswer, setPrevAnswer] = useState('')
    let message

    useEffect(() => {
        const userEmail = localStorage.getItem("currentUser")
        axios
            .post('http://localhost:3000/get/question', {
                userName: userEmail.split("@")[0],
                email: userEmail,
                question_key: question_key,
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
        const question = {
            userName: userEmail.split("@")[0],
            email: userEmail,
            question_key: question_key,
            button: 'hint'
        }
        axios
            .post('http://localhost:3000/update/question', question)
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
        const question = {
            userName: userEmail.split("@")[0],
            email: userEmail,
            question_key: question_key,
            button: 'giveup',
            answer: `${answer[0]} - ${answer[1]}`
        }
        axios
            .post('http://localhost:3000/update/question', question)
            .then((response) => response)
            .catch(err => {
                console.log(err);
            })
    }

    switch (state) {
        case 'Correct':
            message = <Message icon='check'color='green' content='Answer is correct!'/>
            break
        case 'Incorrect':
            message = <Message icon='x' color='red' content='Answer is incorrect... Try again!'/>
            break
        case 'GaveUp':
            message = <Message icon='frown outline' color='yellow' content='You gave up... Try again later!' />
            break
        default:
            message = ''
            break
    }
    if (completed) {
        return (
            <>
                Your Answer:
                {(gaveup) ?
                    <Label color='red' size='large'>{prevAnswer}</Label>
                :   <Label color='green' size='large'>{prevAnswer}</Label>}
                {message}
            </>
        )
    }

    return (
        <>
            <Formik
                key={question_key}
                initialValues={{input: ''}}
                validateOnBlur={false}
                validateOnChange={false}
                onSubmit={(values, { setSubmitting }) =>{
                    const userEmail = localStorage.getItem("currentUser");
                    setTimeout(() => {
                        if (parseInt(values.input) >= answer[0] && parseInt(values.input) <= answer[1]) {
                            setState("Correct")
                            setCompleted(true)
                        } else {
                            setState("Incorrect")
                        }
                        const question = {
                            userName: userEmail.split("@")[0],
                            email: userEmail,
                            question_key: question_key,
                            answer: values.input,
                            correctAnswer: answer,
                            type: 'numeric'
                        }
                        setPrevAnswer(values.input)
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
            {(giveup && !completed) ? <Button onClick={onGiveup} color="red" content="Give Up" /> : ''}
            {(hint && !completed) ? <Modal
                trigger={<Button onClick={onHint} content="Hint" />}
                header='Hint'
                content={hint}
                actions={[{ key: 'done', content: 'Done'}]} /> : ''}
        </>
        )
}


export default Numeric