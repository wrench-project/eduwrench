import React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import Card from "react-bootstrap/Card"
import CardDeck from "react-bootstrap/CardDeck"
import "./forteachers.css"

const ForTeachers = () => (
  <Layout>
    <SEO title="For Teachers" />
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
      For Teachers
    </h3>

    <Card className="main">
      <Card.Body className="card">
        <p className="card">
          This page is intended to provide teachers and instructors information
          regarding the eduWRENCH pedagogic modules, namely:
        </p>
        <ul className="card">
          <li className="card" style={{ color: "#c78651" }}>
            <a style={{ color: "#c78651" }} href="#targetaudience">
              What is the target audience?
            </a>
          </li>
          <li className="card" style={{ color: "#c78651" }}>
            <a style={{ color: "#c78651" }} href="#objectives">
              What are the learning objectives?
            </a>
          </li>
          <li className="card" style={{ color: "#c78651" }}>
            <a style={{ color: "#c78651" }} href="#curriculum">
              What is the relationship to the NSF/IEEE-TCPP Curriculum?
            </a>
          </li>
          <li className="card" style={{ color: "#c78651" }}>
            <a style={{ color: "#c78651" }} href="#integration">
              How can these modules be integrated into courses?
            </a>
          </li>
          <li className="card" style={{ color: "#c78651" }}>
            <a style={{ color: "#c78651" }} href="#server">
              How to run your own EduWRENCH server?
            </a>
          </li>
          <li className="card" style={{ color: "#c78651" }}>
            <a style={{ color: "#c78651" }} href="#help">
              How to get help or get involved?
            </a>
          </li>
        </ul>

        <div
          style={{ height: 50, backgroundColor: "#d3834a", borderRadius: 10 }}
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
            <a id="targetaudience">Target Audience</a>
          </h6>
        </div>
        <p style={{ backgroundColor: "white", marginTop: 15 }}>
          The eduWRENCH modules were designed with college students in mind,
          starting at the freshman level. A current design principle is that no
          programming is required. Therefore, it should be possible for younger
          students, e.g., high school or earlier, to benefit from these modules.
        </p>
        <p style={{ backgroundColor: "white" }}>
          The modules aim to be as self-contained as possible: The only
          prerequisite to the first module is that students be familiar with the
          concept of a program running on a computer for some lapse of time to
          compute something of interest. Depending on their levels, students can
          skim earlier modules or jump directly to later modules. Although
          references are made to textbooks, especially in the earlier modules,
          consulting these textbooks is not required. Textbooks references are
          included, in part, to connect the eduWRENCH content to the general
          Computer Science curriculum.
        </p>
        <div
          style={{ height: 50, backgroundColor: "#d3834a", borderRadius: 10 }}
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
            <b style={{ backgroundColor: "white" }}>SLO1</b>: Be able to explain
            and apply the fundamental concepts of sequential, parallel, and
            distributed computing
          </li>
          <li style={{ backgroundColor: "white" }}>
            <b style={{ backgroundColor: "white" }}>SLO2</b>: Be able to
            describe typical parallel/distributed computing (PDC) applications
            and the platforms on which they run
          </li>
          <li style={{ backgroundColor: "white" }}>
            <b style={{ backgroundColor: "white" }}>SLO3</b>: Be able to reason
            about and improve the performance of PDC applications
          </li>
          <li style={{ backgroundColor: "white" }}>
            <b style={{ backgroundColor: "white" }}>SLO4</b>: Be comfortable
            with and able to use standard tools provided as part of current
            CyberInfrastructure deployments
          </li>
        </ul>
        <p style={{ backgroundColor: "white" }}>
          Each module, and in fact each tab within each module page, lists
          specific SLOs, each mapping to one or more of the top-level SLOs. See
          the comprehensive SLO Map if interest.
        </p>

        <div
          style={{ height: 50, backgroundColor: "#d3834a", borderRadius: 10 }}
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
            <a id="curriculum">NSF/IEEE-TCPP Curriculum Initiative</a>
          </h6>
        </div>

        <p style={{ backgroundColor: "white", marginTop: 15 }}>
          The{" "}
          <a
            style={{ color: "#c78651" }}
            href="https://tcpp.cs.gsu.edu/curriculum/"
            target="_blank"
            rel="noreferrer"
          >
            NSF/IEEE-TCPP Curriculum Initiative on Parallel and Distributed
            Computing
          </a>{" "}
          has produced curriculum recommendations for Core Topics for
          Undergraduates.{" "}
          <a
            style={{ color: "#c78651" }}
            href="https://tcpp.cs.gsu.edu/curriculum/?q=system/files/TCPP%20PDC%20Curriculum%20V2.0beta-Nov12.2020.pdf"
            target="_blank"
            rel="noreferrer"
          >
            Version 2.0 beta
          </a>{" "}
          was released in November 2020. Below is a table that identifies which
          of the SLOs therein as part of these pedagogic modules.
        </p>

        <table className="table">
          <tr className="table">
            <th className="table">NSF/IEEE-TCPP Topic</th>
            <th className="table">NSF/IEEE-TCPP SLO</th>
            <th className="table">eduWRENCH Modules</th>
          </tr>

          <tr className="table">
            <td className="table">
              <i className="table">Architecture</i>
            </td>
            <td className="table">Topologie</td>
            <td className="table">A.3.1</td>
          </tr>

          <tr className="table">
            <td className="table">
              <i className="table">Architecture</i>
            </td>
            <td className="table">Latency</td>
            <td className="table">A.3.1</td>
          </tr>

          <tr className="table">
            <td className="table">
              <i className="table">Architecture</i>
            </td>
            <td className="table">Bandwidth</td>
            <td className="table">A.3.1</td>
          </tr>

          <tr className="table">
            <td className="table">
              <i className="table">Architecture</i>
            </td>
            <td className="table">MIPS/FLOPS</td>
            <td className="table">A.1</td>
          </tr>

          <tr className="table">
            <td className="table">
              <i className="table">Architecture</i>
            </td>
            <td className="table">Power, Energy</td>
            <td className="table">Coming soon</td>
          </tr>

          <tr className="table">
            <td className="table">
              <i className="table">Programming</i>
            </td>
            <td className="table">Load Balancing</td>
            <td className="table">A.2</td>
          </tr>

          <tr className="table">
            <td className="table">
              <i className="table">Programming</i>
            </td>
            <td className="table">Scheduling and Mapping (core, advanced)</td>
            <td className="table">A.2, A.3.3</td>
          </tr>

          <tr className="table">
            <td className="table">
              <i className="table">Programming</i>
            </td>
            <td className="table">Performance Metrics</td>
            <td className="table">A.2</td>
          </tr>

          <tr className="table">
            <td className="table">
              <i className="table">Programming</i>
            </td>
            <td className="table">Speedup</td>
            <td className="table">A.2</td>
          </tr>

          <tr className="table">
            <td className="table">
              <i className="table">Programming</i>
            </td>
            <td className="table">Efficiency</td>
            <td className="table">A.2</td>
          </tr>

          <tr className="table">
            <td className="table">
              <i className="table">Programming</i>
            </td>
            <td className="table">Parallel Scalability</td>
            <td className="table">Coming soon</td>
          </tr>

          <tr className="table">
            <td className="table">
              <i className="table">Programming</i>
            </td>
            <td className="table">Amdahl’s Law</td>
            <td className="table">A.2</td>
          </tr>

          <tr className="table">
            <td className="table">
              <i className="table">Programming</i>
            </td>
            <td className="table">Gustanfson’s Law</td>
            <td className="table">Coming soon</td>
          </tr>

          <tr className="table">
            <td className="table">
              <i className="table">Programming</i>
            </td>
            <td className="table">Energy Efficiency vs. Load Balancing</td>
            <td className="table">Coming soon</td>
          </tr>

          <tr className="table">
            <td className="table">
              <i className="table">Programming</i>
            </td>
            <td className="table">Power Consumption of Parallel Program</td>
            <td className="table">Coming soon</td>
          </tr>

          <tr className="table">
            <td className="table">
              <i className="table">Algorithms</i>
            </td>
            <td className="table">Time</td>
            <td className="table">A.1</td>
          </tr>

          <tr className="table">
            <td className="table">
              <i className="table">Algorithms</i>
            </td>
            <td className="table">Work</td>
            <td className="table">A.1</td>
          </tr>

          <tr className="table">
            <td className="table">
              <i className="table">Algorithms</i>
            </td>
            <td className="table">Memory and Communication Complexity</td>
            <td className="table">A.3</td>
          </tr>

          <tr className="table">
            <td className="table">
              <i className="table">Algorithms</i>
            </td>
            <td className="table">Speedup</td>
            <td className="table">A.2</td>
          </tr>

          <tr className="table">
            <td className="table">
              <i className="table">Algorithms</i>
            </td>
            <td className="table">Efficiency</td>
            <td className="table">A.2</td>
          </tr>

          <tr className="table">
            <td className="table">
              <i className="table">Algorithms</i>
            </td>
            <td className="table">Scalability</td>
            <td className="table">Coming soon</td>
          </tr>

          <tr className="table">
            <td className="table">
              <i className="table">Algorithms</i>
            </td>
            <td className="table">Throughput</td>
            <td className="table">Coming soon</td>
          </tr>

          <tr className="table">
            <td className="table">
              <i className="table">Algorithms</i>
            </td>
            <td className="table">Time vs. Space</td>
            <td className="table">Coming soon</td>
          </tr>

          <tr className="table">
            <td className="table">
              <i className="table">Algorithms</i>
            </td>
            <td className="table">Power vs. Time</td>
            <td className="table">Coming soon</td>
          </tr>

          <tr className="table">
            <td className="table">
              <i className="table">Algorithms</i>
            </td>
            <td className="table">Dependencies</td>
            <td className="table">A.2</td>
          </tr>

          <tr className="table">
            <td className="table">
              <i className="table">Algorithms</i>
            </td>
            <td className="table">Task Graphs</td>
            <td className="table">A.2, A.3.4</td>
          </tr>

          <tr className="table">
            <td className="table">
              <i className="table">Algorithms</i>
            </td>
            <td className="table">Makespan</td>
            <td className="table">A.2</td>
          </tr>

          <tr className="table">
            <td className="table">
              <i className="table">Algorithms</i>
            </td>
            <td className="table">Energy Aware Scheduling</td>
            <td className="table">Coming soon</td>
          </tr>

          <tr className="table">
            <td className="table">
              <i className="table">Algorithms</i>
            </td>
            <td className="table">Load Balancing</td>
            <td className="table">Coming soon</td>
          </tr>
        </table>

        <div
          style={{ height: 50, backgroundColor: "#d3834a", borderRadius: 10 }}
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
            <a id="integration">Integration into Courses</a>
          </h6>
        </div>

        <p style={{ backgroundColor: "white", marginTop: 15 }}>
          There are several ways to integrate the eduWRENCH modules in your
          courses. Each module includes pedagogic narratives that can be used as
          lecture notes. That is, instead of lecturing on a particular topic,
          students could be directed to the relevant eduWRENCH page on which
          they will find relevant pedagogic material (narrative, definition,
          examples, figures, simulation activities, practice questions). Another
          option is for the instructor, during a lecture, to use particular
          simulation activities to illustrate particular concepts interactively,
          and to go through practice questions in class (revealing answers only
          once students have had a chance to participate). Each module contains
          several questions with no answers provided (answers are available to
          instructors upon request). These can be used by instructors in various
          ways including for in-class activities, optionally with
          instructor-provided scaffolding, for homework assignments, or for exam
          questions. All these modalities have been already employed
          successfully in undergraduate university courses.
        </p>

        <div
          style={{ height: 50, backgroundColor: "#d3834a", borderRadius: 10 }}
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
            <a id="server">Running your Own Server</a>
          </h6>
        </div>

        <p style={{ backgroundColor: "white", marginTop: 15 }}>
          eduWRENCH is available on{" "}
          <a
            style={{ color: "#c78651" }}
            href="https://github.com/wrench-project/eduwrench"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
          . Straightforward instructions are provided in the repository’s README
          file for deploying the eduWRENCH Web app and server.
        </p>

        <div
          style={{ height: 50, backgroundColor: "#d3834a", borderRadius: 10 }}
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
            <a id="help">Getting Help and Getting Involved</a>
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
          with any questions, feedback, or suggestions. Do not hesitate even if
          only to report a typo. Pull requests are of course welcome.
        </p>

        <p style={{ backgroundColor: "white", marginTop: 15 }}>
          Also, we would very much like to hear from you if you have used these
          pedagogic modules in your courses, and for which kind of courses.
        </p>
      </Card.Body>
    </Card>
  </Layout>
)

export default ForTeachers
