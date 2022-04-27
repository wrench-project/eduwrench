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
const GlobalStatistics = ({ data }) => {
  let practiceQuesionMap = {
    "Correct Answers": {
      practiceQuestion: ["completed"],
      count: 0,
    },
    "Attemps": {
      practiceQuestion: [],
      count: 0,
    },
    "Give-ups": {
      practiceQuestion: ["giveup"],
      count: 0,
    },
  }

  let usefulMap = {
    "Very Useful": {
      feedback: ["Very Useful"],
      count: 0,
    },
    "Kinda Useful": {
      feedback: ["Useful"],
      count: 0,
    },
    "Sorta Useful": {
      feedback: ["Neutral"],
      count: 0,
    },
    "Useless": {
      feedback: ["Useless"],
      count: 0,
    },
  }

  let qualityMap = {
    "Excellent Quality": {
      feedback: ["Excellent Quality"],
      count: 0,
    },
    "Good Quality": {
      feedback: ["Good Quality"],
      count: 0,
    },
    "Fair Quality": {
      feedback: ["Fair Quality"],
      count: 0,
    },
    "Poor Quality": {
      feedback: ["Poor Quality"],
      count: 0,
    },
  }

  let simFeedbackMap = {
    "Perfect Experience": {
      feedback: ["Perfect"],
      count: 0,
    },
    "Good Experience": {
      feedback: ["Good"],
      count: 0,
    },
    "Poor Experience": {
      feedback: ["Poor"],
      count: 0,
    },
    "Bad Experience": {
      feedback: ["Bad"],
      count: 0,
    },
  }

  let minMonth = 99
  let minYear = 9999

  const globalQuestion = data.globalQuestion
  for (let idx in globalQuestion) {
    let global = globalQuestion[idx]
    let time = new Date(global["time"] * 1000)
    minMonth = Math.min(minMonth, time.getMonth())
    minYear = Math.min(minYear, time.getFullYear())

    for (let p in practiceQuesionMap) {
      let module = practiceQuesionMap[p]
      if (module["practiceQuestion"].includes(global["completed"] === 1 ? "completed" : 0)) {
        module["count"]++
      }
      if (module["practiceQuestion"].includes(global["giveup"] === 1 ? "giveup" : 0)) {
        module["count"]++
      }
    }
    practiceQuesionMap.Attemps.count += global["attempts"]
  }

  let questionChartData = {
    labels: [],
    datasets: [],
  }
  let questionValues = []
  for (let p in practiceQuesionMap) {
    questionChartData.labels.push(p)
    questionValues.push(practiceQuesionMap[p]["count"])
  }

  questionChartData.datasets.push({
    data: questionValues,
    backgroundColor: [
      "rgba(255, 99, 132, 0.2)",
      "rgba(54, 162, 235, 0.2)",
      "rgba(255, 206, 86, 0.2)",
    ],
    borderColor: [
      "rgba(255, 99, 132, 1)",
      "rgba(54, 162, 235, 1)",
      "rgba(255, 206, 86, 1)",
    ],
    borderWidth: 1,
  })
  
  const globalFeedback = data.globalFeedback
  for (let idx in globalFeedback) {
    let global = globalFeedback[idx]
    let time = new Date(global["time"] * 1000)
    minMonth = Math.min(minMonth, time.getMonth())
    minYear = Math.min(minYear, time.getFullYear())

    for (let u in usefulMap) {
      let module = usefulMap[u]
      if (module["feedback"].includes(global["useful"])) {
        module["count"]++
      }
    }
    for (let q in qualityMap) {
      let module = qualityMap[q]
      if (module["feedback"].includes(global["quality"])) {
        module["count"]++
      }
    }
  }

  let usefulChartData = {
    labels: [],
    datasets: [],
  }
  let usefulValues = []
  for (let u in usefulMap) {
    usefulChartData.labels.push(u)
    usefulValues.push(usefulMap[u]["count"])
  }

  usefulChartData.datasets.push({
    data: usefulValues,
    backgroundColor: [
      "rgba(75, 192, 192, 0.2)",
      "rgba(153, 102, 255, 0.2)",
      "rgba(255, 159, 64, 0.2)",
      "rgba(255, 99, 132, 0.2)",
    ],
    borderColor: [
      "rgba(75, 192, 192, 1)",
      "rgba(153, 102, 255, 1)",
      "rgba(255, 159, 64, 1)",
      "rgba(255, 99, 132, 1)",
    ],
    borderWidth: 1,
  })

  let qualityChartData = {
    labels: [],
    datasets: [],
  }
  let qualityValues = []
  for (let q in qualityMap) {
    qualityChartData.labels.push(q)
    qualityValues.push(qualityMap[q]["count"])
  }

  qualityChartData.datasets.push({
    data: qualityValues,
    backgroundColor: [
      "rgba(75, 192, 192, 0.2)",
      "rgba(153, 102, 255, 0.2)",
      "rgba(255, 159, 64, 0.2)",
      "rgba(255, 99, 132, 0.2)",
    ],
    borderColor: [
      "rgba(75, 192, 192, 1)",
      "rgba(153, 102, 255, 1)",
      "rgba(255, 159, 64, 1)",
      "rgba(255, 99, 132, 1)",
    ],
    borderWidth: 1,
  })

  const globalSimFeedback = data.globalSimFeedback
  for (let idx in globalSimFeedback) {
    let global = globalSimFeedback[idx]
    let time = new Date(global["time"] * 1000)
    minMonth = Math.min(minMonth, time.getMonth())
    minYear = Math.min(minYear, time.getFullYear())

    for (let s in simFeedbackMap) {
      let module = simFeedbackMap[s]
      if (module["feedback"].includes(global["rating"])) {
        module["count"]++
      }
    }
  }

  let simFeedbackChartData = {
    labels: [],
    datasets: [],
  }
  let simFeedbackValues = []
  for (let s in simFeedbackMap) {
    simFeedbackChartData.labels.push(s)
    simFeedbackValues.push(simFeedbackMap[s]["count"])
  }

  simFeedbackChartData.datasets.push({
    data: simFeedbackValues,
    backgroundColor: [
      "rgba(75, 192, 192, 0.2)",
      "rgba(153, 102, 255, 0.2)",
      "rgba(255, 159, 64, 0.2)",
      "rgba(255, 99, 132, 0.2)",
    ],
    borderColor: [
      "rgba(75, 192, 192, 1)",
      "rgba(153, 102, 255, 1)",
      "rgba(255, 159, 64, 1)",
      "rgba(255, 99, 132, 1)",
    ],
    borderWidth: 1,
  })

  let option = {
    indexAxis: "y",
    scales: {
      x: {
        title: {
          display: true,
          text: "Numbers",
        },
      },
    },
    plugins: {
      legend: {
        position: "none",
      },
    },
    maintainAspectRatio: false,
  }

  let options = {
    indexAxis: "y",
    scales: {
      x: {
        title: {
          display: true,
          text: "Number of People",
        },
      },
    },
    plugins: {
      legend: {
        position: "none",
      },
    },
    maintainAspectRatio: false,
  }

  return (
    <>
      <Segment.Group>
        <Segment color="purple">
          <strong>Practice Questions</strong> (since {minMonth}/{minYear})
        </Segment>
        <Segment>
          <Bar type="bar" width={100} height={200} data={questionChartData} options={option} />
        </Segment>
        <Segment color="green">
          <strong>Feedbacks</strong> (since {minMonth}/{minYear})
        </Segment>
        <div class="ui segments">
          <div class="ui segment">
            <strong>Usefulness Rating of Modules</strong>
          </div>
          <Segment>
            <Bar type="bar" width={100} height={250} data={usefulChartData} options={options} />
          </Segment>
        </div>
        <div class="ui segments">
          <div class="ui segment">
            <strong>Quality Rating of Modules</strong>
          </div>
          <Segment>
            <Bar type="bar" width={100} height={250} data={qualityChartData} options={options} />
          </Segment>
        </div>
        <div class="ui segments">
          <div class="ui segment">
            <strong>Experience Rating of Simulations</strong>
          </div>
          <Segment>
            <Bar type="bar" width={100} height={250} data={simFeedbackChartData} options={options} />
          </Segment>
        </div>
      </Segment.Group>
    </>
  )
}

export default GlobalStatistics
