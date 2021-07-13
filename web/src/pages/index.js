import React from "react"
import Layout from "../components/layout"
import Seo from "../components/seo"
import ModulesList from "../components/modules_list"
import "./index.css"

const IndexPage = () => (
  <Layout>
    <Seo title="Home" />

    <div className="irow" style={{ marginTop: "2em", marginBottom: "2em" }}>
      <div className="icolumn">
        <h3 style={{
          marginBottom: `20px`,
          marginTop: `30px`,
          color: "#525252"
        }}>
          <br />GOAL
        </h3>

        <p style={{ paddingRight: "3em" }}>
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

        <h3 style={{
          marginBottom: `20px`,
          marginTop: `30px`,
          color: "#525252"
        }}>
          WHAT THIS IS NOT ABOUT
        </h3>
        <p style={{ paddingRight: "3em" }}>
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

        <h3 style={{
          marginBottom: `20px`,
          marginTop: `30px`,
          color: "#525252"
        }}>
          ABOUT WRENCH AND SIMGRID
        </h3>
        <p style={{ paddingRight: "3em" }}>
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

      <div className="icolumn">
        <ModulesList />
      </div>
    </div>

    <br /><br />

  </Layout>
)

export default IndexPage
