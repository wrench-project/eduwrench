import React, { useEffect, useState } from "react"
import axios from "axios"
import { Form, Segment, Checkbox, Label, Grid, Container } from "semantic-ui-react"
import { Formik, Field } from "formik"
import SimulationOutput from "../../../components/simulation/simulation_output"
import SimulationScenario from "../../../components/simulation/simulation_scenario"
import GanttChart from "../../../components/charts/gantt_chart"
import HostUtilizationChart from "../../../components/charts/host_utilization_chart"
import TasksData from "../../../components/simulation/tasks_data"
import SimulationSignIn from "../../../components/simulation/simulation_signin"
import TaskSlider from "./task_slider"
import CheckboxSlider from "./checkbox_slider"
import {
    validateFieldInRange
} from "../../../components/simulation/simulation_validation"

import MontageWorkflow from "../../../images/vector_graphs/thrustd/montage_workflow.svg"

const Thrustd_Cloud_Simulation = () => {

    const [simulationResults, setSimulationResults] = useState(<></>)
    const [auth, setAuth] = useState("false")

    useEffect(() => {
        setAuth(localStorage.getItem("login"))
    })

    return (
        auth === "true" ? (
            <>
                <SimulationScenario scenario={<MontageWorkflow/>} />

                <Segment.Group>
                    <Segment color="teal"><strong>Simulation Parameters</strong></Segment>
                    <Segment>
                        <Formik enableReinitialize={true}
                            initialValues={{
                                numHosts: 1,
                                pstate: 0,
                                cloudHosts: 0,
                                numVmInstances: 0,
                                mProjectLocal: 0,
                                mDiffFitLocal: 0,
                                mConcatFitLocal: false,
                                mBgModelLocal: false,
                                mBackgroundLocal: 0,
                                mImgtblLocal: false,
                                mAddLocal: false,
                                mViewerLocal: false
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
                                        cloudHosts: values.cloudHosts,
                                        numVmInstances: values.numVmInstances,
                                        mProjectLocal: values.mProjectLocal,
                                        mDiffFitLocal: values.mDiffFitLocal,
                                        mConcatFitLocal: values.mConcatFitLocal,
                                        mBgModelLocal: values.mBgModelLocal,
                                        mBackgroundLocal: values.mBackgroundLocal,
                                        mImgtblLocal: values.mImgtblLocal,
                                        mAddLocal: values.mAddLocal,
                                        mViewerLocal: values.mViewerLocal
                                    }
                                    console.log(data)
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
                                  setFieldValue,
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
                                    <Form.Group widths="equal">
                                        <Form.Input fluid name="cloudHosts"
                                                    label="Number of Cloud Hosts"
                                                    placeholder="0"
                                                    type="number"
                                                    min={0}
                                            // not sure how many is the max for cloud hosts
                                                    max={128}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    value={values.cloudHosts}
                                                    error={errors.cloudHosts && touched.cloudHosts ? {
                                                        content: "Please provide the number of cloud hosts in the range of [0, 128].",
                                                        pointing: "above"
                                                    } : null}
                                        />
                                        <Form.Input fluid
                                                    name="numVmInstances"
                                                    label="Number of VM Instances"
                                                    placeholder="0"
                                                    type="number"
                                                    min={0}
                                            // again not sure of the max value
                                                    max={128}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    value={values.numVmInstances}
                                                    error={errors.numVmInstances && touched.numVmInstances ? {
                                                        content: "Please provide the number of VM instances in the range of [0, 128].",
                                                        pointing: "above"
                                                    } : null}
                                        />
                                    </Form.Group>
                                    {/*https://stackoverflow.com/questions/63774577/how-to-define-setfieldvalue-in-react*/}
                                    <Segment><strong>Task Distribution</strong></Segment>
                                    <Form.Field fluid value={values.mProjectLocal}>
                                        <TaskSlider color="blue" name="mProjectLocal" set={setFieldValue}/>
                                    </Form.Field>
                                    <Form.Field fluid value={values.mDiffFitLocal}>
                                        <TaskSlider color="pink" name="mDiffFitLocal" set={setFieldValue}/>
                                    </Form.Field>
                                    <Form.Field fluid>
                                        <CheckboxSlider color="orange" name="mConcatFitLocal" set={setFieldValue} value={values.mConcatFitLocal}/>
                                    </Form.Field>
                                    <Form.Field fluid>
                                        <CheckboxSlider color="green" name="mBgModelLocal" set={setFieldValue} value={values.mBgModelLocal}/>
                                    </Form.Field>
                                    <Form.Field fluid value={values.mBackgroundLocal}>
                                        <TaskSlider color="yellow" name="mBackgroundLocal" set={setFieldValue}/>
                                    </Form.Field>
                                    <Form.Field fluid>
                                        <CheckboxSlider color="blue" name="mImgtblLocal" set={setFieldValue} value={values.mImgtblLocal}/>
                                    </Form.Field>
                                    <Form.Field fluid>
                                        <CheckboxSlider color="violet" name="mAddLocal" set={setFieldValue} value={values.mAddLocal}/>
                                    </Form.Field>
                                    <Form.Field fluid>
                                        <CheckboxSlider color="red" name="mViewerLocal" set={setFieldValue} value={values.mViewerLocal}/>
                                    </Form.Field>
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
