import React from "react"
import Layout from "../components/layout"
import Seo from "../components/seo"
import { CardColumns, Card, Button, ListGroup } from "react-bootstrap"
import "./index.css"

const IndexPage = () => (
  <Layout>
    <Seo title="Home" />

    <h5
      style={{
        // display: "flex",
        // flexDirection: "column",
        // justifyContent: "center",
        // textAlign: "center",
        marginBottom: `20px`,
        marginTop: `30px`,
        margin: "auto",
        color: "#525252"
      }}
    >
      <br />OUR MODULES
    </h5>
    <h5><br />A. Parallel and Distributed Computing Concepts</h5>

    <CardColumns style={{ flex: 1 }}>
      <Card>
        <Card.Body>
          <Card.Title>A.1. Single-core Computing</Card.Title>
          <Card.Text className="module-desc">
            The goal of this module is to provide you with basic knowledge about sequential computing (i.e., running a
            program on a single core).
          </Card.Text>
          <Button variant="warning" href="/pedagogic_modules/single_core_computing/">Launch</Button>
        </Card.Body>
      </Card>

      <Card>
        <Card.Body>
          <Card.Title>A.2. Multi-core Computing</Card.Title>
          <Card.Text className="module-desc">
            The goal of this module is to introduce you to multi-core computing (i.e., running a program on multiple
            cores within the same computer).
          </Card.Text>
          <Button variant="warning" href="/pedagogic_modules/multi_core_computing/">Launch</Button>
        </Card.Body>
      </Card>

      <Card style={{ flexShrink: 0 }}>
        <Card.Body>
          <Card.Title>A.3. Distributed Computing</Card.Title>
          <Card.Text>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <Button variant="warning" size="sm"
                        href="/pedagogic_modules/distributed_computing/networking_fundamentals/">Launch</Button>
                {" "}A.3.1 Networking Fundamentals<br />
                <span className="module-desc">The goal of this module is to provide you with knowledge of networking,
                  as it relates to the performance of distributed computing applications.</span>
              </ListGroup.Item>
              <ListGroup.Item>
                <Button variant="warning" size="sm"
                        href="/pedagogic_modules/distributed_computing/client_server/">Launch</Button>
                {" "}A.3.2 Client-Server<br />
                <span className="module-desc">The goal of this module is to introduce you to the fundamental
                  client/server model of computation.</span>
              </ListGroup.Item>
              <ListGroup.Item>
                <Button variant="warning" size="sm"
                        href="/pedagogic_modules/distributed_computing/coordinator_worker/">Launch</Button>
                {" "}A.3.3 Client-Server<br />
                <span className="module-desc">The goal of this module is to introduce you to the coordinator/worker
                  model of computation, which in some sense extends client-server.</span>
              </ListGroup.Item>
              <ListGroup.Item>
                <Button variant="warning" size="sm"
                        href="/pedagogic_modules/distributed_computing/workflow/">Launch</Button>
                {" "}A.3.4 Workflows<br />
                <span className="module-desc">The goal of this module is to introduce you to the workflow model of
                  computation that is used in many real-world scientific applications.</span>
              </ListGroup.Item>
            </ListGroup>
          </Card.Text>

        </Card.Body>
      </Card>
    </CardColumns>

    <div className="irow" style={{ marginTop: "2em", marginBottom: "2em" }}>
      <div className="icolumn">
        <h5
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            textAlign: "center",
            marginBottom: `0px`,
            marginTop: `30px`,
            color: "#525252"
          }}
        >
          GOAL
        </h5>
        <p style={{ padding: 25 }}>
          The goal is to achieve various learning objectives in the areas of
          parallel computing, distributed computing, and cyberinfrastructure
          computing. This is achieved via pedagogic modules that explore, at
          first elementary and later sophisticated, relevant concepts. Most
          modules include hands-on "activities" in which students explore and
          experiment with simulated application executions using the{" "}
          <a
            target="_blank"
            className="link"
            href="https://wrench-project.org/"
          >
            WRENCH
          </a>{" "}
          simulation framework. These modules can be used to enhance/augment
          existing courses, such as university or on-line courses, or can
          simply be done in sequence by independent learners. High-level
          Learning Objectives include: (i) Be able to explain and apply the
          fundamental concepts of sequential, parallel, and distributed
          computing; (ii) Be able to describe typical parallel/distributed
          computing (PDC) applications and the platforms on which they run;
          (iii) Be able to reason about and improve the performance of PDC
          applications; and (iv) Be comfortable with and able to use standard
          tools provided as part of current CyberInfrastructure deployments.
        </p>
      </div>

      <div className="icolumn">
        <h5
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            textAlign: "center",
            marginBottom: `0px`,
            marginTop: `30px`,
            color: "#525252"
          }}
        >
          WHAT THIS IS NOT ABOUT
        </h5>
        <p style={{ padding: 25 }}>
          Teaching computer programming skills is not an objective of these
          pedagogic modules, and no computer programming is required. This
          said, the content often makes reference to particular computing
          programming techniques, and sometimes even suggests programming
          activities or projects. This is because many of the learning
          objectives target concepts that are fundamental for developing
          (efficient) programs that execute or parallel and distributed
          platforms. As a result, these modules can be used effectively as
          part of a course that does include programming learning objectives.
        </p>

        <h5
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            textAlign: "center",
            marginBottom: `0px`,
            marginTop: `10px`,
            color: "#525252"
          }}
        >
          ABOUT WRENCH AND SIMGRID
        </h5>
        <p style={{ padding: 25 }}>
          {" "}
          <a
            target="_blank"
            className="link"
            href="https://wrench-project.org/"
          >
            WRENCH
          </a>{" "}
          is a framework for simulating the execution of parallel and
          distributed applications on cyberinfrastructures. It is based on the
          lower-level{" "}
          <a target="_blank" className="link" href="https://simgrid.org/">
            SimGrid
          </a>{" "}
          simulation framework, which provides the necessary accurate and
          scalable simulation abstractions.
        </p>
      </div>
    </div>

  </Layout>
)

export default IndexPage
