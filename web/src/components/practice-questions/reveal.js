import React, {useState, useEffect} from "react"
import {Form, Message, Button, Modal, Label, Divider} from "semantic-ui-react"
import {Formik} from 'formik'
import axios from "axios"

const PracticeQuestionReveal = ({question_key, question, hint, explanation, module}) => {
    console.log("KEY = " + question_key)
    console.log("HINT = " + hint)
    console.log("EXPLANATION = " + explanation)
    console.log("MODULE = " + module)
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
        const userName = localStorage.getItem("userName")
        const question = {
            userName: userName,
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
        const userName = localStorage.getItem("userName")
        const question = {
            userName: userName,
            email: userEmail,
            question_key: question_key,
            button: 'reveal',
            type: 'reveal',
        }
        console.log(question)
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
                <Divider/>
                <div>
                <strong>[{question_key}]</strong> {question}
                <br/><br/>
                <Label color='grey' size='large'>Revealed Answer:</Label><br/> {explanation}
                    <br/>
                    <br/>
                </div>
            </>
        )
    } else {
        return (
            <>
                <Divider/>
                <div>
                <strong>[{question_key}]</strong> {question}
                    <br/><br/>
                {<Button onClick={onReveal} color="teal" content="Reveal answer"/>}
                {(hint) ? <Modal
                    trigger={<Button onClick={onHint} content="Hint"/>}
                    header='Hint'
                    content={hint}
                    actions={[{key: 'done', content: 'Done'}]}/> : ""}
                    <br/>
                    <br/>
                </div>
            </>
        )
    }
}


export default PracticeQuestionReveal