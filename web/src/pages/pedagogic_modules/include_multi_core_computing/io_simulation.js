import React, { useState } from "react"
import axios from "axios"
import { Form, Segment } from "semantic-ui-react"
import { Formik } from "formik"
import SimulationOutput from "../../../components/simulation/simulation_output"
import SimulationScenario from "../../../components/simulation/simulation_scenario"
import GanttChart from "../../../components/charts/gantt_chart"
import HostUtilizationChart from "../../../components/charts/host_utilization_chart"
import { validateFieldInRange } from "../../../components/simulation/simulation_validation"

import IOSimulationScenario from "../../../images/vector_graphs/multi_core/multicore_io_simulation.svg"
import SimulationFeedback from "../../../components/simulation/simulation_feedback";

const IOSimulation = () => {

  const [simulationResults, setSimulationResults] = useState(<></>)
  const [runtimes, setRunTimes] = useState(0)

  return (
    <>
      <SimulationScenario scenario={<IOSimulationScenario/>}/>

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
              if (!validateFieldInRange("mcit-io-task1-input-size-label", values.taskInput, 1, 1000, null, "MB")) {
                errors.taskInput = "ERROR"
              }
              if (!validateFieldInRange("mcit-io-task1-output-size-label", values.taskOutput, 1, 1000, null, "MB")) {
                errors.taskOutput = "ERROR"
              }
              if (!validateFieldInRange("mcit-io-task1-work-label", values.taskGflop, 100, 1000, null, "Gflop")) {
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
                setRunTimes(runtimes + 1)
                const data = {
                  user_name: localStorage.getItem("userName"),
                  email: localStorage.getItem("currentUser"),
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
                        <SimulationOutput output={response.data.simulation_output}/>
                        <GanttChart data={response.data.task_data}/>
                        <HostUtilizationChart data={response.data.task_data}/>
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
                  <Form.Input fluid name="taskInput"
                              label="Task #1 input size (MB)"
                              placeholder="100"
                              type="number"
                              min={1}
                              max={1000}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.taskInput}
                              error={errors.taskInput && touched.taskInput ? {
                                content: "Please provide the number of MBs in the range of [1, 1000].",
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
                  <Form.Input name="taskOutput"
                              label="Task #1 output size (MB)"
                              placeholder="100"
                              type="number"
                              min={1}
                              max={1000}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.taskOutput}
                              error={errors.taskOutput && touched.taskOutput ? {
                                content: "Please provide a number of MBs in the range of [1, 1000].",
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
          <SimulationFeedback simulationID={'multi_core_computing/io_simulation'} trigger={runtimes === 3}/>
        </Segment>
      </Segment.Group>

      {simulationResults}

    </>
  )
}

export default IOSimulation
