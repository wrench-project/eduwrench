import React, {useState, useEffect} from "react"
import {Form, Message, Button, Modal, Label, Divider} from "semantic-ui-react"
import {Formik} from 'formik'
import axios from "axios"


const PracticeQuestionMultiChoice = ({question_key, question, choices, correct_answer, explanation, hint, module}) => {
    const [state, setState] = useState('')
    const [completed, setCompleted] = useState(false)
    let message

    useEffect(() => {
        const userEmail = localStorage.getItem("currentUser");
        const userName = localStorage.getItem("userName");
        axios
            .post(window.location.protocol + "//" + window.location.hostname + ":3000/get/question", {
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
        const userName = localStorage.getItem("userName")
        const question = {
            userName: userName,
            email: userEmail,
            question_key: question_key,
            module: module,
            button: 'hint'
        }
        axios
            .post(window.location.protocol + "//" + window.location.hostname + ":3000/update/question", question)
            .then((response) => response)
            .catch(err => {
                console.log(err);
            })
    }

    const correct_message = "You have given the correct answer: " + correct_answer
    switch (state) {
        case 'Correct':
            message = <Message icon='check' color='green' content={correct_message} />
            break
        case 'Incorrect':
            message = <Message icon='x' color='red' content='Answer is incorrect... Try again!'/>
            break
        default:
            message = ''
            break
    }

    if (completed) {
        const correct_message = "You have given the correct answer: " + correct_answer
        message = <Message icon='check' color='green' content={correct_message} />
        return (
            <>
                <Divider/>
                <strong>[{question_key}]</strong> {question}<br/><br/>
                <ul>
                    {choices.map((choice) =>
                            <li key={choice}> {(completed) ? (choice === correct_answer) ? <strong>{choice}</strong> : choice : choice } </li>
                    )}
                </ul>
                {message}
                <Label color='grey' size='large'>Answer explanation:</Label><br/><br/>{explanation}
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
                initialValues={{selected: ''}}
                validateOnBlur={false}
                validateOnChange={false}
                onSubmit={(values, { setSubmitting }) =>{
                    setTimeout(() => {
                        const userEmail = localStorage.getItem("currentUser");
                        const userName = localStorage.getItem("userName");
                        console.log("VALUES.SELECTED = " + values.selected)
                        console.log("CORRECT ANSWER = " + correct_answer)
                        if (values.selected === correct_answer) {
                            setState("Correct")
                            setCompleted(true)
                        } else {
                            setState("Incorrect")
                        }
                        const question = {
                            user: userName,
                            email: userEmail,
                            question_key: question_key,
                            answer: values.selected,
                            correctAnswer: correct_answer,
                            type: 'multichoice',
                            button: 'submit',
                            module: module
                        }
                        console.log(question)
                        axios
                            .post(window.location.protocol + "//" + window.location.hostname + ":3000/update/question", question)
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
                            <Form.Field key={question_key + "_" + choice}>
                                <Form.Radio
                                    name="selected"
                                    label={choice}
                                    id={question_key + "_" + choice}
                                    value={choice}
                                    checked={(completed) ? choice === correct_answer : values.selected === choice}
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
            <div>
            {(hint) ? <Modal
                trigger={<Button onClick={onHint} content="Hint" />}
                header='Hint'
                content={hint}
                actions={[{ key: 'done', content: 'Done'}]} />: ''}
            {message}
            </div>
            <br/>
        </>
    )
}


export default PracticeQuestionMultiChoice