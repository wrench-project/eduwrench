import React, {useState, useEffect} from "react"
import {Form, Message, Button, Modal, Label} from "semantic-ui-react"
import {Formik} from 'formik'
import axios from "axios"

const Reveal = ({question_key, hint, answer, module}) => {
    const [state, setState] = useState('')
    // const [completed, setCompleted] = useState(false)
    // const [gaveUp, setGaveUp] = useState(false)
    const [revealed, setRevealed] = useState(false)
    let message

    useEffect(() => {
        const userEmail = localStorage.getItem("currentUser");
        const userName = localStorage.getItem("userName");
        axios
            .post('http://localhost:3000/get/question', {
                userName: userName,
                email: userEmail,
                question_key:question_key,
                type: "reveal",
                module:module,
            })
            .then((response) => {
                setRevealed(response.data.completed)
                // setCompleted(response.data.completed)
                // setGaveUp(response.data.giveup)
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

    const onReveal = () => {
        setRevealed(true)
        setState('Revealed')
        // setRevealed(true)
        const userEmail = localStorage.getItem("currentUser")
        const question = {
            userName: userEmail.split("@")[0],
            email: userEmail,
            question_key: question_key,
            answer: '',
            button: 'reveal',
            type: 'reveal',
            correctAnswer: answer,
            module: module
        }
        axios
            .post('http://localhost:3000/update/question', question)
            .then((response) => response)
            .catch(err => {
                console.log(err);
            })
    }

    if (revealed) {
        return (
            <>
                <Label color='' size='large'>Correct Answer:</Label> {answer}
            </>
        )
    }

    return (
        <>
            {(answer) ? <Button onClick={onReveal} color="teal" content="Reveal answer" /> : ''}
            {(hint) ? <Modal
                trigger={<Button onClick={onHint} content="Hint" />}
                header='Hint'
                content={hint}
                actions={[{ key: 'done', content: 'Done'}]} /> : ''}
        </>
    )
}


export default Reveal