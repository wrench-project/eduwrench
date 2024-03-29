import React from "react"
import { Segment, Table } from "semantic-ui-react"
import "./task_data.css"

/**
 *
 * @param display
 * @param label
 * @param className
 * @returns {JSX.Element}
 */
function getTableHeader(display, label, className) {
  return display ? (
    <Table.HeaderCell colSpan="3" textAlign="center" className={className}
                      key={label}>{label}</Table.HeaderCell>) : <></>
}

/**
 *
 * @param display
 * @returns {JSX.Element[]|JSX.Element}
 */
function getTableSubHeader(display) {
  return display ? ([
    <Table.HeaderCell textAlign="center" key="start-time">Start Time</Table.HeaderCell>,
    <Table.HeaderCell textAlign="center" key="end-time">End Time</Table.HeaderCell>,
    <Table.HeaderCell textAlign="center" key="duration">Duration</Table.HeaderCell>
  ]) : <></>
}

/**
 *
 * @param data
 * @param label
 * @returns {JSX.Element}
 * @constructor
 */
const TasksData = ({ data, label = null }) => {

  let tableHeader = (<></>)
  let tableSubHeader = (<></>)
  let tableRows = []

  let labels = label ? label : {
    read: { display: true, label: "Read Input" },
    compute: { display: true, label: "Computation" },
    write: { display: true, label: "Write Output" }
  }

  if (data.workflow_execution) {
    const tasksData = data.workflow_execution.tasks

    // header
    tableHeader = [
      <Table.HeaderCell key="header-taskid" />,
      getTableHeader(labels.read.display, labels.read.label, "table-read"),
      getTableHeader(labels.compute.display, labels.compute.label, "table-compute"),
      getTableHeader(labels.write.display, labels.write.label, "table-write"),
      <Table.HeaderCell key="header-duration" />
    ]

    // sub-header
    tableSubHeader = [
      <Table.HeaderCell key="subheader-id">Task ID</Table.HeaderCell>,
      getTableSubHeader(labels.read.display),
      getTableSubHeader(labels.compute.display),
      getTableSubHeader(labels.write.display),
      <Table.HeaderCell key="subheader-duration">Task Duration</Table.HeaderCell>
    ]

    // tasks data
    tableRows = []
    tasksData.forEach(function(element) {
      // read
      let minRead = Number.MAX_SAFE_INTEGER
      let maxRead = 0.0
      if (element.read === null) {
        element.read = [{ start: 0, end: 0 }]
        minRead = element.compute.start
      }
      element.read.forEach(function(read) {
        minRead = Math.min(minRead, read.start)
        maxRead = Math.max(maxRead, read.end)
      })

      // read
      let minWrite = Number.MAX_SAFE_INTEGER
      let maxWrite = 0.0
      if (element.write === null) {
        element.write = [{ start: 0, end: 0 }]
        maxWrite = element.compute.end
      }
      element.write.forEach(function(write) {
        minWrite = Math.min(minWrite, write.start)
        maxWrite = Math.max(maxWrite, write.end)
      })

      let rowContents = [
        <Table.Cell key={element.task_id}>{element.task_id}</Table.Cell>,
        <Table.Cell key={element.task_id + "-read-start"} textAlign="right"
                    className="table-read">{minRead.toFixed(3)}</Table.Cell>,
        <Table.Cell key={element.task_id + "-read-end"} textAlign="right"
                    className="table-read">{maxRead.toFixed(3)}</Table.Cell>,
        <Table.Cell key={element.task_id + "-read-duration"} textAlign="right"
                    className="table-read">{(maxRead - minRead).toFixed(3)}</Table.Cell>,
        <Table.Cell key={element.task_id + "-compute-start"} textAlign="right"
                    className="table-compute">{element.compute.start.toFixed(3)}</Table.Cell>,
        <Table.Cell key={element.task_id + "-compute-end"} textAlign="right"
                    className="table-compute">{element.compute.end.toFixed(3)}</Table.Cell>,
        <Table.Cell key={element.task_id + "-compute-duration"} textAlign="right"
                    className="table-compute">{(element.compute.end - element.compute.start).toFixed(3)}</Table.Cell>,
        <Table.Cell key={element.task_id + "-write-start"} textAlign="right"
                    className="table-write">{minWrite.toFixed(3)}</Table.Cell>,
        <Table.Cell key={element.task_id + "-write-end"} textAlign="right"
                    className="table-write">{maxWrite.toFixed(3)}</Table.Cell>,
        <Table.Cell key={element.task_id + "-write-duration"} textAlign="right"
                    className="table-write">{(maxWrite - minWrite).toFixed(3)}</Table.Cell>,
        <Table.Cell key={element.task_id + "-duration"} textAlign="right">{(maxWrite - minRead).toFixed(3)}</Table.Cell>
      ]
      tableRows.push([
        <Table.Row key={element.task_id + "-row"}>
          {rowContents}
        </Table.Row>
      ])
    })
  }

  return (
    <>
      <Segment.Group>
        <Segment color="blue"><strong>Tasks Data</strong></Segment>
        <Segment className="task-data">
          <Table size="small" padded compact striped>
            <Table.Header fullWidth>
              <Table.Row>
                {tableHeader}
              </Table.Row>
              <Table.Row>
                {tableSubHeader}
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {tableRows}
            </Table.Body>
          </Table>
        </Segment>
      </Segment.Group>
    </>
  )
}

export default TasksData
