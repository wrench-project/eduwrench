import React, { useState } from "react"
import axios from "axios"
import { Form, Segment } from "semantic-ui-react"
import { Formik } from "formik"
import SimulationScenario from "../../../components/simulation/simulation_scenario"
import SimulationOutput from "../../../components/simulation/simulation_output"
import { validateFieldInMultipleRanges } from "../../../components/simulation/simulation_validation"

import ClientServerBasicsScenario from "../../../images/vector_graphs/client_server/client_server_basics.svg"
import SimulationFeedback from "../../../components/simulation/simulation_feedback";

const ClientServerBasicsSimulation = () => {

  const [simulationResults, setSimulationResults] = useState(<></>)
  const [runtimes, setRunTimes] = useState(0)

  return (
    <>
      <SimulationScenario scenario={<ClientServerBasicsScenario/>}/>

      <Segment.Group>
        <Segment color="teal"><strong>Simulation Parameters</strong></Segment>
        <Segment>
          <Formik
            initialValues={{
              server1Bandwidth: 10,
              hostSelect: "1"
            }}

            validate={values => {
              const errors = {}
              if (!validateFieldInMultipleRanges("cs-server-1-link-label", values.server1Bandwidth, [
                { min: 1, max: 999, prefix: "Bandwidth:", postfix: "MB/sec" },
                { min: 1000, max: 10000, prefix: "Bandwidth:", postfix: "GBps", valueLambdaFunction: (v) => v / 1000 }
              ])) {
                errors.server1Bandwidth = "ERROR"
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
                  server_1_link_bandwidth: values.server1Bandwidth,
                  server_2_link_bandwidth: "100",
                  server_1_link_latency: "10",
                  file_size: "100",
                  host_select: values.hostSelect
                }
                setSimulationResults(<></>)
                axios.post(window.location.protocol + "//" + window.location.hostname + ":3000/run/client_server", data).then(
                  response => {
                    setSimulationResults(
                      <>
                        <SimulationOutput output={response.data.simulation_output}/>
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
                  <Form.Input fluid name="server1Bandwidth"
                              label="Link Speed to Server #1 (MB/sec)"
                              placeholder="10"
                              type="number"
                              min={1}
                              max={10000}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.server1Bandwidth}
                              error={errors.server1Bandwidth && touched.server1Bandwidth ? {
                                content: "Please provide the link speed from the Client to Server #1 in the range of [1, 10000] MB/sec.",
                                pointing: "above"
                              } : null}
                  />
                </Form.Group>
                <Form.Button color="teal" type="submit" disabled={isSubmitting}>Run Simulation</Form.Button>
              </Form>
            )}
          </Formik>
          <SimulationFeedback simulationID={'client_server/client_server_basics_simulation'} trigger={runtimes === 3}/>
        </Segment>
      </Segment.Group>

      {simulationResults}

    </>
  )
}

export default ClientServerBasicsSimulation
