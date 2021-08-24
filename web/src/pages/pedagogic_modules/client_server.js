import React from "react"
import Layout from "../../components/layout"
import PageHeader from "../../components/page_header"
import { Segment, Tab } from "semantic-ui-react"
import "./pedagogic_modules.css"

import ClientServerBasics from "./include_client_server/client_server_basics"
import ClientServerPipelining from "./include_client_server/client_server_pipelining"

const ClientServer = () => {

    const module = "A.3.2"
    return (
        <Layout>
            <PageHeader title="A.3.2 Client-Server"/>

            <Segment style={{ marginBottom: "2em" }}>
                The goal of this module is to introduce you to the fundamental client/server model of computation.
                <br /><br />
                Go through the tabs below in sequence…
            </Segment>

            <Tab className="tab-panes" renderActiveOnly={true} panes={[
                {
                    menuItem: {
                        key: "client_server_basics",
                        content: "Basics"
                    },
                    render: () => <Tab.Pane><ClientServerBasics module={module} tab={"client_server_basics"}/></Tab.Pane>
                },
                {
                    menuItem: {
                        key: "client_server_pipelining",
                        content: "Pipelining I/O and Network"
                    },
                    render: () => <Tab.Pane><ClientServerPipelining module={module} tab={"client_server_pipelining"}/></Tab.Pane>
                }
            ]}
            />
        </Layout>
    )
}

export default ClientServer
