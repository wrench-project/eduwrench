import React, { useState } from "react"
import { Link } from "gatsby"
import "antd/dist/antd.css"
import "./glossary.css"
import { Drawer, Button, Input } from "antd"
import YAMLData from "../../content/glossary.yml"
import { useStaticQuery, graphql } from "gatsby"

const Glossary = () => {
  const [visible, setVisible] = useState(false)
  const [input, setInput] = useState("")

  const showDrawer = () => {
    setVisible(true)
  }
  const onClose = () => {
    setVisible(false)
  }

  const data = useStaticQuery(graphql`
    query GlossaryQuery {
      allGlossaryYaml(sort: { order: ASC, fields: term }) {
        nodes {
          term
          description
        }
      }
    }
  `)

  var searchData

  if (input.length > 0) {
    searchData = data.allGlossaryYaml.nodes.filter(i => {
      return i.term.toLowerCase().match(input.toLowerCase())
    })
  } else {
    searchData = data.allGlossaryYaml.nodes
  }

  const listItems = searchData.map(item => (
    <div>
      <br />
      <h5>{item.term}</h5>
      <p>{item.description}</p>
    </div>
  ))

  const handleChange = e => {
    e.preventDefault()
    setInput(e.target.value)
  }

  return (
    <>
      <Button
        style={{
          backgroundColor: "#d3834a",
          borderColor: "#d3834a",
          position: "fixed",
          marginTop: 60,
        }}
        size="large"
        type="primary"
        onClick={showDrawer}
      >
        Glossary
      </Button>
      <Drawer
        title=""
        placement="left"
        closable={false}
        onClose={onClose}
        visible={visible}
      >
        <div className="cont">
          <h2 style={{ color: "grey" }}>Glossary</h2>
          <br />
          <Input
            type="text"
            placeholder="Search for a term..."
            id="term"
            name="term"
            value={input}
            onChange={handleChange}
            bordered={false}
          ></Input>
          {listItems}
          <br />
          <p style={{ color: "grey" }}>©2020 eduWRENCH. All rights reserved.</p>
        </div>
      </Drawer>
    </>
  )
}
export default Glossary
