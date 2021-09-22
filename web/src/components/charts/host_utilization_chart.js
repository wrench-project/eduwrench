import React from "react"
import { Bar } from "@iftek/react-chartjs-3"
import { Segment } from "semantic-ui-react"

/**
 *
 * @param data
 * @param hosts
 */
function findTaskScheduling(data, hosts) {
  Object.keys(hosts).forEach(function(key) {
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
      for (let k = 0; k < task.num_cores_allocated; k++) {
        for (let j = 0; j < host.cores; j++) {
          let tasks = host.tasks[j]
          if (tasks.length === 0) {
            tasks.push(task)
            break
          }

          let lastTask = tasks[tasks.length - 1]
          if (lastTask.whole_task.end <= task.whole_task.start) {
            tasks.push(task)
            break
          }
        }
      }
    }
  })
}

/**
 *
 * @param datasets
 * @param end
 * @param labels
 */
function fillEmptyValues(datasets, end, labels) {
  for (let i = datasets.length; i < end; i++) {
    datasets.push({
      data: [],
      backgroundColor: [],
      taskId: [],
      borderColor: "rgba(0, 0, 0, 0.4)",
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

/**
 *
 * @param obj
 * @param start
 * @param end
 * @param color
 * @param id
 */
function ingestData(obj, start, end, color, id) {
  obj.data.push([start.toFixed(3), end.toFixed(3)])
  obj.backgroundColor.push(color)
  obj.taskId.push(id)
}

/**
 *
 * @param data
 * @param hostsList
 * @param diskHostsList
 * @param zoom
 * @param operations
 * @returns {JSX.Element}
 * @constructor
 */
const HostUtilizationChart = ({
                                data,
                                hostsList = [],
                                diskHostsList = [],
                                zoom = true,
                                operations = "all"
                              }) => {
  let chartData = {}
  let options = {}

  if (data.workflow_execution || data.disk_operations) {
    const tasksData = data.workflow_execution ? data.workflow_execution.tasks : null
    const diskData = data.disk_operations ? data.disk_operations : null
    chartData = {
      labels: [],
      datasets: []
    }
    let zoomMaxRange = 0

    // obtain list of hosts
    let hosts = {}
    if (tasksData) {
      Object.keys(tasksData).forEach(function(key) {
        let task = tasksData[key]
        if (hostsList.length > 0 && !hostsList.includes(task.execution_host.hostname)) {
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
    }

    // obtain additional hosts without tasks
    if (diskData) {
      Object.keys(diskData).forEach(function(key) {
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

    if (tasksData) {
      findTaskScheduling(tasksData, hosts)
    }

    // populate data
    Object.keys(hosts).forEach(function(key) {
      // add disk operations
      if ((diskHostsList.length === 0 || diskHostsList.includes(key)) && diskData && diskData[key]) {
        Object.keys(diskData[key]).forEach(function(mount) {
          let diskMounts = diskData[key]

          // read operations
          if (diskMounts[mount].reads) {
            chartData.labels.push(key + " (mount: " + mount + " - reads)")
            fillEmptyValues(
              chartData.datasets,
              diskMounts[mount].reads.length,
              chartData.labels
            )

            for (let i = 0; i < diskMounts[mount].reads.length; i++) {
              let operation = diskMounts[mount].reads[i]
              ingestData(
                chartData.datasets[i],
                operation.start,
                operation.end,
                "#469C76",
                "read"
              )
            }
          }

          // write operations
          if (diskMounts[mount].writes) {
            chartData.labels.push(key + " (mount: " + mount + " - writes)")
            fillEmptyValues(
              chartData.datasets,
              diskMounts[mount].writes.length,
              chartData.labels
            )
            for (let i = 0; i < diskMounts[mount].writes.length; i++) {
              let operation = diskMounts[mount].writes[i]
              ingestData(
                chartData.datasets[i],
                operation.start,
                operation.end,
                "#6FB2E4",
                "write"
              )
            }
          }
        })
      }

      // add compute tasks
      let host = hosts[key]
      if (hostsList.length === 0 || hostsList.includes(key)) {
        Object.keys(host.tasks).forEach(function(core) {
          let coreTasks = host.tasks[core]
          chartData.labels.push(key + " (core #" + core + ")")
          // filling empty values
          fillEmptyValues(
            chartData.datasets,
            coreTasks.length,
            chartData.labels
          )
          for (let i = 0; i < coreTasks.length; i++) {
            let task = coreTasks[i]
            ingestData(
              chartData.datasets[i],
              task.compute.start,
              task.compute.end,
              task.color || "#EEE461",
              task.task_id
            )
            zoomMaxRange = Math.max(zoomMaxRange, task.compute.end)
          }
        })
      }
    })

    options = {
      indexAxis: "y",
      responsive: true,
      scales: {
        x: {
          stacked: false,
          title: {
            display: true,
            text: "Time (seconds)"
          }
        },
        y: {
          stacked: true,
          reverse: true
        }
      },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          position: "nearest",
          mode: "point",
          intersect: "false",
          callbacks: {
            label: function(context) {
              let value = context.formattedValue.replace("[", "").replace("]", "").split(", ")
              let runtime = value[1] - value[0]
              if (runtime > 0.0) {
                let label = context.dataset.taskId[context.dataIndex] || ""
                if (label) {
                  label += ": " + runtime.toFixed(3) + "s - [" + value[0] + ", " + value[1] + "]"
                }
                return label
              }
              return ""
            }
          }
        }
      }
    }
  }

  return (
    <>
      <Segment.Group>
        <Segment color="olive"><strong>Host Utilization</strong></Segment>
        <Segment>
          <Bar type="bar" data={chartData} options={options} />
        </Segment>
      </Segment.Group>
    </>
  )
}

export default HostUtilizationChart
