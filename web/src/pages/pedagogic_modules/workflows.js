import React from "react"
import Layout from "../../components/layout"
import Seo from "../../components/seo"
import { Segment, Tab } from "semantic-ui-react"
import "./pedagogic_modules.css"

import WorkflowsFundamentals from "./include_workflows/workflows_fundamentals"

const Workflows = () => {
  return (
    <Layout>
      <Seo title="A.3.4 Workflows" />
      <h2 style={{
        marginBottom: `30px`,
        marginTop: `50px`,
        color: "#525252"
      }}><br />A.3.4 Workflows</h2>

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
          render: () => <Tab.Pane><WorkflowsFundamentals /></Tab.Pane>
        },
        {
          menuItem: {
            key: "workflows_distributed_execution",
            content: "Distributed Execution"
          },
          render: () => <Tab.Pane></Tab.Pane>
        },
        {
          menuItem: {
            key: "workflows_data_locality",
            content: "Data Locality"
          },
          render: () => <Tab.Pane></Tab.Pane>
        },
        {
          menuItem: {
            key: "workflows_mixed_parallelsim",
            content: "Mixed Parallelism"
          },
          render: () => <Tab.Pane></Tab.Pane>
        },
        {
          menuItem: {
            key: "workflows_capstone",
            content: "Capstone"
          },
          render: () => <Tab.Pane></Tab.Pane>
        }
      ]}
      />
    </Layout>
  )
}

export default Workflows
