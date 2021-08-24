import React, { useEffect, useState } from "react"
import axios from "axios"
import { Form, Segment } from "semantic-ui-react"
import { Formik } from "formik"
import SimulationOutput from "../../../components/simulation/simulation_output"
import SimulationScenario from "../../../components/simulation/simulation_scenario"
import HostUtilizationChart from "../../../components/charts/host_utilization_chart"
import SimulationSignIn from "../../../components/simulation/simulation_signin"
import { validateFieldInRange } from "../../../components/simulation/simulation_validation"

import WorkflowsMixedParallelismScenario
  from "../../../images/vector_graphs/workflows/workflow_task_data_parallelism.svg"

const WorkflowsMixedParallelismSimulation = () => {

  const [simulationResults, setSimulationResults] = useState(<></>)
  const [auth, setAuth] = useState("false")

  useEffect(() => {
    setAuth(localStorage.getItem("login"))
  })

  return (
    auth === "true" ? (
      <>
        <SimulationScenario scenario={<WorkflowsMixedParallelismScenario />} />

        <Segment.Group>
          <Segment color="teal"><strong>Simulation Parameters</strong></Segment>
          <Segment>
            <Formik
              initialValues={{
                numCoresBlue: 1,
                numCoresYellow: 1,
                numCoresPurple: 1
              }}

              validate={values => {
                const errors = {}
                if (!validateFieldInRange("wf-parallel-num-cores-blue-label", values.numCoresBlue, 1, 3, null, "core(s)")) {
                  errors.numCoresBlue = "ERROR"
                }
                if (!validateFieldInRange("wf-parallel-num-cores-yellow-label", values.numCoresYellow, 1, 3, null, "core(s)")) {
                  errors.numCoresYellow = "ERROR"
                }
                if (!validateFieldInRange("wf-parallel-num-cores-purple-label", values.numCoresPurple, 1, 3, null, "core(s)")) {
                  errors.numCoresPurple = "ERROR"
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
                    num_cores_blue: values.numCoresBlue,
                    num_cores_yellow: values.numCoresYellow,
                    num_cores_purple: values.numCoresPurple
                  }
                  setSimulationResults(<></>)
                  axios.post(window.location.protocol + "//" + window.location.hostname + ":3000/run/workflow_task_data_parallelism", data).then(
                    response => {
                      setSimulationResults(
                        <>
                          <SimulationOutput output={response.data.simulation_output} />
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
                    <Form.Input fluid name="numCoresBlue"
                                label="Number of cores used by the blue task"
                                placeholder="1"
                                type="number"
                                min={1}
                                max={3}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.numCoresBlue}
                                error={errors.numCoresBlue && touched.numCoresBlue ? {
                                  content: "Provide a number in the range of [1, 3].",
                                  pointing: "above"
                                } : null}
                    />
                    <Form.Input fluid
                                name="numCoresYellow"
                                label="Number of cores used by the yellow task"
                                placeholder="1"
                                type="number"
                                min={1}
                                max={3}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.numCoresYellow}
                                error={errors.numCoresYellow && touched.numCoresYellow ? {
                                  content: "Provide a number in the range of [1, 3].",
                                  pointing: "above"
                                } : null}
                    />
                    <Form.Input fluid
                                name="numCoresPurple"
                                label="Number of cores used by the purple task"
                                placeholder="1"
                                type="number"
                                min={1}
                                max={3}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.numCoresPurple}
                                error={errors.numCoresPurple && touched.numCoresPurple ? {
                                  content: "Provide a number in the range of [1, 3].",
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

export default WorkflowsMixedParallelismSimulation
