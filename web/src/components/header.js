import { Link } from "gatsby"
import PropTypes from "prop-types"
import React from "react"
import Navbar from "react-bootstrap/Navbar"
import Nav from "react-bootstrap/Nav"

const Header = props => {
  return (
    <div>
      <div>
        <Navbar bg="light">
          <Navbar.Brand style={{ backgroundColor: "#f8f9fa" }}>
            <Link to="/">
              <img
                src={require("../images/wrench_logo.png")}
                width="40"
                height="40"
                style={{ margin: "20px", backgroundColor: "#f8f9fa" }}
                className="d-inline-block align-top"
                alt="eduWRENCH logo"
              />
            </Link>
          </Navbar.Brand>
          <Nav.Link style={{ color: "#c78651" }} href="/">
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

          <Navbar.Brand
            className="ml-auto"
            style={{ backgroundColor: "#f8f9fa" }}
          >
            <img
              src={require("../images/signin.png")}
              height="40"
              style={{ margin: "20px", backgroundColor: "white" }}
              className="d-inline-block align-top"
              alt="Sign In"
            />
          </Navbar.Brand>
        </Navbar>
        <Navbar bg="light">
          {" "}
          <Link to="/">
            <h5
              style={{
                backgroundColor: "#f8f9fa",
                color: "#c78651",
                marginLeft: 20,
                display: "inline-block",
              }}
            >
              eduWRENCH - Pedagogic Modules
            </h5>
          </Link>
          <small
            style={{
              color: "#bbbdbf",
              marginLeft: 5,
              marginBottom: 5,
              backgroundColor: "#f8f9fa",
            }}
          >
            Parallel and Distributed Computing Courseware
          </small>
        </Navbar>
      </div>
    </div>
  )
}

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header
