import React from "react"
import { Divider, Header } from "semantic-ui-react"
import TeX from "@matejmazur/react-katex"
import LearningObjectives from "../../../components/learning_objectives"
import SimulationActivity from "../../../components/simulation/simulation_activity"
import PracticeQuestions from "../../../components/practice_questions"

import CIBasics from "../../../images/vector_graphs/ci_service_concepts/basics.svg"

const CIServiceFundamentals = () => {
  return (
    <>
      <LearningObjectives objectives={[
        "Understand the principles of cyberinfrastructure services",
        "Understand the concept of overhead and how it can impact CI services performance"
      ]} />

      <h2>Basics</h2>

      <p>
        The term <strong>cyberinfrastructure</strong> (CI) was introduced in the late 1990s, and became popular starting
        around 2003. Although no strict definition is widely accepted, all commonly used definitions allude to systems
        comprising a computational <i>infrastructure</i> for enabling breakthrough scientific discoveries. In summary,
        a <i>cyberinfrastructure</i> can be composed of (but not limited to) the following elements:
      </p>
      <ul>
        <li>Computational systems (e.g., grids, clouds, clusters, supercomputers, etc.)</li>
        <li>Data and information management systems (e.g., databases, data repositories, etc.)</li>
        <li>Advanced instruments (e.g., telescopes, detectors, etc.)</li>
        <li>Visualization environments (e.g., scientific visualization, data analytics, etc.)</li>
        <li>Advanced networks (e.g., high-bandwidth networks, collaborative networks, etc.)</li>
        <li>Software (e.g., applications, resource scheduling and provisioning, monitoring, fault-tolerance, etc.)</li>
        <li>People (e.g., researchers, developers, etc.)</li>
      </ul>
      <p>
        Typically, cyberinfrastructures leverage several parallel and distributed
        computing technologies for creating solutions organized into sets of <strong>services</strong>
        tailored to support a specific scientific domain or general-purpose scientific
        needs.
      </p>

      <h2>Cyberinfrastructure Services</h2>

      <p>
        A CI is typically composed of several services that together provide the fundamental abstractions for executing
        application workloads conveniently and efficiently. Common CI services target data storage and management, data
        movements over the network, computation on bare-metal or virtualized compute nodes, web sites that serve as
        portals for the CI. In this module, we explore different approaches and techniques commonly used for using these
        services in a view to executing various application workloads. Note that we do not target any specific CI
        service implementations, but instead the main concepts in different service categories.
      </p>
      <p>
        The figure below shows an example of a CI composed of four different services: a <i>website</i>, from where
        users interact with the system to upload/download data and launch compute tasks; a <i>Storage service</i>, where
        data can stored and retrieve persistently; a <i>File Registry service</i>, which is a catalog that acts as a
        bookkeeper for data location; and a <i>Compute service</i>, which can execute compute tasks on demand.
      </p>

      <CIBasics />
      <div className="caption">
        <strong>Figure 1:</strong> Example of a CI with a website, a storage service, a file registry service, and a
        compute service.
      </div>
      <p>
        Although the figure above illustrates a simple CI deployment, this configuration represents a typical
        infrastructure in which web portals (or science gateways) utilizes data storage services and file catalogs for
        data archival, and compute platforms (e.g., clouds or clusters) for performing computations (e.g., analysis of
        data or visualization). CI services are often connected to each other by a network topology with high-speed
        network links with small latencies, while connection to the users (client) are usually subjected to ISP
        (internet service provider) bandwidths and latencies (see the <a
        href="/pedagogic_modules/networking_fundamentals/">Networking Fundamentals module</a>) for a discussion of
        network latencies, bandwidths, and topologies; and see the <a href="/pedagogic_modules/client_server">Client-Server
        module</a>) to see the implications of low network bandwidth on a distributed computation).
      </p>

      <h2>CI Service Overhead</h2>

      <p>
        In the <a href="/modules">Distributed Computing module</a> you have learned how to reason about the performance
        of distributed programs and how to estimate their execution times based on network, I/O, and compute times. This
        is certainly a foundation on which we can build to estimate the execution times of an application running on a
        set of CI services, but it does not account for the fact that we are now using a possibly complicate software
        infrastructure. In this infrastructure using each CI service comes with an <strong>overhead</strong>, i.e.,
        there is a delay for processing each request to the service.
      </p>
      <p>
        For example, a File Registry service may need to execute a search algorithm on some large, possible distributed,
        data structure for finding all storage services on which a copy of particular file is located. A Compute service
        may need to allocate and/or boot virtual machines (VMs) or containers to perform the requested computation. In
        addition, overheads compound as services can interact with each other. For instance, a storage service may need
        to interact with a Web server and a File Registry service when a new file is stored.
      </p>
      <p>
        Some of these overheads can be at most a few seconds, while others can be up to several minutes. As a result,
        predicting the execution of a possibly complex application workload on a particular CI is not an easy task
        when trying to account for these overheads. And yet, not accounting for them can lead to overly optimistic
        performance expectations.
      </p>

      <Header as="h3" block>
        Simulating Service Overhead
      </Header>

      <p>
        The simulation app below simulates the execution of the client-server setup depicted in Figure 1 of the <a
        href="/pedagogic_modules/client_server">Client-Server module</a>. But here each server is implemented as a CI
        service that experience some <i>overhead</i> (a time in seconds) each time a task is started. This is the time
        needed to perform <i>startup</i> operations to configure the environment for executing the task (e.g., booting a
        VM instance). As a result, if it has high overhead, a server may not be as attractive as it may seem based on
        purely its network connectivity and compute speed.
      </p>
      <p>
        Using the app, experiment with simulating the execution with each server (use the radio button to select which
        server to use), leaving all values to their default. You should notice a difference in execution time. In the
        client Client-Server module, Server #2 is able to finish execution more quickly than Server #1, as the latter is
        connected to the client via a low-bandwidth link. Here, using the default overhead values of 1 sec and 5 sec for
        Server #1 and Server #2 respectively, we observe that Server #1 finishes execution a bit faster. For a task with
        less computation to do, Server #1 would be even more preferable, while Server #2 would be the better choice
        provided the task has enough computation to do.
      </p>

      <Divider />

      <Header as="h3" block>
        Questions
      </Header>


    </>
  )
}

export default CIServiceFundamentals
