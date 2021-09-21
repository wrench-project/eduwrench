import React from "react";
import "semantic-ui-css/semantic.min.css";
import {Label, Grid, Container, Checkbox, Form} from "semantic-ui-react";

const CheckboxSlider = ({color, name, set, value}) => {
    const state = { checked: value }

    return (
        <Container>
            <Grid>
                <Grid.Column width={4}>
                    <Checkbox slider name={name} onChange={() => {state.checked = !value; set(name, state.checked);}}/>
                </Grid.Column>
                <Grid.Column width={16}>
                    <Label fluid horizontal color={color}></Label>
                </Grid.Column>
            </Grid>
        </Container>
    );
};

export default CheckboxSlider;