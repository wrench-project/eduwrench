import React, { useState } from "react"

import Card from "react-bootstrap/Card"

const LoadImbalance = () => {
  return (
    <>
      <Card className="main">
        <Card.Body className="card">
          <div className="banner-div">
            <h6 className="banner-header">
              <a id="learningobjectives">Learning Objectives</a>
            </h6>
          </div>
          <br />
          <div className="highlighted">
            <ul style={{ marginTop: 10 }} className="highlighted">
              <li className="highlighted">
                Understand the concept of load imbalance and how it causes idle
                time
              </li>
              <li className="highlighted">
                Understand and quantify the relationship between idle time,
                speedup, and efficiency
              </li>
            </ul>
          </div>
          <hr />
          <br />
          <h5 className="header-small">Load Imbalance and Idle Time</h5>
          <p style={{ display: "inline-block" }} className="card">
            One reason why a parallel program’s parallel efficiency can be less
            than 100% is{" "}
            <b style={{ display: "inline-block" }} className="card">
              idle time
            </b>
            : time during which one or more cores are not able to work while
            other cores are working. A common cause of idle time is{" "}
            <b style={{ display: "inline-block" }} className="card">
              load imbalance
            </b>
            .
          </p>
          <p style={{ display: "inline-block" }} className="card">
            Consider a parallel program that consists of{" "}
            <i className="var">n</i> tasks, each of them running in the same
            amount of time on a core. We run this program on a computer with{" "}
            <i className="var">p</i> cores. If <i className="var">n</i> is not
            divisible by <i className="var">p</i>, then at least one core will
            be idle during program execution. For example, if we have 8 tasks,
            that each run for 1 hour; and 5 cores, all cores will be busy
            running the first 5 tasks in parallel. But once this phase of
            execution is finished, we have 3 tasks left and 5 available cores.
            So 2 cores will have nothing to do for 1 hour. In this situation, we
            say that{" "}
            <b style={{ display: "inline-block" }} className="card">
              the load is not well-balanced across cores
            </b>
            . Some cores will run two tasks, while others will run only one
            task.
          </p>
          <p style={{ display: "inline-block" }} className="card">
            There is a{" "}
            <b style={{ display: "inline-block" }} className="card">
              direct relationship
            </b>{" "}
            between idle time and parallel efficiency, assuming idle time is the
            only cause of loss in parallel efficiency.{" "}
            <b style={{ display: "inline-block" }} className="card">
              The parallel efficiency is the sum of the core non-idle times
              divided by the product of the number of cores by the overall
              execution time.
            </b>{" "}
          </p>
          <p style={{ display: "inline-block" }} className="card">
            The above statement may sound complicated, but it is very intuitive
            on an example. Consider a 2-core computer that executes a multi-task
            program in 35 minutes. One core computes for the full 35 minutes,
            while the other core computes for 20 minutes and then sits idle for
            15 minutes. This execution is depicted in the figure below:
          </p>
          <br />
          <left
            style={{
              backgroundColor: "white",
            }}
          >
            <img
              src={require("../../../images/multi_core_computing/utilization.svg")}
              height="150"
              align="left"
              style={{
                backgroundColor: "white",
              }}
              alt="Utilization"
            />
            <small
              style={{ display: "inline-block", backgroundColor: "white" }}
            >
              <b
                style={{
                  display: "inline-block",
                  backgroundColor: "white",
                  color: "#c78651",
                }}
              >
                Figure 1:
              </b>{" "}
              Example 35-minute execution on a 2-core computer. The white area
              is the core idle time, the yellow area is the core compute time.
            </small>
          </left>
          <br />
          <p style={{ display: "inline-block" }} className="card">
            What the above statement says is that the parallel efficiency is the
            yellow area divided by the area of the whole rectangle. The white
            area is the number of{" "}
            <i style={{ display: "inline-block" }} className="card">
              idle core minutes
            </i>{" "}
            in the execution. In this case it is equal to{" "}
            <span className="var">1 × 15</span> minutes.{" "}
            <i style={{ display: "inline-block" }} className="card">
              The more white in the
            </i>{" "}
            <i style={{ display: "inline-block" }} className="card">
              figure, the lower the parallel efficiency.
            </i>{" "}
            In this example, the parallel efficiency is{" "}
            <span className="var">(1 × 35 + 1 × 20)/(2 × 35)</span> = 78.5%. You
            can note that this is exactly the speedup (55/35) divided by the
            number of cores (2).
          </p>
        </Card.Body>
      </Card>
    </>
  )
}

export default LoadImbalance
