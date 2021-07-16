import React from "react"
import { Segment } from "semantic-ui-react"
import { Line } from "@iftek/react-chartjs-3"

const dataSizeUnits = {
  B: ["B", "Bytes", 1],
  KB: ["KB", "Kilobytes", 3],
  MB: ["MB", "Megabytes", 6],
  GB: ["GB", "Gigabytes", 9],
  TB: ["TB", "Terabytes", 12],
  PB: ["PB", "Petabytes", 15]
}

function getRandomColor() {
  return "#" + Math.floor(Math.random() * 16777215).toString(16)
}

const NetworkBandwidthUsageChart = ({
                                      data,
                                      unit = dataSizeUnits.MB,
                                      linkNames = [],
                                      range = null
                                    }) => {
  let chartData = {}
  let options = {}

  if (data.link_usage) {
    const links = data.link_usage.links
    chartData = { labels: [], datasets: [] }
    let labels = []

    Object.keys(links).forEach(function(key) {
      let link = links[key]
      if (linkNames.length > 0 && !linkNames.includes(link.linkname)) {
        return
      }

      let bytes = []
      for (let idx in link.link_usage_trace) {
        let entry = link.link_usage_trace[idx]
        if (!range || (range && entry.time >= range[0] && entry.time <= range[1])) {
          let parsedTime = parseFloat(entry.time).toFixed(2)
          if (!labels.includes(parsedTime)) {
            labels.push(parsedTime)
          }
          // zoomMaxRange = Math.max(zoomMaxRange, entry.time)
          bytes.push(parseFloat(entry["bytes per second"] / Math.pow(10, unit[2])).toFixed(3))
        }
      }

      let color = getRandomColor()
      chartData.datasets.push({
        label: link.linkname,
        backgroundColor: color,
        borderColor: color,
        stepped: true,
        data: bytes,
        fill: true
      })
    })
    chartData.labels = labels

    options = {
      scales: {
        x: {
          title: {
            display: true,
            text: "Time (seconds)"
          }
        },
        y: {
          title: {
            display: true,
            text: "Bandwidth Usage (" + unit[0] + ")"
          }
        }
      },
      plugins: {
        tooltip: {
          mode: "index",
          intersect: false
        }
      }
    }
  }

  return (
    <>
      <Segment.Group>
        <Segment color="purple"><strong>Network Bandwidth Usage</strong></Segment>
        <Segment>
          <Line data={chartData} options={options} />
        </Segment>
      </Segment.Group>
    </>
  )
}

export default NetworkBandwidthUsageChart
