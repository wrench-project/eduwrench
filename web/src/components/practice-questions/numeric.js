import React, { useState, useEffect } from "react"
import { Input, Button } from "semantic-ui-react"
import axios from "axios";

const Numeric = ({question_key}) => {
    const [text, setText] = useState('');
    const [correct, setCorrect] = useState('');
    const [attempts, setAttempts] = useState(0);
    const [completed, setCompleted] = useState(false);
    let outputText;

    /* Input from the textbox */
    const handleInput = (e, data) => {
        e.preventDefault();
        setText(data);
    }

    /* Check if value in textbox is correct */
    const handleSubmit = (e) => {
        e.preventDefault();
        if (text.value === 'Hello') {
            setAttempts(attempts + 1);
            setCorrect('Correct');
            setCompleted(true);
        } else {
            setAttempts(attempts + 1);
            setCorrect('Incorrect');
        }
    }

    if (correct === 'Correct') {
        outputText = <p>The answer is correct</p>;
    } else if (correct === 'Incorrect') {
        outputText = <p>The answer is incorrect</p>;
    }

    /* Pull the question information from the database for persistence */
    useEffect(() => {
        axios
            .post('http://localhost:3000/get/question', {question_key: question_key})
            .then((response) => {
                setCompleted(response.data.completed);
                setAttempts(response.data.attempts);
                return response;
            })
            .catch(err => {
                console.log(err);
            });
    }, [])

    /* Get the callback of the questions parameters */
    useEffect(() => {
        const question = {
            question_key,
            attempts,
            completed,
        }
        axios
            .post('http://localhost:3000/update/question', question)
            .then((response) => response)
            .catch(err => {
                console.error(err);
            });
    }, [attempts, completed])


    return (
        <>
            <Input type='text' onChange={handleInput} placeholder='Input Answer'/>
            <Button content='Submit' onClick={handleSubmit}/>
            {outputText}
        </>
    );
}

export default Numeric;