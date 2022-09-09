import React, { useEffect, useState } from "react"
import axios from "axios"
import { Form, Header, Segment } from "semantic-ui-react"
import { Formik } from "formik"
import SimulationScenario from "../../../components/simulation/simulation_scenario"
import SimulationOutput from "../../../components/simulation/simulation_output"

import CoordinatorWorkerSchedulingScenario
  from "../../../images/vector_graphs/coordinator_worker/coordinator_worker.svg"
import SimulationFeedback from "../../../components/simulation/simulation_feedback";
import SigninCheck from '../../../components/signin_check';

const CoordinatorWorkerSchedulingSimulation = () => {

  const [simulationResults, setSimulationResults] = useState(<></>)
  const [auth, setAuth] = useState("false")
  const [runtimes, setRunTimes] = useState(0)


  useEffect(() => {
    setAuth(localStorage.getItem("login"))
  }, [])

  return (
    <SigninCheck data={[
      <>
        <SimulationScenario scenario={<CoordinatorWorkerSchedulingScenario/>}/>

        <Segment.Group>
          <Segment color="teal"><strong>Simulation Parameters</strong></Segment>
          <Segment>
            <Formik
              initialValues={{
                numWorkers: 5,
                minWorkerGflops: 1,
                maxWorkerGflops: 100,
                minWorkerBand: 1,
                maxWorkerBand: 100,
                numTasks: 5,
                minTaskInput: 1,
                maxTaskInput: 100,
                minTaskFlop: 1,
                maxTaskFlop: 100,
                taskScheduling: "0",
                computeScheduling: "0",
                numInvocation: 30,
                seed: 12345
              }}

              validate={values => {
                const errors = {}
                if (!values.numWorkers || !/^[0-9]+$/i.test(values.numWorkers) || values.numWorkers > 50 || values.numWorkers < 1) {
                  errors.numWorkers = "ERROR"
                } else if (!values.minWorkerGflops || !/^[0-9]+$/i.test(values.minWorkerGflops) || values.minWorkerGflops > 1000000 || values.minWorkerGflops < 1 || values.minWorkerGflops > values.maxWorkerGflops) {
                  errors.minWorkerGflops = "ERROR"
                } else if (!values.maxWorkerGflops || !/^[0-9]+$/i.test(values.maxWorkerGflops) || values.maxWorkerGflops > 1000000 || values.maxWorkerGflops < 1 || values.minWorkerGflops > values.maxWorkerGflops) {
                  errors.maxWorkerGflops = "ERROR"
                } else if (!values.minWorkerBand || !/^[0-9]+$/i.test(values.minWorkerBand) || values.minWorkerBand > 1000000 || values.minWorkerBand < 1 || values.minWorkerBand > values.maxWorkerBand) {
                  errors.minWorkerBand = "ERROR"
                } else if (!values.maxWorkerBand || !/^[0-9]+$/i.test(values.maxWorkerBand) || values.maxWorkerBand > 1000000 || values.maxWorkerBand < 1 || values.minWorkerBand > values.maxWorkerBand) {
                  errors.maxWorkerBand = "ERROR"
                } else if (!values.numTasks || !/^[0-9]+$/i.test(values.numTasks) || values.numTasks > 100 || values.numTasks < 1) {
                  errors.numTasks = "ERROR"
                } else if (!values.minTaskInput || !/^[0-9]+$/i.test(values.minTaskInput) || values.minTaskInput > 1000000 || values.minTaskInput < 1 || values.minTaskInput > values.maxTaskInput) {
                  errors.minTaskInput = "ERROR"
                } else if (!values.maxTaskInput || !/^[0-9]+$/i.test(values.maxTaskInput) || values.maxTaskInput > 1000000 || values.maxTaskInput < 1 || values.minTaskInput > values.maxTaskInput) {
                  errors.maxTaskInput = "ERROR"
                } else if (!values.minTaskFlop || !/^[0-9]+$/i.test(values.minTaskFlop) || values.minTaskFlop > 1000000 || values.minTaskFlop < 1 || values.minTaskFlop > values.maxTaskFlop) {
                  errors.minTaskFlop = "ERROR"
                } else if (!values.maxTaskFlop || !/^[0-9]+$/i.test(values.maxTaskFlop) || values.maxTaskFlop > 1000000 || values.maxTaskFlop < 1 || values.minTaskFlop > values.maxTaskFlop) {
                  errors.maxTaskFlop = "ERROR"
                } else if (!values.numInvocation || !/^[0-9]+$/i.test(values.numInvocation) || values.numInvocation > 100 || values.numInvocation < 2) {
                  errors.numInvocation = "ERROR"
                } else if (!values.seed || !/^[0-9]+$/i.test(values.seed) || values.seed < 1) {
                  errors.seed = "ERROR"
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
                  let tokens = "100 10 100, 100 1000 100, 1000 1000 1000, 1000 1000 1000".split(",")
                  for (let i = 0; i < tokens.length; i++) {
                    fixed_task_specs += tokens[i] + " 0"
                    if (i < tokens.length - 1) {
                      fixed_task_specs += ","
                    }
                  }
                  const data = {
                    user_name: localStorage.getItem("userName"),
                    email: localStorage.getItem("currentUser"),
                    host_specs: "10 100, 100 100, 1000 100",
                    task_specs: fixed_task_specs,
                    num_workers: values.numWorkers,
                    min_worker_flops: values.minWorkerGflops,
                    max_worker_flops: values.maxWorkerGflops,
                    min_worker_band: values.minWorkerBand,
                    max_worker_band: values.maxWorkerBand,
                    num_tasks: values.numTasks,
                    min_task_input: values.minTaskInput,
                    max_task_input: values.maxTaskInput,
                    min_task_flop: values.minTaskFlop,
                    max_task_flop: values.maxTaskFlop,
                    min_task_output: 0,
                    max_task_output: 0,
                    task_scheduling_select: values.taskScheduling,
                    compute_scheduling_select: values.computeScheduling,
                    num_invocation: values.numInvocation,
                    seed: values.seed
                  }
                  setSimulationResults(<></>)
                  axios.post(window.location.protocol + "//" + window.location.hostname + ":3000/run/coordinator_worker", data).then(
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
                  <Header as="h4" dividing>
                    Workers
                  </Header>
                  <Form.Group widths="equal">
                    <Form.Input fluid name="numWorkers"
                                label="Number of Workers"
                                placeholder="5"
                                type="number"
                                min={1}
                                max={50}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.numWorkers}
                                error={errors.numWorkers && touched.numWorkers ? {
                                  content: "Please provide a number in the range [1,50].",
                                  pointing: "above"
                                } : null}
                    />
                  </Form.Group>
                  <Form.Group widths="equal">
                    <Form.Input fluid name="minWorkerGflops"
                                label="Minimum Gflop/sec Per Worker"
                                placeholder="1"
                                type="number"
                                min={1}
                                max={1000000}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.minWorkerGflops}
                                error={errors.minWorkerGflops && touched.minWorkerGflops ? {
                                  content: "Please provide a number in the range [1,1000000] and less than or equal " +
                                    "to the maximum Gflop/sec specified.",
                                  pointing: "above"
                                } : null}
                    />
                    <Form.Input fluid name="maxWorkerGflops"
                                label="Maximum Gflop/sec Per Worker"
                                placeholder="1"
                                type="number"
                                min={1}
                                max={1000000}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.maxWorkerGflops}
                                error={errors.maxWorkerGflops && touched.maxWorkerGflops ? {
                                  content: "Please provide a number in the range [1,1000000] and more than or equal " +
                                    "to the minimum Gflop/sec specified.",
                                  pointing: "above"
                                } : null}
                    />
                  </Form.Group>
                  <Form.Group widths="equal">
                    <Form.Input fluid name="minWorkerBand"
                                label="Minimum Bandwidth (MBps) Per Worker"
                                placeholder="1"
                                type="number"
                                min={1}
                                max={1000000}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.minWorkerBand}
                                error={errors.minWorkerBand && touched.minWorkerBand ? {
                                  content: "Please provide a number in the range [1,1000000] and less than or equal " +
                                    "to the maximum bandwidth specified.",
                                  pointing: "above"
                                } : null}
                    />
                    <Form.Input fluid name="maxWorkerBand"
                                label="Maximum Bandwidth (MBps) Per Worker"
                                placeholder="100"
                                type="number"
                                min={1}
                                max={1000000}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.maxWorkerBand}
                                error={errors.maxWorkerBand && touched.maxWorkerBand ? {
                                  content: "Please provide a number in the range [1,1000000] and more than or equal " +
                                    "to the minimum bandwidth specified.",
                                  pointing: "above"
                                } : null}
                    />
                  </Form.Group>

                  <Header as="h4" dividing>
                    Tasks
                  </Header>
                  <Form.Group widths="equal">
                    <Form.Input fluid name="numTasks"
                                label="Number of Tasks"
                                placeholder="5"
                                type="number"
                                min={1}
                                max={100}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.numTasks}
                                error={errors.numTasks && touched.numTasks ? {
                                  content: "Please provide a number in the range [1,100].",
                                  pointing: "above"
                                } : null}
                    />
                  </Form.Group>
                  <Form.Group widths="equal">
                    <Form.Input fluid name="minTaskInput"
                                label="Minimum Input Per Task (MB)"
                                placeholder="1"
                                type="number"
                                min={1}
                                max={1000000}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.minTaskInput}
                                error={errors.minTaskInput && touched.minTaskInput ? {
                                  content: "Please provide a number in the range [1,1000000] and less than or equal " +
                                    "to the maximum input specified.",
                                  pointing: "above"
                                } : null}
                    />
                    <Form.Input fluid name="maxTaskInput"
                                label="Maximum Input Per Task (MB)"
                                placeholder="100"
                                type="number"
                                min={1}
                                max={1000000}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.maxTaskInput}
                                error={errors.maxTaskInput && touched.maxTaskInput ? {
                                  content: "Please provide a number in the range [1,1000000] and more than or equal " +
                                    "to the minimum input specified.",
                                  pointing: "above"
                                } : null}
                    />
                  </Form.Group>
                  <Form.Group widths="equal">
                    <Form.Input fluid name="minTaskFlop"
                                label="Minimum Work Per Task (Gflop)"
                                placeholder="1"
                                type="number"
                                min={1}
                                max={1000000}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.minTaskFlop}
                                error={errors.minTaskFlop && touched.minTaskFlop ? {
                                  content: "Please provide a number in the range [1,1000000] and less than or equal " +
                                    "to the maximum Gflop specified.",
                                  pointing: "above"
                                } : null}
                    />
                    <Form.Input fluid name="maxTaskFlop"
                                label="Maximum Work Per Task (Gflop)"
                                placeholder="100"
                                type="number"
                                min={1}
                                max={1000000}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.maxTaskFlop}
                                error={errors.maxTaskFlop && touched.maxTaskFlop ? {
                                  content: "Please provide a number in the range [1,1000000] and more than or equal " +
                                    "to the minimum Gflop specified.",
                                  pointing: "above"
                                } : null}
                    />
                  </Form.Group>

                  <Header as="h4" dividing>
                    Scheduling
                  </Header>
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
                  <Form.Group widths="equal">
                    <Form.Input fluid name="numInvocation"
                                label="Number of Experiments"
                                placeholder="30"
                                type="number"
                                min={2}
                                max={100}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.numInvocation}
                                error={errors.numInvocation && touched.numInvocation ? {
                                  content: "Please provide an integer value in the range [2,100].",
                                  pointing: "above"
                                } : null}
                    />
                    <Form.Input fluid name="seed"
                                label="Seed"
                                placeholder="12345"
                                type="number"
                                min={1}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.seed}
                                error={errors.seed && touched.seed ? {
                                  content: "Please provide a positive integer value.",
                                  pointing: "above"
                                } : null}
                    />
                  </Form.Group>

                  <Form.Button color="teal" type="submit" disabled={isSubmitting}>Run Simulation</Form.Button>
                </Form>
              )}
            </Formik>
            <SimulationFeedback simulationID={'coordinator_worker/coordinator_worker_scheduling_simulation'} trigger={runtimes === 3}/>
          </Segment>
        </Segment.Group>

        {simulationResults}

      </>
    ]} auth={auth} content="simulator"></SigninCheck>
  )
}

export default CoordinatorWorkerSchedulingSimulation
