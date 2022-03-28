import React, {useState, useEffect} from "react"
import {Form, Message, Button, Modal, Label} from "semantic-ui-react"
import {Formik} from 'formik'
import axios from "axios"

const MultiChoice = ({question_key, choices, answer, hint, giveup}) => {
    const [state, setState] = useState('')
    const [completed, setCompleted] = useState(false)
    const [gaveUp, setGaveUp] = useState(false)
    let message

    useEffect(() => {
        const userEmail = localStorage.getItem("currentUser");
        axios
            .post('http://localhost:3000/get/question', {
                user: userEmail.split("@")[0],
                email: userEmail,
                question_key:question_key,
            })
            .then((response) => {
                setCompleted(response.data.completed)
                setGaveUp(response.data.giveup)
            })
            .catch(err => {
                console.log(err);
            })
    }, []);

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
        setGaveUp(true)
        setState('GaveUp')
        setCompleted(true)
        const userEmail = localStorage.getItem("currentUser")
        const question = {
            userName: userEmail.split("@")[0],
            email: userEmail,
            question_key: question_key,
            button: 'giveup'
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
                {(gaveUp) ?
                    <Label color='red' size='large'>{answer}</Label>
                    :   <Label color='green' size='large'>{answer}</Label>}
                {message}
            </>
        )
    }

    return (
        <>
            <Formik
                key={question_key}
                initialValues={{selected: ''}}
                validateOnBlur={false}
                validateOnChange={false}
                onSubmit={(values, { setSubmitting }) =>{
                    setTimeout(() => {
                        const userEmail = localStorage.getItem("currentUser");
                        if (values.selected === answer) {
                            setState("Correct")
                            setCompleted(true)
                        } else {
                            setState("Incorrect")
                        }
                        const question = {
                            user: userEmail.split("@")[0],
                            email: userEmail,
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
                            <Form.Field key={choice}>
                                <Form.Radio
                                    name="selected"
                                    label={choice}
                                    id={choice}
                                    value={choice}
                                    checked={(completed) ? choice === answer : values.selected === choice}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                            </Form.Field>
                        )}

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
                            />}
                    </Form>
                )}
            </Formik>
            {message}
            {(giveup && !gaveUp) ? <Button onClick={onGiveup} color="red" content="Give Up" /> : ''}
            {(hint) ? <Modal
                trigger={<Button onClick={onHint} content="Hint" />}
                header='Hint'
                content={hint}
                actions={[{ key: 'done', content: 'Done'}]} /> : ''}
        </>
    )
}


export default MultiChoice