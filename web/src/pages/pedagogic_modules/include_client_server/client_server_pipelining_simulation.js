import React, { useEffect, useState } from "react"
import axios from "axios"
import { Form, Label, Segment } from "semantic-ui-react"
import { Formik } from "formik"
import SimulationScenario from "../../../components/simulation/simulation_scenario"
import SimulationOutput from "../../../components/simulation/simulation_output"
import HostUtilizationChart from "../../../components/charts/host_utilization_chart"
import NetworkBandwidthUsageChart from "../../../components/charts/network_bandwidth_usage"
import SimulationSignIn from "../../../components/simulation/simulation_signin"

import ClientServerDiskScenario from "../../../images/client_server/client_server_disk.svg"

const ClientServerPipeliningSimulation = () => {

  const [simulationResults, setSimulationResults] = useState(<></>)
  const [auth, setAuth] = useState("false")

  useEffect(() => {
    setAuth(localStorage.getItem("login"))
  })

  return (
    auth === "true" ? (
      <>
        <SimulationScenario scenario={ClientServerDiskScenario} />

        <Segment.Group>
          <Segment color="teal"><strong>Simulation Parameters</strong></Segment>
          <Segment>
            <Formik
              initialValues={{
                server1Latency: 10,
                bufferSize: 100000,
                hostSelect: "1"
              }}

              validate={values => {
                const errors = {}
                if (!values.server1Latency || !/^[0-9]+$/i.test(values.server1Latency) || values.server1Latency > 10000 || values.server1Latency < 1) {
                  errors.server1Latency = "ERROR"
                } else if (!values.bufferSize || !/^[0-9]+$/i.test(values.bufferSize) || values.bufferSize > 1000000 || values.bufferSize < 50000) {
                  errors.bufferSize = "ERROR"
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
                    server_1_link_latency: values.server1Latency,
                    server_1_link_bandwidth: 200,
                    server_2_link_bandwidth: 600,
                    file_size: "1000",
                    buffer_size: 1000 * values.bufferSize,
                    host_select: values.hostSelect,
                    disk_speed: 400
                  }
                  setSimulationResults(<></>)
                  axios.post(window.location.protocol + "//" + window.location.hostname + ":3000/run/client_server_disk", data).then(
                    response => {
                      const diskHostsList = ["client"]
                      const linkNames = [values.hostSelect === "1" ? "link1" : "link2"]
                      setSimulationResults(
                        <>
                          <SimulationOutput output={response.data.simulation_output} />
                          <HostUtilizationChart data={response.data.task_data} diskHostsList={diskHostsList} />
                          <NetworkBandwidthUsageChart data={response.data.task_data} linkNames={linkNames} />
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
                  <Form.Group inline>
                    <label>Host selection</label>
                    <Form.Input
                      name="hostSelect"
                      label="Server #1"
                      type="radio"
                      labelPosition="left"
                      value="1"
                      checked={values.hostSelect === "1"}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <Form.Input
                      name="hostSelect"
                      label="Server #2"
                      type="radio"
                      value="2"
                      checked={values.hostSelect === "2"}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </Form.Group>
                  <Form.Group widths="equal">
                    <Form.Input fluid name="server1Latency"
                                label="Latency to Server #1 (us)"
                                placeholder="10"
                                type="number"
                                min={1}
                                max={10000}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.server1Latency}
                                error={errors.server1Latency && touched.server1Latency ? {
                                  content: "Please provide the latency from the Client to Server #1 in us between 1 and 10,000.",
                                  pointing: "above"
                                } : null}
                    />
                    <Form.Input fluid name="bufferSize"
                                label="Buffer Size (KB)"
                                placeholder="100000"
                                type="number"
                                min={50000}
                                max={1000000}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.bufferSize}
                                error={errors.bufferSize && touched.bufferSize ? {
                                  content: "Please provide a buffer size in KB between 50,000 and 1,000,000.",
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

export default ClientServerPipeliningSimulation
