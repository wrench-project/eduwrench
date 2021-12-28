import React, { useEffect, useState } from "react"
import axios from "axios"
import { Form, Segment } from "semantic-ui-react"
import { Formik } from "formik"
import SimulationOutput from "../../../components/simulation/simulation_output"
import SimulationScenarioTwo from "../../../components/simulation/simulation_scenario_two"
import GanttChart from "../../../components/charts/gantt_chart"
import HostUtilizationChart from "../../../components/charts/host_utilization_chart"
import TasksData from "../../../components/simulation/tasks_data"
import SimulationSignIn from "../../../components/simulation/simulation_signin"
import {
    validateFieldInRange
} from "../../../components/simulation/simulation_validation"

import MontageWorkflow from "../../../images/vector_graphs/thrustd/montage_workflow.svg"
import LocalComputingScenario from "../../../images/vector_graphs/thrustd/thrustd_local.svg"

const Thrustd_Local_Simulation = () => {

    const [simulationResults, setSimulationResults] = useState(<></>)
    const [auth, setAuth] = useState("false")

    useEffect(() => {
        setAuth(localStorage.getItem("login"))
    })

    return (
        auth === "true" ? (
            <>
                <SimulationScenarioTwo scenario={<MontageWorkflow/>} scenario2={<LocalComputingScenario/>} />

                <Segment.Group>
                    <Segment color="teal"><strong>Simulation Parameters</strong></Segment>
                    <Segment>
                        <Formik
                            initialValues={{
                                numHosts: 1,
                                pstate: 0
                            }}

                            validate={values => {
                                const errors = {}
                                if (!validateFieldInRange("td-pstate-label-1", values.pstate, 0, 6, "Pstate: ", "")) {
                                    errors.pstate = "ERROR"
                                }
                                if (!validateFieldInRange("td-pstate-label-N", values.pstate, 0, 6, "Pstate: ", "")) {
                                    errors.pstate = "ERROR"
                                }
                                if (!validateFieldInRange("td-num-hosts-label", values.numHosts, 1, 64, "N=", "Hosts")) {
                                    errors.numHosts = "ERROR"
                                }
                                if (values.numHosts < 1 || values.numHosts > 64) {
                                    errors.numHosts = "ERROR"
                                }
                                if (values.pstate < 0 || values.pstate > 6) {
                                    errors.pstate = "ERROR"
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
                                        num_hosts: values.numHosts,
                                        pstate: values.pstate
                                    }
                                    setSimulationResults(<></>)
                                    axios.post(window.location.protocol + "//" + window.location.hostname + ":3000/run/thrustd", data).then(
                                        response => {
                                            setSimulationResults(
                                                <>
                                                    <SimulationOutput output={response.data.simulation_output} />
                                                    <GanttChart data={response.data.task_data} />
                                                    {/*<HostUtilizationChart data={response.data.task_data} />*/}
                                                    {/*<TasksData data={response.data.task_data} />*/}
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
                                        <Form.Input fluid name="numHosts"
                                                    label="Number of hosts powered on"
                                                    placeholder="1"
                                                    type="number"
                                                    min={1}
                                                    max={64}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    value={values.numHosts}
                                                    error={errors.numHosts && touched.numHosts ? {
                                                        content: "Please provide the number of hosts in the range of [1, 64].",
                                                        pointing: "above"
                                                    } : null}
                                        />
                                        <Form.Input fluid
                                                    name="pstate"
                                                    label="Pstate Value"
                                                    placeholder="0"
                                                    type="number"
                                                    min={0}
                                                    max={6}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    value={values.pstate}
                                                    error={errors.pstate && touched.pstate ? {
                                                        content: "Please provide the pstate in the range of [0, 6].",
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

export default Thrustd_Local_Simulation
