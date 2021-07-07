import React, { useState } from "react"
import Layout from "../../components/layout"
import Seo from "../../components/seo"
import { Segment, Tab } from "semantic-ui-react"
// import { BrowserRouter as Router, Route, NavLink, Switch } from "react-router-dom"
import "katex/dist/katex.min.css"
import "./pedagogic_modules.css"

import BasicConcepts from "./include_batch_scheduling/basic_concepts"
import JobSubmission from "./include_batch_scheduling/job_submission"
import BatchQueue from "./include_batch_scheduling/batch_queue"

const BatchScheduling = () => {
    return (
        <Layout>
            <Seo title="C.1. Batch Scheduling" />
            <h2 style={{
                marginBottom: `30px`,
                marginTop: `50px`,
                color: "#525252"
            }}><br />C.1. Batch Scheduling </h2>

            <Segment style={{ marginBottom: "2em" }}>
                The goal of this module is to provide you with fundamental knowledge of and
                hands-on experience with the use of a batch scheduler. This module assumes
                that you have basic knowledge of the Linux command-line, and that you
                have <a href="https://www.docker.com">Docker</a> installed on your computer.
                <br /><br />
                Go through the tabs below in sequence…
            </Segment>

            <Tab className="tab-panes" renderActiveOnly={true} panes={[
                {
                    menuItem: {
                        key: "basic_concepts",
                        content: "Basic Concepts"
                    },
                    render: () => <Tab.Pane><BasicConcepts /></Tab.Pane>
                },
                {
                    menuItem: {
                        key: "job_submission",
                        content: "Job Submission"
                    },
                    render: () => <Tab.Pane><JobSubmission /></Tab.Pane>
                },
                {
                    menuItem: {
                        key: "batch_queue",
                        content: "Batch Queue"
                    },
                    render: () => <Tab.Pane><BatchQueue /></Tab.Pane>
                }
            ]}
            />
        </Layout>
    )
}

export default BatchScheduling
