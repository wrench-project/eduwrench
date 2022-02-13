import React, { useState } from "react"
import { Input, Button } from "semantic-ui-react"
import axios from "axios";

const Textbox = ({question_key}) => {
    let [text, setText] = useState('');
    let [correct, setCorrect] = useState('');
    let [attempts, setAttempts] = useState(0);
    let [completed, setCompleted] = useState(false);
    let outputText;

    const question = {
        question_key,
        attempts,
        completed,
    }

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
        axios
            .post('http://localhost:3000/update/question', question)
            .then((response) => console.log(response))
            .catch(err => {
                console.error(err);
            });
    }

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