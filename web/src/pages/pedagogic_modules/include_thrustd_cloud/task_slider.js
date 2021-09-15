import React, { useState } from "react";
import { Slider } from "react-semantic-ui-range";
import "semantic-ui-css/semantic.min.css";
import { Label, Grid, Container } from "semantic-ui-react";

const TaskSlider = ({color}) => {
    const [value, setValue] = useState(0);

    const settings = {
        start: 0,
        min: 0,
        max: 100,
        step: 5,
        onChange: value => {
            setValue(value);
        }
    };

    // const handleValueChange = e => {
    //     let value = parseInt(e.target.value);
    //     if (!value) {
    //         value = 0;
    //     }
    //     setValue(e.target.value);
    // };

    return (
        <Container>
            <Grid>
                <Grid.Column width={16}>
                    <Slider value={value} color={color} settings={settings} />
                </Grid.Column>
                <Grid.Column width={16}>
                    <Label color={color}>{value}</Label>
                </Grid.Column>
            </Grid>
        </Container>
    );
};

export default TaskSlider;