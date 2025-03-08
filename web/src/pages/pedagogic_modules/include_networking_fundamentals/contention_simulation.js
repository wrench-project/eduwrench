import React, { useState } from "react"
import axios from "axios"
import { Form, Segment } from "semantic-ui-react"
import { Formik } from "formik"
import SimulationOutput from "../../../components/simulation/simulation_output"
import SimulationScenario from "../../../components/simulation/simulation_scenario"

import ContentScenario
  from "../../../images/vector_graphs/networking_fundamentals/networking_fundamentals_cyber_infrastructure.svg"
import SimulationFeedback from "../../../components/simulation/simulation_feedback";

const ContentionSimulation = () => {

  const [simulationResults, setSimulationResults] = useState(<></>)
  const [runtimes, setRunTimes] = useState(0)

  return (
    <>
      <SimulationScenario scenario={<ContentScenario/>}/>

      <Segment.Group>
        <Segment color="teal"><strong>Simulation Parameters</strong></Segment>
        <Segment>
          <Formik
            initialValues={{
              fileSizes: "10, 20"
            }}

            validate={values => {
              const errors = {}
              if (!values.fileSizes || !/^[0-9,\ ]+$/i.test(values.fileSizes)) {
                errors.fileSizes = "ERROR"
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
                  file_sizes: values.fileSizes
                }
                setSimulationResults(<></>)
                axios.post(window.location.protocol + "//" + window.location.hostname + ":" + process.env.GATSBY_BACKEND_PORT + "/run/networking_fundamentals", data).then(
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
                <Form.Group widths="equal">
                  <Form.Input fluid name="fileSizes"
                              label="List of file sizes (MB)"
                              placeholder="1"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.fileSizes}
                              error={errors.fileSizes && touched.fileSizes ? {
                                content: "Please provide a comma- or space-separated list of integral file sizes.",
                                pointing: "above"
                              } : null}
                  />
                </Form.Group>
                <Form.Button color="teal" type="submit" disabled={isSubmitting}>Run Simulation</Form.Button>
              </Form>
            )}
          </Formik>
          <SimulationFeedback simulationID={'networking_fundamentals/contention_simulation'} trigger={runtimes === 3}/>
        </Segment>
      </Segment.Group>

      {simulationResults}

    </>
  )
}

export default ContentionSimulation
