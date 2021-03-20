import React, { useState, useEffect } from "react"
import Card from "react-bootstrap/Card"
import Accordion from "react-bootstrap/Accordion"
import Form from "react-bootstrap/Form"
import Col from "react-bootstrap/Col"
import Button from "react-bootstrap/Button"
import axios from "axios"
import ScriptTag from "react-script-tag"
import "./../pedagogic_modules.css"
import * as d3 from "d3"
import Chart from "chart.js"
import IOGanttChart from "../../../charts/io_gantt_chart"
import IOHostUtilizationChart from "../../../charts/io_host_utilization_chart"
//import { prepareResponseData } from "./../../../sims/scripts/util.js"

//const prepareResponseData = require("./../../../sims/scripts/util.js");

function processIO(taskIO) {
  let minStart = 0
  let maxEnd = 0

  if (taskIO && Object.keys(taskIO).length > 0) {
    minStart = Number.MAX_VALUE
    let ioKeys = Object.keys(taskIO)
    ioKeys.forEach(function (ioKey) {
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
        reverse: true,
      },
      scaleLabel: {
        display: true,
        labelString: "Tasks ID",
      },
    },
  ],
  xAxes: [
    {
      scaleLabel: {
        display: true,
        labelString: "Time (seconds)",
      },
    },
  ],
}

function fillEmptyValues(datasets, end, labels) {
  for (let i = datasets.length; i < end; i++) {
    datasets.push({
      data: [],
      backgroundColor: [],
      taskId: [],
      borderColor: "rgba(0, 0, 0, 0.3)",
      borderWidth: 1,
      barPercentage: 1.2,
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
  keys.forEach(function (key) {
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
        write: { display: true, label: "Writing Output" },
      }

  const colors = {
    read: "#cbb5dd",
    compute: "#f7daad",
    write: "#abdcf4",
  }

  // prepare data
  let data = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [],
        host: [],
        label: labels.read.label,
      },
      {
        data: [],
        backgroundColor: [],
        host: [],
        label: labels.compute.label,
      },
      {
        data: [],
        host: [],
        backgroundColor: [],
        label: labels.write.label,
      },
    ],
  }
  let zoomMaxRange = 0

  let keys = Object.keys(rawData.tasks)
  keys.forEach(function (key) {
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
          label: function (tooltipItem, data) {
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
          afterBody: function (tooltipItem, data) {
            return (
              "Execution Host: " +
              data.datasets[tooltipItem[0].datasetIndex].host[
                tooltipItem[0].index
              ]
            )
          },
        },
      },
      //,
      //plugins: pluginsProperties
    },
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
    datasets: [],
  }
  let zoomMaxRange = 0

  // obtain list of hosts
  let hosts = {}
  let keys = Object.keys(rawData.tasks)
  keys.forEach(function (key) {
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
        tasks: {},
      }
      for (let i = 0; i < task.execution_host.cores; i++) {
        hosts[task.execution_host.hostname].tasks[i] = []
      }
    }
  })

  // obtain additional hosts without tasks
  if (rawData.disk) {
    keys = Object.keys(rawData.disk)
    keys.forEach(function (key) {
      if (diskHostsList.length > 0 && !diskHostsList.includes(key)) {
        return
      }
      if (!(key in hosts)) {
        hosts[key] = {
          cores: 1,
          tasks: {},
        }
      }
    })
  }

  findTaskScheduling(rawData.tasks, hosts)

  // populate data
  keys = Object.keys(hosts)
  keys.forEach(function (key) {
    let host = hosts[key]

    // add disk operations
    if (
      (diskHostsList.length === 0 || diskHostsList.includes(key)) &&
      rawData.disk &&
      rawData.disk[key]
    ) {
      let mounts = Object.keys(rawData.disk[key])
      mounts.forEach(function (mount) {
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
      tasks.forEach(function (core) {
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
              reverse: true,
            },
          },
        ],
        xAxes: [
          {
            scaleLabel: {
              display: true,
              labelString: "Time (seconds)",
            },
          },
        ],
      },
      chartArea: {
        backgroundColor: "#FEF8F8",
      },
      legend: {
        display: false,
      },
      tooltips: {
        position: "nearest",
        mode: "point",
        intersect: "false",
        callbacks: {
          label: function (tooltipItem, data) {
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
          },
        },
      },
      //,
      //plugins: pluginsProperties,
    },
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
    network: links,
  }
}

function prepareData(data) {
  const nullReplacement = {
    start: 0,
    end: 0,
  }
  data.forEach(function (d) {
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
        write: { display: true, label: "Write Output" },
      }

  let tableContents = `
      <table class="task-details-table" id='${tableId}'>
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

  const TASK_DATA = Object.assign([], data).sort(function (lhs, rhs) {
    return parseInt(lhs.compute.start) - parseInt(rhs.compute.start)
  })

  TASK_DATA.forEach(function (task) {
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
      io_overlap: overlapAllowed,
    }

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
      //setChartInfo(generateChartInfo());
    )
    //.then(response => response.json())
    // .then(response => setSimulationOutput(response.data.simulation_output))
  }

  const handleClick = () => {
    const data = {
      email: localStorage.getItem("currentUser"),
      time: Math.floor(Date.now() / 1000),
      activity: "IO",
      num_tasks: numTasks,
      task_gflop: taskGflop,
      task_input: amountInput,
      task_output: amountOutput,
      io_overlap: overlapAllowed,
    }
    axios
      .post("http://localhost:3000/insert", data)
      .then(
        response => {
          console.log(response)
        },
        error => {
          console.log(error)
        }
      )
      .then(alert("Simulation executed"))
  }

  const handlePost = () => {
    // POST request using axios inside useEffect React hook
    const data = {
      email: localStorage.getItem("currentUser"),
      time: Math.floor(Date.now() / 1000),
      activity: "IO",
      num_tasks: numTasks,
      task_gflop: taskGflop,
      task_input: amountInput,
      task_output: amountOutput,
      io_overlap: overlapAllowed,
    }
    axios.post("http://localhost:3000/insert", data)
  }

  const handleNumTasks = e => {
    if (!isNaN(e.target.value) && e.target.value != 0) {
      setNumTasks(e.target.value)
    }
  }

  const handleTaskGflop = e => {
    if (!isNaN(e.target.value) && e.target.value != 0) {
      setTaskGflop(e.target.value)
    }
  }

  const handleAmountInput = e => {
    if (!isNaN(e.target.value) && e.target.value != 0) {
      setAmountInput(e.target.value)
    }
  }

  const handleAmountOutput = e => {
    if (!isNaN(e.target.value) && e.target.value != 0) {
      setAmountOutput(e.target.value)
    }
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
      <Card className="main">
        <Card.Body className="card">
          <div
            style={{
              height: 50,
              backgroundColor: "#d3834a",
              borderRadius: 10,
            }}
          >
            <h6
              style={{
                marginTop: 15,
                color: "white",
                backgroundColor: "#d3834a",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              <a id="objectives">Learning Objectives</a>
            </h6>
          </div>
          <br />
          <ul>
            <li>Understand the concept of IO</li>
            <li>Understand the impact of IO operations on computing</li>
            <li>
              Understand the basics of optimizing computation around IO
              operations
            </li>
          </ul>
          <hr></hr>
          <div
            style={{
              height: 50,
              backgroundColor: "#d3834a",
              borderRadius: 10,
            }}
          >
            <h6
              style={{
                marginTop: 15,
                color: "white",
                backgroundColor: "#d3834a",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              <a id="objectives">Simulating IO</a>
            </h6>
          </div>
          <br />
          <p className="card">
            So that you can gain hands-on experience with the above concepts,
            use the simulation app below.
          </p>
          <p className="card">
            Initially, you can create a series of identical tasks that have a
            certain input and output. Run the simulation to see the progression
            of tasks and host utilization without allowing IO to overlap with
            computation. Once you have observed this, try selecting the checkbox
            to allow overlap. With IO overlap there should be an improvement in
            execution time and host utilization. You can view this in the output
            graphs that are generated. You can also try varying the input/output
            and computation amounts to create IO-intensive or CPU-intensive
            tasks. Understanding which tasks will benefit from increased R/W or
            computation speeds will assist you in answering the questions to
            come.
          </p>
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
                              backgroundColor: "white",
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
                                    fontSize: "small",
                                  }}
                                >
                                  Host capable of 100 Gflops
                                </Form.Label>
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
                                    fontSize: "small",
                                  }}
                                >
                                  Disk reads at 100 MBps
                                </Form.Label>
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
                                    fontSize: "small",
                                  }}
                                >
                                  Disk writes at 100 MBps
                                </Form.Label>
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
                                color: "white",
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
                          backgroundColor: "white",
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
