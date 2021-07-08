import React from "react"
import { Form, Label, Segment } from "semantic-ui-react"
import { Formik } from "formik"

const IOSimulation = () => {
  return (
    <>
      <Segment.Group>
        <Segment color="orange"><strong>Enter Simulation Parameters</strong></Segment>
        <Segment>
          <Formik
            initialValues={{ numTasks: 1, taskGflop: 100, amountInput: 1, amountOutput: 1 }}
            validate={values => {
              const errors = {}
              if (!values.numTasks || !/^[0-9]+$/i.test(values.numTasks) || values.numTasks > 100 || values.numTasks < 1) {
                errors.numTasks = "ERROR"
              } else if (!values.taskGflop || !/^[0-9]+$/i.test(values.taskGflop) || values.taskGflop < 1 || values.taskGflop > 999999) {
                errors.taskGflop = "ERROR"
              } else if (!values.amountInput || !/^[0-9]+$/i.test(values.amountInput) || values.amountInput < 0 || values.amountInput > 999) {
                errors.amountInput = "ERROR"
              } else if (!values.amountOutput || !/^[0-9]+$/i.test(values.amountOutput) || values.amountOutput < 0 || values.amountOutput > 999) {
                errors.amountOutput = "ERROR"
              }
              return errors
            }}
            onSubmit={(values, { setSubmitting }) => {
              setTimeout(() => {
                alert(JSON.stringify(values, null, 2))
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
                  <Form.Input fluid name="numTasks"
                              label="Number of Tasks"
                              placeholder="1"
                              type="number"
                              min={1}
                              max={100}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.numTasks}
                              error={errors.numTasks && touched.numTasks ? {
                                content: "Please provide the number of tasks in the range of [1, 100].",
                                pointing: "above"
                              } : null}
                  />
                  <Form.Input fluid
                              name="taskGflop"
                              label="Task Gflop"
                              placeholder="100"
                              type="number"
                              min={1}
                              max={999999}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.taskGflop}
                              error={errors.taskGflop && touched.taskGflop ? {
                                content: "Please provide the amount of Gflop per task in the range of [1, 999999].",
                                pointing: "above"
                              } : null}
                  >
                    <input />
                    <Label basic className="info-label">
                      Host capable of 100 Gflops
                    </Label>
                  </Form.Input>
                </Form.Group>
                <Form.Group widths="equal">
                  <Form.Input fluid
                              name="amountInput"
                              label="Amount of Task Input Data"
                              placeholder="1"
                              type="number"
                              min={0}
                              max={999}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.amountInput}
                              error={errors.amountInput && touched.amountInput ? {
                                content: "Please provide the amount of input data per task in the range of [0, 999] MB.",
                                pointing: "above"
                              } : null}
                  >
                    <input />
                    <Label basic className="info-label">
                      Disk reads at 100 MBps
                    </Label>
                  </Form.Input>
                  <Form.Input fluid
                              name="amountOutput"
                              label="Amount of Task Output Data"
                              placeholder="1"
                              type="number"
                              min={0}
                              max={999}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.amountOutput}
                              error={errors.amountOutput && touched.amountOutput ? {
                                content: "Please provide the amount of output data per task in the range of [0, 999] MB.",
                                pointing: "above"
                              } : null}
                  >
                    <input />
                    <Label basic className="info-label">
                      Disk writes at 100 MBps
                    </Label>
                  </Form.Input>
                </Form.Group>
                <Form.Checkbox label="IO Overlap Allowed (Computation and IO can take place concurrently)" />
                <Form.Button color="teal" type="submit" disabled={isSubmitting}>Run Simulation</Form.Button>
              </Form>
            )}
          </Formik>
        </Segment>
      </Segment.Group>
    </>
  )
}

export default IOSimulation
