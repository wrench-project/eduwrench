import React, { useState, useEffect } from "react"
import { Input, Button } from "semantic-ui-react"
import axios from "axios";

const Textbox = ({question_key}) => {
    const [text, setText] = useState('');
    const [correct, setCorrect] = useState('');
    const [attempts, setAttempts] = useState(0);
    const [completed, setCompleted] = useState(false);
    let outputText;


    const handleInput = (e, data) => {
        e.preventDefault();
        setText(data);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (text.value === 'Hello') {
            setCorrect('Correct');
            setCompleted(true);
        } else {
            setAttempts(attempts + 1);
            setCorrect('Incorrect');
        }
        const question = {
            question_key,
            attempts,
            completed,
        }
        console.log(question);
        axios
            .post('http://localhost:3000/update/question', question)
            .then((response) => response)
            .catch(err => {
                console.error(err);
            });
    }

    useEffect(() => {
        if (attempts > 0) {
            axios
                .post('http://localhost:3000/get/question', {question_key: question_key})
                .then((response) => {
                    setCompleted(response.data.completed);
                    setAttempts(response.data.attempts + 1);
                    return response;
                })
                .catch(err => {
                    console.log(err);
                });
        }
    }, [])

    if (correct === 'Correct') {
        outputText = <p>The answer is correct</p>;
    } else if (correct === 'Incorrect') {
        outputText = <p>The answer is incorrect</p>;
    }

    return (
        <>
            <Input type='text' onChange={handleInput} placeholder='Input Answer'/>
            <Button content='Submit' onClick={handleSubmit}/>
            {outputText}
        </>
    );
}

export default Textbox;