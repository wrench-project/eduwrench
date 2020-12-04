import React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import Card from "react-bootstrap/Card"
import CardDeck from "react-bootstrap/CardDeck"

const Textbooks = () => (
  <Layout>
    <SEO title="Further Reading" />
    <h3
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        textAlign: "center",
        marginBottom: `30px`,
        marginTop: `50px`,
        color: "#525252",
      }}
    >
      Further Reading
    </h3>
    <p>
      The content in these pedagogic modules often abstracts away low-level
      details so as to focus on specific learning objectives, and referring
      instead to textbooks that cover topics in the standard Computer Science
      curriculum. This page provides a non-exhaustive list of relevant classic
      and/or on-line textbooks:
    </p>

    <Card className="main">
      <Card.Body className="card">
        <b className="card">Computer Architecture:</b>
        <br />
        <ul>
          <li>
            <i style={{ backgroundColor: "white" }}>
              Computer Organization and Design MIPS Edition: The
              Hardware/Software Interface
            </i>{" "}
            (6th Edition, 2020) - Hennessy, Patterson - Morgan Kaufmann
          </li>
        </ul>
        <b className="card">Operating Systems:</b>
        <br />
        <ul>
          <li>
            <i style={{ backgroundColor: "white" }}>
              Operating Systems: Three Easy Pieces
            </i>{" "}
            - Arpaci-Dusseau, Arpaci-Dusseau -{" "}
            <a
              target="_blank"
              rel="noreferrer"
              className="link"
              href="http://pages.cs.wisc.edu/~remzi/OSTEP/"
            >
              http://pages.cs.wisc.edu/~remzi/OSTEP/
            </a>
          </li>
        </ul>
        <b className="card">Networking:</b>
        <br />
        <ul>
          <li>
            <i style={{ backgroundColor: "white" }}>
              Networking: Computer Networks: A Systems Approach
            </i>{" "}
            - Davie, Peterson -{" "}
            <a
              target="_blank"
              rel="noreferrer"
              className="link"
              href="https://book.systemsapproach.org/"
            >
              https://book.systemsapproach.org/
            </a>
          </li>
          <li>
            <i style={{ backgroundColor: "white" }}>
              Computer Networking : Principles, Protocols and Practice
              Bonaventure
            </i>{" "}
            -{" "}
            <a
              target="_blank"
              rel="noreferrer"
              className="link"
              href="https://www.computer-networking.info/"
            >
              https://www.computer-networking.info/
            </a>
          </li>
        </ul>

        <b className="card">Distributed Systems:</b>
        <br />
        <ul>
          <li>
            <i style={{ backgroundColor: "white" }}>
              Distributed Systems: Principles and Paradigms
            </i>{" "}
            (3rd edition, 2006) - Tannenbaum, Van Steen - Pearson Prentice Hall
          </li>
        </ul>

        <b className="card">Algorithms and Theory:</b>
        <ul>
          <li>
            <i style={{ backgroundColor: "white" }}>Algorithms</i> (4th Edition,
            2011) - Sedgewick, Wayne - Addison-Wesley -{" "}
            <a
              target="_blank"
              rel="noreferrer"
              className="link"
              href="https://algs4.cs.princeton.edu/"
            >
              https://algs4.cs.princeton.edu/
            </a>
          </li>
          <li>
            <i style={{ backgroundColor: "white" }}>
              Introduction to Algorithms
            </i>{" "}
            (3rd Edition, 2009) - Cormen, Leiserson, Rivest, Stein, Clifford -
            MIT Press and McGraw-Hill
          </li>
        </ul>
      </Card.Body>
    </Card>
  </Layout>
)

export default Textbooks
