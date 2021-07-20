import React, { useEffect, useState } from "react"
import axios from "axios"
import { Form, Label, Segment } from "semantic-ui-react"
import { Formik } from "formik"
import SimulationOutput from "../../../components/simulation/simulation_output"
import SimulationScenario from "../../../components/simulation/simulation_scenario"
import GanttChart from "../../../components/charts/gantt_chart"
import HostUtilizationChart from "../../../components/charts/host_utilization_chart"
import SimulationSignIn from "../../../components/simulation/simulation_signin"

import IOSimulationScenario from "../../../images/vector_graphs/multi_core/multicore_io_simulation.svg"

const IOSimulation = () => {

  const [simulationResults, setSimulationResults] = useState(<></>)
  const [auth, setAuth] = useState("false")

  useEffect(() => {
    setAuth(localStorage.getItem("login"))
  })

  return (
    auth === "true" ? (
      <>
        <SimulationScenario scenario={<IOSimulationScenario />} />

        <Segment.Group>
          <Segment color="teal"><strong>Simulation Parameters</strong></Segment>
          <Segment>
            <Formik
              initialValues={{
                taskInput: 100,
                taskOutput: 100,
                taskGflop: 100,
                firstTask: "1"
              }}

              validate={values => {
                const errors = {}
                if (!values.taskInput || !/^[0-9]+$/i.test(values.taskInput) || values.taskInput > 1000 || values.taskInput < 100) {
                  errors.taskInput = "ERROR"
                } else if (!values.taskOutput || !/^[0-9]+$/i.test(values.taskOutput) || values.taskOutput > 1000 || values.taskOutput < 100) {
                  errors.taskOutput = "ERROR"
                } else if (!values.taskGflop || !/^[0-9]+$/i.test(values.taskGflop) || values.taskGflop < 100 || values.taskGflop > 1000) {
                  errors.taskGflop = "ERROR"
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
                    task1_input_size: values.taskInput,
                    task1_output_size: values.taskOutput,
                    task1_work: values.taskGflop,
                    first_task: values.firstTask,
                    task2_input_size: 100,
                    task2_output_size: 100,
                    task2_work: 500
                  }
                  setSimulationResults(<></>)
                  axios.post(window.location.protocol + "//" + window.location.hostname + ":3000/run/multi_core_independent_tasks_io", data).then(
                    response => {
                      setSimulationResults(
                        <>
                          <SimulationOutput output={response.data.simulation_output} />
                          <GanttChart data={response.data.task_data} />
                          <HostUtilizationChart data={response.data.task_data} />
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
                    <Form.Input fluid name="taskInput"
                                label="Task #1 input size (MB)"
                                placeholder="100"
                                type="number"
                                min={100}
                                max={1000}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.taskInput}
                                error={errors.taskInput && touched.taskInput ? {
                                  content: "Please provide the number of MBs in the range of [100, 1000].",
                                  pointing: "above"
                                } : null}
                    />
                    <Form.Input fluid name="taskGflop"
                                label="Task #1 work (Gflop)"
                                placeholder="500"
                                type="number"
                                min={100}
                                max={1000}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.taskGflop}
                                error={errors.taskGflop && touched.taskGflop ? {
                                  content: "Please provide a number of Gflop in the range of [100, 1000].",
                                  pointing: "above"
                                } : null}
                    />
                  </Form.Group>
                  <Form.Group widths="equal">
                    <Form.Input name="taskOutput"
                                label="Task #1 output size (MB)"
                                placeholder="100"
                                type="number"
                                min={100}
                                max={1000}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.taskOutput}
                                error={errors.taskOutput && touched.taskOutput ? {
                                  content: "Please provide a number of MBs in the range of [100, 1000].",
                                  pointing: "above"
                                } : null}
                    />
                  </Form.Group>
                  <Form.Group inline>
                    <label>Task ordering:</label>
                    <Form.Input
                      name="firstTask"
                      label="Task #1 first"
                      type="radio"
                      value="1"
                      checked={values.firstTask === "1"}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <Form.Input
                      name="firstTask"
                      label="Task #2 first"
                      type="radio"
                      value="2"
                      checked={values.firstTask === "2"}
                      onChange={handleChange}
                      onBlur={handleBlur}
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

export default IOSimulation
