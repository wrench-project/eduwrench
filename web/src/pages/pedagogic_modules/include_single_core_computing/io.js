import React, { useState, useEffect } from "react"
import Card from "react-bootstrap/Card"
import Accordion from "react-bootstrap/Accordion"
import Form from "react-bootstrap/Form"
import Col from "react-bootstrap/Col"
import Button from "react-bootstrap/Button"
import axios from "axios"
import ScriptTag from "react-script-tag"
import * as d3 from "d3"
import Chart from "chart.js"
import IOGanttChart from "../../../charts/io_gantt_chart"
import IOHostUtilizationChart from "../../../charts/io_host_utilization_chart"
import { StaticImage } from "gatsby-plugin-image"
//import { prepareResponseData } from "./../../../sims/scripts/util.js"

//const prepareResponseData = require("./../../../sims/scripts/util.js");

import { Divider, Header, Segment, Table } from "semantic-ui-react"
import TeX from "@matejmazur/react-katex"
import "./../pedagogic_modules.css"

import IOFigure1 from "../../../images/svgs/IO_figure_1.svg"
import IOFigure2 from "../../../images/svgs/IO_figure_2.svg"
import IOFigure3 from "../../../images/svgs/IO_figure_3.svg"
import IOFigure4 from "../../../images/svgs/IO_figure_4.svg"
import IOFigure5 from "../../../images/svgs/IO_figure_5.svg"


function processIO(taskIO) {
  let minStart = 0
  let maxEnd = 0

  if (taskIO && Object.keys(taskIO).length > 0) {
    minStart = Number.MAX_VALUE
    let ioKeys = Object.keys(taskIO)
    ioKeys.forEach(function(ioKey) {
      let tIO = taskIO[ioKey]
      minStart = Math.min(tIO.start, minStart)
      maxEnd = Math.max(tIO.end, maxEnd)
    })
  }
  return [minStart, maxEnd]
}

const ganttChartScales = {
  yAxes: [
    {
      stacked: true,
      ticks: {
        reverse: true
      },
      scaleLabel: {
        display: true,
        labelString: "Tasks ID"
      }
    }
  ],
  xAxes: [
    {
      scaleLabel: {
        display: true,
        labelString: "Time (seconds)"
      }
    }
  ]
}

function fillEmptyValues(datasets, end, labels) {
  for (let i = datasets.length; i < end; i++) {
    datasets.push({
      data: [],
      backgroundColor: [],
      taskId: [],
      borderColor: "rgba(0, 0, 0, 0.3)",
      borderWidth: 1,
      barPercentage: 1.2
    })
  }
  for (let i = 0; i < datasets.length; i++) {
    for (let j = datasets[i].data.length; j < labels.length - 1; j++) {
      datasets[i].data.push([0, 0])
      datasets[i].backgroundColor.push("")
      datasets[i].taskId.push("")
    }
  }
}

function ingestData(obj, start, end, color, id) {
  obj.data.push([start, end])
  obj.backgroundColor.push(color)
  obj.taskId.push(id)
}

function findTaskScheduling(data, hosts) {
  let keys = Object.keys(hosts)
  keys.forEach(function(key) {
    let hostTasks = []
    // obtaining sorted list of tasks by start time
    for (let i = 0; i < data.length; i++) {
      let task = data[i]
      if (task.execution_host.hostname === key) {
        let position = -1
        for (let j = 0; j < hostTasks.length; j++) {
          if (hostTasks[j].whole_task.start > task.whole_task.start) {
            position = j
            break
          }
        }
        if (hostTasks.length === 0 || position === -1) {
          hostTasks.push(task)
        } else {
          hostTasks.splice(position, 0, task)
        }
      }
    }
    // distributing tasks into cores
    let host = hosts[key]
    for (let i = 0; i < hostTasks.length; i++) {
      let task = hostTasks[i]
      for (let j = 0; j < host.cores; j++) {
        let inserted = false
        for (let k = 0; k < task.num_cores_allocated; k++) {
          if (k > 0) {
            j++
          }
          let tasks = host.tasks[j]
          if (tasks.length === 0) {
            tasks.push(task)
            inserted = true
          } else {
            let lastTask = tasks[tasks.length - 1]
            if (lastTask.whole_task.end <= task.whole_task.start) {
              tasks.push(task)
              inserted = true
            }
          }
        }
        if (inserted) {
          break
        }
      }
    }
  })
}

/**
 * Generates the gantt chart.
 *
 * @param rawData: simulation data
 * @param containedId: id for the chart container element
 * @param zoom: whether to allow zoom functionality in the chart
 * @param label: labels to be displayed
 */
function generateGanttChartInfo(
  rawData,
  containedId = null,
  zoom = true,
  label = null
) {
  const containerId = containedId ? containedId : "graph-container"

  let labels = label
    ? label
    : {
      read: { display: true, label: "Reading Input" },
      compute: { display: true, label: "Performing Computation" },
      write: { display: true, label: "Writing Output" }
    }

  const colors = {
    read: "#cbb5dd",
    compute: "#f7daad",
    write: "#abdcf4"
  }

  // prepare data
  let data = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [],
        host: [],
        label: labels.read.label
      },
      {
        data: [],
        backgroundColor: [],
        host: [],
        label: labels.compute.label
      },
      {
        data: [],
        host: [],
        backgroundColor: [],
        label: labels.write.label
      }
    ]
  }
  let zoomMaxRange = 0

  let keys = Object.keys(rawData.tasks)
  keys.forEach(function(key) {
    let task = rawData.tasks[key]
    data.labels.push(task.task_id)

    // read
    data.datasets[0].data.push(processIO(task.read))
    data.datasets[0].backgroundColor.push(colors.read)
    data.datasets[0].host.push(task.execution_host.hostname)

    // compute
    data.datasets[1].data.push([task.compute.start, task.compute.end])
    data.datasets[1].backgroundColor.push(colors.compute)
    data.datasets[1].host.push(task.execution_host.hostname)

    // write
    data.datasets[2].data.push(processIO(task.write))
    data.datasets[2].backgroundColor.push(colors.write)
    data.datasets[2].host.push(task.execution_host.hostname)

    zoomMaxRange = Math.max(zoomMaxRange, task.whole_task.end)
  })

  // parse labels
  let datasets = []
  if (labels.read.display) {
    datasets.push(data.datasets[0])
  }
  if (labels.compute.display) {
    datasets.push(data.datasets[1])
  }
  if (labels.write.display) {
    datasets.push(data.datasets[2])
  }

  data.datasets = datasets

  // zoom properties
  //let pluginsProperties = definePluginsProperties(zoom, zoomMaxRange);

  // ganttChart = new Chart(ctx
  //   ,
  return {
    type: "horizontalBar",
    data: data,
    options: {
      scales: ganttChartScales,
      tooltips: {
        position: "nearest",
        mode: "point",
        intersect: "false",
        callbacks: {
          label: function(tooltipItem, data) {
            let value = tooltipItem.value
              .replace("[", "")
              .replace("]", "")
              .split(", ")
            let runtime = value[1] - value[0]
            if (runtime > 0) {
              let label = data.datasets[tooltipItem.datasetIndex].label || ""
              if (label) {
                label += ": " + runtime.toFixed(3) + "s"
              }
              return label
            }
            return ""
          },
          afterBody: function(tooltipItem, data) {
            return (
              "Execution Host: " +
              data.datasets[tooltipItem[0].datasetIndex].host[
                tooltipItem[0].index
                ]
            )
          }
        }
      }
      //,
      //plugins: pluginsProperties
    }
  }
  //);
}

/**
 * Generates the host utilization chart
 *
 * @param rawData: simulation data
 * @param containedId: id for the chart container element
 * @param hostsList: list of host names in which compute tasks will be displayed (empty list displays all hosts)
 * @param diskHostsList: list of host names in which the disk usage will be displayed (empty list displays all hosts)
 * @param zoom: whether to allow zoom functionality in the chart
 * @param operations: type of operations to be shown ('all', 'compute', 'io', 'write', 'read')
 */
function generateHostUtilizationChartInfo(
  rawData,
  containedId = null,
  hostsList = [],
  diskHostsList = [],
  zoom = true,
  operations = "all"
) {
  // clean chart
  //if (hostUtilizationChart !== null) {
  //  hostUtilizationChart.destroy()
  //}

  const containerId = containedId ? containedId : "host-utilization-chart"
  let ctx = document.getElementById(containerId)

  // prepare data
  let data = {
    labels: [],
    datasets: []
  }
  let zoomMaxRange = 0

  // obtain list of hosts
  let hosts = {}
  let keys = Object.keys(rawData.tasks)
  keys.forEach(function(key) {
    let task = rawData.tasks[key]
    if (
      hostsList.length > 0 &&
      !hostsList.includes(task.execution_host.hostname)
    ) {
      return
    }
    if (!(task.execution_host.hostname in hosts)) {
      hosts[task.execution_host.hostname] = {
        cores: task.execution_host.cores,
        tasks: {}
      }
      for (let i = 0; i < task.execution_host.cores; i++) {
        hosts[task.execution_host.hostname].tasks[i] = []
      }
    }
  })

  // obtain additional hosts without tasks
  if (rawData.disk) {
    keys = Object.keys(rawData.disk)
    keys.forEach(function(key) {
      if (diskHostsList.length > 0 && !diskHostsList.includes(key)) {
        return
      }
      if (!(key in hosts)) {
        hosts[key] = {
          cores: 1,
          tasks: {}
        }
      }
    })
  }

  findTaskScheduling(rawData.tasks, hosts)

  // populate data
  keys = Object.keys(hosts)
  keys.forEach(function(key) {
    let host = hosts[key]

    // add disk operations
    if (
      (diskHostsList.length === 0 || diskHostsList.includes(key)) &&
      rawData.disk &&
      rawData.disk[key]
    ) {
      let mounts = Object.keys(rawData.disk[key])
      mounts.forEach(function(mount) {
        let diskMounts = rawData.disk[key]

        // read operations
        if (diskMounts[mount].reads) {
          data.labels.push(key + " (mount: " + mount + " - reads)")
          fillEmptyValues(
            data.datasets,
            diskMounts[mount].reads.length,
            data.labels
          )
          let index = 0
          for (let i = 0; i < diskMounts[mount].reads.length; i++) {
            let operation = diskMounts[mount].reads[i]
            ingestData(
              data.datasets[i],
              operation.start,
              operation.end,
              "#77dd91",
              "read"
            )
          }
        }

        // write operations
        if (diskMounts[mount].writes) {
          data.labels.push(key + " (mount: " + mount + " - writes)")
          fillEmptyValues(
            data.datasets,
            diskMounts[mount].writes.length,
            data.labels
          )
          for (let i = 0; i < diskMounts[mount].writes.length; i++) {
            let operation = diskMounts[mount].writes[i]
            ingestData(
              data.datasets[i],
              operation.start,
              operation.end,
              "#8bb7e2",
              "write"
            )
          }
        }
      })
    }

    // add compute tasks
    if (hostsList.length === 0 || hostsList.includes(key)) {
      let tasks = Object.keys(host.tasks)
      tasks.forEach(function(core) {
        let coreTasks = host.tasks[core]
        data.labels.push(key + " (core #" + core + ")")
        // filling empty values
        fillEmptyValues(
          data.datasets,
          coreTasks.length,
          data.labels
          //(percentage = 1.2)
        )
        for (let i = 0; i < coreTasks.length; i++) {
          let task = coreTasks[i]
          ingestData(
            data.datasets[i],
            task.compute.start,
            task.compute.end,
            task.color || "#f7daad",
            task.task_id
          )
          zoomMaxRange = Math.max(zoomMaxRange, task.compute.end)
        }
      })
    }
  })

  // zoom properties
  //let pluginsProperties = definePluginsProperties(zoom, zoomMaxRange)

  return {
    type: "horizontalBar",
    data: data,
    options: {
      scales: {
        yAxes: [
          {
            stacked: true,
            ticks: {
              reverse: true
            }
          }
        ],
        xAxes: [
          {
            scaleLabel: {
              display: true,
              labelString: "Time (seconds)"
            }
          }
        ]
      },
      chartArea: {
        backgroundColor: "#FEF8F8"
      },
      legend: {
        display: false
      },
      tooltips: {
        position: "nearest",
        mode: "point",
        intersect: "false",
        callbacks: {
          label: function(tooltipItem, data) {
            let value = tooltipItem.value
              .replace("[", "")
              .replace("]", "")
              .split(", ")
            let runtime = value[1] - value[0]
            if (runtime > 0) {
              let label =
                data.datasets[tooltipItem.datasetIndex].taskId[
                  tooltipItem.index
                  ] || ""
              if (label) {
                label += ": " + runtime.toFixed(3) + "s"
              }
              return label
            }
            return ""
          }
        }
      }
      //,
      //plugins: pluginsProperties,
    }
  }
}

/**
 *
 * @param responseData
 * @returns {{disk: *, contents: {}, tasks: {}, network: (*|*[])}}
 */
function prepareResponseData(responseData) {
  let links = responseData.link_usage ? responseData.link_usage.links : []
  console.log(responseData)
  return {
    tasks: responseData.workflow_execution.tasks,
    disk: responseData.disk_operations,
    contents: responseData.workflow_execution.tasks, // TODO: remove
    network: links
  }
}

function prepareData(data) {
  const nullReplacement = {
    start: 0,
    end: 0
  }
  data.forEach(function(d) {
    if (d.read === null) {
      d.read = [nullReplacement]
    }
    if (d.compute === null) {
      d.compute = nullReplacement
    }
    if (d.write === null) {
      d.write = [nullReplacement]
    }
  })
  return data
}

const getDuration = (d, section) => {
  if (section === "read" || section === "write") {
    let total = 0
    if (d[section] !== null) {
      d[section].forEach(t => {
        total += t.end - t.start
      })
    }
    return total
  } else if (section === "compute" || section === "whole_task") {
    if (d[section].start === -1) {
      return 0
    } else if (d[section].end === -1) {
      if (d.terminated === -1) {
        return d.failed - d[section].start
      } else if (d.failed === -1) {
        return d.terminated - d[section].start
      }
    } else {
      return d[section].end - d[section].start
    }
  }
}

const toFiveDecimalPlaces = d3.format(".3f")

function convertToTableFormat(d, section, property) {
  let metric = 0
  if (section === "read" || section === "write") {
    metric = property === "start" ? Number.MAX_VALUE : 0
    for (var i in d[section]) {
      metric =
        property === "start"
          ? d[section][i][property] < metric
          ? d[section][i][property]
          : metric
          : d[section][i][property] > metric
          ? d[section][i][property]
          : metric
    }
  } else {
    metric = d[section][property]
    if (metric === -1) {
      if (d.failed !== -1) {
        return "Failed"
      }
      if (d.terminated !== -1) {
        return "Terminated"
      }
    }
  }
  return toFiveDecimalPlaces(metric)
}

/**
 *
 * @param data
 * @param tableID
 * @param label
 */
function populateWorkflowTaskDataTable(data, tableID = null, label = null) {
  let tableId = tableID ? tableID : "task-details-table"
  const tableBodyId = tableId + "-body"
  const tdClass = "task-details-td"

  let labels = label
    ? label
    : {
      read: { display: true, label: "Read Input" },
      compute: { display: true, label: "Computation" },
      write: { display: true, label: "Write Output" }
    }

  let tableContents = `
      <table class="task-details-table" id="${tableId}">
          <colgroup>
              <col span="1"></col>`

  if (labels.read.display) {
    tableContents += `<col span="3" class="read-col"></col>`
  }
  if (labels.compute.display) {
    tableContents += `<col span="3" class="compute-col"></col>`
  }
  if (labels.write.display) {
    tableContents += `<col span="3" class="write-col"></col>`
  }

  tableContents += `
              <col span="1"></col>
          </colgroup>
          <thead class="${tableId}">
              <tr>
                  <td></td>`

  if (labels.read.display) {
    tableContents +=
      `<td colspan="3" style="background-color:powderblue; width:60%;" class="text-center ${tdClass}">` +
      labels.read.label +
      `</td>`
  }
  if (labels.compute.display) {
    tableContents +=
      `<td colspan="3" style="background-color:lightsalmon; width:60%;" class="text-center ${tdClass}">` +
      labels.compute.label +
      `</td>`
  }
  if (labels.write.display) {
    tableContents +=
      `<td colspan="3" style="background-color:palegreen; width:60%;" class="text-center ${tdClass}">` +
      labels.write.label +
      `</td>`
  }

  tableContents += `                  
                  <td></td>
              </tr>
              <tr>
                  <th scope="col" class="task-details-table-header">TaskID</th>`

  if (labels.read.display) {
    tableContents += `
          <th scope="col" class="task-details-table-header">Start Time</th>
          <th scope="col" class="task-details-table-header">End Time</th>
          <th scope="col" class="task-details-table-header">Duration</th>`
  }
  if (labels.compute.display) {
    tableContents += `
          <th scope="col" class="task-details-table-header">Start Time</th>
          <th scope="col" class="task-details-table-header">End Time</th>
          <th scope="col" class="task-details-table-header">Duration</th>`
  }
  if (labels.write.display) {
    tableContents += `
          <th scope="col" class="task-details-table-header">Start Time</th>
          <th scope="col" class="task-details-table-header">End Time</th>
          <th scope="col" class="task-details-table-header">Duration</th>`
  }
  tableContents += `        
                  <th scope="col" class="task-details-table-header">Task Duration</th>
              </tr>
          </thead>
  
          <tbody class="task-details-table" id="${tableBodyId}">
          </tbody>
      </table >`

  document.getElementById(tableId).innerHTML = tableContents

  d3.select(`#${tableId}`).style("display", "block")

  let task_details_table_body = d3.select(`#${tableBodyId}`)

  const TASK_DATA = Object.assign([], data).sort(function(lhs, rhs) {
    return parseInt(lhs.compute.start) - parseInt(rhs.compute.start)
  })

  TASK_DATA.forEach(function(task) {
    let task_id = task["task_id"]

    let read_start = convertToTableFormat(task, "read", "start")
    let read_end = convertToTableFormat(task, "read", "end")
    let read_duration = toFiveDecimalPlaces(getDuration(task, "read"))

    let compute_start = convertToTableFormat(task, "compute", "start")
    let compute_end = convertToTableFormat(task, "compute", "end")
    let compute_duration = toFiveDecimalPlaces(getDuration(task, "compute"))

    let write_start = convertToTableFormat(task, "write", "start")
    let write_end = convertToTableFormat(task, "write", "end")
    let write_duration = toFiveDecimalPlaces(getDuration(task, "write"))

    let task_duration = toFiveDecimalPlaces(getDuration(task, "whole_task"))

    if (Number.isNaN(task_duration)) {
      task_duration = Math.abs(task_duration)
    }

    let tr = task_details_table_body.append("tr").attr("id", task_id)
    tr.append("td").html(task_id).attr("class", tdClass)

    if (labels.read.display) {
      tr.append("td").html(read_start).attr("class", tdClass)
      tr.append("td").html(read_end).attr("class", tdClass)
      tr.append("td").html(read_duration).attr("class", tdClass)
    }

    if (labels.compute.display) {
      tr.append("td").html(compute_start).attr("class", tdClass)
      tr.append("td").html(compute_end).attr("class", tdClass)
      tr.append("td").html(compute_duration).attr("class", tdClass)
    }

    if (labels.write.display) {
      tr.append("td").html(write_start).attr("class", tdClass)
      tr.append("td").html(write_end).attr("class", tdClass)
      tr.append("td").html(write_duration).attr("class", tdClass)
    }

    tr.append("td").html(task_duration).attr("class", tdClass)
  })
}

const IO = () => {
  const [auth, setAuth] = useState("false")
  const [test, setTest] = useState([])

  const [numTasks, setNumTasks] = useState(1)
  const [taskGflop, setTaskGflop] = useState(100)
  const [amountInput, setAmountInput] = useState(1)
  const [amountOutput, setAmountOutput] = useState(1)
  const [overlapAllowed, setOverlapAllowed] = useState(false)
  const [numTasksError, setNumTasksError] = useState("")
  const [taskGflopError, setTaskGflopError] = useState("")
  const [amountInputError, setAmountInputError] = useState("")
  const [amountOutputError, setAmountOutputError] = useState("")
  const [simulationOutput, setSimulationOutput] = useState("")
  const [simulationExecuted, setSimulationExecuted] = useState(false)
  const [ganttChartInfo, setGanttChartInfo] = useState({})
  const [hostUtilizationChartInfo, setHostUtilizationChartInfo] = useState({})

  useEffect(() => {
    const authenticated = localStorage.getItem("login")
    setAuth(authenticated)
  })

  const runSimulation = () => {
    const userEmail = localStorage.getItem("currentUser")
    const data = {
      userName: userEmail.split("@")[0],
      email: userEmail,
      num_tasks: numTasks,
      task_gflop: taskGflop,
      task_input: amountInput,
      task_output: amountOutput,
      io_overlap: overlapAllowed
    }

    let errorsPresent = false

    if (!numTasks || numTasks < 1 || numTasks > 100) {
      errorsPresent = true
      setNumTasksError(
        "Please provide the number of tasks in the range of [1, 100]."
      )
    } else {
      setNumTasksError("")
    }

    if (!taskGflop || taskGflop < 1 || taskGflop > 999999) {
      errorsPresent = true
      setTaskGflopError(
        "Please provide the amount of Gflop per task in the range of [1, 999999]."
      )
    } else {
      setTaskGflopError("")
    }

    if (!amountInput || amountInput < 1 || amountInput > 999) {
      errorsPresent = true
      setAmountInputError(
        "Please provide the amount of input data per task in the range of [0, 999] MB."
      )
    } else {
      setAmountInputError("")
    }

    if (!amountOutput || amountOutput < 1 || amountOutput > 999) {
      errorsPresent = true
      setAmountOutputError(
        "Please provide the amount of output data per task in the range of [0, 999] MB."
      )
    } else {
      setAmountOutputError("")
    }

    if (!errorsPresent) {
      // console.log(data);
      axios.post("http://localhost:3000/run/io_operations", data).then(
        response => {
          //console.log(response.data.simulation_output)
          let executionData = prepareResponseData(response.data.task_data)
          //console.log(executionData)
          let ganttChartInfo = generateGanttChartInfo(
            executionData,
            "io-graph-container"
          )
          let hostUtilizationChartInfo = generateHostUtilizationChartInfo(
            executionData,
            "io-host-utilization-chart",
            [],
            [],
            false
          )
          //console.log(ganttChartInfo)
          setGanttChartInfo(ganttChartInfo)
          setHostUtilizationChartInfo(hostUtilizationChartInfo)
          setSimulationOutput(
            response.data.simulation_output.replace(/\s*\<.*?\>\s*/g, "@")
          )
          let preparedData = prepareData(
            response.data.task_data.workflow_execution.tasks
          )
          populateWorkflowTaskDataTable(preparedData, "io-task-details-table")
          setSimulationExecuted(true)
          alert("Simulation executed")
        },
        error => {
          console.log(error)
          alert("Error executing simulation")
        }
      )
    }
  }

  const handleNumTasks = e => {
    setNumTasks(e.target.value)
  }

  const handleTaskGflop = e => {
    setTaskGflop(e.target.value)
  }

  const handleAmountInput = e => {
    setAmountInput(e.target.value)
  }

  const handleAmountOutput = e => {
    setAmountOutput(e.target.value)
  }

  const handleOverlapAllowed = e => {
    setOverlapAllowed(e.target.checked)
  }

  const SimulationOutputPretty = () => {
    const output = simulationOutput.split("@")
    const elements = output.map(line => <p className="card">{line}</p>)

    return (
      <div style={{ color: "#a129ab" }} className="card">
        {elements}
      </div>
    )
  }

  return (
    <>
      <Segment.Group className="objectives">
        <Segment inverted><strong>Learning Objectives</strong></Segment>
        <Segment style={{ backgroundColor: "#fafafa" }}>
          <ul style={{ backgroundColor: "#fafafa" }}>
            <li>Understand the concept of IO</li>
            <li>Understand the impact of IO operations on computing</li>
            <li>Understand the basics of optimizing computation around IO operations</li>
          </ul>
        </Segment>
      </Segment.Group>

      <h2>Basic Concepts</h2>

      <p>
        A computer typically does not run a program start to finish in a vacuum. Programs often need to
        consume <strong>I</strong>nput and produce <strong>O</strong>utput, which is done by executing <strong>IO
        operations</strong>. A couple of very common IO operations are reading from disk and writing to disk. As the
        disk is much slower than the CPU, even small disk reads or writes can represent a large (from the CPU’s
        perspective) chunk of time during which the CPU is sitting idle.
      </p>

      <p>
        When it comes to IO operations, not all programs are created equal. Some programs will require more IO time than
        others. In fact, programs are typically categorized as IO- or CPU-intensive. If a program spends more time
        performing IO operations than CPU operations, it is said to be <i>IO-intensive</i>. If the situation is
        reversed, the program is said to be <i>CPU-intensive</i>. For instance, a program that reads a large jpeg image
        from disk, reduces the brightness of every pixel (to make the image darker), and writes the modified image to
        disk is IO-intensive on most standard computers (a lot of data to read/write from/to disk, and very quick
        computation on this data – in this case perhaps just a simple subtraction). By contrast, a program that instead
        of reducing the brightness of the image applies an oil painting filter to it will most likely be CPU-intensive
        (applying an oil painting filter entails many, many more computations than a simple subtraction).
      </p>

      <p>
        As mentioned above, reading from and writing to the disk are slow operations compared to the CPU. Typically,
        there is a difference between read and write speeds as well. Reading is typically significantly faster than
        writing. Furthermore, different kinds of disks have different speeds as well. The table below shows advertised
        read and write speeds for two mass-market SATA disks, a Hard Disk Drive (HDD) and a Solid State Drive (SSD), at
        the time this content is being written:
      </p>

      <Table collapsing>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Disk</Table.HeaderCell>
            <Table.HeaderCell>Read Bandwidth</Table.HeaderCell>
            <Table.HeaderCell>Write Bandwidth</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell>WD HDD (10EZEX)</Table.Cell>
            <Table.Cell>160 MB/sec</Table.Cell>
            <Table.Cell>143 MB/sec</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>Samsung 860 EVO</Table.Cell>
            <Table.Cell>550 MB/sec</Table.Cell>
            <Table.Cell>520 MB/sec</Table.Cell>
          </Table.Row>
        </Table.Body>
        <Table.Footer>
          <Table.Row>
            <Table.HeaderCell colSpan="3">
              The read and write speeds are often referred to as <strong>bandwidths</strong>. The units above is MB/sec
              (MegaByte per second), which is also written as MBps.
            </Table.HeaderCell>
          </Table.Row>
        </Table.Footer>
      </Table>

      <p>
        Determining the exact bandwidth that disk reads and writes will experience during program execution is actually
        difficult (due to the complexity of the underlying hardware and software, and due to how the data is stored and
        accessed on the disk). In this module, we will always assume that disk bandwidths are constant.
      </p>

      <h2>A Program with Computation and IO</h2>

      <p>
        Let us consider a program that performs a task in three phases. First, it reads data from disk. Second, it
        performs some computation on that data to create new data. And third, it writes the new data back to disk. This
        could be one of the image processing programs mentioned in the previous section as examples. If this program is
        invoked to process two images, i.e., so that it performs two tasks, then its execution timeline is as depicted
        below:
      </p>

      <IOFigure1 />
      <div className="caption"><strong>Figure 1:</strong> Example execution timeline.</div>

      <p>
        As can be seen in the figure, at any given time either the CPU is idle (while IO operations are ongoing) or the
        disk is idle (while computation is ongoing). In the above figure, reading an image from disk takes 1 second,
        writing an image to disk takes 1 second, and processing an image takes 2 seconds. (We can thus infer that the
        two images have the same size, and that the disk has identical read and write bandwidths). We can compute the
        CPU Utilization as follows:
      </p>

      <TeX block math="\text{CPU Utilization}  = \frac{T_{Compute}}{T_{Compute} + T_{Idle}} = \frac{4}{4 + 4} = 0.5" />

      <p>
        This means that the CPU is idle for half of the execution of the program. This program is perfectly balanced,
        i.e., it is neither CPU-intensive nor IO-intensive.
      </p>

      <h2>Overlapping computation and IO</h2>

      <p>
        The execution in the previous section can be improved. This is because <strong>the CPU and the disk are two
        different hardware components, and they can work at the same time</strong>. As a result, while the CPU is
        processing the 1st image, the 2nd image could be read from disk! The CPU can then start processing the 2nd image
        right away after it finishes processing the 1st image. The 1st image can be written to disk at the same time.
        This execution is depicted below:
      </p>

      <IOFigure2 />
      <div className="caption"><strong>Figure 2:</strong> Example execution timeline with overlap of IO and computation.
      </div>

      <p>
        The total execution time has dropped by 2 seconds <strong>and</strong> the CPU utilization is increased:
      </p>

      <TeX block math="\text{CPU Utilization} = \frac{T_{Compute}}{T_{Compute} + T_{Idle}} = \frac{4}{4 + 2} = 0.66" />

      <p>
        If there were additional, similar images to process, the CPU utilization would continue to drop as it would be
        idle only at the very beginning and at the very end of the execution.
      </p>

      <p>
        The above is an ideal situation because IO time for an image is exactly equal to compute time. More precisely,
        save for the first and last task, <i>while the program computes task <TeX math="i" /> there is enough time to
        write the output of task <TeX math="i-1" /> and to read the input of task <TeX math="i+1" /></i>.
      </p>

      <p>
        If the above condition does not hold, then there is necessarily CPU idle time. For instance, if the time to read
        an image is instead 2s (for instance because the program reads larger images but writes back down-scaled images)
        and the program must process 3 images, then the execution would be as:
      </p>

      <IOFigure3 />
      <div className="caption"><strong>Figure 3:</strong> Example execution timeline with overlap of IO and computation.
      </div>

      <p>
        As expected, the program first reads 2 images, and then alternates write and read operations while CPU
        computation is going on. But in this case, the CPU experiences idle time because images cannot be read from disk
        fast enough. So although overlapping IO and computation almost always reduces program execution time, the
        benefit can vary based on IO and computation volumes (and especially if these volumes vary from task to task!).
      </p>

      <Divider />

      <h2>Practical concerns</h2>

      <p>
        In practice, one can implement a program that overlaps IO and computation. This can be done by using
        non-blocking IO operations and/or threads. These are techniques that are described in Operating Systems
        <a href="/textbooks">textbooks</a>. The overlap may not be completely "free", as reading/writing data from disk
        can still require the CPU to perform some computation. Therefore, there can be time-sharing of the CPU between
        the IO operations and the computation, and the computation is slowed down a little bit by the IO operations
        (something we did not show in the figures above). This said, there are ways for IO operations to use almost no
        CPU cycles. One such technique, which relies on specific but commonplace hardware, is called Direct Memory
        Access (DMA). See Operating Systems <a href="/textbooks">textbooks</a> for more details.
      </p>

      <p>
        Another practical concern is RAM pressure. When going from the example execution in Figure 1 to that in Figure
        2, the peak amount of RAM needed by the program is increased because at some point more than one input images
        are held in RAM. Since tasks could have significant memory requirements, RAM constrains can prevent some overlap
        of IO and computation.
      </p>

      <Header as="h3" block>
        Simulating IO
      </Header>

      <p>
        So that you can gain hands-on experience with the above concepts, use the simulation app below.
      </p>

      <p>
        Initially, you can create a series of identical tasks that have a certain input and output. Run the simulation
        to see the progression of tasks and host utilization without allowing IO to overlap with computation. Once you
        have observed this, try selecting the checkbox to allow overlap. With IO overlap there should be an improvement
        in execution time and host utilization. You can view this in the output graphs that are generated. You can also
        try varying the input/output and computation amounts to create IO-intensive or CPU-intensive tasks.
        Understanding which tasks will benefit from increased R/W or computation speeds will assist you in answering the
        questions to come.
      </p>

      <IOFigure4 />
      <IOFigure5 />


      <Card className="main">
        <Card.Body className="card">

          <Accordion>
            <Card>
              <Accordion.Toggle as={Card.Header} eventKey="0">
                (Open Simulator Here)
              </Accordion.Toggle>
              <Accordion.Collapse eventKey="0">
                <Card.Body className="card">
                  {auth === "true" ? (
                    <div>
                      <Card className="card">
                        <Card.Body className="card">
                          <Card.Title className="card">
                            Simulation Scenario
                          </Card.Title>
                          <hr></hr>
                          <img
                            src={require("../../../sim_images/io_task.svg")}
                            height="300"
                            style={{
                              backgroundColor: "white"
                            }}
                            alt="eduWRENCH logo"
                          />
                        </Card.Body>
                      </Card>
                      <Card className="card">
                        <Card.Body className="card">
                          <Card.Title className="card">
                            Enter Simulation Parameters
                          </Card.Title>
                          <hr></hr>
                          <Form style={{ backgroundColor: "white" }}>
                            <Form.Row style={{ backgroundColor: "white" }}>
                              <Form.Group
                                as={Col}
                                controlId="numTasks"
                                style={{ backgroundColor: "white" }}
                              >
                                <Form.Label
                                  style={{ backgroundColor: "white" }}
                                >
                                  Number of Tasks
                                </Form.Label>
                                <Form.Control
                                  style={{ backgroundColor: "white" }}
                                  type="number"
                                  defaultValue={numTasks}
                                  onChange={handleNumTasks}
                                />
                                <small className="error">{numTasksError}</small>
                              </Form.Group>
                              <Form.Group
                                as={Col}
                                controlId="taskGflop"
                                style={{ backgroundColor: "white" }}
                              >
                                <Form.Label
                                  style={{ backgroundColor: "white" }}
                                >
                                  Task Gflop
                                </Form.Label>
                                <Form.Control
                                  type="Number"
                                  defaultValue={taskGflop}
                                  style={{ backgroundColor: "white" }}
                                  onChange={handleTaskGflop}
                                />
                                <Form.Label
                                  style={{
                                    backgroundColor: "white",
                                    color: "grey",
                                    fontSize: "small"
                                  }}
                                >
                                  Host capable of 100 Gflops
                                </Form.Label>
                                <br />
                                <small className="error">
                                  {taskGflopError}
                                </small>
                              </Form.Group>
                            </Form.Row>
                            <Form.Row style={{ backgroundColor: "white" }}>
                              <Form.Group
                                as={Col}
                                controlId="amountInput"
                                style={{ backgroundColor: "white" }}
                              >
                                <Form.Label
                                  style={{ backgroundColor: "white" }}
                                >
                                  Amount of Task Input Data
                                </Form.Label>
                                <Form.Control
                                  type="number"
                                  defaultValue={amountInput}
                                  style={{ backgroundColor: "white" }}
                                  onChange={handleAmountInput}
                                />
                                <Form.Label
                                  style={{
                                    backgroundColor: "white",
                                    color: "grey",
                                    fontSize: "small"
                                  }}
                                >
                                  Disk reads at 100 MBps
                                </Form.Label>
                                <br />
                                <small className="error">
                                  {amountInputError}
                                </small>
                              </Form.Group>
                              <Form.Group
                                as={Col}
                                controlId="amountOutput"
                                style={{ backgroundColor: "white" }}
                              >
                                <Form.Label
                                  style={{ backgroundColor: "white" }}
                                >
                                  Amount of Task Output Data
                                </Form.Label>
                                <Form.Control
                                  type="Number"
                                  defaultValue={amountOutput}
                                  style={{ backgroundColor: "white" }}
                                  onChange={handleAmountOutput}
                                />
                                <Form.Label
                                  style={{
                                    backgroundColor: "white",
                                    color: "grey",
                                    fontSize: "small"
                                  }}
                                >
                                  Disk writes at 100 MBps
                                </Form.Label>
                                <br />
                                <small className="error">
                                  {amountOutputError}
                                </small>
                              </Form.Group>
                            </Form.Row>
                            <Form.Row style={{ backgroundColor: "white" }}>
                              <Form.Group style={{ backgroundColor: "white" }}>
                                <Form.Check
                                  custom
                                  className="check"
                                  style={{ backgroundColor: "white" }}
                                  type="checkbox"
                                  id="overlap"
                                  label="IO Overlap Allowed (Computation and IO can take place concurrently)"
                                  onChange={handleOverlapAllowed}
                                  checked={overlapAllowed}
                                />
                              </Form.Group>
                            </Form.Row>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                backgroundColor: "white",
                                color: "white"
                              }}
                            >
                              <Button onClick={runSimulation}>
                                Run Simulation
                              </Button>
                            </div>
                          </Form>
                        </Card.Body>
                      </Card>
                      <Card className="card">
                        <Card.Body className="card">
                          <Card.Title className="card">
                            Simulation Output
                          </Card.Title>
                          <hr></hr>
                          <SimulationOutputPretty></SimulationOutputPretty>
                        </Card.Body>
                      </Card>
                      <Card className="card">
                        <Card.Body className="card">
                          <Card.Title className="card">
                            Task Executions
                          </Card.Title>
                          <hr></hr>
                          {simulationExecuted && (
                            <IOGanttChart chartInfo={ganttChartInfo} />
                          )}
                        </Card.Body>
                      </Card>
                      <Card className="card">
                        <Card.Body className="card">
                          <Card.Title className="card">
                            Host Utilization
                          </Card.Title>
                          <hr></hr>
                          {simulationExecuted && (
                            <IOHostUtilizationChart
                              chartInfo={hostUtilizationChartInfo}
                            />
                          )}
                        </Card.Body>
                      </Card>
                      <Card className="card">
                        <Card.Body className="card">
                          <Card.Title className="card">Task Data</Card.Title>
                          <hr></hr>
                          <div
                            style={{ backgroundColor: "white" }}
                            id="io-task-details-table"
                          ></div>
                        </Card.Body>
                      </Card>
                    </div>
                  ) : (
                    <div className="card">
                      <img
                        src={require("../../../images/wrench_logo.png")}
                        width="40"
                        height="40"
                        style={{
                          backgroundColor: "white"
                        }}
                        alt="eduWRENCH logo"
                      />
                      <h4 className="card" style={{ color: "grey" }}>
                        {" "}
                        eduWRENCH Pedagogic Module Simulator
                      </h4>
                      <p className="card">
                        <b className="card">
                          Sign in on the top of the page to access the
                          simulator.
                        </b>
                      </p>
                    </div>
                  )}
                </Card.Body>
              </Accordion.Collapse>
            </Card>
          </Accordion>
        </Card.Body>
      </Card>
    </>
  )
}

export default IO
