import React from "react"
import { Form, Segment } from "semantic-ui-react"

const IOSimulation = () => {
  return (
    <>
      <Segment.Group>
        <Segment color="orange"><strong>Enter Simulation Parameters</strong></Segment>
        <Segment>
          <Form>
            <Form.Group widths="equal">
              <Form.Input fluid label="Number of Tasks" placeholder="1" type="number" min={1} max={100} required />
              <Form.Input fluid label="Task Gflop" placeholder="100" type="number" min={1} max={999999} required />
            </Form.Group>
            <Form.Group widths="equal">
              <Form.Input fluid label="Amount of Task Input Data" placeholder="1" type="number" min={0} max={999}
                          required />
              <Form.Input fluid label="Amount of Task Output Data" placeholder="1" type="number" min={0} max={999}
                          required />
            </Form.Group>
            <Form.Checkbox label="IO Overlap Allowed (Computation and IO can take place concurrently)" />
            <Form.Button color="teal">Run Simulation</Form.Button>
          </Form>
        </Segment>
      </Segment.Group>
    </>
  )
}

export default IOSimulation
