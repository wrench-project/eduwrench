import React, { Component, useState, useEffect } from "react"
import { Segment, Table } from "semantic-ui-react"
import { Bar } from "@iftek/react-chartjs-3"

const TasksData = ({ data, label = null }) => {

  let tableContents = ``
  let labels = label ? label : {
    read: { display: true, label: "Read Input" },
    compute: { display: true, label: "Computation" },
    write: { display: true, label: "Write Output" }
  }

  if (data.workflow_execution) {
    const tasksData = data.workflow_execution.tasks


  }

  return (
    <>
      <Segment.Group>
        <Segment color="blue"><strong>Tasks Data</strong></Segment>
        <Segment>
          <Table>
            <Table.Header>
              <Table.Row>

              </Table.Row>
            </Table.Header>
          </Table>
        </Segment>
      </Segment.Group>
    </>
  )
}

export default TasksData
