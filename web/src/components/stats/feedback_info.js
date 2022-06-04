import React, {useState} from 'react'
import {Accordion, Icon, Table, Grid, Divider, Popup} from "semantic-ui-react";
import {graphql, useStaticQuery} from "gatsby";
import FeedbackInfoRow from "./feedback_info_row";

// Function to retrieve the whole CurriculumMap "database"
const GetCurriculumMapDatabase = () => {
    return useStaticQuery(graphql`
    query modulesAndTheirTabs {
      allCurriculummapYaml {
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
}

const FeedbackInfo = ({feedbackData}) => {

    console.log("DATA")
    const data = GetCurriculumMapDatabase()
    const mappings = data["allCurriculummapYaml"]["nodes"][3]["Mappings"]
    const tabnamedict = {}
    for (const mapping of mappings) {
        const module = mapping["module"]
        const tabkey = mapping["tab"]
        const tabname = mapping["tabname"]
        console.log("* " + module + " " + tabkey + " " + tabname)
        tabnamedict[tabkey] = {"module": module, "tabname": tabname}
    }
    console.log("FEEDBACK DATA")
    console.log(feedbackData)

    const feedbackArray = []
    for (const feedback of feedbackData) {
        feedbackArray.push({
            "module": tabnamedict[feedback.tabkey].module,
            "tab": tabnamedict[feedback.tabkey].tabname,
            "completed": feedback.completed
        })
    }

    return (
        <>
            <Table celled>
                {/*<Table.Header>*/}
                {/*    <Table.Row>*/}
                {/*        <Table.HeaderCell>Module tab</Table.HeaderCell>*/}
                {/*        <Table.HeaderCell>Your feedback</Table.HeaderCell>*/}
                {/*    </Table.Row>*/}
                {/*</Table.Header>*/}
                <Table.Body>
                    {feedbackArray.map((feedback) => <FeedbackInfoRow module={feedback.module} tab={feedback.tab} completed={feedback.completed} /> )}
                </Table.Body>
            </Table>
        </>
    )
}

export default FeedbackInfo