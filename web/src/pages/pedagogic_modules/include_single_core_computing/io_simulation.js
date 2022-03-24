import React, { useEffect, useState } from "react"
import axios from "axios"
import { Form, Label, Popup, Segment } from "semantic-ui-react"
import { Formik } from "formik"
import SimulationOutput from "../../../components/simulation/simulation_output"
import SimulationScenario from "../../../components/simulation/simulation_scenario"
import GanttChart from "../../../components/charts/gantt_chart"
import HostUtilizationChart from "../../../components/charts/host_utilization_chart"
import TasksData from "../../../components/simulation/tasks_data"
import SimulationSignIn from "../../../components/simulation/simulation_signin"
import {
  validateFieldInRange,
  validateFieldInMultipleRanges
} from "../../../components/simulation/simulation_validation"

import IOTask from "../../../images/vector_graphs/single_core/io_task.svg"
import SimulationPopup from "../../../components/simulation/simulation_popup"

const IOSimulation = () => {

  const [simulationResults, setSimulationResults] = useState(<></>)
  const [auth, setAuth] = useState("false")
  const [buttonPopup, setButtonPopup] = useState(false)

  useEffect(() => {
    setAuth(localStorage.getItem("login"))
  })

  const handleClick = (e) => {
    e.preventDefault();
  }

  return (
    auth === "true" ? (
      <>
        <SimulationScenario scenario={<IOTask />} />

        <Segment.Group>
          <Segment color="teal"><strong>Simulation Parameters</strong></Segment>
          <Segment>
            <Formik
              initialValues={{
                numTasks: 1,
                taskGflop: 100,
                amountInput: 1,
                amountOutput: 1,
                overlapAllowed: false
              }}

              validate={values => {
                const errors = {}
                if (!validateFieldInRange("num-tasks-label", values.numTasks, 1, 100, null, "Task(s)")) {
                  errors.numTasks = "ERROR"
                }
                if (!validateFieldInMultipleRanges("task-gflop-label", values.taskGflop, [
                  { min: 1, max: 999, prefix: null, postfix: "Gflop" },
                  { min: 1000, max: 1000000, prefix: null, postfix: "Tflop", valueLambdaFunction: (v) => v / 1000 }
                ])) {
                  errors.taskGflop = "ERROR"
                }
                if (!validateFieldInRange("task-input-label", values.amountInput, 0, 999, "In:", "MB")) {
                  errors.amountInput = "ERROR"
                }
                if (!validateFieldInRange("task-output-label", values.amountOutput, 0, 999, "Out:", "MB")) {
                  errors.amountOutput = "ERROR"
                }
                return errors
              }}

              onSubmit={(values, { setSubmitting }) => {
                setTimeout(() => {
                  if (localStorage.getItem("login") !== "true") {
                    setSimulationResults(<></>)
                    return
                  }
                  const data = {
                    user_name: localStorage.getItem("userName"),
                    email: localStorage.getItem("currentUser"),
                    num_tasks: values.numTasks,
                    task_gflop: values.taskGflop,
                    task_input: values.amountInput,
                    task_output: values.amountOutput,
                    io_overlap: values.overlapAllowed
                  }
                  setSimulationResults(<></>)
                  axios.post(window.location.protocol + "//" + window.location.hostname + ":3000/run/io_operations", data).then(
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
                    <Form.Input fluid name="numTasks"
                                label="Number of Tasks"
                                placeholder="1"
                                type="number"
                                min={1}
                                max={100}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.numTasks}
                                error={errors.numTasks && touched.numTasks ? {
                                  content: "Please provide the number of tasks in the range of [1, 100].",
                                  pointing: "above"
                                } : null}
                    />
                    <Form.Input fluid
                                name="taskGflop"
                                label="Task Gflop"
                                placeholder="100"
                                type="number"
                                min={1}
                                max={999999}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.taskGflop}
                                error={errors.taskGflop && touched.taskGflop ? {
                                  content: "Please provide the amount of Gflop per task in the range of [1, 999999].",
                                  pointing: "above"
                                } : null}
                    >
                      <input />
                      <Label basic className="info-label">
                        Host capable of 100 Gflops
                      </Label>
                    </Form.Input>
                  </Form.Group>
                  <Form.Group widths="equal">
                    <Form.Input fluid
                                name="amountInput"
                                label="Amount of Task Input Data"
                                placeholder="1"
                                type="number"
                                min={0}
                                max={999}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.amountInput}
                                error={errors.amountInput && touched.amountInput ? {
                                  content: "Please provide the amount of input data per task in the range of [0, 999] MB.",
                                  pointing: "above"
                                } : null}
                    >
                      <input />
                      <Label basic className="info-label">
                        Disk reads at 100 MBps
                      </Label>
                    </Form.Input>
                    <Form.Input fluid
                                name="amountOutput"
                                label="Amount of Task Output Data"
                                placeholder="1"
                                type="number"
                                min={0}
                                max={999}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.amountOutput}
                                error={errors.amountOutput && touched.amountOutput ? {
                                  content: "Please provide the amount of output data per task in the range of [0, 999] MB.",
                                  pointing: "above"
                                } : null}
                    >
                      <input />
                      <Label basic className="info-label">
                        Disk writes at 100 MBps
                      </Label>
                    </Form.Input>
                  </Form.Group>
                  <Form.Field
                    type="checkbox"
                    control="input"
                    label="IO Overlap Allowed (Computation and IO can take place concurrently)"
                    name="overlapAllowed"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.overlapAllowed}
                  />
                  {/* <Form.Button color="teal" type="submit" disabled={isSubmitting}>Run Simulation</Form.Button> */}
                  <Form.Button color="teal" type="submit" onClick={() => setButtonPopup(true)} disabled={isSubmitting}>Run Simulation</Form.Button>
                
                <SimulationPopup trigger={buttonPopup} setTrigger={setButtonPopup}>
                  <h3>Feedback</h3>
                  <p>Are you a student/professor/other?</p>
                  <Form.TextArea placeholder='answer' rows="2" cols="70"/>
                  <Form.Button content='Submit' onClick={handleClick}/>
                </SimulationPopup>
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

export default IOSimulation
