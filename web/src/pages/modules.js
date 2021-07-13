import React from "react"
import Layout from "../components/layout"
import Seo from "../components/seo"
import ModulesList from "../components/modules_list"
import "./modules.css"

const Modules = () => (
  <Layout>
    <Seo title="Modules" />
    <ModulesList />
    <br/><br/>
  </Layout>
)

export default Modules
