import React, { useEffect, useState } from "react"
import axios from "axios"
import { Form, Segment } from "semantic-ui-react"
import { Formik } from "formik"
import SimulationScenario from "../../../components/simulation/simulation_scenario"
import SimulationOutput from "../../../components/simulation/simulation_output"
import HostUtilizationChart from "../../../components/charts/host_utilization_chart"
import SimulationSignIn from "../../../components/simulation/simulation_signin"

import DataParallelismSimulationScenario from "../../../images/vector_graphs/multi_core/multicore_data_parallelism.svg"

const DataParallelismSimulation = () => {

  const [simulationResults, setSimulationResults] = useState(<></>)
  const [auth, setAuth] = useState("false")

  useEffect(() => {
    setAuth(localStorage.getItem("login"))
  })

  return (
    auth === "true" ? (
      <>
        <SimulationScenario scenario={<DataParallelismSimulationScenario />} />

        <Segment.Group>
          <Segment color="teal"><strong>Simulation Parameters</strong></Segment>
          <Segment>
            <Formik
              initialValues={{
                numCores: 1,
                oilRadius: 1
              }}

              validate={values => {
                const errors = {}
                if (!values.oilRadius || !/^[0-9]+$/i.test(values.oilRadius) || values.oilRadius < 1 || values.oilRadius > 10) {
                  errors.oilRadius = "ERROR"
                } else if (!values.numCores || !/^[0-9]+$/i.test(values.numCores) || values.numCores > 100 || values.numCores < 1) {
                  errors.numCores = "ERROR"
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
                    num_cores: values.numCores,
                    oil_radius: values.oilRadius,
                    scheduling_scheme: values.schedulingScheme
                  }
                  setSimulationResults(<></>)
                  axios.post(window.location.protocol + "//" + window.location.hostname + ":3000/run/multi_core_data_parallelism", data).then(
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
                    <Form.Input fluid name="oilRadius"
                                label="Radius of the 'oil' task"
                                placeholder="1"
                                type="number"
                                min={1}
                                max={10}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.oilRadius}
                                error={errors.oilRadius && touched.oilRadius ? {
                                  content: "Please provide a radius for the \"oil\" task in the range [1,10].",
                                  pointing: "above"
                                } : null}
                    />
                    <Form.Input fluid name="numCores"
                                label="Number of Cores in Compute Node"
                                placeholder="1"
                                type="number"
                                min={1}
                                max={100}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.numCores}
                                error={errors.numCores && touched.numCores ? {
                                  content: "Please provide the number of cores in the compute node in the range of [1, 100].",
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

export default DataParallelismSimulation
