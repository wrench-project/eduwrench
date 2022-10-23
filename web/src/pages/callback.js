import React from "react"

import Layout from "../components/layout"
import Seo from "../components/seo"
import { Button } from "semantic-ui-react"

function exchangeCode(search) {
  window.opener.postMessage(search, window.opener.location.href);
}

const CallbackPage = () => (
  <Layout>
    <Seo title="CILogon Callback Page" />
    <h1>CILogon to eduWRENCH</h1>
    <p>Allow eduWRENCH to access your CILogon account and information?</p>
    <Button onClick={exchangeCode(window.location.search)}>Yes</Button>
    <Button>No</Button>
  </Layout>
)

export default CallbackPage
