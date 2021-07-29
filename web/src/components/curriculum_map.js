// import React, {useState} from "react"
import {useStaticQuery, graphql} from "gatsby"
import "antd/dist/antd.css"
import {Segment, Table} from "semantic-ui-react";
import React from "react";

// Function to retrieve the whole CurriculumMap "database"
const GetCurriculumMapDatabase = () => {
  const data = useStaticQuery(graphql`
    query CurriculummapQuery {
      allCurriculummapYaml(sort: { order:ASC, fields: SLOs}) {
        nodes {
            TopSLOs {
                description
                key
            }
            ModuleTitles {
                number
                title
            }
            SLOs {
                description
                key
                topSLOs
            }
            Mappings {
                module
                tab
                tabname
                SLOs
          }
        }
      }
    }
  `)
  return data
}

// Function to retrieve the list of SLO descriptions for a module-tab pair
export const ListSLOs = (module, tab) => {
  const data = GetCurriculumMapDatabase()

  // Get the SLOs and Mappings
  const SLOs = data["allCurriculummapYaml"]["nodes"][0]["SLOs"]
  const Mappings = data["allCurriculummapYaml"]["nodes"][2]["Mappings"]

  // Determine all SLO keys relevant for the module-tab passed as arguments
  let SLOKeys = []
  for (const m of Mappings) {
    if (m.module === module && m.tab === tab) {
      SLOKeys = m.SLOs
    }
  }

  // Retrieve the descriptions of the relevant SLOs
  let SLODescriptions = []
  for (const SLO of SLOs) {
    if (SLOKeys.includes(SLO.key)) {
      SLODescriptions.push(SLO.description)
    }
  }

  while (SLOKeys.length !== SLODescriptions.length) {
    SLODescriptions.push("INTERNAL ERROR: SLO NOT FOUND")
  }

  return SLODescriptions
}


export const HighLevelCurriculumMap = () => {

  const data = GetCurriculumMapDatabase()

  // Get the SLOs and Mappings
  const SLOs = data["allCurriculummapYaml"]["nodes"][0]["SLOs"]
  const TopSLOs = data["allCurriculummapYaml"]["nodes"][1]["TopSLOs"]
  const ModuleTitles = data["allCurriculummapYaml"]["nodes"][2]["ModuleTitles"]
  const Mappings = data["allCurriculummapYaml"]["nodes"][3]["Mappings"]

  // Compute the dict of all modules: module_dict[module] = [[tab, bool, bool, bool, bool], [tab, bool, bool, bool], ...]
  let module_dict = {}

  for (let mapping of Mappings) {
    let module = mapping.module
    let tabname = mapping.tabname

    if (!(module in module_dict)) {
      module_dict[module] = []
    }

    // Create a blank tab spec
    let tab_spec = [tabname]
    for (let i=0; i < TopSLOs.length; i++) {
      tab_spec.push(false)
    }

    // Find the top SLOs for this module-tab
    let foundSLOs = []
    for (let slo of mapping.SLOs) {
      let result = SLOs.filter(x => x.key === slo)
      if (result.length > 1) {
        break
      } else {
        for (let s of result[0].topSLOs) {
          foundSLOs.push(s)
        }
      }
    }

    // Aggregate all with previous tabs within module
    for (let i = 0; i < TopSLOs.length; i++) {
      let topSLOKey = TopSLOs[i].key
      if (foundSLOs.includes(topSLOKey)) {
        tab_spec[1 + i] =  tab_spec[1 + i] || true
      }
    }
    module_dict[module].push(tab_spec)
  }

  // Build all the rows
  let sorted = [];
  for(let module in module_dict) {
    sorted[sorted.length] = module;
  }
  sorted.sort();

  console.log(ModuleTitles)
  let tableRows = []
  for (let key of sorted) {
    let module_title
    try {
      module_title = ModuleTitles.filter(x => x.number === key)[0].title
    } catch (error) {
      module_title = ""
    }

    let background_color = "#bfbfbf"
    let module_row = (
        <Table.Row key={Math.random()}>
          <Table.Cell key={Math.random()} colspan="1" textAlign="left" bgcolor={background_color}><b>{key}&nbsp;&nbsp;{module_title}</b></Table.Cell>
          <Table.Cell key={Math.random()} colspan="1" textAlign="left" bgcolor={background_color}><b>SLO1</b></Table.Cell>
          <Table.Cell key={Math.random()} colspan="1" textAlign="left" bgcolor={background_color}><b>SLO2</b></Table.Cell>
          <Table.Cell key={Math.random()} colspan="1" textAlign="left" bgcolor={background_color}><b>SLO3</b></Table.Cell>
          <Table.Cell key={Math.random()} colspan="1" textAlign="left" bgcolor={background_color}><b>SLO4</b></Table.Cell>
        </Table.Row>
    )
    tableRows.push(module_row)

    for (let tabspec of module_dict[key]) {
      let checkmarks = []
      for (let i=0; i < 4; i++) {
        let checkmark = tabspec[i + 1] ? (<b>&#10003;</b>) : (<b></b>)
        checkmarks.push(checkmark)
      }
      let row = (<Table.Row key={Math.random()}>
        <Table.Cell key={Math.random()}>&nbsp;<b>&#x21AA;</b> {tabspec[0]}</Table.Cell>
        <Table.Cell key={Math.random()}>{checkmarks[0]}</Table.Cell>
        <Table.Cell key={Math.random()}>{checkmarks[1]}</Table.Cell>
        <Table.Cell key={Math.random()}>{checkmarks[2]}</Table.Cell>
        <Table.Cell key={Math.random()}>{checkmarks[3]}</Table.Cell>
      </Table.Row>)
      tableRows.push(row)
    }
  }
  return (
      <>
        <Segment.Group className="objectives">
          <Segment inverted><strong>Curriculum Map</strong></Segment>
          <Table collapsing>
            {/*<Table.Header>*/}
            {/*  <Table.Row key={Math.random()}>*/}
            {/*    <Table.HeaderCell>Modules</Table.HeaderCell>*/}
            {/*    <Table.HeaderCell>SLO1</Table.HeaderCell>*/}
            {/*    <Table.HeaderCell>SLO2</Table.HeaderCell>*/}
            {/*    <Table.HeaderCell>SLO3</Table.HeaderCell>*/}
            {/*    <Table.HeaderCell>SLO4</Table.HeaderCell>*/}
            {/*  </Table.Row>*/}
            {/*</Table.Header>*/}
            <Table.Body>
              {tableRows}
            </Table.Body>
          </Table>
        </Segment.Group>
      </>
  )
}

export default HighLevelCurriculumMap

