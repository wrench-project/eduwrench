/**
 * Copyright (c) 2021. The WRENCH Team.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 */

import React, { useEffect, useState } from "react"
import axios from "axios"
import Layout from "../components/layout"
import PageHeader from "../components/page_header"
import UsageStatistics from "../components/charts/usage_statistics"
import GlobalStatistics from "../components/charts/global_statistics"
import { Divider, Segment } from "semantic-ui-react"

const About = () => {

  const [usageStatisticsResults, setUsageStatisticsResults] = useState(<></>)
  const [globalStatisticsResults, setGlobalStatisticsResults] = useState(<></>)

  useEffect(() => {
    axios.post(`${window.location.protocol}//${window.location.hostname}/backend/get/usage_statistics`).then(
      response => {
        console.log(response.data)
        setUsageStatisticsResults(
          <>
            <UsageStatistics data={response.data.usage_data} />
          </>
        )
      },
      error => {
        console.log(error)
        alert("Error executing simulation.")
      }
    )
  }, []);

  useEffect(() => {
    axios.post(`${window.location.protocol}//${window.location.hostname}/backend/get/global_statistics`).then(
      response => {
        console.log('================',response.data)
        setGlobalStatisticsResults(
          <>
            <GlobalStatistics data={response.data} />
          </>
        )
      },
      error => {
        console.log(error)
        alert("Error global statistics.")
      }
    )
  }, [])

  return (
    <Layout>
      <PageHeader title="About" />

      <Segment>
        <p>
          eduWRENCH is developed by a collaborative team from
          the <a href="https://www.ics.hawaii.edu/" target="_blank" rel="noreferrer noopener">University of Hawai'i at Mãnoa</a> (UHM),
          the <a href="https://www.ornl.gov/group/dlsw" target="_blank" rel="noreferrer noopener">Oak Ridge National Laboratory</a> (ORNL),
          the <a href="https://isi.edu/" target="_blank" rel="noreferrer noopener">University of Southern California</a> (USC),
          and the <a href="https://cnrs.fr/" target="_blank" rel="noreferrer noopener">National Center for Scientific Research</a> (CNRS).
        </p>

        <Divider />

        <h3>Motivation</h3>
        <p>
          Teaching parallel and distributed computing topics in a hands-on manner is challenging, especially at
          introductory, undergraduate levels. Participation challenges arise due to the need to provide students with an
          appropriate compute platform, which is not always possible. Even if a platform is provided to students, not
          all relevant learning objectives can be achieved via hands-on learning on a single platform. In particular, it
          is typically not feasible to provide students with platform configurations representative of emerging and
          future cyberinfrastructure scenarios (e.g., highly distributed, heterogeneous platforms with large
          numbers of high-end compute nodes). To address these challenges, we have developed a set
          of <a href="/modules">pedagogic modules</a> that can be integrated piecemeal into university courses. These
          modules include simulation-driven activities for students to experience relevant application and platform
          scenarios hands-on. These activities are supported by simulators developed using
          the <a href="https://wrench-project.org" target="_blank">WRENCH simulation framework</a>.
        </p>

        <Divider />

        <h3>Citing eduWRENCH</h3>
        <p>
          When citing eduWRENCH, please use
          the <a href="https://rafaelsilva.com/files/publications/casanova2021jpdc.pdf" target="_blank">following
          paper</a>. You should also actually read that paper, as it provides a recent and general overview and
          evaluation aspects of the educational framework.
        </p>

        <pre style={{ padding: "1em !important", borderRadius: "0.5em", border: "1px solid #ddd" }}>
          {"@article{eduwrench,\n"}
          {"         title = {Teaching Parallel and Distributed Computing Concepts in Simulation with WRENCH},\n"}
          {"         author = {Casanova, Henri and Tanaka, Ryan and Koch, William and Ferreira da Silva, Rafael},\n"}
          {"         journal = {Journal of Parallel and Distributed Computing},\n"}
          {"         volume = {156},\n"}
          {"         number = {},\n"}
          {"         pages = {53--63},\n"}
          {"         doi = {10.1016/j.jpdc.2021.05.009},\n"}
          {"         year = {2021}\n"}
          {"}"}
        </pre>

      </Segment>

      <Segment>
        <h3>Simulation Usage Statistics</h3>
        {usageStatisticsResults}
      </Segment>
      <Segment>
         <h3>Practice Questions and Feedback Statistics</h3>
         {globalStatisticsResults}
       </Segment>

      <br /><br />

    </Layout>
  )
}

export default About
