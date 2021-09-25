import React, { useState } from "react";
import { Slider } from "react-semantic-ui-range";
import "semantic-ui-css/semantic.min.css";
import { Label, Grid, Container } from "semantic-ui-react";

const TaskSlider = ({color, name, set}) => {
    const [uiValue, setValue] = useState(0);

    const settings = {
        start: 0,
        min: 0,
        max: 100,
        step: 5,
        onChange: uiValue => {
            setValue(uiValue);
            set(name, uiValue);
        }
    };

    return (
        <Container>
            <Grid>
                <Grid.Column width={16}>
                    <Slider value={uiValue} color={color} settings={settings}/>
                </Grid.Column>
                <Grid.Column width={16}>
                    <Label color={color}>Cloud: {uiValue}%</Label>
                    <Label color={color}>Local: {100 - uiValue}%</Label>
                </Grid.Column>
            </Grid>
        </Container>
    );
};

export default TaskSlider;