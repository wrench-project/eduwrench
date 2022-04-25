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

  let feedbackMap = {
    "Feedbacks": {
      feedback: ["completed"],
      count: 0,
    },
    "Useful of Modules": {
      feedback: ["Very Useful", "Useful"],
      count: 0,
    },
    "Good Quality of Modules": {
      feedback: ["Very Good", "Good"],
      count: 0,
    },
    "Good Quality of Simulations": {
      feedback: ["Perfect", "Good"],
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
      if (module["practiceQuestion"].includes(global['completed'] === 1 ? 'completed' : 0)) {
        module["count"]++
      }
      if (module["practiceQuestion"].includes(global['giveup'] === 1 ? 'giveup' : 0)) {
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

    for (let f in feedbackMap) {
      let module = feedbackMap[f]
      if (module["feedback"].includes(global["completed"] === 1 ? "completed" : 0)) {
        module["count"]++
      }
      if (module["feedback"].includes(global["useful"])) {
        module["count"]++
      }
      if (module["feedback"].includes(global["quality"])) {
        module["count"]++
      }
      if (module["feedback"].includes(global["rating"])) {
        module["count"]++
      }
    }
  }

  const globalSimulationFeedback = data.globalSimulationFeedback

  for (let idx in globalSimulationFeedback) {
    let global = globalSimulationFeedback[idx]
    let time = new Date(global["time"] * 1000)
    minMonth = Math.min(minMonth, time.getMonth())
    minYear = Math.min(minYear, time.getFullYear())

    for (let f in feedbackMap) {
      let module = feedbackMap[f]
      if (module["feedback"].includes(global["rating"])) {
        module["count"]++
      }
    }
  }

  let feedbackChartData = {
    labels: [],
    datasets: [],
  }
  let feedbackValues = []
  for (let f in feedbackMap) {
    feedbackChartData.labels.push(f)
    feedbackValues.push(feedbackMap[f]["count"])
  }

  feedbackChartData.datasets.push({
    data: feedbackValues,
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

  let options = {
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
    maintainAspectRatio: false
  }

  return (
    <>
      <Segment.Group>
        <Segment color="purple">
          <strong>Practice Questions</strong> (since {minMonth}/{minYear})
        </Segment>
        <Segment>
          <Bar type="bar" width={100} height={250} data={questionChartData} options={options} />
        </Segment>
        <Segment color="green">
          <strong>Feedbacks</strong> (since {minMonth}/{minYear})
        </Segment>
        <Segment>
          <Bar type="bar" width={100} height={320} data={feedbackChartData} options={options} />
        </Segment>
      </Segment.Group>
    </>
  )
}

export default GlobalStatistics
