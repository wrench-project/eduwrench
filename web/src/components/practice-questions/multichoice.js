import React, {useState, useEffect} from "react";
import {Form, Radio} from "semantic-ui-react";
import axios from "axios";

const MultiChoice = ({question_key, choices, answer}) => {
    const [selected, setSelected] = useState('');
    const [correct, setCorrect] = useState('');
    const [attempts, setAttempts] = useState(0);
    const [completed, setCompleted] = useState(false);
    let input;
    let submit;
    let outputText;

    const handleChange = (e, value) => {
        e.preventDefault();
        setSelected(value);
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        if (selected.value === answer) {
            setCorrect("Correct");
            setAttempts(attempts + 1);
            setCompleted(true);
        } else {
            setAttempts(attempts + 1);
            setCorrect("Incorrect");
        }
    }

    switch (correct) {
        case 'Correct':
            outputText = <p>The answer is correct</p>;
            input = choices.map((choice) => <Form.Field>
                <Radio
                    disabled
                    label={choice}
                    name='radioGroup'
                    value={choice}
                    checked={selected.value === choice}
                    onChange={handleChange} />
            </Form.Field>)
            submit = <Form.Button disablecontent="Submit" onClick={handleSubmit} />
            break;
        case 'Incorrect':
            outputText = <p>The answer is incorrect</p>;
            input = choices.map((choice) => <Form.Field error>
                <Radio
                    label={choice}
                    name='radioGroup'
                    value={choice}
                    checked={selected.value === choice}
                    onChange={handleChange} />
            </Form.Field>)
            submit = <Form.Button content="Submit" onClick={handleSubmit} />
            break;
        default:
            outputText = '';
            input = choices.map((choice) => <Form.Field>
                <Radio
                    label={choice}
                    name='radioGroup'
                    value={choice}
                    checked={selected.value === choice}
                    onChange={handleChange} />
            </Form.Field>)
            submit = <Form.Button content="Submit" onClick={handleSubmit} />
            break;
    }

    /* useEffect(() => {
        axios
            .post('http://localhost:3000/get/question', {question_key:question_key})
            .then((response) => {
                setCompleted(response.data.completed);
                setAttempts(response.data.attempts);
                return response
            })
            .catch(err => {
                console.log(err);
            })
    }, []); */

    /* Get the callback of the questions parameters */
    /* useEffect(() => {
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
    }, [attempts, completed, correct]) */

    return (
        <>
            <Form>
                Selected value: {selected.value}
                {input}
                {submit}
            </Form>
            {outputText}
        </>
    )
}


export default MultiChoice;