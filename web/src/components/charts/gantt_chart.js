import React from "react"
import { Bar } from "@iftek/react-chartjs-3"
import { Segment } from "semantic-ui-react"

/**
 *
 * @param taskIO
 * @returns {number[]}
 */
function processIO(taskIO) {
  let minStart = 0
  let maxEnd = 0

  if (taskIO && Object.keys(taskIO).length > 0) {
    minStart = Number.MAX_VALUE
    let ioKeys = Object.keys(taskIO)
    ioKeys.forEach(function(ioKey) {
      let tIO = taskIO[ioKey]
      minStart = Math.min(tIO.start.toFixed(3), minStart)
      maxEnd = Math.max(tIO.end.toFixed(3), maxEnd)
    })
  }
  return [minStart, maxEnd]
}

/**
 *
 * @param data
 * @param label
 * @returns {JSX.Element}
 * @constructor
 */
const GanttChart = ({ data, label = null }) => {

  let labels = label ? label : {
    read: { display: true, label: "Reading Input" },
    compute: { display: true, label: "Performing Computation" },
    write: { display: true, label: "Writing Output" }
  }

  let chartData = {}
  let options = {}

  if (data.workflow_execution) {
    const tasksData = data.workflow_execution.tasks

    chartData = {
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

    const colors = {
      read: "#469C76",
      compute: "#EEE461",
      write: "#6FB2E4"
    }

    let zoomMaxRange = 0

    Object.keys(tasksData).forEach(
      function(key) {
        let task = tasksData[key]
        chartData.labels.push(task.task_id)

        // read
        chartData.datasets[0].data.push(processIO(task.read))
        chartData.datasets[0].backgroundColor.push(colors.read)
        chartData.datasets[0].host.push(task.execution_host.hostname)

        // compute
        chartData.datasets[1].data.push([task.compute.start.toFixed(3), task.compute.end.toFixed(3)])
        chartData.datasets[1].backgroundColor.push(colors.compute)
        chartData.datasets[1].host.push(task.execution_host.hostname)

        // write
        chartData.datasets[2].data.push(processIO(task.write))
        chartData.datasets[2].backgroundColor.push(colors.write)
        chartData.datasets[2].host.push(task.execution_host.hostname)

        zoomMaxRange = Math.max(zoomMaxRange, task.whole_task.end)
      }
    )

    // parse labels
    let datasets = []
    if (labels.read.display) {
      datasets.push(chartData.datasets[0])
    }
    if (labels.compute.display) {
      datasets.push(chartData.datasets[1])
    }
    if (labels.write.display) {
      datasets.push(chartData.datasets[2])
    }
    chartData.datasets = datasets

    // zoom properties
    //let pluginsProperties = definePluginsProperties(zoom, zoomMaxRange);

    options = {
      indexAxis: "y",
      scales: {
        y: {
          stacked: true,
          reverse: true,
          title: {
            display: true,
            text: "Tasks ID"
          }
        },
        x: {
          title: {
            display: true,
            text: "Time (seconds)"
          }
        }
      },
      plugins: {
        tooltip: {
          position: "nearest",
          mode: "point",
          intersect: "false",
          callbacks: {
            label: function(context) {
              let value = context.formattedValue.replace("[", "").replace("]", "").split(", ")
              let runtime = value[1] - value[0]
              if (runtime > 0) {
                let label = context.dataset.label || ""
                if (label) {
                  label += ": " + runtime.toFixed(3) + "s"
                }
                return label
              }
              return ""
            },
            afterBody: function(context) {
              return ("Execution Host: " + context[0].dataset.host[context[0].dataIndex])
            }
          }
        }
      }
    }
  }

  return (
    <>
      <Segment.Group>
        <Segment color="yellow"><strong>Task Executions</strong></Segment>
        <Segment>
          <Bar type="bar" data={chartData} options={options} />
        </Segment>
      </Segment.Group>
    </>
  )
}

export default GanttChart
