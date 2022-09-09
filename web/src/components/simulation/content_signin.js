import React from "react"
import { StaticImage } from "gatsby-plugin-image"

const ContentSignIn = ({content}) => {
  return (
    <div style={{ backgroundColor: "#f7f7f7" }}>
      <StaticImage
        src="../../images/wrench_logo.png"
        width={40}
        height={40}
        alt="eduWRENCH logo"
        backgroundColor="#f7f7f7"
        style={{ marginRight: "1em", float: "left" }}
      />
      <strong>eduWRENCH Pedagogic Modules</strong>
      <br />
      Sign in on the top of the page to access the {content}.
    </div>
  )
}

export default ContentSignIn
