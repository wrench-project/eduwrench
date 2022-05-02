import React from "react"
import Layout from "../../components/layout"
import Seo from "../../components/seo"
import { Segment, Tab } from "semantic-ui-react"
import "katex/dist/katex.min.css"
import "./pedagogic_modules.css"

import SoloCloudFunction from "./include_cloud_functions/solo_cloud_function"

const CloudFunctions = () => {

    const module = "C.2"

    return (
        <Layout>
            <Seo title="C.2. Cloud Functions" />
            <h2 style={{
                marginBottom: `30px`,
                marginTop: `50px`,
                color: "#525252"
            }}><br />C.2. Cloud Functions</h2>

            <Segment style={{ marginBottom: "2em" }}>
                The goal of this module is to have you go through a case-study for a real-world workflow application that must be executed
                while paying attention both to  performance and carbon footprint.  You first execute the app on a local cluster that you
                can configure in various ways to trade-off performance for electrical power efficiency. You then execute it by using the local cluster
                in a low-power configuration as well as a remote cloud whose power source is green(er).
                <br /><br />
                Go through the two tabs below in sequence…
            </Segment>

            <Tab className="tab-panes" renderActiveOnly={true} panes={[
                {
                    menuItem: {
                        key: "solo_cloud_function",
                        content: "Solo Cloud Function"
                    },
                    render: () => <Tab.Pane><SoloCloudFunction module={module} tab={"solo_cloud_function"}/></Tab.Pane>
                },
                // {
                //     menuItem: {
                //         key: "cloud_computing",
                //         content: "Local cluster and remote cloud"
                //     },
                //     render: () => <Tab.Pane><CloudComputing module={module} tab={"cloud_computing"}/></Tab.Pane>
                // }
            ]}
            />
        </Layout>
    )
}

export default CloudFunctions
