import React from "react"
import Layout from "../../components/layout"
import PageHeader from "../../components/page_header"
import { Segment, Tab } from "semantic-ui-react"
import "katex/dist/katex.min.css"
import "./pedagogic_modules.css"

import WorkAndSpeed from "./include_single_core_computing/work_and_speed"
import TimeSharing from "./include_single_core_computing/time_sharing"
import Memory from "./include_single_core_computing/memory"
import IO from "./include_single_core_computing/io"
import Capstone from "./include_single_core_computing/capstone"

const SingleCoreComputing = () => {
  return (
    <Layout>
      <PageHeader title="A.1. Single-core Computing" />

      <Segment style={{ marginBottom: "2em" }}>
        The goal of this module is to provide you with basic knowledge about sequential computing (i.e., running a
        program on a single core).
        <br /><br />
        There is a lot of complexity under the cover, which belongs in Computer Architecture and Operating Systems{" "}
        <a className="link" href="/textbooks"> textbooks </a> . Instead, we take a high-level approach, with a focus on
        performance.
        <br /><br />
        Go through the tabs below in sequence…
      </Segment>

      <Tab className="tab-panes" renderActiveOnly={true} panes={[
        {
          menuItem: {
            key: "work_and_speed",
            content: "Work and Speed"
          },
          render: () => <Tab.Pane><WorkAndSpeed /></Tab.Pane>
        },
        {
          menuItem: {
            key: "time_sharing",
            content: "Time Sharing"
          },
          render: () => <Tab.Pane><TimeSharing /></Tab.Pane>
        },
        {
          menuItem: {
            key: "memory",
            content: "Memory"
          },
          render: () => <Tab.Pane><Memory /></Tab.Pane>
        },
        {
          menuItem: {
            key: "io",
            content: "I/O"
          },
          render: () => <Tab.Pane><IO /></Tab.Pane>
        },
        {
          menuItem: {
            key: "capstone",
            content: "Capstone"
          },
          render: () => <Tab.Pane><Capstone /></Tab.Pane>
        }
      ]}
      />
    </Layout>
  )
}

export default SingleCoreComputing
