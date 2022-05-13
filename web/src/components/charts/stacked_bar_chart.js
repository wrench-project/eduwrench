import {Segment} from "semantic-ui-react";
import { Bar } from "@iftek/react-chartjs-3"
import React from "react";

/**
 * @param data
 * @returns {JSX.Element}
 * @constructor
 */
const StackedBarChart = ({data}) => {

  // console.log(data)

  let keys = []
  let success = []
  let failure = []

  Object.keys(data).forEach(
    function (key) {
      let time = data[key]
      keys.push(key)
      success.push(time['succeeded'])
      failure.push(time['failed'])
    }
  )

  const options = {
    scales: {
      x: {
        title: {
          display: true,
          text: 'Time (min)'
        }
      },
      y: {
        title: {
          display: true,
          text: '# FIR'
        }
      }
    }
  }

  let recordData = {
    datasets: [
      {
        stack: "stack",
        label: 'success',
        backgroundColor: '#2185d0',
        data: success
      },
      {
        stack: "stack",
        label: 'failure',
        backgroundColor: '#db2828',
        data: failure
      }
    ],
    labels: keys
  }

  return (
    <>
      <Segment.Group>
        <Segment color="yellow"><strong>FIR Success vs Failure</strong></Segment>
        <Segment>
          <Bar data={recordData} options={options} />
        </Segment>
      </Segment.Group>
    </>
  )

}

export default StackedBarChart