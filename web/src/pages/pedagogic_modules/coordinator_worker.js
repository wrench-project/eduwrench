import React from "react"
import Layout from "../../components/layout"
import PageHeader from "../../components/page_header"
import { Segment, Tab } from "semantic-ui-react"
import "./pedagogic_modules.css"

import CoordinatorWorkerBasics from "./include_coordinator_worker/coordinator_worker_basics"
import CoordinatorWorkerScheduling from "./include_coordinator_worker/coordinator_worker_scheduling"

const CoordinatorWorker = () => {

    const module = "A.3.3"

    return (
        <Layout>
            <PageHeader title="A.3.3 Coordinator-Worker" />

            <Segment style={{ marginBottom: "2em" }}>
                The goal of this module is to introduce you to the coordinator/worker model of computation, which in some sense
                extends client-server.
                <br /><br />
                Go through the tabs below in sequence…
            </Segment>

            <Tab className="tab-panes" renderActiveOnly={true} panes={[
                {
                    menuItem: {
                        key: "coordinator_worker_basics",
                        content: "Basics"
                    },
                    render: () => <Tab.Pane><CoordinatorWorkerBasics module={module} tab={"coordinator_worker_basics"}/></Tab.Pane>
                },
                {
                    menuItem: {
                        key: "coordinator_worker_experiments",
                        content: "Scheduling Experiments"
                    },
                    render: () => <Tab.Pane><CoordinatorWorkerScheduling module={module} tab={"coordinator_worker_experiments"}/></Tab.Pane>
                }
            ]}
            />
        </Layout>
    )
}

export default CoordinatorWorker
