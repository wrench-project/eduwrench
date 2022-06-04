import React, {useState} from 'react'
import {Accordion, Icon, Table, Grid, Divider, Popup} from "semantic-ui-react";


const SimulationInfo = ({simulationData}) => {

    const numSimulations = simulationData.length
    const wordSimulation = (numSimulations > 1 ? "simulations" : "simulation")

    return (
        <>
            To data have you have executed <strong>{numSimulations} {wordSimulation}</strong>
        </>
    )
}

export default SimulationInfo