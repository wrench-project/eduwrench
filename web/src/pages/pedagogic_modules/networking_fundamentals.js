import React from "react"
import Layout from "../../components/layout"
import PageHeader from "../../components/page_header"
import { Segment, Tab } from "semantic-ui-react"
import "./pedagogic_modules.css"

import LatencyAndBandwidth from "./include_networking_fundamentals/latency_and_bandwidth"
import Topologies from "./include_networking_fundamentals/topologies"
import Contention from "./include_networking_fundamentals/contention"

const NetworkingFundamental = () => {
  return (
    <Layout>
      <PageHeader title="A.3.1 Networking Fundamentals" />

      <Segment style={{ marginBottom: "2em" }}>
        The goal of this module is to provide you with knowledge of networking, as it relates to the performance of
        distributed computing applications.
        <br /><br />
        The goal is <strong style={{ backgroundColor: "#fff" }}>not</strong> to teach you details of network
        technologies and protocols, which are fascinating topics you can learn about in Networking <a
        href="/textbooks"> textbooks < /a>.
        <br /><br />
        Go through the tabs below in sequence…
      </Segment>

      <Tab className="tab-panes" renderActiveOnly={true} panes={[
        {
          menuItem: {
            key: "latency_and_bandwidth",
            content: "Latency & Bandwidth"
          },
          render: () => <Tab.Pane><LatencyAndBandwidth /></Tab.Pane>
        },
        {
          menuItem: {
            key: "topologies",
            content: "Topologies"
          },
          render: () => <Tab.Pane><Topologies /></Tab.Pane>
        },
        {
          menuItem: {
            key: "contention",
            content: "Contention"
          },
          render: () => <Tab.Pane><Contention /></Tab.Pane>
        }
      ]}
      />
    </Layout>
  )
}

export default NetworkingFundamental
