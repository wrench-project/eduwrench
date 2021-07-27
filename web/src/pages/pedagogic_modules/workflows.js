import React from "react"
import Layout from "../../components/layout"
import PageHeader from "../../components/page_header"
import { Segment, Tab } from "semantic-ui-react"
import "./pedagogic_modules.css"

import WorkflowsFundamentals from "./include_workflows/workflows_fundamentals"
import WorkflowsDistributedExecution from "./include_workflows/workflows_distributed_execution"
import WorkflowsDataLocality from "./include_workflows/workflows_data_locality"
import WorkflowsMixedParallelism from "./include_workflows/workflows_mixed_parallelism"
import WorkflowsCapstone from "./include_workflows/capstone"

const Workflows = () => {
  const module = "A.3.4"

  return (
    <Layout>
      <PageHeader title="A.3.4 Workflows" />

      <Segment style={{ marginBottom: "2em" }}>
        The goal of this module is to introduce you to the workflow model of computation that is used in many real-world
        scientific applications.
        <br /><br />
        Go through the tabs below in sequence…
      </Segment>

      <Tab className="tab-panes" renderActiveOnly={true} panes={[
        {
          menuItem: {
            key: "workflows_fundamentals",
            content: "Fundamentals"
          },
          render: () => <Tab.Pane><WorkflowsFundamentals module={module} tab={"workflows_fundamentals"}/></Tab.Pane>
        },
        {
          menuItem: {
            key: "workflows_distributed_execution",
            content: "Distributed Execution"
          },
          render: () => <Tab.Pane><WorkflowsDistributedExecution module={module} tab={"workflows_distributed_execution"}/></Tab.Pane>
        },
        {
          menuItem: {
            key: "workflows_data_locality",
            content: "Data Locality"
          },
          render: () => <Tab.Pane><WorkflowsDataLocality module={module} tab={"workflows_data_locality"}/></Tab.Pane>
        },
        {
          menuItem: {
            key: "workflows_mixed_parallelism",
            content: "Mixed Parallelism"
          },
          render: () => <Tab.Pane><WorkflowsMixedParallelism module={module} tab={"workflows_mixed_parallelism"}/></Tab.Pane>
        },
        {
          menuItem: {
            key: "workflows_capstone",
            content: "Capstone"
          },
          render: () => <Tab.Pane><WorkflowsCapstone module={module} tab={"workflows_capstone"}/></Tab.Pane>
        }
      ]}
      />
    </Layout>
  )
}

export default Workflows
