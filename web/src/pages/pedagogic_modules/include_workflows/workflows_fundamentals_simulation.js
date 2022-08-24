import React, { useEffect, useState } from "react"
import axios from "axios"
import { Form, Segment } from "semantic-ui-react"
import { Formik } from "formik"
import SimulationOutput from "../../../components/simulation/simulation_output"
import SimulationScenario from "../../../components/simulation/simulation_scenario"
import GanttChart from "../../../components/charts/gantt_chart"
import HostUtilizationChart from "../../../components/charts/host_utilization_chart"
import TasksData from "../../../components/simulation/tasks_data"
import SimulationSignIn from "../../../components/simulation/simulation_signin"
import { validateFieldInRange } from "../../../components/simulation/simulation_validation"

import WorkflowsFundamentalsScenario from "../../../images/vector_graphs/workflows/workflow_fundamentals.svg"
import SimulationFeedback from "../../../components/simulation/simulation_feedback";

const WorkflowsFundamentalsSimulation = () => {

  const [simulationResults, setSimulationResults] = useState(<></>)
  const [auth, setAuth] = useState("false")
  const [runtimes, setRunTimes] = useState(0)

  useEffect(() => {
    setAuth(localStorage.getItem("login"))
  })

  return (
    auth === "true" ? (
      <>
        <SimulationScenario scenario={<WorkflowsFundamentalsScenario />} />

        <Segment.Group>
          <Segment color="teal"><strong>Simulation Parameters</strong></Segment>
          <Segment>
            <Formik
              initialValues={{
                numCores: 1,
                diskBandwidth: 100
              }}

              validate={values => {
                const errors = {}
                if (!validateFieldInRange("wf-num-cores-label", values.numCores, 1, 3, "Cores:")) {
                  errors.numCores = "ERROR"
                }
                if (!validateFieldInRange("wf-disk-bandwidth-label", values.diskBandwidth, 10, 500, null, "MB/sec")) {
                  errors.diskBandwidth = "ERROR"
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
                    num_cores: values.numCores,
                    disk_bandwidth: values.diskBandwidth
                  }
                  setSimulationResults(<></>)
                  axios.post(window.location.protocol + "//" + window.location.hostname + ":3000/run/workflow_fundamentals", data).then(
                    response => {
                      setSimulationResults(
                        <>
                          <SimulationOutput output={response.data.simulation_output} />
                          <GanttChart data={response.data.task_data} />
                          <HostUtilizationChart data={response.data.task_data} />
                          <TasksData data={response.data.task_data} />
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
                    <Form.Input fluid name="numCores"
                                label="Number of cores"
                                placeholder="1"
                                type="number"
                                min={1}
                                max={3}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.numCores}
                                error={errors.numCores && touched.numCores ? {
                                  content: "Please provide a number of cores in the range [1,3].",
                                  pointing: "above"
                                } : null}
                    />
                    <Form.Input fluid
                                name="diskBandwidth"
                                label="Disk bandwidth (MB/sec)"
                                placeholder="100"
                                type="number"
                                min={10}
                                max={500}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.diskBandwidth}
                                error={errors.diskBandwidth && touched.diskBandwidth ? {
                                  content: "Please provide a disk read/write bandwidth value in the range [10,500].",
                                  pointing: "above"
                                } : null}
                    />
                  </Form.Group>
                  <Form.Button color="teal" type="submit" disabled={isSubmitting}>Run Simulation</Form.Button>
                </Form>
              )}
            </Formik>
              <SimulationFeedback simulationID={'workflows/workflows_fundamentals_simulation'} trigger={runtimes === 3}/>
          </Segment>
        </Segment.Group>

        {simulationResults}

      </>
    ) : (
      <SimulationSignIn />
    )
  )
}

export default WorkflowsFundamentalsSimulation
