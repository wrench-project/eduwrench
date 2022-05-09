import React, { useEffect, useState } from "react"
import axios from "axios"
import { Form, Segment } from "semantic-ui-react"
import { Formik } from "formik"
import SimulationOutput from "../../../components/simulation/simulation_output"
import SimulationScenario from "../../../components/simulation/simulation_scenario"
import GanttChart from "../../../components/charts/gantt_chart"
import SimulationSignIn from "../../../components/simulation/simulation_signin"
import {
    validateFieldInRange
} from "../../../components/simulation/simulation_validation"

import SoloCloudFunctionScenario from "../../../images/vector_graphs/gcf/gcf.svg"

const Solo_Cloud_Function_Simulation = () => {

    const [simulationResults, setSimulationResults] = useState(<></>)
    const [auth, setAuth] = useState("false")

    useEffect(() => {
        setAuth(localStorage.getItem("login"))
    })

    return (
        auth === "true" ? (
            <>
                <SimulationScenario scenario={<SoloCloudFunctionScenario/>} />

                <Segment.Group>
                    <Segment color="teal"><strong>Simulation Parameters</strong></Segment>
                    <Segment>
                        <Formik
                            initialValues={{
                                numInstances: 1,
                                numFir: 2
                            }}

                            validate={values => {
                                const errors = {}
                                if (!validateFieldInRange("gcf-num-instances-label", values.numInstances, 1, 100, "N = ", " Instance(s)")) {
                                    errors.numInstances = "ERROR"
                                }
                                if (!validateFieldInRange("gcf-num-fir-label", values.numFir, 2, 100, "Max # FIR / sec = ", "")) {
                                    errors.numFir = "ERROR"
                                }
                                if (values.numInstances < 1 || values.numInstances > 100) {
                                    errors.numInstances = "ERROR"
                                }
                                if (values.numFir < 2 || values.numFir > 100) {
                                    errors.numFir = "ERROR"
                                }
                                return errors
                            }}

                            onSubmit={(values, { setSubmitting }) => {
                                setTimeout(() => {
                                    if (localStorage.getItem("login") !== "true") {
                                        setSimulationResults(<></>)
                                        return
                                    }
                                    const userEmail = localStorage.getItem("currentUser")
                                    const data = {
                                        userName: userEmail.split("@")[0],
                                        email: userEmail,
                                        numInstances: values.numInstances,
                                        numFir: values.numFir
                                    }
                                    setSimulationResults(<></>)
                                    axios.post(window.location.protocol + "//" + window.location.hostname + ":3000/run/solo_cloud_function", data).then(
                                        response => {
                                            setSimulationResults(
                                                <>
                                                    <SimulationOutput output={response.data.simulation_output} />
                                                    <GanttChart data={response.data.task_data} />
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
                            {({
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
                                        <Form.Input fluid name="numInstances"
                                                    label="Number of Instances"
                                                    placeholder="1"
                                                    type="number"
                                                    min={1}
                                                    max={100}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    value={values.numInstances}
                                                    error={errors.numInstances && touched.numInstances ? {
                                                        content: "Please provide the number of instances in the range of [1, 100].",
                                                        pointing: "above"
                                                    } : null}
                                        />
                                        <Form.Input fluid
                                                    name="numFir"
                                                    label="Max # of Requests/sec"
                                                    placeholder="2"
                                                    type="number"
                                                    min={2}
                                                    max={100}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    value={values.numFir}
                                                    error={errors.numFir && touched.numFir ? {
                                                        content: "Please provide the max # of requests/sec in the range of [2, 100].",
                                                        pointing: "above"
                                                    } : null}
                                        />
                                    </Form.Group>
                                    <Form.Button color="teal" type="submit" disabled={isSubmitting}>Run Simulation</Form.Button>
                                </Form>
                            )}
                        </Formik>
                    </Segment>
                </Segment.Group>

                {simulationResults}

            </>
        ) : (
            <SimulationSignIn />
        )
    )
}

export default Solo_Cloud_Function_Simulation
