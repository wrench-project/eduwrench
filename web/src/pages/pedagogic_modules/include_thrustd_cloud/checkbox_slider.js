import React, {useState} from "react";
import "semantic-ui-css/semantic.min.css";
import {Label, Grid, Container, Checkbox} from "semantic-ui-react";

const CheckboxSlider = ({color, name, set, value}) => {
    const state = { checked: value }
    const [label_state, setLabel] = useState("Local");

    return (
        <Container>
            <Grid>
                <Grid.Column width={4}>
                    <Checkbox slider name={name}
                              onChange={() => {state.checked = !value; set(name, state.checked);
                              (state.checked === true ? setLabel("Cloud") : setLabel("Local"))
                              }}/>
                </Grid.Column>
                <Grid.Column width={16}>
                    <Label fluid horizontal color={color}>{label_state}</Label>
                </Grid.Column>
            </Grid>
        </Container>
    );
};

export default CheckboxSlider;
