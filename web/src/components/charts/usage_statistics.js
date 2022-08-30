/**
 * Copyright (c) 2021. The WRENCH Team.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 */

import React from "react"
import { Bar } from "@iftek/react-chartjs-3"
import { Segment } from "semantic-ui-react"

/**
 *
 * @param data
 * @constructor
 */
const UsageStatistics = ({ data }) => {

  let simulationModulesMap = {
    "A.1 Single-core Computing": {
      "simulation": ["io_operations"],
      "count": 0
    },
    "A.2 Multi-core Computing": {
      "simulation": ["multi_core_data_parallelism", "multi_core_independent_tasks", "multi_core_independent_tasks_ram", "multi_core_dependent_tasks"],
      "count": 0
    },
    "A.3.1 Distributed Computing: Networking Fundamentals": {
      "simulation": ["networking_fundamentals"],
      "count": 0
    },
    "A.3.2 Distributed Computing: Client-Server": {
      "simulation": ["client_server", "client_server_disk"],
      "count": 0
    },
    "A.3.3 Distributed Computing: Coordinator-Worker": {
      "simulation": ["coordinator_worker"],
      "count": 0
    },
    "A.3.4 Distributed Computing: Workflows": {
      "simulation": ["workflow_distributed", "workflow_fundamentals", "workflow_task_data_parallelism"],
      "count": 0
    },
    "C.2 Cloud Functions": {
      "simulation": ["cloud_functions"],
      "count": 0
    },
    "D.1 Case Study: Energy-Aware Workflow Execution": {
      "simulation": ["thrustd_cloud", "thrustd"],
      "count": 0
    }
  }

  let minMonth = 99
  let minYear = 9999

  for (let idx in data) {
    let usage = data[idx]
    let time = new Date(usage["time"] * 1000)
    minMonth = Math.min(minMonth, time.getMonth())
    console.log("MINMONTH = " + minMonth)
    minYear = Math.min(minYear, time.getFullYear())

    for (let m in simulationModulesMap) {
      let module = simulationModulesMap[m]
      if (module["simulation"].includes(usage["activity"])) {
        module["count"]++
        break
      }
    }
  }
  minMonth = (["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"])[minMonth]

  let chartData = {
    labels: [],
    datasets: []
  }

  let values = []
  for (let m in simulationModulesMap) {
    chartData.labels.push(m)
    values.push(simulationModulesMap[m]["count"])
  }

  chartData.datasets.push({
    data: values,
    backgroundColor: [
      "rgba(255, 99, 132, 0.2)",
      "rgba(54, 162, 235, 0.2)",
      "rgba(255, 206, 86, 0.2)",
      "rgba(75, 192, 192, 0.2)",
      "rgba(153, 102, 255, 0.2)",
      "rgba(255, 159, 64, 0.2)"
    ],
    borderColor: [
      "rgba(255, 99, 132, 1)",
      "rgba(54, 162, 235, 1)",
      "rgba(255, 206, 86, 1)",
      "rgba(75, 192, 192, 1)",
      "rgba(153, 102, 255, 1)",
      "rgba(255, 159, 64, 1)"
    ],
    borderWidth: 1
  })

  let options = {
    indexAxis: "y",
    scales: {
      x: {
        title: {
          display: true,
          text: "# of simulation runs per module"
        }
      }
    },
    plugins: {
      legend: {
        position: "none"
      }
    }
  }

  return (
    <>
      <Segment.Group>
        <Segment color="yellow"><strong>Total Number of Simulation Runs</strong> (since {minMonth} {minYear})</Segment>
        <Segment>
          <Bar type="bar" data={chartData} options={options} />
        </Segment>
      </Segment.Group>
    </>
  )
}

export default UsageStatistics
