import React, { useEffect, useState } from "react"
import axios from "axios"
import { Form, Segment} from "semantic-ui-react"
import { Formik} from "formik"
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
                                numVmInstances: 0,
                                mProjectCloud: 0,
                                mDiffFitCloud: 0,
                                mConcatFitCloud: false,
                                mBgModelCloud: false,
                                mBackgroundCloud: 0,
                                mImgtblCloud: false,
                                mAddCloud: false,
                                mViewerCloud: false
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
                                        numVmInstances: values.numVmInstances,
                                        mProjectCloud: values.mProjectCloud,
                                        mDiffFitCloud: values.mDiffFitCloud,
                                        mConcatFitCloud: values.mConcatFitCloud,
                                        mBgModelCloud: values.mBgModelCloud,
                                        mBackgroundCloud: values.mBackgroundCloud,
                                        mImgtblCloud: values.mImgtblCloud,
                                        mAddCloud: values.mAddCloud,
                                        mViewerCloud: values.mViewerCloud
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
                                    <Form.Field fluid value={values.mProjectCloud}>
                                        <TaskSlider color="blue" name="mProjectCloud" set={setFieldValue}/>
                                    </Form.Field>
                                    <Form.Field fluid value={values.mDiffFitCloud}>
                                        <TaskSlider color="pink" name="mDiffFitCloud" set={setFieldValue}/>
                                    </Form.Field>
                                    <Form.Field fluid>
                                        <CheckboxSlider color="orange" name="mConcatFitCloud" set={setFieldValue} value={values.mConcatFitCloud}/>
                                    </Form.Field>
                                    <Form.Field fluid>
                                        <CheckboxSlider color="green" name="mBgModelCloud" set={setFieldValue} value={values.mBgModelCloud}/>
                                    </Form.Field>
                                    <Form.Field fluid value={values.mBackgroundCloud}>
                                        <TaskSlider color="yellow" name="mBackgroundCloud" set={setFieldValue}/>
                                    </Form.Field>
                                    <Form.Field fluid>
                                        <CheckboxSlider color="blue" name="mImgtblCloud" set={setFieldValue} value={values.mImgtblCloud}/>
                                    </Form.Field>
                                    <Form.Field fluid>
                                        <CheckboxSlider color="violet" name="mAddCloud" set={setFieldValue} value={values.mAddCloud}/>
                                    </Form.Field>
                                    <Form.Field fluid>
                                        <CheckboxSlider color="red" name="mViewerCloud" set={setFieldValue} value={values.mViewerCloud}/>
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
