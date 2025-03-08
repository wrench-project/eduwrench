import React, { useState } from "react"
import axios from "axios"
import { Form, Segment } from "semantic-ui-react"
import { Formik } from "formik"
import SimulationOutput from "../../../components/simulation/simulation_output"
import SimulationScenario from "../../../components/simulation/simulation_scenario"
import GanttChart from "../../../components/charts/gantt_chart"
import HostUtilizationChart from "../../../components/charts/host_utilization_chart"
import NetworkBandwidthUsageChart from "../../../components/charts/network_bandwidth_usage"
import TasksData from "../../../components/simulation/tasks_data"
import { validateFieldInRange } from "../../../components/simulation/simulation_validation"

import WorkflowsDataLocalityScenario from "../../../images/vector_graphs/workflows/workflow_data_locality.svg"
import SimulationFeedback from "../../../components/simulation/simulation_feedback";

const WorkflowsDataLocalitySimulation = () => {

  const [simulationResults, setSimulationResults] = useState(<></>)
  const [runtimes, setRunTimes] = useState(0)

  return (
    <>
      <SimulationScenario scenario={<WorkflowsDataLocalityScenario/>}/>

      <Segment.Group>
        <Segment color="teal"><strong>Simulation Parameters</strong></Segment>
        <Segment>
          <Formik
            initialValues={{
              numCores: 1,
              numHosts: 1,
              linkBandwidth: 100,
              useLocalStorage: true
            }}

            validate={values => {
              const errors = {}
              if (!validateFieldInRange("wf-locality-num-cores-label-1", values.numCores, 1, 32, "Cores:")) {
                errors.numCores = "ERROR"
              }
              if (!validateFieldInRange("wf-locality-num-cores-label-2", values.numCores, 1, 32, "Cores:")) {
                errors.numCores = "ERROR"
              }
              if (!validateFieldInRange("wf-locality-num-hosts-label", values.numHosts, 1, 20, "N =", "Host(s)")) {
                errors.numHosts = "ERROR"
              }
              if (!validateFieldInRange("wf-locality-link-bandwidth-label", values.linkBandwidth, 1, 500, "Bandwidth:", "MB/sec")) {
                errors.linkBandwidth = "ERROR"
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
                  num_hosts: values.numHosts,
                  num_cores: values.numCores,
                  link_bandwidth: values.linkBandwidth,
                  use_local_storage: values.useLocalStorage ? "1" : "0"
                }
                setSimulationResults(<></>)
                axios.post("http://" + window.location.hostname + ":" + process.env.GATSBY_BACKEND_PORT + "/run/workflow_distributed", data).then(
                  response => {
                    setSimulationResults(
                      <>
                        <SimulationOutput output={response.data.simulation_output}/>
                        <GanttChart data={response.data.task_data}/>
                        <HostUtilizationChart data={response.data.task_data}/>
                        <NetworkBandwidthUsageChart data={response.data.task_data} linkNames={["wide_area_link"]}/>
                        <TasksData data={response.data.task_data}/>
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
                  <Form.Input fluid name="linkBandwidth"
                              label="Wide-area link bandwidth"
                              placeholder="1"
                              type="number"
                              min={1}
                              max={500}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.linkBandwidth}
                              error={errors.linkBandwidth && touched.linkBandwidth ? {
                                content: "Provide a bandwidth in the range [1, 500].",
                                pointing: "above"
                              } : null}
                  />
                </Form.Group>
                <Form.Field
                  type="checkbox"
                  control="input"
                  label={(<>Use storage on <i>hpc_storage.edu</i></>)}
                  name="useLocalStorage"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.useLocalStorage}
                  checked={values.useLocalStorage}
                />
                <Form.Button color="teal" type="submit" disabled={isSubmitting}>Run Simulation</Form.Button>
              </Form>
            )}
          </Formik>
          <SimulationFeedback simulationID={'workflows/workflows_data_locality_simulation'} trigger={runtimes === 3}/>
        </Segment>
      </Segment.Group>

      {simulationResults}

    </>
  )
}

export default WorkflowsDataLocalitySimulation
