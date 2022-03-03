import React, { useState, useEffect } from "react"
import { Input, Button } from "semantic-ui-react"
import axios from "axios";

const Numeric = ({question_key, answer}) => {
    const [text, setText] = useState('');
    const [correct, setCorrect] = useState('');
    const [completed, setCompleted] = useState(false);
    let input;
    let submit
    let outputText;

    useEffect(() => {
        axios
            .post('http://localhost:3000/get/question', {question_key: question_key})
            .then((response) => setCompleted(response.data.completed))
            .catch(err => {
                console.log(err);
            });
    }, [])

    /* Input from the textbox */
    const handleInput = (e, data) => {
        e.preventDefault();
        setText(data);
    }


    /* Check if value in textbox is correct */
    const handleSubmit = (e) => {
        e.preventDefault();
        if (text.value === answer) {
            setCorrect('Correct');
        } else {
            setCorrect('Incorrect');
        }
        const question = {
            question_key: question_key,
            answer: text.value,
            correctAnswer: answer
        }
        axios
            .post('http://localhost:3000/update/question', question)
            .then((response) => response)
            .catch(err => {
                console.error(err);
            });
    }

    if (correct === 'Correct' || completed) {
        outputText = <p>The answer is correct</p>;
        input = <Input disabled placeholder="Hello" />;
        submit = <Button disabled content="Submit" />;
    } else if (correct === 'Incorrect') {
        outputText = <p style={{color:'FF0000'}}>The answer is incorrect</p>;
        input = <Input type='text' error onChange={handleInput} placeholder='Input Answer'/>;
        submit = <Button content='Submit' onClick={handleSubmit}/>;
    } else {
        outputText = ''
        input = <Input type='text' onChange={handleInput} placeholder='Input Answer'/>
        submit = <Button content='Submit' onClick={handleSubmit}/>
    }

    return (
        <>
            {input}
            {submit}
            {outputText}
        </>
        )
}


export default Numeric;