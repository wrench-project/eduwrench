import React from "react"
import Layout from "../../components/layout"
import Seo from "../../components/seo"
import { Segment, Tab } from "semantic-ui-react"
import "katex/dist/katex.min.css"
import "./pedagogic_modules.css"

import LocalComputing from "./include_thrustd_cloud/local_computing"
import CloudComputing from "./include_thrustd_cloud/cloud_computing"

const ThrustD_Cloud = () => {
    return (
        <Layout>
            <Seo title="D.1. Thrust D" />
            <h2 style={{
                marginBottom: `30px`,
                marginTop: `50px`,
                color: "#525252"
            }}><br />D.1. Thrust D</h2>

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
                        key: "local_computing",
                        content: "Local Computing"
                    },
                    render: () => <Tab.Pane><LocalComputing /></Tab.Pane>
                },
                {
                    menuItem: {
                        key: "cloud_computing",
                        content: "Cloud Computing"
                    },
                    render: () => <Tab.Pane><CloudComputing /></Tab.Pane>
                }
            ]}
            />
        </Layout>
    )
}

export default ThrustD_Cloud
