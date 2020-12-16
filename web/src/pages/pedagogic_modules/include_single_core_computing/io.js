import React, { useState, useEffect } from "react"
import Card from "react-bootstrap/Card"
import Accordion from "react-bootstrap/Accordion"

const IO = () => {
  const [auth, setAuth] = useState("false")

  useEffect(() => {
    const authenticated = localStorage.getItem("login")
    setAuth(authenticated)
  })

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
                    <h5 className="card">Logged in</h5>
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
