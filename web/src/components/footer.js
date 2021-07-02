import React from "react"
import Navbar from "react-bootstrap/Navbar"
import Nav from "react-bootstrap/Nav"
import { Link } from "gatsby"
import "./footer.css"

const Footer = () => (
  <div className="footer">
    <div className="row">
      <div className="column">
        <p className="text">
          ©2020-{new Date().getFullYear()} eduWRENCH.
          <br/>
          Released under{" "}
          <a
            target="_blank"
            rel="noreferrer"
            className="link"
            href="https://github.com/wrench-project/eduwrench/blob/master/LICENSE"
          >
            GNU General Public License v3.0.{" "}
          </a>{" "}
          <br/>
        </p>
        <small className="text">
          <Link className="slink" to="/privacypolicy/">
            Privacy Policy
          </Link>
          {" "} | {" "}
          <a className="slink" to="/modules/">
             Our Modules
          </a>
          {" "} | {" "}
          <a
            href="https://wrench-project.org/"
            target="_blank"
            rel="noreferrer"
            className="slink"
          >
            WRENCH Project
          </a>
        </small>
        <div className="banner">
          <div className="inline-block">
            <a
              href="https://nsf.gov/"
              target="_blank"
              rel="noreferrer"
              className="link"
            >
              <img
                src={require("../images/logo-nsf.png")}
                width="40"
                height="40"
                style={{ margin: "10px", backgroundColor: "white" }}
                alt="NSF logo"
              />
            </a>
          </div>
          <div className="inline-block">
            <a
              href="https://www.ics.hawaii.edu/"
              target="_blank"
              rel="noreferrer"
              className="link"
            >
              <img
                src={require("../images/logo-uhm.png")}
                height="40"
                width="120"
                style={{ margin: "10px", backgroundColor: "white" }}
                alt="UHM logo"
              />
            </a>
          </div>
          <div className="inline-block">
            {" "}
            <a
              href="https://www.isi.edu/"
              target="_blank"
              rel="noreferrer"
              className="link"
            >
              <img
                src={require("../images/logo-usc.png")}
                height="40"
                width="120"
                style={{ margin: "10px", backgroundColor: "white" }}
                alt="USC logo"
              />
            </a>
          </div>
        </div>
      </div>
      <div className="column">
        <p className="text">
          eduWRENCH is funded by the National Science Foundation (NSF) under
          grants number{" "}
          <a
            target="_blank"
            rel="noreferrer"
            className="link"
            href="https://nsf.gov/awardsearch/showAward?AWD_ID=1923539"
          >
            1923539
          </a>
          , and{" "}
          <a
            target="_blank"
            rel="noreferrer"
            className="link"
            href="https://nsf.gov/awardsearch/showAward?AWD_ID=1923621"
          >
            1923621.{" "}
          </a>{" "}
        </p>
        <small className="smaller text">
          Any opinions, findings, and conclusions or recommendations expressed
          in this material are those of the author(s) and do not necessarily
          reflect the views of the National Science Foundation.
        </small>
      </div>
    </div>
  </div>
)

export default Footer
