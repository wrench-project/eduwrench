/**
 * Copyright (c) 2019-2021. The WRENCH Team.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 */

import React, { useEffect, useState } from "react"
import axios from "axios"
import { Form, Segment } from "semantic-ui-react"
import { Formik } from "formik"
import SimulationScenario from "../../../components/simulation/simulation_scenario"
import SimulationOutput from "../../../components/simulation/simulation_output"
import SimulationSignIn from "../../../components/simulation/simulation_signin"
import { validateFieldInRange } from "../../../components/simulation/simulation_validation"

import CIStorageServicesScenario from "../../../images/vector_graphs/ci_service_concepts/cic_storage_service.svg"
import SimulationFeedback from "../../../components/simulation/simulation_feedback";

const CIStorageServicesSimulation = () => {

    const [simulationResults, setSimulationResults] = useState(<></>)
    const [auth, setAuth] = useState("false")
    const [runtimes, setRunTimes] = useState(0)


    useEffect(() => {
        setAuth(localStorage.getItem("login"))
    })

    return (
        auth === "true" ? (
                <>
                    <SimulationScenario scenario={<CIStorageServicesScenario />} />

                    <Segment.Group>
                        <Segment color="teal"><strong>Simulation Parameters</strong></Segment>
                        <Segment>
                            <Formik
                                initialValues={{
                                    bandwidth: 10,
                                    fileSize: 10,
                                    registrationOverhead: 1
                                }}

                                validate={values => {
                                    const errors = {}
                                    if (!validateFieldInRange("client-bandwidth-label", values.bandwidth, 1, 1000, null, "Mbps")) {
                                        errors.bandwidth = "ERROR"
                                    }
                                    if (values.fileSize < 1 || values.fileSize > 10000) {
                                        errors.fileSize = "ERROR"
                                    }
                                    if (!validateFieldInRange("registration-overhead-label", values.registrationOverhead, 0, 5, null, "sec")) {
                                        errors.registrationOverhead = "ERROR"
                                    }
                                    return errors
                                }}

                                onSubmit={(values, { setSubmitting }) => {
                                    setTimeout(() => {
                                        if (localStorage.getItem("login") !== "true") {
                                            setSimulationResults(<></>)
                                            return
                                        }
                                        setRunTimes(runtimes + 1)
                                        const data = {
                                            user_name: localStorage.getItem("userName"),
                                            email: localStorage.getItem("currentUser"),
                                            bandwidth: values.bandwidth,
                                            fileSize: values.fileSize,
                                            registrationOverhead: values.registrationOverhead
                                        }
                                        setSimulationResults(<></>)
                                        axios.post(window.location.protocol + "//" + window.location.hostname + ":3000/run/storage_service", data).then(
                                            response => {
                                                const diskHostsList = ["StorageHost"]
                                                const linkNames = ["network_link"]

                                                // Doing some filtering of output lines for prettiness
                                                let outputLines = response.data.simulation_output.split(/\r?\n/);
                                                let cleanedOutput = ""
                                                for (let line of outputLines) {
                                                    if (
                                                        line.includes("Adding file (data_file) at (Client) to the file registry") ||
                                                        line.includes("mount point") ||
                                                        line.includes("starting on host")
                                                        ) {
                                                      continue
                                                    }
                                                    cleanedOutput = cleanedOutput.concat(line)
                                                }
                                                setSimulationResults(
                                                    <>
                                                        <SimulationOutput output={cleanedOutput} />
                                                    </>
                                                )
                                                setSubmitting(false)
                                            },
                                            error => {
                                                console.log(error)
                                                alert("Error executing simulation.")
                                                setSubmitting(false)
                                            }
                                        )
                                    }, 400)
                                }}
                            >
                                {
                                    ({
                                         values,
                                         errors,
                                         touched,
                                         handleChange,
                                         handleBlur,
                                         handleSubmit,
                                         isSubmitting
                                     }) => (
                                        <Form onSubmit={handleSubmit}>
                                            <Form.Group widths="equal">
                                                <Form.Input fluid name="bandwidth"
                                                            label="Bandwidth between Client and Data Service (MB/sec)"
                                                            placeholder="10"
                                                            type="number"
                                                            min={1}
                                                            max={1000}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            value={values.bandwidth}
                                                            error={errors.bandwidth && touched.bandwidth ? {
                                                                content: "Please provide a value between 1 and 1000 MB/sec.",
                                                                pointing: "above"
                                                            } : null}
                                                />
                                                <Form.Input fluid name="fileSize"
                                                            label="File size (MB)"
                                                            placeholder="10"
                                                            type="number"
                                                            min={1}
                                                            max={10000}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            value={values.fileSize}
                                                            error={errors.fileSize && touched.fileSize ? {
                                                                content: "Please provide a value between 1 and 10000 MB.",
                                                                pointing: "above"
                                                            } : null}
                                                />
                                                <Form.Input fluid name="registrationOverhead"
                                                            label="Registration Overhead for File Registry Service (sec)"
                                                            placeholder="1"
                                                            type="number"
                                                            min={0}
                                                            max={5}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            value={values.registrationOverhead}
                                                            error={errors.registrationOverhead && touched.registrationOverhead ? {
                                                                content: "Please provide a value between 0 and 5 secs.",
                                                                pointing: "above"
                                                            } : null}
                                                />
                                            </Form.Group>
                                            <Form.Button color="teal" type="submit" disabled={isSubmitting}>Run Simulation</Form.Button>
                                        </Form>
                                    )
                                }
                            </Formik>
                            <SimulationFeedback simulationID={'ci_service_concepts/ci_stirage_services_simulation'} trigger={runtimes === 3}/>
                        </Segment>
                    </Segment.Group>

                    {
                        simulationResults
                    }

                </>
            ) :
            (
                <SimulationSignIn />
            )
    )
}

export default CIStorageServicesSimulation
