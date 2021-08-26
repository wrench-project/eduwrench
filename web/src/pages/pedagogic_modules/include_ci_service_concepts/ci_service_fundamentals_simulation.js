/**
 * Copyright (c) 2019-2021. The WRENCH Team.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 */

import React, { useEffect, useState } from "react"
import axios from "axios"
import { Form, Segment } from "semantic-ui-react"
import { Formik } from "formik"
import SimulationScenario from "../../../components/simulation/simulation_scenario"
import SimulationOutput from "../../../components/simulation/simulation_output"
import GanttChart from "../../../components/charts/gantt_chart"
import SimulationSignIn from "../../../components/simulation/simulation_signin"
import { validateFieldInRange } from "../../../components/simulation/simulation_validation"

import CIServiceFundamentalsScenario from "../../../images/vector_graphs/ci_service_concepts/ci_overhead.svg"

const CIServiceFundamentalsSimulation = () => {

  const [simulationResults, setSimulationResults] = useState(<></>)
  const [auth, setAuth] = useState("false")

  useEffect(() => {
    setAuth(localStorage.getItem("login"))
  })

  return (
    auth === "true" ? (
        <>
          <SimulationScenario scenario={<CIServiceFundamentalsScenario />} />

          <Segment.Group>
            <Segment color="teal"><strong>Simulation Parameters</strong></Segment>
            <Segment>
              <Formik
                initialValues={{
                  compute1Startup: 1,
                  compute2Startup: 5,
                  taskWork: 1000,
                  hostSelect: "1"
                }}

                validate={values => {
                  const errors = {}
                  if (!validateFieldInRange("server-1-overhead-label", values.compute1Startup, 0, 10, "Startup overhead", "sec")) {
                    errors.compute1Startup = "ERROR"
                  }
                  if (!validateFieldInRange("server-2-overhead-label", values.compute2Startup, 0, 10, "Startup overhead", "sec")) {
                    errors.compute2Startup = "ERROR"
                  }
                  if (!validateFieldInRange("task-work-label", values.taskWork, 100, 2000, null, "Gflop")) {
                    errors.taskWork = "ERROR"
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
                      compute_1_startup: values.compute1Startup,
                      compute_2_startup: values.compute2Startup,
                      server_1_link_bandwidth: "10",
                      server_2_link_bandwidth: "100",
                      server_1_link_latency: "10",
                      file_size: "100",
                      task_work: values.taskWork,
                      host_select: values.hostSelect
                    }
                    setSimulationResults(<></>)
                    axios.post(window.location.protocol + "//" + window.location.hostname + ":3000/run/ci_overhead", data).then(
                      response => {
                        setSimulationResults(
                          <>
                            <SimulationOutput output={response.data.simulation_output} />
                            <GanttChart data={response.data.task_data} label={{
                              read: { display: false },
                              compute: { display: true, label: "Performing Computation" },
                              write: { display: false }
                            }} />
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
                        <Form.Input fluid name="compute1Startup"
                                    label="Task startup overhead for Server #1 (secs)"
                                    placeholder="1"
                                    type="number"
                                    min={0}
                                    max={10}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.compute1Startup}
                                    error={errors.compute1Startup && touched.compute1Startup ? {
                                      content: "Please provide a value between 0 and 10.",
                                      pointing: "above"
                                    } : null}
                        />
                        <Form.Input fluid name="compute2Startup"
                                    label="Task startup overhead for Server #2 (secs)"
                                    placeholder="5"
                                    type="number"
                                    min={0}
                                    max={10}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.compute2Startup}
                                    error={errors.compute2Startup && touched.compute2Startup ? {
                                      content: "Please provide a value between 0 and 10.",
                                      pointing: "above"
                                    } : null}
                        />
                        <Form.Input fluid name="taskWork"
                                    label="Task work (Gflop)"
                                    placeholder="1000"
                                    type="number"
                                    min={100}
                                    max={2000}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.taskWork}
                                    error={errors.taskWork && touched.taskWork ? {
                                      content: "Please provide a value between 100 and 2000.",
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

export default CIServiceFundamentalsSimulation
