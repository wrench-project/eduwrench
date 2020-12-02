import React from "react"
import { Link } from "gatsby"
import Card from "react-bootstrap/Card"
import CardDeck from "react-bootstrap/CardDeck"

import Layout from "../components/layout"
import SEO from "../components/seo"
import "./modules.css"

const Modules = () => (
  <Layout>
    <SEO title="Modules" />
    <h3
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        textAlign: "center",
        marginBottom: `30px`,
        marginTop: `50px`,
      }}
    >
      Our Modules
    </h3>
    <CardDeck style={{ display: "flex", flexDirection: "row" }}>
      <Card
        className="maincard"
        style={{
          flex: 1,
          width: "20rem",
          backgroundColor: "white",
        }}
      >
        <Card.Body style={{ backgroundColor: "white" }}>
          <Card.Title style={{ backgroundColor: "white" }}>
            A. Parallel and Distributed Computing Concepts
          </Card.Title>
          <Card.Link style={{ color: "#c78651" }} href="#">
            <b style={{ backgroundColor: "white" }}>
              &emsp;A.1. Single-core Computing
            </b>
          </Card.Link>
          <br />
          <p
            style={{
              backgroundColor: "white",
              marginLeft: 30,
              color: "#919191",
            }}
          >
            <i style={{ backgroundColor: "white" }}>
              The goal of this module is to provide you with basic knowledge
              about sequential computing (i.e., running a program on a single
              core).
            </i>
          </p>
          <br />
          <Card.Link style={{ color: "#c78651" }} href="#">
            <b style={{ backgroundColor: "white" }}>
              &emsp;A.2. Multi-core Computing
            </b>
          </Card.Link>
          <p
            style={{
              backgroundColor: "white",
              marginLeft: 30,
              color: "#919191",
            }}
          >
            <i style={{ backgroundColor: "white" }}>
              The goal of this module is to introduce you to multi-core
              computing (i.e., running a program on multiple cores within the
              same computer).
            </i>
          </p>
          <br />
          <div style={{ marginBottom: 10, backgroundColor: "white" }}>
            <Card.Link style={{ color: "#c78651" }} href="#">
              <b style={{ backgroundColor: "white" }}>
                &emsp;A.3. Distributed Computing
              </b>
            </Card.Link>
          </div>

          <br />
          <Card.Link style={{ color: "#c78651" }} href="#">
            &emsp;&emsp;A.3.1 Networking Fundamentals
          </Card.Link>
          <p
            style={{
              backgroundColor: "white",
              marginLeft: 50,
              color: "#919191",
            }}
          >
            <i style={{ backgroundColor: "white" }}>
              The goal of this module is to provide you with knowledge of
              networking, as it relates to the performance of distributed
              computing applications.
            </i>
          </p>
          <br />
          <Card.Link style={{ color: "#c78651" }} href="#">
            &emsp;&emsp;A.3.2 Client-Server
          </Card.Link>
          <p
            style={{
              backgroundColor: "white",
              marginLeft: 50,
              color: "#919191",
            }}
          >
            <i style={{ backgroundColor: "white" }}>
              The goal of this module is to introduce you to the fundamental
              client/server model of computation.
            </i>
          </p>
          <br />
          <Card.Link style={{ color: "#c78651" }} href="#">
            &emsp; &emsp;A.3.3 Coordinator-Worker
          </Card.Link>
          <p
            style={{
              backgroundColor: "white",
              marginLeft: 50,
              color: "#919191",
            }}
          >
            <i style={{ backgroundColor: "white" }}>
              The goal of this module is to introduce you to the
              coordinator/worker model of computation, which in some sense
              extends client-server.
            </i>
          </p>
          <br />
          <Card.Link style={{ color: "#c78651" }} href="#">
            &emsp; &emsp;A.3.4 Workflows
          </Card.Link>
          <p
            style={{
              backgroundColor: "white",
              marginLeft: 50,
              color: "#919191",
            }}
          >
            <i style={{ backgroundColor: "white" }}>
              The goal of this module is to introduce you to the workflow model
              of computation that is used in many real-world scientific
              applications.
            </i>
          </p>
        </Card.Body>
      </Card>

      <Card
        className="maincard"
        style={{ flex: 1, width: "20rem", backgroundColor: "white" }}
      >
        <Card.Body style={{ backgroundColor: "white" }}>
          <Card.Title style={{ backgroundColor: "white" }}>
            B. Cyberinfrastructure Concepts
          </Card.Title>
        </Card.Body>
      </Card>
    </CardDeck>

    <div style={{ marginTop: 20, marginBottom: 70 }}>
      <Card
        className="maincard"
        style={{ flex: 1, width: "30rem", backgroundColor: "white" }}
      >
        <Card.Body style={{ backgroundColor: "white" }}>
          <Card.Title style={{ backgroundColor: "white" }}>
            C. Cyberinfrastructure Services
          </Card.Title>
        </Card.Body>
      </Card>
    </div>
  </Layout>
)

export default Modules
