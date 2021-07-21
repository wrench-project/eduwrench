import React from "react"
import Seo from "./seo"

const PageHeader = ({ title }) => {
  return (
    <>
      <Seo title={title} />
      <h2 style={{
        marginBottom: `30px`,
        marginTop: `50px`,
        color: "#525252"
      }}><br />{title}</h2>
    </>
  )
}

export default PageHeader
