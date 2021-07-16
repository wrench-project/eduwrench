import React from "react"
import Layout from "../../components/layout"
import Seo from "../../components/seo"
import { Segment, Tab } from "semantic-ui-react"
import "./pedagogic_modules.css"

import ClientServerBasics from "./include_client_server/client_server_basics"
import ClientServerPipelining from "./include_client_server/client_server_pipelining"

const NetworkingFundamental = () => {
  return (
    <Layout>
      <Seo title="A.3.2 Client-Server" />
      <h2 style={{
        marginBottom: `30px`,
        marginTop: `50px`,
        color: "#525252"
      }}><br />A.3.2 Client-Server</h2>

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
          render: () => <Tab.Pane><ClientServerBasics /></Tab.Pane>
        },
        {
          menuItem: {
            key: "client_server_pipelining",
            content: "Pipelining I/O and Network"
          },
          render: () => <Tab.Pane><ClientServerPipelining /></Tab.Pane>
        }
      ]}
      />
    </Layout>
  )
}

export default NetworkingFundamental
