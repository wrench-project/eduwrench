import React, { useEffect, useState } from "react"
import axios from "axios"
import { Form, Label, Segment } from "semantic-ui-react"
import { Formik } from "formik"
import SimulationOutput from "../../../components/simulation/simulation_output"
import SimulationScenario from "../../../components/simulation/simulation_scenario"
import GanttChart from "../../../components/charts/gantt_chart"
import HostUtilizationChart from "../../../components/charts/host_utilization_chart"
import TasksData from "../../../components/simulation/tasks_data"
import SimulationSignIn from "../../../components/simulation/simulation_signin"
import CloudComponent from "./cloud_component";
import {
    validateFieldInRange
} from "../../../components/simulation/simulation_validation"

import IOTask from "../../../images/vector_graphs/single_core/io_task.svg"

const Thrustd_Cloud_Simulation = () => {

    const [simulationResults, setSimulationResults] = useState(<></>)
    const [auth, setAuth] = useState("false")

    useEffect(() => {
        setAuth(localStorage.getItem("login"))
    })

    return (
        auth === "true" ? (
            <>
                <SimulationScenario scenario={<IOTask />} />

                <Segment.Group>
                    <Segment color="teal"><strong>Simulation Parameters</strong></Segment>
                    <Segment>
                        <Formik
                            initialValues={{
                                numHosts: 1,
                                pstate: 0,
                                useCloud: false,
                                cloudHosts: 0,
                                numVmInstances: 0
                            }}

                            validate={values => {
                                const errors = {}
                                // if (!validateFieldInRange("num-hosts-label", values.numHosts, 1, 128, "XXX", "Host(s)")) {
                                //     errors.numHosts = "ERROR"
                                // }
                                // if (!validateFieldInRange("pstate-label", values.pstate, 0, 6, "pstate:", "YYY")) {
                                //     errors.pstate = "ERROR"
                                // }
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
                                        pstate: values.pstate,
                                        useCloud: values.useCloud,
                                        cloudHosts: values.cloudHosts,
                                        numVmInstances: values.numVmInstances
                                    }
                                    setSimulationResults(<></>)
                                    axios.post(window.location.protocol + "//" + window.location.hostname + ":3000/run/thrustd_cloud", data).then(
                                        response => {
                                            setSimulationResults(
                                                <>
                                                    <SimulationOutput output={response.data.simulation_output} />
                                                    <GanttChart data={response.data.task_data} />
                                                    <HostUtilizationChart data={response.data.task_data} />
                                                    <TasksData data={response.data.task_data} />
                                                </>
                                            )
                                        },
                                        error => {
                                            console.log(error)
                                            alert("Error executing simulation.")
                                        }
                                    )
                                    setSubmitting(false)
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
                                                    label="Number of Hosts"
                                                    placeholder="1"
                                                    type="number"
                                                    min={1}
                                                    max={128}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    value={values.numHosts}
                                                    error={errors.numHosts && touched.numHosts ? {
                                                        content: "Please provide the number of hosts in the range of [1, 128].",
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
                                    <Form.Field
                                        type="checkbox"
                                        control="input"
                                        label="Use Cloud"
                                        name="useCloud"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.useCloud}
                                    />
                                    <CloudComponent useCloud={values.useCloud} handleChange={handleChange} handleBlur={handleBlur} values={values} errors={errors} touched={touched}/>
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

export default Thrustd_Cloud_Simulation
