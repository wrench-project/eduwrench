import React from "react"
import Layout from "../components/layout"
import PageHeader from "../components/page_header"
import { Segment } from "semantic-ui-react"

const Textbooks = () => (
  <Layout>
    <PageHeader title="Further Reading" />

    <p>
      The content in these pedagogic modules often abstracts away low-level
      details so as to focus on specific learning objectives, and referring
      instead to textbooks that cover topics in the standard Computer Science
      curriculum. This page provides a non-exhaustive list of relevant classic
      and/or on-line textbooks:
    </p>

    <Segment>
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
      <br />
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
    </Segment>
    <br /><br />

  </Layout>
)

export default Textbooks
