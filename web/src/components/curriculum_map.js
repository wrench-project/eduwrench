// import React, {useState} from "react"
import {useStaticQuery, graphql} from "gatsby"
import "antd/dist/antd.css"

export const ListSLOs = (module, tab) => {

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

  return SLODescriptions

}

