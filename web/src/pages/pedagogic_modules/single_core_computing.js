import React, { useState } from "react"
import { Link } from "gatsby"

import Layout from "../../components/layout"
import Seo from "../../components/seo"
import Card from "react-bootstrap/Card"
import Tab from "react-bootstrap/Tab"
import Tabs from "react-bootstrap/Tabs"
import "./pedagogic_modules.css"

import WorkAndSpeed from "./include_single_core_computing/work_and_speed"
import TimeSharing from "./include_single_core_computing/time_sharing"
import Memory from "./include_single_core_computing/memory"
import IO from "./include_single_core_computing/io"
import Capstone from "./include_single_core_computing/capstone"

const { TabPane } = Tabs

function callback(key) {
  console.log(key)
}

const SingleCoreComputing = () => {
  return (
    <Layout>
      <Seo title="A.1. Single-core Computing" />
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
          <WorkAndSpeed />
        </Tab>
        <Tab eventKey="timesharing" title="Time Sharing">
          <TimeSharing />
        </Tab>
        <Tab eventKey="memory" title="Memory">
          <Memory />
        </Tab>
        <Tab eventKey="io" title="IO">
          <IO />
        </Tab>
        <Tab eventKey="capstone" title="Capstone">
          <Capstone />
        </Tab>
      </Tabs>
    </Layout>
  )
}

export default SingleCoreComputing
