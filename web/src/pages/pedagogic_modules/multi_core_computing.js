import React from "react"
import Layout from "../../components/layout"
import PageHeader from "../../components/page_header"
import { Segment, Tab } from "semantic-ui-react"
import "./pedagogic_modules.css"

import TaskParallelism from "./include_multi_core_computing/task_parallelism"
import TaskDependencies from "./include_multi_core_computing/task_dependencies"
import RamAndIO from "./include_multi_core_computing/ram_and_io"
import LoadImbalance from "./include_multi_core_computing/load_imbalance"
import DataParallelism from "./include_multi_core_computing/data_parallelism"
import MultiCoreCapstone from "./include_multi_core_computing/capstone"

const MultiCoreComputing = () => {
  const module = "A.2"

  return (
    <Layout>
      <PageHeader title="A.2. Multi-core Computing"/>

      <Segment style={{ marginBottom: "2em" }}>
        The goal of this module is to introduce you to multi-core computing (i.e., running a program on multiple cores
        within the same computer).
        <br /><br />
        Go through the tabs below in sequence…
      </Segment>

      <Tab className="tab-panes" renderActiveOnly={true} panes={[
        {
          menuItem: {
            key: "task_parallelism",
            content: "Task Parallelism"
          },
          render: () => <Tab.Pane><TaskParallelism module={module} tab={"task_parallelism"}/></Tab.Pane>
        },
        {
          menuItem: {
            key: "load_imbalance",
            content: "Load Imbalance"
          },
          render: () => <Tab.Pane><LoadImbalance module={module} tab={"load_imbalance"}/></Tab.Pane>
        },
        {
          menuItem: {
            key: "ram_and_io",
            content: "Ram and I/O"
          },
          render: () => <Tab.Pane><RamAndIO module={module} tab={"ram_and_io"}/></Tab.Pane>
        },
        {
          menuItem: {
            key: "task_dependencies",
            content: "Task Dependencies"
          },
          render: () => <Tab.Pane><TaskDependencies module={module} tab={"task_dependencies"}/></Tab.Pane>
        },
        {
          menuItem: {
            key: "data_parallelism",
            content: "Data Parallelism"
          },
          render: () => <Tab.Pane><DataParallelism module={module} tab={"data_parallelism"}/></Tab.Pane>
        },
        {
          menuItem: {
            key: "multicore_capstone",
            content: "Capstone"
          },
          render: () => <Tab.Pane><MultiCoreCapstone module={module} tab={"multicore_capstone"}/></Tab.Pane>
        }
      ]}
      />
    </Layout>
  )
}

export default MultiCoreComputing
