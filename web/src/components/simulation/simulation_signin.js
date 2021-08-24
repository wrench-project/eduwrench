import React from "react"
import { StaticImage } from "gatsby-plugin-image"

const SimulationSignIn = () => {
  return (
    <>
      <StaticImage
        src="../../images/wrench_logo.png"
        width={40}
        height={40}
        alt="eduWRENCH logo"
        backgroundColor="#f7f7f7"
        style={{ marginRight: "1em", float: "left" }}
      />
      <strong style={{ backgroundColor: "#f7f7f7" }}>eduWRENCH Pedagogic Module Simulator</strong>
      <br />
      Sign in on the top of the page to access the simulator.
    </>
  )
}

export default SimulationSignIn
