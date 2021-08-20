/**
 * Copyright (c) 2019-2021. The WRENCH Team.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 */

import React from "react"
import Layout from "../components/layout"
import Seo from "../components/seo"
import ModulesList from "../components/modules_list"
import "./index.css"
import { StaticImage } from "gatsby-plugin-image"

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
        </h3>
        <StaticImage
          src="../images/eduwrench-students.jpg"
          style={{
            maxWidth: "95%",
            marginBottom: "10px",
            borderRadius: "0.5em"
          }}
          alt="Students"
          backgroundColor="#fff"
        />

        <p style={{ paddingRight: "3em" }}>
          The goal of eduWRENCH is to achieve various <strong>learning objectives</strong> in the areas of parallel
          computing, distributed computing, and cyberinfrastructure computing. This is achieved via pedagogic modules
          that explore, at first elementary and later sophisticated, relevant concepts. Most modules include hands-on
          "activities" in which students explore and experiment with simulated application executions using
          the <strong><a target="_blank" className="link"
                         href="https://wrench-project.org/"> WRENCH </a></strong> simulation framework. These modules
          can be used to enhance/augment existing courses, such as university or on-line courses, or can simply be done
          in sequence by independent learners. High-level Learning Objectives include:
        </p>
        <ol>
          <li>
            Be able to explain and apply the fundamental concepts of sequential, parallel, and distributed computing;
          </li>
          <li>
            Be able to describe typical parallel/distributed computing (PDC) applications and the platforms on which
            they run;
          </li>
          <li>
            Be able to reason about and improve the performance of PDC applications;
          </li>
          <li>
            Be comfortable with and able to use standard
            tools provided as part of current CyberInfrastructure deployments.
          </li>
        </ol>

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

    <br />
    <br />

  </Layout>
)

export default IndexPage
