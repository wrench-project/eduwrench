import React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import Image from "../components/image"
import SEO from "../components/seo"
import Card from "react-bootstrap/Card"
import CardDeck from "react-bootstrap/CardDeck"
import "bootstrap/dist/css/bootstrap.min.css"
import "./index.css"

const IndexPage = () => (
  <Layout>
    <SEO title="Home" />
    <div
      style={{
        maxWidth: `1400px`,
        marginTop: `1.45rem`,
        backgroundColor: `#fefaec`,
      }}
    >
      <img src={require("../images/coverimg.png")} alt="cover"></img>
    </div>
    <div>
      <div class="irow">
        <div class="icolumn">
          <h5
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              textAlign: "center",
              marginBottom: `0px`,
              marginTop: `30px`,
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
              WRENCH{" "}
            </a>
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
          <h5
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              textAlign: "center",
              marginBottom: `0px`,
              marginTop: `10px`,
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
              WRENCH{" "}
            </a>
            is a framework for simulating the execution of parallel and
            distributed applications on cyberinfrastructures. It is based on the
            lower-level{" "}
            <a target="_blank" className="link" href="https://simgrid.org/">
              SimGrid{" "}
            </a>{" "}
            simulation framework, which provides the necessary accurate and
            scalable simulation abstractions.
          </p>
        </div>
        <div class="icolumn">
          <h5
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              textAlign: "center",
              marginBottom: `0px`,
              marginTop: `30px`,
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
        </div>
      </div>
    </div>
    <h5
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        textAlign: "center",
        marginBottom: `30px`,
        marginTop: `30px`,
      }}
    >
      MODULES
    </h5>
    <CardDeck style={{ display: "flex", flexDirection: "row" }}>
      <Card
        className="m"
        style={{
          flex: 1,
          width: "20rem",
          backgroundColor: "white",
          borderColor: "lightgrey !important",
        }}
      >
        <Card.Body style={{ backgroundColor: "white" }}>
          <Card.Title style={{ backgroundColor: "white" }}>
            A. Parallel and Distributed Computing Concepts
          </Card.Title>
          <Card.Link style={{ color: "#c78651" }} href="#">
            A.1. Single-core Computing
          </Card.Link>
          <br />
          <Card.Link style={{ color: "#c78651" }} href="#">
            A.2. Multi-core Computing
          </Card.Link>
          <br />
          <Card.Link style={{ color: "#c78651" }} href="#">
            A.3. Distributed Computing
          </Card.Link>
          <br />
          <Card.Link style={{ color: "#c78651" }} href="#">
            &emsp;A.3.1 Networking Fundamentals
          </Card.Link>
          <br />
          <Card.Link style={{ color: "#c78651" }} href="#">
            &emsp;A.3.2 Client-Server
          </Card.Link>
          <br />
          <Card.Link style={{ color: "#c78651" }} href="#">
            &emsp;A.3.3 Coordinator-Worker
          </Card.Link>
          <br />
          <Card.Link style={{ color: "#c78651" }} href="#">
            &emsp;A.3.4 Workflows
          </Card.Link>
        </Card.Body>
      </Card>

      <Card
        className="m"
        style={{ flex: 1, width: "20rem", backgroundColor: "white" }}
      >
        <Card.Body style={{ backgroundColor: "white" }}>
          <Card.Title style={{ backgroundColor: "white" }}>
            B. Cyberinfrastructure Concepts
          </Card.Title>
        </Card.Body>
      </Card>

      <Card
        className="m"
        style={{ flex: 1, width: "20rem", backgroundColor: "white" }}
      >
        <Card.Body style={{ backgroundColor: "white" }}>
          <Card.Title style={{ backgroundColor: "white" }}>
            C. Cyberinfrastructure Services
          </Card.Title>
        </Card.Body>
      </Card>
    </CardDeck>
    <br />
  </Layout>
)

export default IndexPage
