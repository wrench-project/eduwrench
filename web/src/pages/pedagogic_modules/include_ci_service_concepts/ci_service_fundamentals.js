/**
 * Copyright (c) 2019-2022. The WRENCH Team.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 */

import React from "react"
import { Divider, Header } from "semantic-ui-react"
import TeX from "@matejmazur/react-katex"
import LearningObjectives from "../../../components/learning_objectives"
import SimulationActivity from "../../../components/simulation/simulation_activity"
import CIServiceFundamentalsSimulation from "./ci_service_fundamentals_simulation"
import PracticeQuestions from "../../../components/practice_questions"

import CIBasics from "../../../images/vector_graphs/ci_service_concepts/basics.svg"

const CIServiceFundamentals = ({ module, tab }) => {
  return (
    <>
      <LearningObjectives module={module} tab={tab} />

      <h2>Basics</h2>

      <p>
        The term <strong>cyberinfrastructure</strong> (CI) was introduced in the late 1990s and became popular starting
        around 2003. Although no strict definition is widely accepted, all commonly used definitions allude to systems
        comprising a computational <i>infrastructure</i> for enabling breakthrough scientific discoveries. In summary,
        a <i>cyberinfrastructure</i> can be composed of (but not limited to) the following elements:
      </p>
      <ul>
        <li>Computational systems (e.g., grids, clouds, edge devices, clusters, supercomputers, etc.)</li>
        <li>Data and information management systems (e.g., databases, data repositories, etc.)</li>
        <li>Advanced instruments (e.g., telescopes, detectors, etc.)</li>
        <li>Visualization environments (e.g., scientific data visualization tools, immersive VR, etc.)</li>
        <li>Advanced networks (e.g., high-bandwidth networks, collaborative networks, etc.)</li>
        <li>Software (e.g., application codes, resource scheduling and provisioning frameworks, resource monitoring
          systems, etc.)
        </li>
        <li>People (e.g., researchers, developers, etc.)</li>
      </ul>
      <p>
        Typically, CIs leverage several parallel and distributed computing technologies for creating
        solutions organized into sets of <strong>services</strong> tailored to support a specific scientific domain or
        general-purpose scientific needs.
      </p>

      <h2>Cyberinfrastructure Services</h2>

      <p>
        A CI is typically composed of several services that together provide the fundamental abstractions for executing
        application workloads conveniently and efficiently. Common CI services target data storage and management, data
        movements over the network, computation on bare-metal or virtualized compute nodes, and web sites that serve as
        portals for users to use all the above services. In this module, we explore different approaches and techniques
        commonly used for using these
        services to execute various application workloads. Note that we do not target any specific CI
        service implementation, but instead we target the main concepts in different service categories.
      </p>
      <p>
        The figure below shows an example of a CI composed of four different services: a <i>website</i>, from where
        users interact with the system to upload/download data and launch compute tasks; a <i>Storage service</i>, where
        data can be stored and retrieved persistently; a <i>File Registry service</i>, which is a catalog that acts as a
        bookkeeper for data location; and a <i>Compute service</i>, which can execute compute tasks on demand.
      </p>

      <CIBasics />
      <div className="caption">
        <strong>Figure 1:</strong> Example of a CI with a website, a storage service, a file registry service, and a
        compute service.
      </div>
      <p>
        Although the figure above illustrates a simple CI deployment, this configuration represents a typical
        infrastructure in which web portals (or science gateways) utilize data storage services and file catalogs for
        data archival, and compute platforms (e.g., clouds or clusters) for performing computations (e.g., analysis of
        data or visualization). CI services are often connected to each other by a network topology with high-speed
        network links with small latencies, while connection to the users (client) are usually subjected to ISP
        (internet service provider) bandwidths and latencies (see the <a
          href="/pedagogic_modules/networking_fundamentals/">Networking Fundamentals module</a> for a discussion of
        network latencies, bandwidths, and topologies; and see the <a href="/pedagogic_modules/client_server">Client-Server
          module</a> to see the implications of low network bandwidth on the performance of a distributed computation).
      </p>

      <h2>CI Service Overhead</h2>

      <p>
        In the <a href="/modules">Distributed Computing module</a>, you have learned how to reason about the performance
        of distributed programs and how to estimate their execution times based on network, I/O, and compute times. This
        is certainly a foundation on which we can build to estimate the execution times of an application running on a
        set of CI services, but it does not account for the fact that we are now using a possibly complicated software
        infrastructure. In this infrastructure, using each CI service comes with an <strong>overhead</strong>, i.e.,
        there is a delay for processing each request to the service.
      </p>
      <p>
        For example, a File Registry service may need to execute a search algorithm on some large, possibly distributed,
        data structure for finding all storage services on which a copy of a particular file is located. A Compute
        service
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
        Client-Server module, Server #2 finishes the execution more quickly than Server #1, as the latter is
        connected to the client via a low-bandwidth link. Here, using the default overhead values of 1 sec and 5 sec for
        Server #1 and Server #2 respectively, we observe that Server #1 finishes execution a bit faster. For a task with
        less computation to do, Server #1 would be even preferable, while Server #2 would be the better choice
        provided the task has enough computation to do.
      </p>

      <SimulationActivity panelKey="ci-service-fundamentals-simulation" content={<CIServiceFundamentalsSimulation />} />

      <PracticeQuestions
        header={
          (<>
            Answer the practice questions hereafter, which pertain to the setup in the above simulation (You can use
            the simulation to double-check answers).
          </>)
        }
        questions={[
          {
            key: "B.1.p1.1",
            question: "Using the default values in the above setup as the base case (Server #1: 1 second; Server #2: " +
              "5 seconds; Task: 1000 Gflop), reason on whether reducing the overhead of Server #2 by 1 second would make it preferable " +
              "to Server #1. Then double-check your answer in the simulation.",
            content: "In the base setup, Server #2 completes the task 1.22 second slower than Server #1. So no, we " +
              "would have to reduce the overhead by more than 1 second."
          },
          {
            key: "B.1.p1.2",
            question: "With the default overhead values (1 and 5 seconds), for which value of the task's work would " +
              "both servers complete the task in the same about of time? Try to come up with an analytical answer " +
              "first. Then use the simulation to see how close it is to the true value (by doing a by-hand binary " +
              "search on the execution time difference!).",
            content: (
              <>
                Let <TeX math="x" /> be the task's work. The execution time on each server is estimated as:
                <TeX math="T_{server\#1} = 100 / 10 + 1 + x / 100" block />
                and
                <TeX math="T_{server\#2} = 100 / 100 + 5 + x / 60." block />
                Solving
                <TeX math="T_{server\#1}  = T_{server\#2}" block />
                yields
                <TeX math="x = 750 \text{Gflop}." block />
                As we know from previous modules, such estimates can be inaccurate, especially because they cannot
                capture the complexity of actual networks. Doing a simple binary search with the simulation app yields
                a value of <TeX math="x = 818 \text{Gflop}" />.
              </>
            )
          },
          {
            key: "B.1.p1.3",
            question: (
              <>
                We have to run a computation on the above two-server system, where Server #1 has a 3 sec task startup
                overhead and Server #2 has a 5 sec task startup overhead. The computation consists in
                500 Gflop of work. You have two options:
                <ul>
                  <li>Option #1: run the computation as a single task on one of the servers (whichever one is the
                    fastest)
                  </li>
                  <li>Option #2: split the computation into two 250-Gflop tasks that each read the whole input file, and
                    run them concurrently on the two servers
                  </li>
                </ul>
                Using the simulation app figure out which option is best.
              </>
            ),
            content: (
              <>
                <p>Using the simulation, we obtain:</p>
                <ul>
                  <li>Running a 500-Gflop task on Server #1: 18.50 sec</li>
                  <li>Running a 500-Gflop task on Server #2: 14.38 sec</li>
                  <li>Running a 250-Gflop task on Server #1: 14.00 sec</li>
                  <li>Running a 250-Gflop task on Server #2: 10.22 sec</li>
                </ul>
                <p>So, we obtain the execution time for each option:</p>
                <ul>
                  <li>Option #1: min(18.50, 14.38) = 14.38 sec</li>
                  <li>Option #2: max(14.00, 10.22) = 14.00 sec</li>
                </ul>
                <p>We are better off with Option #2!</p>
              </>
            )
          }
        ]} />

      <Divider />

      <Header as="h3" block>
        Questions
      </Header>

      <p>
        <strong>[B.1.q1.1]</strong> Your company needs to execute a particular workload that is a
        "chain" of <TeX math="n" /> tasks that must be executed in sequence (this is also called a "linear workflow").
        Each task consists of 10 Tflop of work         and reads as input and writes as output a negligible about of data.
        You consider two options:
      </p>
      <ul style={{ marginBottom: 0 }}>
        <li><b>Option #1: </b> Run all tasks on your local computer that computes at 200 Gflop/sec;</li>
        <li><b>Option #2: </b> Run all tasks on a remote CI service that computes at 500 Gflop/sec.
          Your connection to the remote service is via a fast network with negligible latency but the
          service has <TeX math="h" /> seconds of overhead.
        </li>
      </ul>
      <p>
        <strong>Question:</strong> How low should the overhead <TeX math="h" /> be so that using Option #2 is at least
        as good as using Option #1?
      </p>

      <p>
        <strong>[B.1.q1.2]</strong> Consider the same setup as in the previous section, but now you have the option of
        executing some tasks locally while running some tasks remotely. How many tasks should be run remotely to
        minimize execution time?
        Give your answer as a function of <TeX math="n" /> and <TeX math="h" />. It is ok if that function does not
        produce an integer value for all <TeX math="n" /> and <TeX math="h" />, that is it can give a fractional
        approximation of the optimal number of tasks to run locally.
      </p>
      <p>
        Say now that <TeX math="n = 100" /> and that <TeX math="h = 10" />. How many tasks should we run locally?
        (Your answer must be an integer).
      </p>

      <p>
        <strong>[B.1.q1.3]</strong> You have access to a CI deployment that consists of a file registry service, two
        compute services, and some storage services, all accessed via a Web site. The overheads of these services are as
        follow:
      </p>
      <ul>
        <li><b>File Registry service:</b> 2 seconds for a "give me a file's location" request and 1 second for a "here
          is a new file location" request;
        </li>
        <li><b>Compute service #1:</b> 10 seconds for a "start task" request;</li>
        <li><b>Compute service #2:</b> 20 seconds for a "start task" request;</li>
        <li><b>Storage services:</b> 5 seconds for a "read a file" or a "write a file" request;</li>
        <li><b>Web site:</b> negligible overhead.</li>
      </ul>
      <p>
        On this CI deployment, you need to run a workload that consist of 600 tasks (all with the same work in Gflop).
        Each task must read two input files from a Storage service, after making sure that the files are there
        by querying the File Registry service. Each task produces one output file that it writes to a Storage service,
        and then sends a request to the File Registry service to make it aware of the new file and its location.
      </p>
      <p>
        Compute service #2 has higher overhead, but once a task starts on it
        runs twice as fast as on Computes service #1. The software system you use to
        execute your workload on the CI deployment performs static (i.e., ahead of
        time) load balancing by considering only the compute speeds of the compute services.
      </p>
      <p>
        How many seconds of CI service overhead are being experienced in this whole execution?
      </p>

      {/*<Divider />*/}
      {/*<Header as="h3" block>*/}
      {/*  Suggested Activities*/}
      {/*</Header>*/}
      {/*- IDEA: One service that one uses often is ssh (Secure Shell). On Linux machine on which the Ssh daemon is*/}
      {/*running, setup passwordless authentication, such that typing "ssh localhost" does not ask for your password. Then*/}
      {/*type the command "time ssh localhost sleep 1". What is the overhead of the Ssh service in seconds?*/}
      {/*- IDEA: Pick a cloud provider and measure the overhead for starting a VM instance.*/}
      {/*- IDEA: Curl REST API request overhead.*/}

    </>
  )
}

export default CIServiceFundamentals
