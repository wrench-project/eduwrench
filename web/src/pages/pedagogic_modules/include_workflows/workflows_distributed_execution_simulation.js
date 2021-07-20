import React, { useEffect, useState } from "react"
import axios from "axios"
import { Form, Segment } from "semantic-ui-react"
import { Formik } from "formik"
import SimulationOutput from "../../../components/simulation/simulation_output"
import SimulationScenario from "../../../components/simulation/simulation_scenario"
import HostUtilizationChart from "../../../components/charts/host_utilization_chart"
import TasksData from "../../../components/simulation/tasks_data"
import SimulationSignIn from "../../../components/simulation/simulation_signin"

import WorkflowsDistributedExecutionScenario from "../../../images/vector_graphs/workflows/workflow_distributed.svg"

const WorkflowsDistributedExecutionSimulation = () => {

  const [simulationResults, setSimulationResults] = useState(<></>)
  const [auth, setAuth] = useState("false")

  useEffect(() => {
    setAuth(localStorage.getItem("login"))
  })

  return (
    auth === "true" ? (
      <>
        <SimulationScenario scenario={WorkflowsDistributedExecutionScenario} />

        <Segment.Group>
          <Segment color="teal"><strong>Simulation Parameters</strong></Segment>
          <Segment>
            <Formik
              initialValues={{
                numCores: 1,
                numHosts: 1
              }}

              validate={values => {
                const errors = {}
                if (!values.numCores || !/^[0-9]+$/i.test(values.numCores) || values.numCores > 32 || values.numCores < 1) {
                  errors.numCores = "ERROR"
                } else if (!values.numHosts || !/^[0-9]+$/i.test(values.numHosts) || values.numHosts < 1 || values.numHosts > 20) {
                  errors.numHosts = "ERROR"
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
                    num_cores: values.numCores,
                    link_bandwidth: "100",
                    use_local_storage: "0",
                  }
                  setSimulationResults(<></>)
                  axios.post(window.location.protocol + "//" + window.location.hostname + ":3000/run/workflow_distributed", data).then(
                    response => {
                      setSimulationResults(
                        <>
                          <SimulationOutput output={response.data.simulation_output} />
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
                                label="Number of compute hosts"
                                placeholder="1"
                                type="number"
                                min={1}
                                max={20}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.numHosts}
                                error={errors.numHosts && touched.numHosts ? {
                                  content: "Provide a number in the range of [1, 20].",
                                  pointing: "above"
                                } : null}
                    />
                    <Form.Input fluid name="numCores"
                                label="Number of cores per compute host"
                                placeholder="1"
                                type="number"
                                min={1}
                                max={32}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.numCores}
                                error={errors.numCores && touched.numCores ? {
                                  content: "Provide a number in the range of [1, 32].",
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

export default WorkflowsDistributedExecutionSimulation
