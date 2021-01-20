import React, { useState, useEffect } from "react"
import Card from "react-bootstrap/Card"
import Accordion from "react-bootstrap/Accordion"
import Form from "react-bootstrap/Form"
import Col from "react-bootstrap/Col"
import Button from "react-bootstrap/Button"
import axios from "axios"
import "./../pedagogic_modules.css"

const IO = () => {
  const [auth, setAuth] = useState("false")
  const [test, setTest] = useState([])

  const [numTasks, setNumTasks] = useState(1)
  const [taskGflop, setTaskGflop] = useState(100)
  const [amountInput, setAmountInput] = useState(1)
  const [amountOutput, setAmountOutput] = useState(1)
  const [overlapAllowed, setOverlapAllowed] = useState(false)

  useEffect(() => {
    const authenticated = localStorage.getItem("login")
    setAuth(authenticated)
  })

  const handleClick = () => {
    const data = {
      email: localStorage.getItem("currentUser"),
      time: Math.floor(Date.now() / 1000),
      activity: "IO",
      num_tasks: numTasks,
      task_gflop: taskGflop,
      task_input: amountInput,
      task_output: amountOutput,
      io_overlap: overlapAllowed,
    }
    axios
      .post("http://localhost:3000/insert", data)
      .then(
        response => {
          console.log(response)
        },
        error => {
          console.log(error)
        }
      )
      .then(alert("Simulation executed"))
  }

  const handlePost = () => {
    // POST request using axios inside useEffect React hook
    const data = {
      email: localStorage.getItem("currentUser"),
      time: Math.floor(Date.now() / 1000),
      activity: "IO",
      num_tasks: numTasks,
      task_gflop: taskGflop,
      task_input: amountInput,
      task_output: amountOutput,
      io_overlap: overlapAllowed,
    }
    axios.post("http://localhost:3000/insert", data)
  }

  const handleNumTasks = e => {
    if (!isNaN(e.target.value) && e.target.value != 0) {
      setNumTasks(e.target.value)
    }
  }

  const handleTaskGflop = e => {
    if (!isNaN(e.target.value) && e.target.value != 0) {
      setTaskGflop(e.target.value)
    }
  }

  const handleAmountInput = e => {
    if (!isNaN(e.target.value) && e.target.value != 0) {
      setAmountInput(e.target.value)
    }
  }

  const handleAmountOutput = e => {
    if (!isNaN(e.target.value) && e.target.value != 0) {
      setAmountOutput(e.target.value)
    }
  }

  const handleOverlapAllowed = e => {
    setOverlapAllowed(e.target.checked)
  }

  return (
    <>
      <Card className="main">
        <Card.Body className="card">
          <div
            style={{
              height: 50,
              backgroundColor: "#d3834a",
              borderRadius: 10,
            }}
          >
            <h6
              style={{
                marginTop: 15,
                color: "white",
                backgroundColor: "#d3834a",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              <a id="objectives">Learning Objectives</a>
            </h6>
          </div>
          <br />
          <ul>
            <li>Understand the concept of IO</li>
            <li>Understand the impact of IO operations on computing</li>
            <li>
              Understand the basics of optimizing computation around IO
              operations
            </li>
          </ul>
          <hr></hr>
          <div
            style={{
              height: 50,
              backgroundColor: "#d3834a",
              borderRadius: 10,
            }}
          >
            <h6
              style={{
                marginTop: 15,
                color: "white",
                backgroundColor: "#d3834a",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              <a id="objectives">Simulating IO</a>
            </h6>
          </div>
          <br />
          <p className="card">
            So that you can gain hands-on experience with the above concepts,
            use the simulation app below.
          </p>
          <p className="card">
            Initially, you can create a series of identical tasks that have a
            certain input and output. Run the simulation to see the progression
            of tasks and host utilization without allowing IO to overlap with
            computation. Once you have observed this, try selecting the checkbox
            to allow overlap. With IO overlap there should be an improvement in
            execution time and host utilization. You can view this in the output
            graphs that are generated. You can also try varying the input/output
            and computation amounts to create IO-intensive or CPU-intensive
            tasks. Understanding which tasks will benefit from increased R/W or
            computation speeds will assist you in answering the questions to
            come.
          </p>
          <Accordion>
            <Card>
              <Accordion.Toggle as={Card.Header} eventKey="0">
                (Open Simulator Here)
              </Accordion.Toggle>
              <Accordion.Collapse eventKey="0">
                <Card.Body className="card">
                  {auth === "true" ? (
                    <div>
                      <Card className="card">
                        <Card.Body className="card">
                          <Card.Title className="card">
                            Simulation Scenario
                          </Card.Title>
                          <hr></hr>
                          <img
                            src={require("../../../sim_images/io_task.svg")}
                            height="300"
                            style={{
                              backgroundColor: "white",
                            }}
                            alt="eduWRENCH logo"
                          />
                        </Card.Body>
                      </Card>
                      <Card className="card">
                        <Card.Body className="card">
                          <Card.Title className="card">
                            Enter Simulation Parameters
                          </Card.Title>
                          <hr></hr>
                          <Form style={{ backgroundColor: "white" }}>
                            <Form.Row style={{ backgroundColor: "white" }}>
                              <Form.Group
                                as={Col}
                                controlId="numTasks"
                                style={{ backgroundColor: "white" }}
                              >
                                <Form.Label
                                  style={{ backgroundColor: "white" }}
                                >
                                  Number of Tasks
                                </Form.Label>
                                <Form.Control
                                  style={{ backgroundColor: "white" }}
                                  type="number"
                                  defaultValue={numTasks}
                                  onChange={handleNumTasks}
                                />
                              </Form.Group>
                              <Form.Group
                                as={Col}
                                controlId="taskGflop"
                                style={{ backgroundColor: "white" }}
                              >
                                <Form.Label
                                  style={{ backgroundColor: "white" }}
                                >
                                  Task Gflop
                                </Form.Label>
                                <Form.Control
                                  type="Number"
                                  defaultValue={taskGflop}
                                  style={{ backgroundColor: "white" }}
                                  onChange={handleTaskGflop}
                                />
                              </Form.Group>
                            </Form.Row>
                            <Form.Row style={{ backgroundColor: "white" }}>
                              <Form.Group
                                as={Col}
                                controlId="amountInput"
                                style={{ backgroundColor: "white" }}
                              >
                                <Form.Label
                                  style={{ backgroundColor: "white" }}
                                >
                                  Amount of Task Input Data
                                </Form.Label>
                                <Form.Control
                                  type="number"
                                  defaultValue={amountInput}
                                  style={{ backgroundColor: "white" }}
                                  onChange={handleAmountInput}
                                />
                              </Form.Group>
                              <Form.Group
                                as={Col}
                                controlId="amountOutput"
                                style={{ backgroundColor: "white" }}
                              >
                                <Form.Label
                                  style={{ backgroundColor: "white" }}
                                >
                                  Amount of Task Output Data
                                </Form.Label>
                                <Form.Control
                                  type="Number"
                                  defaultValue={amountOutput}
                                  style={{ backgroundColor: "white" }}
                                  onChange={handleAmountOutput}
                                />
                              </Form.Group>
                            </Form.Row>
                            <Form.Row style={{ backgroundColor: "white" }}>
                              <Form.Group style={{ backgroundColor: "white" }}>
                                <Form.Check
                                  custom
                                  className="check"
                                  style={{ backgroundColor: "white" }}
                                  type="checkbox"
                                  id="overlap"
                                  label="IO Overlap Allowed (Computation and IO can take place concurrently)"
                                  onChange={handleOverlapAllowed}
                                  checked={overlapAllowed}
                                />
                              </Form.Group>
                            </Form.Row>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                backgroundColor: "white",
                                color: "white",
                              }}
                            >
                              <Button custom onClick={handleClick}>
                                Run Simulation
                              </Button>
                            </div>
                          </Form>
                        </Card.Body>
                      </Card>
                      <Card className="card">
                        <Card.Body className="card">
                          <Card.Title className="card">
                            Simulation Output
                          </Card.Title>
                          <hr></hr>
                        </Card.Body>
                      </Card>
                      <Card className="card">
                        <Card.Body className="card">
                          <Card.Title className="card">
                            Task Executions
                          </Card.Title>
                          <hr></hr>
                        </Card.Body>
                      </Card>
                      <Card className="card">
                        <Card.Body className="card">
                          <Card.Title className="card">
                            Host Utilization
                          </Card.Title>
                          <hr></hr>
                        </Card.Body>
                      </Card>
                      <Card className="card">
                        <Card.Body className="card">
                          <Card.Title className="card">Task Data</Card.Title>
                          <hr></hr>
                        </Card.Body>
                      </Card>
                    </div>
                  ) : (
                    <div className="card">
                      <img
                        src={require("../../../images/wrench_logo.png")}
                        width="40"
                        height="40"
                        style={{
                          backgroundColor: "white",
                        }}
                        alt="eduWRENCH logo"
                      />
                      <h4 className="card" style={{ color: "grey" }}>
                        {" "}
                        eduWRENCH Pedagogic Module Simulator
                      </h4>
                      <p className="card">
                        <b className="card">
                          Sign in on the top of the page to access the
                          simulator.
                        </b>
                      </p>
                    </div>
                  )}
                </Card.Body>
              </Accordion.Collapse>
            </Card>
          </Accordion>
        </Card.Body>
      </Card>
    </>
  )
}

export default IO
