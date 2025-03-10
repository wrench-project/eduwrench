import React, { useState } from "react"
import axios from "axios"
import { Form, Segment } from "semantic-ui-react"
import { Formik } from "formik"
import SimulationScenario from "../../../components/simulation/simulation_scenario"
import SimulationOutput from "../../../components/simulation/simulation_output"
import GanttChart from "../../../components/charts/gantt_chart"
import HostUtilizationChart from "../../../components/charts/host_utilization_chart"

import CoordinatorWorkerBasicsScenario
  from "../../../images/vector_graphs/coordinator_worker/coordinator_worker_no_output.svg"
import SimulationFeedback from "../../../components/simulation/simulation_feedback";

const CoordinatorWorkerBasicsSimulation = () => {

  const [simulationResults, setSimulationResults] = useState(<></>)
  const [runtimes, setRunTimes] = useState(0)

  return (
    <>
      <SimulationScenario scenario={<CoordinatorWorkerBasicsScenario/>}/>

      <Segment.Group>
        <Segment color="teal"><strong>Simulation Parameters</strong></Segment>
        <Segment>
          <Formik
            initialValues={{
              workers: "10 100, 100 100, 1000 100",
              tasks: "100 10, 100 1000, 1000 1000, 1000 1000",
              taskScheduling: "0",
              computeScheduling: "0"
            }}

            validate={values => {
              const errors = {}
              if (!values.workers || !/^([0-9]+ [0-9]+,? *)+$/i.test(values.workers)) {
                errors.workers = "ERROR"
              } else if (!values.tasks || !/^([0-9]+ [0-9]+,? *)+$/i.test(values.tasks)) {
                errors.tasks = "ERROR"
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
                let fixed_task_specs = ""
                let tokens = values.tasks.split(",")
                for (let i = 0; i < tokens.length; i++) {
                  fixed_task_specs += tokens[i] + " 0"
                  if (i < tokens.length - 1) {
                    fixed_task_specs += ","
                  }
                }
                const data = {
                  user_name: localStorage.getItem("userName"),
                  email: localStorage.getItem("currentUser"),
                  host_specs: values.workers,
                  task_specs: fixed_task_specs,
                  num_workers: 5,
                  min_worker_flops: 1,
                  max_worker_flops: 100,
                  min_worker_band: 1,
                  max_worker_band: 100,
                  num_tasks: 5,
                  min_task_input: 1,
                  max_task_input: 100,
                  min_task_flop: 1,
                  max_task_flop: 100,
                  min_task_output: 0,
                  max_task_output: 0,
                  task_scheduling_select: values.taskScheduling,
                  compute_scheduling_select: values.computeScheduling,
                  num_invocation: 1,
                  seed: Math.floor(1000 * Math.random())
                }
                setSimulationResults(<></>)
                axios.post(window.location.protocol + "//" + window.location.hostname + "/backend" + "/run/coordinator_worker", data).then(
                  response => {
                    setSimulationResults(
                      <>
                        <SimulationOutput output={response.data.simulation_output}/>
                        <GanttChart data={response.data.task_data}/>
                        <HostUtilizationChart data={response.data.task_data}/>
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
                  <Form.Input fluid name="workers"
                              label="List of workers ([MB/sec][Gflop/sec])"
                              placeholder="10 100, 100 100, 1000 100"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.workers}
                              error={errors.workers && touched.workers ? {
                                content: "Please provide a comma- or space-separated list of host specifications. " +
                                  "([Bandwidth to Coordinator] [Gflop/sec], ...)",
                                pointing: "above"
                              } : null}
                  />
                  <Form.Input fluid name="tasks"
                              label="List of tasks ([Input MB][Gflop])"
                              placeholder="100 10, 100 1000, 1000 1000, 1000 1000"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.tasks}
                              error={errors.tasks && touched.tasks ? {
                                content: "Please provide a comma- or spwace-separated list of task specifications. " +
                                  "([Input MB] [Gflop], ...)",
                                pointing: "above"
                              } : null}
                  />
                </Form.Group>
                <Form.Group inline>
                  <label>Task selection</label>
                  <Form.Input
                    name="taskScheduling"
                    label="Random"
                    type="radio"
                    labelPosition="left"
                    value="0"
                    checked={values.taskScheduling === "0"}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <Form.Input
                    name="taskScheduling"
                    label="Highest work"
                    type="radio"
                    value="1"
                    checked={values.taskScheduling === "1"}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <Form.Input
                    name="taskScheduling"
                    label="Lowest work"
                    type="radio"
                    value="2"
                    checked={values.taskScheduling === "2"}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <Form.Input
                    name="taskScheduling"
                    label="Highest data"
                    type="radio"
                    value="3"
                    checked={values.taskScheduling === "3"}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <Form.Input
                    name="taskScheduling"
                    label="Lowest data"
                    type="radio"
                    value="4"
                    checked={values.taskScheduling === "4"}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <Form.Input
                    name="taskScheduling"
                    label="Highest work/data ratio"
                    type="radio"
                    value="5"
                    checked={values.taskScheduling === "5"}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <Form.Input
                    name="taskScheduling"
                    label="Lowest work/data ratio"
                    type="radio"
                    value="6"
                    checked={values.taskScheduling === "6"}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Form.Group>
                <Form.Group inline>
                  <label>Worker selection</label>
                  <Form.Input
                    name="computeScheduling"
                    label="Random"
                    type="radio"
                    labelPosition="left"
                    value="0"
                    checked={values.computeScheduling === "0"}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <Form.Input
                    name="computeScheduling"
                    label="Fastest"
                    type="radio"
                    value="1"
                    checked={values.computeScheduling === "1"}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <Form.Input
                    name="computeScheduling"
                    label="Best-Connected"
                    type="radio"
                    value="2"
                    checked={values.computeScheduling === "2"}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <Form.Input
                    name="computeScheduling"
                    label="Earliest completion"
                    type="radio"
                    value="3"
                    checked={values.computeScheduling === "3"}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Form.Group>

                <Form.Button color="teal" type="submit" disabled={isSubmitting}>Run Simulation</Form.Button>
              </Form>
            )}
          </Formik>
          <SimulationFeedback simulationID={'coordinator_worker/coordinator_worker_basics_simulation'} trigger={runtimes === 3}/>
        </Segment>
      </Segment.Group>

      {simulationResults}

    </>
  )
}

export default CoordinatorWorkerBasicsSimulation
