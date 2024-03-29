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
import PageHeader from "../components/page_header"
import { Header, Segment } from "semantic-ui-react"

const ForStudents = () => (
  <Layout className="page">
    <PageHeader title="For Students"/>

    <Segment>
      <p>
        This page is intended to provide students information regarding the
        eduWRENCH pedagogic modules, namely:
      </p>
      <ul>
        <li><a style={{ color: "#c78651" }} href="#prerequisites"> What are the prerequisites?</a></li>
        <li><a style={{ color: "#c78651" }} href="#objectives"> What are the learning objectives?</a></li>
        <li><a style={{ color: "#c78651" }} href="#feedback"> How to provide feedback?</a>
        </li>
      </ul>
    </Segment>

    <Segment>
      <Header as="h3" block>
        <a id="prerequisites">Prerequisites</a>
      </Header>
      <p>
        The eduWRENCH modules aim to be as self-contained as possible. The only prerequisite to the first module is that
        you must be familiar with the concept of a program running on a computer for some lapse of time to compute
        something of interest. The modules are intended to be done in sequence. Depending on your level of knowledge,
        you may be able to skip (or merely skim) the earlier module(s).
      </p>
      <p>
        The content in these modules, especially for the earlier ones, references classic textbooks. This is to make
        connections to the standard Computer Science curriculum. Consulting these textbooks, however, is completely
        optional.
      </p>
      <p>
        Finally, these modules do not assume any computer programming knowledge or skills, and do not involve any
        programming activities. This said, the concepts you will learn have direct implications on the development of
        parallel and distributed applications.
      </p>
    </Segment>

    <Segment>
      <Header as="h3" block>
        <a id="objectives">Learning Objectives</a>
      </Header>

      <p>The eduWRENCH modules target four top-level Student Learning Objectives (SLOs):</p>
      <ul>
        <li>
          <strong>SLO1</strong>: Be able to explain and apply the fundamental concepts of sequential, parallel, and
          distributed computing
        </li>
        <li>
          <strong>SLO2</strong>: Be able to describe typical parallel/distributed computing (PDC) applications and the
          platforms on which they run
        </li>
        <li>
          <strong>SLO3</strong>: Be able to reason about and improve the performance of PDC applications
        </li>
        <li>
          <strong>SLO4</strong>: Be comfortable with and able to use standard tools provided as part of current
          CyberInfrastructure deployments
        </li>
      </ul>
      <p>
        Each module, and in fact each tab within each module page, lists specific SLOs, each mapping to one or more of
        the top-level SLOs. See the comprehensive SLO Map if interest.
      </p>
    </Segment>

    <Segment>
      <Header as="h3" block>
        <a id="feedback">Providing Feedback</a>
      </Header>

      <p>You can contact us at <a href="mailto:support@wrench-project.org">support@wrench-project.org</a> to provide
        feedback, even if only to let us know about errors/typos on the site. </p>
    </Segment>
    <br/><br/>

  </Layout>
)

export default ForStudents
