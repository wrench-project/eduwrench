/**
 * Copyright (c) 2021. The WRENCH Team.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 */

import React, { useState } from "react"
import axios from "axios"
import { Form, Segment } from "semantic-ui-react"
import { Formik } from "formik"
import SimulationScenario from "../../../components/simulation/simulation_scenario"
import SimulationOutput from "../../../components/simulation/simulation_output"
import { validateFieldInRange } from "../../../components/simulation/simulation_validation"

import CIStorageNetworkProximityScenario
  from "../../../images/vector_graphs/ci_service_concepts/ci_network_proximity.svg"
import SimulationFeedback from "../../../components/simulation/simulation_feedback";

const CIStorageNetworkProximitySimulation = () => {

  const [simulationResults, setSimulationResults] = useState(<></>)
  const [runtimes, setRunTimes] = useState(0)

  return (
    <>
      <SimulationScenario scenario={<CIStorageNetworkProximityScenario/>}/>

      <Segment.Group>
        <Segment color="teal"><strong>Simulation Parameters</strong></Segment>
        <Segment>
          <Formik
            initialValues={{
              fileSize: 10,
              server1Bandwidth: 100,
              server1Latency: 10,
              server2Bandwidth: 150,
              server2Latency: 8,
              server3Bandwidth: 200,
              server3Latency: 12
            }}

            validate={values => {
              const errors = {}
              if (values.fileSize < 1 || values.fileSize > 100) {
                errors.fileSize = "ERROR"
              }
              if (!validateFieldInRange("ci-np-server1bandwidth", values.server1Bandwidth, 1, 1000, "Bandwidth:", "Mbps")) {
                errors.server1Bandwidth = "ERROR"
              }
              if (!validateFieldInRange("ci-np-server1latency", values.server1Latency, 1, 100, "Latency:", "μs")) {
                errors.server1Latency = "ERROR"
              }
              if (!validateFieldInRange("ci-np-server2bandwidth", values.server2Bandwidth, 1, 1000, "Bandwidth:", "Mbps")) {
                errors.server2Bandwidth = "ERROR"
              }
              if (!validateFieldInRange("ci-np-server2latency", values.server2Latency, 1, 100, "Latency:", "μs")) {
                errors.server2Latency = "ERROR"
              }
              if (!validateFieldInRange("ci-np-server3bandwidth", values.server3Bandwidth, 1, 1000, "Bandwidth:", "Mbps")) {
                errors.server3Bandwidth = "ERROR"
              }
              if (!validateFieldInRange("ci-np-server3latency", values.server3Latency, 1, 100, "Latency:", "μs")) {
                errors.server3Latency = "ERROR"
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
                  fileSize: values.fileSize * 1000 * 1000 * 1000,
                  server1Bandwidth: values.server1Bandwidth,
                  server1Latency: values.server1Latency,
                  server2Bandwidth: values.server2Bandwidth,
                  server2Latency: values.server2Latency,
                  server3Bandwidth: values.server3Bandwidth,
                  server3Latency: values.server3Latency
                }
                setSimulationResults(<></>)
                axios.post(window.location.protocol + "//" + window.location.hostname + ":" + process.env.GATSBY_BACKEND_PORT + "/run/storage_network_proximity", data).then(
                  response => {
                    const diskHostsList = ["Client"]
                    const linkNames = ["network_link"]
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
            {
              ({
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
                    <Form.Input fluid name="fileSize"
                                label="File size (GB)"
                                placeholder="10"
                                type="number"
                                min={1}
                                max={100}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.fileSize}
                                error={errors.fileSize && touched.fileSize ? {
                                  content: "Please provide a value between 1 and 100 GB.",
                                  pointing: "above"
                                } : null}
                    />
                  </Form.Group>
                  <Form.Group widths="equal">
                    <Form.Group className="grouped-forms" grouped>
                      <strong>Server 1:</strong>
                      <Form.Input fluid name="server1Bandwidth"
                                  label="Bandwidth (MB/sec)"
                                  placeholder="10"
                                  type="number"
                                  min={1}
                                  max={1000}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  value={values.server1Bandwidth}
                                  error={errors.server1Bandwidth && touched.server1Bandwidth ? {
                                    content: "Please provide a value between 1 and 1000 MB/sec.",
                                    pointing: "above"
                                  } : null}
                      />
                      <Form.Input fluid name="server1Latency"
                                  label="Latency (μs)"
                                  placeholder="1"
                                  type="number"
                                  min={1}
                                  max={100}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  value={values.server1Latency}
                                  error={errors.server1Latency && touched.server1Latency ? {
                                    content: "Please provide a value between 1 and 100 μs.",
                                    pointing: "above"
                                  } : null}
                      />
                    </Form.Group>
                    <Form.Group className="grouped-forms" grouped>
                      <strong>Server 2:</strong>
                      <Form.Input fluid name="server2Bandwidth"
                                  label="Bandwidth (MB/sec)"
                                  placeholder="150"
                                  type="number"
                                  min={1}
                                  max={1000}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  value={values.server2Bandwidth}
                                  error={errors.server2Bandwidth && touched.server2Bandwidth ? {
                                    content: "Please provide a value between 1 and 1000 MB/sec.",
                                    pointing: "above"
                                  } : null}
                      />
                      <Form.Input fluid name="server2Latency"
                                  label="Latency (μs)"
                                  placeholder="8"
                                  type="number"
                                  min={1}
                                  max={100}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  value={values.server2Latency}
                                  error={errors.server2Latency && touched.server2Latency ? {
                                    content: "Please provide a value between 1 and 100 μs.",
                                    pointing: "above"
                                  } : null}
                      />
                    </Form.Group>
                    <Form.Group className="grouped-forms grouped-forms-last" grouped>
                      <strong>Server 3:</strong>
                      <Form.Input fluid name="server3Bandwidth"
                                  label="Bandwidth (MB/sec)"
                                  placeholder="200"
                                  type="number"
                                  min={1}
                                  max={1000}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  value={values.server3Bandwidth}
                                  error={errors.server3Bandwidth && touched.server3Bandwidth ? {
                                    content: "Please provide a value between 1 and 1000 MB/sec.",
                                    pointing: "above"
                                  } : null}
                      />
                      <Form.Input fluid name="server3Latency"
                                  label="Latency (μs)"
                                  placeholder="12"
                                  type="number"
                                  min={1}
                                  max={100}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  value={values.server3Latency}
                                  error={errors.server3Latency && touched.server3Latency ? {
                                    content: "Please provide a value between 1 and 100 μs.",
                                    pointing: "above"
                                  } : null}
                      />
                    </Form.Group>
                  </Form.Group>
                  <Form.Button color="teal" type="submit" disabled={isSubmitting}>Run Simulation</Form.Button>
                </Form>
              )
            }
          </Formik>
          <SimulationFeedback simulationID={'ci_service_concepts/ci_storage_network_proximity_simulation'} trigger={runtimes === 3}/>
        </Segment>
      </Segment.Group>

      {
        simulationResults
      }

    </>
  )
}

export default CIStorageNetworkProximitySimulation
