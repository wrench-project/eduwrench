import React from "react"

import Seo from "../components/seo"
import { Button } from "semantic-ui-react"
import { StaticImage } from "gatsby-plugin-image"
import "./callback.css"

function exchangeCode(search) {
  window.opener.postMessage(search, window.opener.location.href);
  window.close();
}

function userClicksNo() {
  window.opener.postMessage("No.", window.opener.location.href);
  window.close();
}

const CallbackPage = () => (
  <div className="callback-page">
    <Seo title="CILogon Callback Page" />
    <h1 className="cilogon_header">CILogon to eduWRENCH</h1>
    <StaticImage
      src="../images/cilogon_to_eduwrench.png"
      style={{
        maxWidth: "100%",
        marginBottom: "25px",
      }}
      alt="CILogon to eduWRENCH"
    />
    <p className="cilogon_question">Allow eduWRENCH to access your CILogon account and information?</p>
    <div className="button-group">
      <Button className="cilogon_confirm" size="huge" color="blue" onClick={() => exchangeCode(window.location.search)}>Yes</Button>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <Button className="cilogon_deny" size="huge" color="red" onClick={() => userClicksNo()}>No</Button>
    </div>
  </div>
)

export default CallbackPage
