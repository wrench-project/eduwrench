import React, { Component, useState, useEffect } from "react"
import Chart from "chart.js"

export default class IOHostUtilizationChart extends Component {
  chartRef = React.createRef()

  state = { chartInfo: this.props.chartInfo }

  constructor(props) {
    super(props)
  }

  componentDidMount() {
    const myChartRef = this.chartRef.current.getContext("2d")
    console.log(this.props.chartInfo)
    this.myChart = new Chart(myChartRef, this.props.chartInfo)
  }

  componentDidUpdate() {
    const myChartRef = this.chartRef.current.getContext("2d")
    this.myChart.destroy()
    this.myChart = new Chart(myChartRef, this.props.chartInfo)
  }

  render() {
    return (
      <div>
        <canvas
          style={{ backgroundColor: "white" }}
          id="myChart"
          ref={this.chartRef}
        />
      </div>
    )
  }
}
