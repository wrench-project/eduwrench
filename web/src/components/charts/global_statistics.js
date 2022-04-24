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

  let globalStatisticsMap = {
    "Answers": {
     "practiceQuestion": ['completed'],
     "feedback": [],
     "count": 0
    },
    "Attemps": {
     "practiceQuestion": [],
     "feedback": [],
     "count": 0
    },
    // "Average Rating for Modules": {
    //  "feedback": [],
    //  "count": 0
    // },
    "Feedbacks": {
      "practiceQuestion": [],
      "feedback": ['completed'],
      "count": 0
    },
    "Useful of Modules": {
      "practiceQuestion": [],
      "feedback": ["Very Useful", "Useful"],
      "count": 0
    },
    "Quality of Modules": {
      "practiceQuestion": [],
      "feedback": ["Very Good", "Good"],
      "count": 0
    },
  }

  let minMonth = 99
  let minYear = 9999

  const globalQuestion = data.globalQuestion;

  for (let idx in globalQuestion) {
    let global = globalQuestion[idx]
    let time = new Date(global["time"] * 1000)
    minMonth = Math.min(minMonth, time.getMonth())
    minYear = Math.min(minYear, time.getFullYear())

    for (let m in globalStatisticsMap) {
      let module = globalStatisticsMap[m]
      if (module["practiceQuestion"].includes(global['completed'] === 1 ? 'completed' : 0)) {
        module["count"]++
      }
    }
    globalStatisticsMap.Attemps.count += global['attempts'];
  }

  const globalFeedback = data.globalFeedback;

  for (let idx in globalFeedback) {
    let global = globalFeedback[idx]
    let time = new Date(global["time"] * 1000)
    minMonth = Math.min(minMonth, time.getMonth())
    minYear = Math.min(minYear, time.getFullYear())

    for (let m in globalStatisticsMap) {
      let module = globalStatisticsMap[m]
      if (module["feedback"].includes(global['completed'] === 1 ? 'completed' : 0)) {
        module["count"]++
      }
      if (module["feedback"].includes(global['useful'])) {
        module["count"]++
      }
      if (module["feedback"].includes(global['quality'])) {
        module["count"]++
      }
    }
  }

  let chartData = {
    labels: [],
    datasets: []
  }
 
   let values = []
   for (let m in globalStatisticsMap) {
     chartData.labels.push(m)
     values.push(globalStatisticsMap[m]["count"])
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
           text: "Numbers"
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
         <Segment color="purple"><strong>Global Statistics of Practice Questions and Feedback</strong> (since {minMonth}/{minYear})</Segment>
         <Segment>
           <Bar type="bar" data={chartData} options={options} />
         </Segment>
       </Segment.Group>
     </>
   )
 }
 
 export default GlobalStatistics
 