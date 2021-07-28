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
            SLOs {
                description
                key
                topSLOs
            }
            Mappings {
                module
                tab
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
  const TopSLOs = data["allCurriculummapYaml"]["nodes"][1]["TopSLOs"]
  const SLOs = data["allCurriculummapYaml"]["nodes"][0]["SLOs"]
  const Mappings = data["allCurriculummapYaml"]["nodes"][2]["Mappings"]

  let mapRows = []

  for (let mapping of Mappings) {
    let module = mapping.module
    let tab = mapping.tab
    let foundSLOs = []
    for (let slo of mapping.SLOs) {
      for (let s of SLOs) {
        if (s.key === slo) {
          for (let ts of s.topSLOs) {
            foundSLOs.push(ts)
          }
        }
      }
    }
    let topSLOPresent = ["false", "false", "false", "false"]
    for (let i=0; i < TopSLOs.length; i++) {
      let topSLOKey = TopSLOs[i].key
      if (foundSLOs.includes(topSLOKey)) {
        topSLOPresent[i] = "true"
      }
    }

    let newRow = [mapping.module, mapping.tab, topSLOPresent[0], topSLOPresent[1], topSLOPresent[2], topSLOPresent[3] ]
    mapRows.push(newRow)
  }

  // console.log(mapRows)

  return (
      <>
        <Segment.Group className="objectives">
          <Segment inverted><strong>Curriculum Map</strong></Segment>
          <Table collapsing>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Module</Table.HeaderCell>
                <Table.HeaderCell>Tab</Table.HeaderCell>
                <Table.HeaderCell>SLO#1</Table.HeaderCell>
                <Table.HeaderCell>SLO#2</Table.HeaderCell>
                <Table.HeaderCell>SLO#3</Table.HeaderCell>
                <Table.HeaderCell>SLO#4</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {mapRows.map((row) => {
                console.log('row: ', row);
                return (
                    <Table.Row>
                      <Table.Cell>{row[0]}</Table.Cell>
                      <Table.Cell>{row[1]}</Table.Cell>
                      <Table.Cell>{row[2]}</Table.Cell>
                      <Table.Cell>{row[3]}</Table.Cell>
                      <Table.Cell>{row[4]}</Table.Cell>
                      <Table.Cell>{row[5]}</Table.Cell>
                    </Table.Row>
                );
              })}
            </Table.Body>
          </Table>
        </Segment.Group>
      </>
  )
}

export default HighLevelCurriculumMap

