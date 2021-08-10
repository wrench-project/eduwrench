import React from "react"
import PropTypes from "prop-types"
import { useStaticQuery, graphql } from "gatsby"
import Header from "./header"
import Footer from "./footer"
import Glossary from "./glossary"
import { Container } from "semantic-ui-react"
import "semantic-ui-css/semantic.min.css"
import "./layout.css"

const Layout = ({ children }) => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)

  const gtag = require("./gtag")

  return (
    <>
      <Header siteTitle={data.site.siteMetadata?.title || `Title`} />
      <Glossary />
      <Container style={{ marginTop: "4em", backgroundColor: "#fefaec" }}>
        <main>{children}</main>
      </Container>
      <Footer />
    </>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired
}

export default Layout
