import React, {useState, useEffect} from "react"
import {Form, Message, Button, Modal, Label} from "semantic-ui-react"
import {Formik} from 'formik'
import axios from "axios"

const MultiChoice = ({question_key, choices, answer, hint, module}) => {
    const [state, setState] = useState('')
    const [completed, setCompleted] = useState(false)
    let message

    useEffect(() => {
        const userEmail = localStorage.getItem("currentUser");
        const userName = localStorage.getItem("userName");
        axios
            .post('http://localhost:3000/get/question', {
                userName: userName,
                email: userEmail,
                question_key:question_key,
                type: "multichoice",
                module: module
            })
            .then((response) => {
                setCompleted(response.data.completed)
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
            module: module,
            button: 'hint'
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
        default:
            message = ''
            break
    }

    if (completed) {
        return (
            <>
                <Label color='green' size='large'>Detailed answer: {answer} </Label>}
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
                            type: 'multichoice',
                            button: 'submit',
                            module: module
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
            {(hint) ? <Modal
                trigger={<Button onClick={onHint} content="Hint" />}
                header='Hint'
                content={hint}
                actions={[{ key: 'done', content: 'Done'}]} /> : ''}
            {message}
        </>
    )
}


export default MultiChoice