import React, { Component, useState, useEffect } from "react"
import { Bar } from "react-chartjs-2"
import { Segment } from "semantic-ui-react"

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

const GanttChart = ({ data, label = null }) => {

  let labels = label ? label : {
    read: { display: true, label: "Reading Input" },
    compute: { display: true, label: "Performing Computation" },
    write: { display: true, label: "Writing Output" }
  }

  let chartData = {
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

  let options = {}

  if (data.workflow_execution) {
    const tasksData = data.workflow_execution.tasks

    const colors = {
      read: "#cbb5dd",
      compute: "#f7daad",
      write: "#abdcf4"
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
      // plugins: pluginsProperties
    }
  }

  return (
    <>
      <Segment.Group>
        <Segment color="yellow"><strong>Task Executions</strong></Segment>
        <Segment>
          <Bar type="horizontalBar" data={chartData} options={options} />
        </Segment>
      </Segment.Group>
    </>
  )
}

export default GanttChart
