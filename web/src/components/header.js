import "./header.css"
import { StaticImage } from "gatsby-plugin-image"
import PropTypes from "prop-types"
import React from "react"
import Navbar from "react-bootstrap/Navbar"
import Nav from "react-bootstrap/Nav"
import Auth from "./auth"

const Header = props => {
  return (
    <div>
      <div>
        <Navbar bg="light" fixed="top" expand="md"
                style={{ boxShadow: "#ccc 2px 2px 2px" }}>
          <Navbar.Brand href="/" style={{ backgroundColor: "#f8f9fa" }}>
            <StaticImage
              src="../images/wrench_logo.png"
              width="30"
              height="30"
              alt="eduWRENCH logo"
            />
          </Navbar.Brand>
          <Navbar.Text style={{ lineHeight: "1em" }}>
            <strong style={{
              backgroundColor: "#f8f9fa",
              color: "#c78651",
              display: "inline-block"
            }}>
              eduWRENCH - Pedagogic Modules
              <small
                style={{
                  color: "#bbbdbf",
                  marginLeft: 5,
                  marginBottom: 5,
                  backgroundColor: "#f8f9fa",
                  fontSize: "0.7em"
                }}
              ><br />Parallel and Distributed Computing Courseware
              </small>
            </strong>
          </Navbar.Text>

          <Nav.Link style={{ color: "#c78651", marginLeft: "1em" }} href="/">
            Home
          </Nav.Link>

          <Nav.Link href="/modules/" style={{ color: "#c78651" }}>
            Modules
          </Nav.Link>

          <Nav.Link href="/forstudents/" style={{ color: "#c78651" }}>
            For Students
          </Nav.Link>

          <Nav.Link href="/forteachers/" style={{ color: "#c78651" }}>
            For Teachers
          </Nav.Link>

          <Navbar.Collapse className="justify-content-end" style={{
            backgroundColor: "#f8f9fa", marginRight: "1em"
          }}>
            <Navbar.Text>
              <Auth />
            </Navbar.Text>
          </Navbar.Collapse>
        </Navbar>
      </div>
    </div>
  )
}

Header.propTypes = {
  siteTitle: PropTypes.string
}

Header.defaultProps = {
  siteTitle: ``
}

export default Header
