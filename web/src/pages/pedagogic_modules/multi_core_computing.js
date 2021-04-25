import React, { useState } from "react"
import { Link } from "gatsby"

import Layout from "../../components/layout"
import SEO from "../../components/seo"
import Card from "react-bootstrap/Card"
import Tab from "react-bootstrap/Tab"
import Tabs from "react-bootstrap/Tabs"
import "./pedagogic_modules.css"

import TaskParallelism from "./include_multi_core_computing/task_parallelism"
import TaskDependencies from "./include_multi_core_computing/task_dependencies"
import RamAndIO from "./include_multi_core_computing/ram_and_io"
import LoadImbalance from "./include_multi_core_computing/load_imbalance"
import DataParallelism from "./include_multi_core_computing/data_parallelism"
import MultiCoreCapstone from "./include_multi_core_computing/capstone"

const { TabPane } = Tabs

function callback(key) {
  console.log(key)
}

const MultiCoreComputing = () => {
  return (
    <Layout>
      <SEO title="A.2. Multi-core Computing" />
      <h3 className="header">A.2. Multi-core Computing</h3>
      <p>
        The goal of this module is to introduce you to multi-core computing
        (i.e., running a program on multiple cores within the same computer).
      </p>
      <p>Go through the tabs below in sequence…</p>

      <Tabs
        className="tabs"
        defaultActiveKey="taskparallelism"
        id="uncontrolled-tab-example"
      >
        <Tab eventKey="taskparallelism" title="Task Parallelism">
          <TaskParallelism />
        </Tab>
        <Tab eventKey="loadimbalance" title="Load Imbalance">
          <LoadImbalance />
        </Tab>
        <Tab eventKey="ramandio" title="Ram and I/O">
          <RamAndIO />
        </Tab>
        <Tab eventKey="taskdependencies" title="Task Dependencies">
          <TaskDependencies />
        </Tab>
        <Tab eventKey="dataparallelism" title="Data Parallelism">
          <DataParallelism />
        </Tab>
        <Tab eventKey="capstone" title="Capstone">
          <MultiCoreCapstone />
        </Tab>
      </Tabs>
    </Layout>
  )
}

export default MultiCoreComputing
