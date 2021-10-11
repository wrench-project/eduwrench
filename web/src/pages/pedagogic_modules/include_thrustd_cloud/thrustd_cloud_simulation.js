import React, { useEffect, useState } from "react"
import axios from "axios"
import { Form, Segment, Grid} from "semantic-ui-react"
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
import MProjectInput from "../../../images/vector_graphs/thrustd/split_montage/mProject/files_0.svg"
import MProjectLevel from "../../../images/vector_graphs/thrustd/split_montage/mProject/level_0.svg"
import MProjectTasks from "../../../images/vector_graphs/thrustd/split_montage/mProject/tasks_0.svg"
import MDiffFitInput from "../../../images/vector_graphs/thrustd/split_montage/mDiffFit/files_1.svg"
import MDiffFitLevel from "../../../images/vector_graphs/thrustd/split_montage/mDiffFit/level_1.svg"
import MDiffFitTasks from "../../../images/vector_graphs/thrustd/split_montage/mDiffFit/tasks_1.svg"
import MConcatFitInput from "../../../images/vector_graphs/thrustd/split_montage/mConcatFit/files_2.svg"
import MConcatFitLevel from "../../../images/vector_graphs/thrustd/split_montage/mConcatFit/level_2.svg"
import MConcatFitTasks from "../../../images/vector_graphs/thrustd/split_montage/mConcatFit/tasks_2.svg"
import MBgModelInput from "../../../images/vector_graphs/thrustd/split_montage/mBgModel/files_3.svg"
import MBgModelLevel from "../../../images/vector_graphs/thrustd/split_montage/mBgModel/level_3.svg"
import MBgModelTasks from "../../../images/vector_graphs/thrustd/split_montage/mBgModel/tasks_3.svg"

const Thrustd_Cloud_Simulation = () => {

    const [simulationResults, setSimulationResults] = useState(<></>)
    const [auth, setAuth] = useState("false")
    const [numVmsError, setNumVmsError] = useState("false")

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
                                if (values.numHosts < 1 || values.numHosts > 128) {
                                    errors.numHosts = "ERROR"
                                }
                                if (values.pstate < 0 || values.pstate > 6) {
                                    errors.pstate = "ERROR"
                                }
                                if ((values.mProjectCloud > 0 || values.mDiffFitCloud > 0 || values.mConcatFitCloud === true ||
                                    values.mBgModelCloud === true || values.mBackgroundCloud > 0 || values.mImgtblCloud === true
                                    || values.mAddCloud === true || values.mViewerCloud === true) && values.numVmInstances <= 0) {
                                    setNumVmsError("Please provide the number of VM instances in the range of [1, 500] to use the cloud sliders.")
                                    errors.numVmInstances = "ERROR"
                                } else if (values.numVmInstances < 0 || values.numVmInstances > 500) {
                                    setNumVmsError("Please provide the number of VM instances in the range of [0, 500].")
                                    errors.numVmInstances = "ERROR"
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
                                                    max={500}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    value={values.numVmInstances}
                                                    error={errors.numVmInstances && touched.numVmInstances ? {
                                                        content: numVmsError,
                                                        pointing: "above"
                                                    } : null}
                                        />
                                    </Form.Group>
                                    {/*https://stackoverflow.com/questions/63774577/how-to-define-setfieldvalue-in-react*/}
                                    <Segment><strong>Task Distribution</strong></Segment>
                                    <Grid>
                                        <Grid.Row>
                                            <Grid.Column>
                                                <MProjectInput/>
                                            </Grid.Column>
                                            <Grid.Column>
                                                <MProjectTasks/>
                                            </Grid.Column>
                                        </Grid.Row>
                                        <Grid.Row>
                                            <Grid.Column>
                                                <MProjectLevel/>
                                            </Grid.Column>
                                            <Grid.Column>
                                                <Form.Field fluid value={values.mProjectCloud}>
                                                    <TaskSlider color="blue" name="mProjectCloud" set={setFieldValue}/>
                                                </Form.Field>
                                            </Grid.Column>
                                        </Grid.Row>

                                        <Grid.Row>
                                            <Grid.Column>
                                                <MDiffFitInput/>
                                            </Grid.Column>
                                            <Grid.Column>
                                                <MDiffFitTasks/>
                                            </Grid.Column>
                                        </Grid.Row>
                                        <Grid.Row>
                                            <Grid.Column>
                                                <MDiffFitLevel/>
                                            </Grid.Column>
                                            <Grid.Column>
                                                <Form.Field fluid value={values.mDiffFitCloud}>
                                                    <TaskSlider color="pink" name="mDiffFitCloud" set={setFieldValue}/>
                                                </Form.Field>
                                            </Grid.Column>
                                        </Grid.Row>

                                        <Grid.Row>
                                            <Grid.Column>
                                                <MConcatFitInput/>
                                            </Grid.Column>
                                            <Grid.Column>
                                                <MConcatFitTasks/>
                                            </Grid.Column>
                                        </Grid.Row>
                                        <Grid.Row>
                                            <Grid.Column>
                                                <MConcatFitLevel/>
                                            </Grid.Column>
                                            <Grid.Column>
                                                <Form.Field fluid>
                                                    <CheckboxSlider color="orange" name="mConcatFitCloud" set={setFieldValue} value={values.mConcatFitCloud}/>
                                                </Form.Field>
                                            </Grid.Column>
                                        </Grid.Row>

                                        <Grid.Row>
                                            <Grid.Column>
                                                <MBgModelInput/>
                                            </Grid.Column>
                                            <Grid.Column>
                                                <MBgModelTasks/>
                                            </Grid.Column>
                                        </Grid.Row>
                                        <Grid.Row>
                                            <Grid.Column>
                                                <MBgModelLevel/>
                                            </Grid.Column>
                                            <Grid.Column>
                                                <Form.Field fluid>
                                                    <CheckboxSlider color="green" name="mBgModelCloud" set={setFieldValue} value={values.mBgModelCloud}/>
                                                </Form.Field>
                                            </Grid.Column>
                                        </Grid.Row>

                                    </Grid>

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
