import React, { useState } from "react"
import axios from "axios"
import { Form, Segment } from "semantic-ui-react"
import { Formik } from "formik"
import SimulationScenario from "../../../components/simulation/simulation_scenario"
import SimulationOutput from "../../../components/simulation/simulation_output"
import {
  validateFieldInRange,
  validateFieldInMultipleRanges
} from "../../../components/simulation/simulation_validation"

import ClientServerDiskScenario from "../../../images/vector_graphs/client_server/client_server_disk.svg"
import SimulationFeedback from "../../../components/simulation/simulation_feedback";

const ClientServerPipeliningSimulation = () => {

  const [simulationResults, setSimulationResults] = useState(<></>)
  const [runtimes, setRunTimes] = useState(0)

  return (
    <>
      <SimulationScenario scenario={<ClientServerDiskScenario/>}/>

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
              if (!validateFieldInRange("csd-server-1-link-latency-label", values.server1Latency, 1, 10000, "Latency:", "us")) {
                errors.server1Latency = "ERROR"
              }
              if (!validateFieldInMultipleRanges("csd-buffer-size-label", values.bufferSize, [
                { min: 100, max: 999, postfix: "KB", valueLambdaFunction: (v) => v },
                { min: 1000, max: 999999, postfix: "MB", valueLambdaFunction: (v) => v / 1000 },
                { min: 1000000, max: 1000000, postfix: "GB", valueLambdaFunction: (v) => v / 1000000 }
              ])) {
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
                setRunTimes(runtimes + 1)
                const data = {
                  user_name: localStorage.getItem("userName"),
                  email: localStorage.getItem("currentUser"),
                  server_1_link_latency: values.server1Latency,
                  server_1_link_bandwidth: 200,
                  server_2_link_bandwidth: 600,
                  file_size: "1000",
                  buffer_size: 1000 * values.bufferSize,
                  host_select: values.hostSelect,
                  disk_speed: 400
                }
                setSimulationResults(<></>)
                axios.post(window.location.protocol + "//" + window.location.hostname + ":" + process.env.GATSBY_BACKEND_PORT + "/run/client_server_disk", data).then(
                  response => {
                    const diskHostsList = ["client"]
                    const linkNames = [values.hostSelect === "1" ? "link1" : "link2"]
                    setSimulationResults(
                      <>
                        <SimulationOutput output={response.data.simulation_output}/>
                        {/*<HostUtilizationChart data={response.data.task_data} diskHostsList={diskHostsList} />*/}
                        {/*<NetworkBandwidthUsageChart data={response.data.task_data} linkNames={linkNames} />*/}
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
                              min={100}
                              max={1000000}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.bufferSize}
                              error={errors.bufferSize && touched.bufferSize ? {
                                content: "Please provide a buffer size in KB between 100 and 1,000,000.",
                                pointing: "above"
                              } : null}
                  />
                </Form.Group>
                <Form.Button color="teal" type="submit" disabled={isSubmitting}>Run Simulation</Form.Button>
              </Form>
            )}
          </Formik>
          <SimulationFeedback simulationID={'client_server/client_server_pipelining_simulation'} trigger={runtimes === 3}/>
        </Segment>
      </Segment.Group>

      {simulationResults}

    </>
  )
}

export default ClientServerPipeliningSimulation
