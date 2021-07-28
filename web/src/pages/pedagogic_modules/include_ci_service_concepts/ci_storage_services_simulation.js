import React, { useEffect, useState } from "react"
import axios from "axios"
import { Form, Segment } from "semantic-ui-react"
import { Formik } from "formik"
import SimulationScenario from "../../../components/simulation/simulation_scenario"
import SimulationOutput from "../../../components/simulation/simulation_output"
import HostUtilizationChart from "../../../components/charts/host_utilization_chart"
import NetworkBandwidthUsageChart from "../../../components/charts/network_bandwidth_usage"
import SimulationSignIn from "../../../components/simulation/simulation_signin"
import { validateFieldInRange } from "../../../components/simulation/simulation_validation"

import CIStorageServicesScenario from "../../../images/vector_graphs/ci_service_concepts/cic_storage_service.svg"

const CIStorageServicesSimulation = () => {

  const [simulationResults, setSimulationResults] = useState(<></>)
  const [auth, setAuth] = useState("false")

  useEffect(() => {
    setAuth(localStorage.getItem("login"))
  })

  return (
    auth === "true" ? (
        <>
          <SimulationScenario scenario={<CIStorageServicesScenario />} />

          <Segment.Group>
            <Segment color="teal"><strong>Simulation Parameters</strong></Segment>
            <Segment>
              <Formik
                initialValues={{
                  bandwidth: 10,
                  fileSize: 10,
                  registrationOverhead: 1
                }}

                validate={values => {
                  const errors = {}
                  if (!validateFieldInRange("client-bandwidth-label", values.bandwidth, 1, 1000, null, "Mbps")) {
                    errors.bandwidth = "ERROR"
                  }
                  if (values.fileSize < 1 || values.fileSize > 10000) {
                    errors.fileSize = "ERROR"
                  }
                  if (!validateFieldInRange("registration-overhead-label", values.registrationOverhead, 0, 5, null, "sec")) {
                    errors.registrationOverhead = "ERROR"
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
                      bandwidth: values.bandwidth,
                      fileSize: values.fileSize,
                      registrationOverhead: values.registrationOverhead
                    }
                    setSimulationResults(<></>)
                    axios.post(window.location.protocol + "//" + window.location.hostname + ":3000/run/storage_service", data).then(
                      response => {
                        const diskHostsList = ["StorageHost"]
                        const linkNames = ["network_link"]
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
                        <Form.Input fluid name="bandwidth"
                                    label="Bandwidth between Client and Data Service (MB/sec)"
                                    placeholder="10"
                                    type="number"
                                    min={1}
                                    max={1000}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.bandwidth}
                                    error={errors.bandwidth && touched.bandwidth ? {
                                      content: "Please provide a value between 1 and 1000 MB/sec.",
                                      pointing: "above"
                                    } : null}
                        />
                        <Form.Input fluid name="fileSize"
                                    label="File size (MB)"
                                    placeholder="10"
                                    type="number"
                                    min={1}
                                    max={10000}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.fileSize}
                                    error={errors.fileSize && touched.fileSize ? {
                                      content: "Please provide a value between 1 and 10000 MB.",
                                      pointing: "above"
                                    } : null}
                        />
                        <Form.Input fluid name="registrationOverhead"
                                    label="Registration Overhead for File Registry Service (sec)"
                                    placeholder="1"
                                    type="number"
                                    min={0}
                                    max={5}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.registrationOverhead}
                                    error={errors.registrationOverhead && touched.registrationOverhead ? {
                                      content: "Please provide a value between 0 and 5 secs.",
                                      pointing: "above"
                                    } : null}
                        />
                      </Form.Group>
                      <Form.Button color="teal" type="submit" disabled={isSubmitting}>Run Simulation</Form.Button>
                    </Form>
                  )
                }
              </Formik>
            </Segment>
          </Segment.Group>

          {
            simulationResults
          }

        </>
      ) :
      (
        <SimulationSignIn />
      )
  )
}

export default CIStorageServicesSimulation
