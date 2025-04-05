import React, { useState } from "react"
import axios from "axios"
import { Form, Segment } from "semantic-ui-react"
import { Formik } from "formik"
import SimulationScenario from "../../../components/simulation/simulation_scenario"
import SimulationOutput from "../../../components/simulation/simulation_output"
import HostUtilizationChart from "../../../components/charts/host_utilization_chart"
import { validateFieldInRange } from "../../../components/simulation/simulation_validation"

import TaskDependencies3CoresSimulationScenario
  from "../../../images/vector_graphs/multi_core/multicore_dependencies_3_cores.svg"
import SimulationFeedback from "../../../components/simulation/simulation_feedback";

const TaskDependencies3CoresSimulation = () => {

  const [simulationResults, setSimulationResults] = useState(<></>)
  const [runtimes, setRunTimes] = useState(0)

  return (
    <>
      <SimulationScenario scenario={<TaskDependencies3CoresSimulationScenario/>}/>

      <Segment.Group>
        <Segment color="teal"><strong>Simulation Parameters</strong></Segment>
        <Segment>
          <Formik
            initialValues={{
              taskGflop: 100
            }}

            validate={values => {
              const errors = {}
              if (!validateFieldInRange("mcdt3-analyze-work-label", values.taskGflop, 10, 1000, null, "Gflop")) {
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
                  num_cores: "3",
                  analyze_work: values.taskGflop,
                  scheduling_scheme: "viz"
                }
                setSimulationResults(<></>)
                axios.post(`${window.location.protocol}//${window.location.hostname}/backend/run/multi_core_dependent_tasks`, data).then(
                  response => {
                    setSimulationResults(
                      <>
                        <SimulationOutput output={response.data.simulation_output}/>
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
                  <Form.Input fluid
                              name="taskGflop"
                              label="Work of 'analyze' task in Gflop"
                              placeholder="100"
                              type="number"
                              min={10}
                              max={1000}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.taskGflop}
                              error={errors.taskGflop && touched.taskGflop ? {
                                content: "Please provide the work of the \"analyze\" task in the range [10, 1000].",
                                pointing: "above"
                              } : null}
                  />
                </Form.Group>
                <Form.Button color="teal" type="submit" disabled={isSubmitting}>Run Simulation</Form.Button>
              </Form>
            )}
          </Formik>
          <SimulationFeedback simulationID={'multi_core_computing/task_depencies_3_cores_simulation'} trigger={runtimes === 3}/>
        </Segment>
      </Segment.Group>

      {simulationResults}

    </>
  )
}

export default TaskDependencies3CoresSimulation
