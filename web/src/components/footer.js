import React from "react"
import { Link } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"
import "./footer.css"

const Footer = () => (
  <div className="footer">
    <div className="row">
      <div className="column">
        <p className="text">
          ©2020-{new Date().getFullYear()} eduWRENCH.
          <br />
          Released under{" "}
          <a
            target="_blank"
            rel="noreferrer"
            className="link"
            href="https://github.com/wrench-project/eduwrench/blob/master/LICENSE"
          >
            GNU General Public License v3.0.{" "}
          </a>{" "}
          <br />
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
              className="link m-lg-2"
              style={{ marginLeft: "1em !important"}}
            >
              <StaticImage
                src="../images/logo-nsf.png"
                height="40"
                alt="NSF logo"
                backgroundColor="#fff"
              />
            </a>
          </div>
          <div className="inline-block">
            <a
              href="https://www.ics.hawaii.edu/"
              target="_blank"
              rel="noreferrer"
              className="link m-lg-2"
            >
              <StaticImage
                src="../images/logo-uhm.png"
                height="40"
                alt="UHM logo"
                backgroundColor="#fff"
              />
            </a>
          </div>
          <div className="inline-block">
            {" "}
            <a
              href="https://www.isi.edu/"
              target="_blank"
              rel="noreferrer"
              className="link m-lg-2"
            >
              <StaticImage
                src="../images/logo-usc.png"
                height="40"
                alt="USC logo"
                backgroundColor="#fff"
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
