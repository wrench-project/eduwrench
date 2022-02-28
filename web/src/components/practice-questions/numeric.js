import React, { useState, useEffect } from "react"
import { Input, Button } from "semantic-ui-react"
import axios from "axios";

const Numeric = ({question_key, answer}) => {
    const [text, setText] = useState('');
    const [correct, setCorrect] = useState('');
    const [attempts, setAttempts] = useState(0);
    const [completed, setCompleted] = useState(false);
    // const [getData, setGetData] = useState({});
    let input;
    let submit
    let outputText;

    /* Input from the textbox */
    const handleInput = (e, data) => {
        e.preventDefault();
        setText(data);
    }

    /* Check if value in textbox is correct */
    const handleSubmit = (e) => {
        e.preventDefault();
        if (text.value === answer) {
            setAttempts(attempts + 1);
            setCorrect('Correct');
            setCompleted(true);
        } else {
            setAttempts(attempts + 1);
            setCorrect('Incorrect');
        }
    }

    switch (correct) {
        case 'Correct' || completed:
            outputText = <p>The answer is correct</p>;
            input = <Input disabled placeholder={text} />;
            submit = <Button disabled content="Submit" />;
            break;
        case 'Incorrect':
            outputText = <p style={{color:'FF0000'}}>The answer is incorrect</p>;
            input = <Input type='text' error onChange={handleInput} placeholder='Input Answer'/>;
            submit = <Button content='Submit' onClick={handleSubmit}/>;
            break;
        default:
            outputText = ''
            input = <Input type='text' onChange={handleInput} placeholder='Input Answer'/>
            submit = <Button content='Submit' onClick={handleSubmit}/>
            break;
    }


   /* Pull the question information from the database for persistence */
    useEffect(() => {
        axios
            .post('http://localhost:3000/get/question', {question_key: question_key})
            .then((response) => {
                setCompleted(response.data.completed);
                setAttempts(response.data.attempts);
                // setGetData(response.data)
                return response;
            })
            .catch(err => {
                console.log(err);
            });
    }, []);
    // console.log(getData);

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
    }, [attempts, completed, correct])


    return (
        <>
            {input}
            {submit}
            {outputText}
        </>
        )
}


export default Numeric;