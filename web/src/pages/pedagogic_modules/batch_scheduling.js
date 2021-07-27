import React from "react"
import Layout from "../../components/layout"
import PageHeader from "../../components/page_header"
import { Segment, Tab } from "semantic-ui-react"
import "katex/dist/katex.min.css"
import "./pedagogic_modules.css"

import BasicConcepts from "./include_batch_scheduling/basic_concepts"
import JobSubmission from "./include_batch_scheduling/job_submission"
import BatchQueue from "./include_batch_scheduling/batch_queue"
import JobCancellation from "./include_batch_scheduling/job_cancellation"
import JobDuration from "./include_batch_scheduling/job_duration"
import JobNumNodes from "./include_batch_scheduling/job_num_nodes"

const BatchScheduling = () => {

  const module = "C.1"

  return (
    <Layout>
      <PageHeader title="C.1. Batch Scheduling" />

      <Segment style={{ marginBottom: "2em" }}>
        The goal of this module is to provide you with fundamental knowledge of and
        hands-on experience with the use of a batch scheduler.
        <br />
        <br />
        This module assumes
        that you have basic knowledge of the Linux command-line, and that you
        have <a href="https://www.docker.com">Docker</a> installed on your computer.
        <br />
        <br />

        Go through the tabs below in sequence.
      </Segment>

      <Tab className="tab-panes" renderActiveOnly={true} panes={[
        {
          menuItem: {
            key: "basic_concepts",
            content: "Basics"
          },
          render: () => <Tab.Pane><BasicConcepts module={module} tab={"basic_concepts"}/></Tab.Pane>
        },
        {
          menuItem: {
            key: "job_submission",
            content: "Job Submission"
          },
          render: () => <Tab.Pane><JobSubmission module={module} tab={"job_submission"}/></Tab.Pane>
        },
        {
          menuItem: {
            key: "batch_queue",
            content: "Batch Queue"
          },
          render: () => <Tab.Pane><BatchQueue module={module} tab={"batch_queue"}/></Tab.Pane>
        },
        {
          menuItem: {
            key: "job_cancellation",
            content: "Job Cancellation"
          },
          render: () => <Tab.Pane><JobCancellation module={module} tab={"job_cancellation"}/></Tab.Pane>
        },
        {
          menuItem: {
            key: "job_duration",
            content: "Job Duration"
          },
          render: () => <Tab.Pane><JobDuration module={module} tab={"job_duration"}/></Tab.Pane>
        },
        {
          menuItem: {
            key: "job_num_nodes",
            content: "Job Size"
          },
          render: () => <Tab.Pane><JobNumNodes module={module} tab={"job_num_nodes"}/></Tab.Pane>
        }

      ]}
      />
    </Layout>
  )
}

export default BatchScheduling
