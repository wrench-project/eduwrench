import React, {useState} from "react";
import {Form, Radio} from "semantic-ui-react";

const MultiChoice = () => {
    const [selected, setSelected] = useState('');
    const [correct, setCorrect] = useState('');
    let outputText;

    const handleChange = (e, value) => {
        e.preventDefault();
        setSelected(value);
    }
    const handleClick = (e) => {
        e.preventDefault();
        if (selected.value === "A") {
            setCorrect("Correct");
        } else if (selected.value === "B") {
            setCorrect("Incorrect");
        }
    }

    if (correct === 'Correct') {
        outputText = <p>The answer is correct</p>;
    } else if (correct === 'Incorrect') {
        outputText = <p>The answer is incorrect</p>;
    }

    return (
        <>
            <Form>
                <Form.Field>
                Selected value: {selected.value}
                </Form.Field>
                <Form.Field>
                    <Radio
                        label='Choose A'
                        name='radioGroup'
                        value='A'
                        checked={selected.value === 'A'}
                        onChange={handleChange}
                    />
                </Form.Field>
                <Form.Field>
                    <Radio
                        label='Choose B'
                        name='radioGroup'
                        value='B'
                        checked={selected.value === 'B'}
                        onChange={handleChange}
                        />
                </Form.Field>
                <Form.Button content="Submit" onClick={handleClick} />
            </Form>
            {outputText}
        </>
    )
}

export default MultiChoice;