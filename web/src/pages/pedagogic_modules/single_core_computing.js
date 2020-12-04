import React from "react"
import { Link } from "gatsby"

import Layout from "../../components/layout"
import SEO from "../../components/seo"
import Card from "react-bootstrap/Card"
import Tab from "react-bootstrap/Tab"
import Tabs from "react-bootstrap/Tabs"
import "./pedagogic_modules.css"
import ReactMarkdown from "react-markdown"

const { TabPane } = Tabs

function callback(key) {
  console.log(key)
}

const SingleCoreComputing = () => (
  <Layout>
    <SEO title="A.1. Single-core Computing" />
    <h3
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        textAlign: "center",
        marginBottom: `30px`,
        marginTop: `50px`,
        color: "#525252",
      }}
    >
      A.1. Single-core Computing
    </h3>
    <p>
      The goal of this module is to provide you with basic knowledge about
      sequential computing (i.e., running a program on a single core).
    </p>
    <p>
      There is a lot of complexity under the cover, which belongs in Computer
      Architecture and Operating Systems{" "}
      <a className="link" href="/textbooks/">
        textbooks
      </a>
      . Instead, we take a high-level approach, with a focus on performance.
    </p>
    <p>Go through the tabs below in sequence…</p>

    <Tabs
      className="tabs"
      defaultActiveKey="workandspeed"
      id="uncontrolled-tab-example"
    >
      <Tab eventKey="workandspeed" title="Work and Speed">
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

            <p style={{ backgroundColor: "white", marginTop: 15 }}>
              The eduWRENCH modules target four top-level Student Learning
              Objectives (SLOs):
            </p>
            <ul style={{ backgroundColor: "white" }}>
              <li style={{ backgroundColor: "white" }}>
                <b style={{ backgroundColor: "white" }}>SLO1</b>: Be able to
                explain and apply the fundamental concepts of sequential,
                parallel, and distributed computing
              </li>
              <li style={{ backgroundColor: "white" }}>
                <b style={{ backgroundColor: "white" }}>SLO2</b>: Be able to
                describe typical parallel/distributed computing (PDC)
                applications and the platforms on which they run
              </li>
              <li style={{ backgroundColor: "white" }}>
                <b style={{ backgroundColor: "white" }}>SLO3</b>: Be able to
                reason about and improve the performance of PDC applications
              </li>
              <li style={{ backgroundColor: "white" }}>
                <b style={{ backgroundColor: "white" }}>SLO4</b>: Be comfortable
                with and able to use standard tools provided as part of current
                CyberInfrastructure deployments
              </li>
            </ul>
            <p style={{ backgroundColor: "white" }}>
              Each module, and in fact each tab within each module page, lists
              specific SLOs, each mapping to one or more of the top-level SLOs.
              See the comprehensive SLO Map if interest.
            </p>

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
                <a id="feedback">Providing Feedback</a>
              </h6>
            </div>

            <p style={{ backgroundColor: "white", marginTop: 15 }}>
              You can contact us at{" "}
              <a
                href="mailto:support@wrench-project.org"
                style={{ color: "#d3834a", backgroundColor: "white" }}
              >
                support@wrench-project.org
              </a>{" "}
              to provide feedback, even if only to let us know about
              errors/typos on the site.
            </p>
          </Card.Body>
        </Card>
      </Tab>
      <Tab eventKey="timesharing" title="Time Sharing">
        <Card className="main">
          <Card.Body className="card">
            <p className="card">
              This page is intended to provide students information regarding
              the eduWRENCH pedagogic modules, namely:
            </p>
            <ul className="card">
              <li className="card" style={{ color: "#c78651" }}>
                <a style={{ color: "#c78651" }} href="#prerequisites">
                  What are the prerequisites?
                </a>
              </li>
              <li className="card" style={{ color: "#c78651" }}>
                <a style={{ color: "#c78651" }} href="#objectives">
                  What are the learning objectives?
                </a>
              </li>
              <li className="card" style={{ color: "#c78651" }}>
                <a style={{ color: "#c78651" }} href="#feedback">
                  How to provide feedback?
                </a>
              </li>
            </ul>

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
                <a id="prerequisites">Prerequisites</a>
              </h6>
            </div>
            <p style={{ backgroundColor: "white", marginTop: 15 }}>
              The eduWRENCH modules aim to be as self-contained as possible. The
              only prerequisite to the first module is that you must be familiar
              with the concept of a program running on a computer for some lapse
              of time to compute something of interest. The modules are intended
              to be done in sequence. Depending on your level of knowledge, you
              may be able to skip (or merely skim) the earlier module(s).
            </p>
            <p style={{ backgroundColor: "white" }}>
              The content in these modules, especially for the earlier ones,
              references classic textbooks. This is to make connections to the
              standard Computer Science curriculum. Consulting these textbooks,
              however, is completely optional.
            </p>
            <p style={{ backgroundColor: "white" }}>
              Finally, these modules do not assume any computer programming
              knowledge or skills, and do not involve any programming
              activities. This said, the concepts you will learn have direct
              implications on the development of parallel and distributed
              applications.
            </p>
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
            <p style={{ backgroundColor: "white", marginTop: 15 }}>
              The eduWRENCH modules target four top-level Student Learning
              Objectives (SLOs):
            </p>
            <ul style={{ backgroundColor: "white" }}>
              <li style={{ backgroundColor: "white" }}>
                <b style={{ backgroundColor: "white" }}>SLO1</b>: Be able to
                explain and apply the fundamental concepts of sequential,
                parallel, and distributed computing
              </li>
              <li style={{ backgroundColor: "white" }}>
                <b style={{ backgroundColor: "white" }}>SLO2</b>: Be able to
                describe typical parallel/distributed computing (PDC)
                applications and the platforms on which they run
              </li>
              <li style={{ backgroundColor: "white" }}>
                <b style={{ backgroundColor: "white" }}>SLO3</b>: Be able to
                reason about and improve the performance of PDC applications
              </li>
              <li style={{ backgroundColor: "white" }}>
                <b style={{ backgroundColor: "white" }}>SLO4</b>: Be comfortable
                with and able to use standard tools provided as part of current
                CyberInfrastructure deployments
              </li>
            </ul>
            <p style={{ backgroundColor: "white" }}>
              Each module, and in fact each tab within each module page, lists
              specific SLOs, each mapping to one or more of the top-level SLOs.
              See the comprehensive SLO Map if interest.
            </p>

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
                <a id="feedback">Providing Feedback</a>
              </h6>
            </div>

            <p style={{ backgroundColor: "white", marginTop: 15 }}>
              You can contact us at{" "}
              <a
                href="mailto:support@wrench-project.org"
                style={{ color: "#d3834a", backgroundColor: "white" }}
              >
                support@wrench-project.org
              </a>{" "}
              to provide feedback, even if only to let us know about
              errors/typos on the site.
            </p>
          </Card.Body>
        </Card>
      </Tab>
      <Tab eventKey="memory" title="Memory">
        <Card className="main">
          <Card.Body className="card">
            <p className="card">
              This page is intended to provide students information regarding
              the eduWRENCH pedagogic modules, namely:
            </p>
            <ul className="card">
              <li className="card" style={{ color: "#c78651" }}>
                <a style={{ color: "#c78651" }} href="#prerequisites">
                  What are the prerequisites?
                </a>
              </li>
              <li className="card" style={{ color: "#c78651" }}>
                <a style={{ color: "#c78651" }} href="#objectives">
                  What are the learning objectives?
                </a>
              </li>
              <li className="card" style={{ color: "#c78651" }}>
                <a style={{ color: "#c78651" }} href="#feedback">
                  How to provide feedback?
                </a>
              </li>
            </ul>

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
                <a id="prerequisites">Prerequisites</a>
              </h6>
            </div>
            <p style={{ backgroundColor: "white", marginTop: 15 }}>
              The eduWRENCH modules aim to be as self-contained as possible. The
              only prerequisite to the first module is that you must be familiar
              with the concept of a program running on a computer for some lapse
              of time to compute something of interest. The modules are intended
              to be done in sequence. Depending on your level of knowledge, you
              may be able to skip (or merely skim) the earlier module(s).
            </p>
            <p style={{ backgroundColor: "white" }}>
              The content in these modules, especially for the earlier ones,
              references classic textbooks. This is to make connections to the
              standard Computer Science curriculum. Consulting these textbooks,
              however, is completely optional.
            </p>
            <p style={{ backgroundColor: "white" }}>
              Finally, these modules do not assume any computer programming
              knowledge or skills, and do not involve any programming
              activities. This said, the concepts you will learn have direct
              implications on the development of parallel and distributed
              applications.
            </p>
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
            <p style={{ backgroundColor: "white", marginTop: 15 }}>
              The eduWRENCH modules target four top-level Student Learning
              Objectives (SLOs):
            </p>
            <ul style={{ backgroundColor: "white" }}>
              <li style={{ backgroundColor: "white" }}>
                <b style={{ backgroundColor: "white" }}>SLO1</b>: Be able to
                explain and apply the fundamental concepts of sequential,
                parallel, and distributed computing
              </li>
              <li style={{ backgroundColor: "white" }}>
                <b style={{ backgroundColor: "white" }}>SLO2</b>: Be able to
                describe typical parallel/distributed computing (PDC)
                applications and the platforms on which they run
              </li>
              <li style={{ backgroundColor: "white" }}>
                <b style={{ backgroundColor: "white" }}>SLO3</b>: Be able to
                reason about and improve the performance of PDC applications
              </li>
              <li style={{ backgroundColor: "white" }}>
                <b style={{ backgroundColor: "white" }}>SLO4</b>: Be comfortable
                with and able to use standard tools provided as part of current
                CyberInfrastructure deployments
              </li>
            </ul>
            <p style={{ backgroundColor: "white" }}>
              Each module, and in fact each tab within each module page, lists
              specific SLOs, each mapping to one or more of the top-level SLOs.
              See the comprehensive SLO Map if interest.
            </p>

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
                <a id="feedback">Providing Feedback</a>
              </h6>
            </div>

            <p style={{ backgroundColor: "white", marginTop: 15 }}>
              You can contact us at{" "}
              <a
                href="mailto:support@wrench-project.org"
                style={{ color: "#d3834a", backgroundColor: "white" }}
              >
                support@wrench-project.org
              </a>{" "}
              to provide feedback, even if only to let us know about
              errors/typos on the site.
            </p>
          </Card.Body>
        </Card>
      </Tab>
      <Tab eventKey="io" title="IO">
        <Card className="main">
          <Card.Body className="card">
            <p className="card">
              This page is intended to provide students information regarding
              the eduWRENCH pedagogic modules, namely:
            </p>
            <ul className="card">
              <li className="card" style={{ color: "#c78651" }}>
                <a style={{ color: "#c78651" }} href="#prerequisites">
                  What are the prerequisites?
                </a>
              </li>
              <li className="card" style={{ color: "#c78651" }}>
                <a style={{ color: "#c78651" }} href="#objectives">
                  What are the learning objectives?
                </a>
              </li>
              <li className="card" style={{ color: "#c78651" }}>
                <a style={{ color: "#c78651" }} href="#feedback">
                  How to provide feedback?
                </a>
              </li>
            </ul>

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
                <a id="prerequisites">Prerequisites</a>
              </h6>
            </div>
            <p style={{ backgroundColor: "white", marginTop: 15 }}>
              The eduWRENCH modules aim to be as self-contained as possible. The
              only prerequisite to the first module is that you must be familiar
              with the concept of a program running on a computer for some lapse
              of time to compute something of interest. The modules are intended
              to be done in sequence. Depending on your level of knowledge, you
              may be able to skip (or merely skim) the earlier module(s).
            </p>
            <p style={{ backgroundColor: "white" }}>
              The content in these modules, especially for the earlier ones,
              references classic textbooks. This is to make connections to the
              standard Computer Science curriculum. Consulting these textbooks,
              however, is completely optional.
            </p>
            <p style={{ backgroundColor: "white" }}>
              Finally, these modules do not assume any computer programming
              knowledge or skills, and do not involve any programming
              activities. This said, the concepts you will learn have direct
              implications on the development of parallel and distributed
              applications.
            </p>
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
            <p style={{ backgroundColor: "white", marginTop: 15 }}>
              The eduWRENCH modules target four top-level Student Learning
              Objectives (SLOs):
            </p>
            <ul style={{ backgroundColor: "white" }}>
              <li style={{ backgroundColor: "white" }}>
                <b style={{ backgroundColor: "white" }}>SLO1</b>: Be able to
                explain and apply the fundamental concepts of sequential,
                parallel, and distributed computing
              </li>
              <li style={{ backgroundColor: "white" }}>
                <b style={{ backgroundColor: "white" }}>SLO2</b>: Be able to
                describe typical parallel/distributed computing (PDC)
                applications and the platforms on which they run
              </li>
              <li style={{ backgroundColor: "white" }}>
                <b style={{ backgroundColor: "white" }}>SLO3</b>: Be able to
                reason about and improve the performance of PDC applications
              </li>
              <li style={{ backgroundColor: "white" }}>
                <b style={{ backgroundColor: "white" }}>SLO4</b>: Be comfortable
                with and able to use standard tools provided as part of current
                CyberInfrastructure deployments
              </li>
            </ul>
            <p style={{ backgroundColor: "white" }}>
              Each module, and in fact each tab within each module page, lists
              specific SLOs, each mapping to one or more of the top-level SLOs.
              See the comprehensive SLO Map if interest.
            </p>

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
                <a id="feedback">Providing Feedback</a>
              </h6>
            </div>

            <p style={{ backgroundColor: "white", marginTop: 15 }}>
              You can contact us at{" "}
              <a
                href="mailto:support@wrench-project.org"
                style={{ color: "#d3834a", backgroundColor: "white" }}
              >
                support@wrench-project.org
              </a>{" "}
              to provide feedback, even if only to let us know about
              errors/typos on the site.
            </p>
          </Card.Body>
        </Card>
      </Tab>
      <Tab eventKey="capstone" title="Capstone">
        <Card className="main">
          <Card.Body className="card">
            <p className="card">
              This page is intended to provide students information regarding
              the eduWRENCH pedagogic modules, namely:
            </p>
            <ul className="card">
              <li className="card" style={{ color: "#c78651" }}>
                <a style={{ color: "#c78651" }} href="#prerequisites">
                  What are the prerequisites?
                </a>
              </li>
              <li className="card" style={{ color: "#c78651" }}>
                <a style={{ color: "#c78651" }} href="#objectives">
                  What are the learning objectives?
                </a>
              </li>
              <li className="card" style={{ color: "#c78651" }}>
                <a style={{ color: "#c78651" }} href="#feedback">
                  How to provide feedback?
                </a>
              </li>
            </ul>

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
                <a id="prerequisites">Prerequisites</a>
              </h6>
            </div>
            <p style={{ backgroundColor: "white", marginTop: 15 }}>
              The eduWRENCH modules aim to be as self-contained as possible. The
              only prerequisite to the first module is that you must be familiar
              with the concept of a program running on a computer for some lapse
              of time to compute something of interest. The modules are intended
              to be done in sequence. Depending on your level of knowledge, you
              may be able to skip (or merely skim) the earlier module(s).
            </p>
            <p style={{ backgroundColor: "white" }}>
              The content in these modules, especially for the earlier ones,
              references classic textbooks. This is to make connections to the
              standard Computer Science curriculum. Consulting these textbooks,
              however, is completely optional.
            </p>
            <p style={{ backgroundColor: "white" }}>
              Finally, these modules do not assume any computer programming
              knowledge or skills, and do not involve any programming
              activities. This said, the concepts you will learn have direct
              implications on the development of parallel and distributed
              applications.
            </p>
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
            <p style={{ backgroundColor: "white", marginTop: 15 }}>
              The eduWRENCH modules target four top-level Student Learning
              Objectives (SLOs):
            </p>
            <ul style={{ backgroundColor: "white" }}>
              <li style={{ backgroundColor: "white" }}>
                <b style={{ backgroundColor: "white" }}>SLO1</b>: Be able to
                explain and apply the fundamental concepts of sequential,
                parallel, and distributed computing
              </li>
              <li style={{ backgroundColor: "white" }}>
                <b style={{ backgroundColor: "white" }}>SLO2</b>: Be able to
                describe typical parallel/distributed computing (PDC)
                applications and the platforms on which they run
              </li>
              <li style={{ backgroundColor: "white" }}>
                <b style={{ backgroundColor: "white" }}>SLO3</b>: Be able to
                reason about and improve the performance of PDC applications
              </li>
              <li style={{ backgroundColor: "white" }}>
                <b style={{ backgroundColor: "white" }}>SLO4</b>: Be comfortable
                with and able to use standard tools provided as part of current
                CyberInfrastructure deployments
              </li>
            </ul>
            <p style={{ backgroundColor: "white" }}>
              Each module, and in fact each tab within each module page, lists
              specific SLOs, each mapping to one or more of the top-level SLOs.
              See the comprehensive SLO Map if interest.
            </p>

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
                <a id="feedback">Providing Feedback</a>
              </h6>
            </div>

            <p style={{ backgroundColor: "white", marginTop: 15 }}>
              You can contact us at{" "}
              <a
                href="mailto:support@wrench-project.org"
                style={{ color: "#d3834a", backgroundColor: "white" }}
              >
                support@wrench-project.org
              </a>{" "}
              to provide feedback, even if only to let us know about
              errors/typos on the site.
            </p>
          </Card.Body>
        </Card>
      </Tab>
    </Tabs>
  </Layout>
)

export default SingleCoreComputing
