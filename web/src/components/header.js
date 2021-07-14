import React from "react"
import PropTypes from "prop-types"
import { Menu } from "semantic-ui-react"
import { StaticImage } from "gatsby-plugin-image"
import Auth from "./auth"
import "./header.css"

const Header = props => {
  return (
    <div>
      <div>
        <Menu fixed="top">
          <Menu.Item className="menu-logo">
            <StaticImage
              src="../images/wrench_logo.png"
              width={30}
              height={30}
              alt="eduWRENCH logo"
              backgroundColor="#fff"
              style={{ marginRight: "1em" }}
            />
            <strong style={{
              backgroundColor: "#fff",
              color: "#c78651",
              display: "inline-block"
            }} className="menu-logo">
              eduWRENCH - Pedagogic Modules
              <small
                style={{
                  color: "#bbbdbf",
                  marginLeft: 5,
                  marginBottom: 5,
                  backgroundColor: "#fff",
                  fontSize: "0.7em"
                }}
              ><br />Parallel and Distributed Computing Courseware
              </small>
            </strong>
          </Menu.Item>

          <Menu.Item href="/" className="menu-item">
            Home
          </Menu.Item>

          <Menu.Item href="/modules" className="menu-item">
            Modules
          </Menu.Item>

          <Menu.Item href="/forstudents" className="menu-item">
            For Students
          </Menu.Item>

          <Menu.Item href="/forteachers" className="menu-item">
            For Teachers
          </Menu.Item>

          <Auth />

        </Menu>
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
