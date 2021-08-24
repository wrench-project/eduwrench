import React from "react"
import Layout from "../../components/layout"
import PageHeader from "../../components/page_header"
import { Segment, Tab } from "semantic-ui-react"
import "katex/dist/katex.min.css"
import "./pedagogic_modules.css"

import CIServiceFundamentals from "./include_ci_service_concepts/ci_service_fundamentals"
import CIStorageServices from "./include_ci_service_concepts/ci_storage_services"

const CIServiceConcepts = () => {

  const module = "B.1"

  return (
    <Layout>
      <PageHeader title="B.1. CI Service Concepts" />

      <Segment style={{ marginBottom: "2em" }}>
        <p> The goal of this module is to provide you with basic knowledge about cyberinfrastructure (CI) services. </p>
        <p>Go through the tabs below in sequence...</p>
      </Segment>

      <Tab className="tab-panes" renderActiveOnly={true} panes={[
        {
          menuItem: {
            key: "ci_service_fundamentals",
            content: "Fundamentals"
          },
          render: () => <Tab.Pane><CIServiceFundamentals module={module} tab={"ci_service_fundamentals"} /></Tab.Pane>
        },
        {
          menuItem: {
            key: "ci_storage_services",
            content: "Managing Data"
          },
          render: () => <Tab.Pane><CIStorageServices module={module} tab={"ci_storage_services"} /></Tab.Pane>
        }
        // {
        //   menuItem: {
        //     key: "ci_compute_services",
        //     content: "Managing Computations"
        //   },
        //   render: () => <Tab.Pane></Tab.Pane>
        // }
      ]}
      />
    </Layout>
  )
}

export default CIServiceConcepts
