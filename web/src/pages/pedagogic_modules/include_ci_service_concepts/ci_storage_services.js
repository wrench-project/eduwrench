/**
 * Copyright (c) 2019-2021. The WRENCH Team.
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
import CIStorageServicesSimulation from "./ci_storage_services_simulation"
// import PracticeQuestions from "../../../components/practice_questions_header"

import PracticeQuestionNumeric from "../../../components/practice-questions/numeric";

import CISimpleStorage from "../../../images/vector_graphs/ci_service_concepts/simple_storage.svg"
import CIStorageNetworkProximitySimulation from "./ci_storage_network_proximity_simulation"

const CIStorageServices = ({ module, tab }) => {
  return (
    <>
      <LearningObjectives module={module} tab={tab} />

      <h2>Data Services</h2>

      <p>
        A common type of CI service is a "data service". A data service provide
        permanent,
        reliable, and efficient data storage. In addition to storing data in a (remote) server,
        a data service can also provide other capabilities, e.g.,
        support for registering metadata for data description, backups, search mechanisms,
        data integrity checks, etc.
      </p>
      <p>
        Let us consider a data service that comprises at least the following components: storage devices (e.g., HDD,
        SSD, RAM, etc.), a file system to access data on these devices, and a "file registry" databases (for keeping
        track of file locations and recording metadata). While a data service can reside on a single machine, typical CI
        deployments follow a distributed approach. That is, multiple data servers or <i>data nodes</i>, dedicated nodes
        for processing query requests, etc., in which services are part of the same local network (LAN) or are
        distributed into physically remote sites (connected via WAN). The figure below shows an example of
        a data service with a single data node (that runs a storage service) and a single database node (that runs a
        file registry service), each configured to run on different machines, but all part of the same local network.
      </p>

      <CISimpleStorage />
      <div className="caption"><strong>Figure 1:</strong> Example of a simple CI data service deployment.</div>

      <p>
        In the figure above, storing a file into the data service involves
        interaction with two services: the storage service and the file registry service.
        The sequence diagram shown on the bottom of Figure 1 depicts the sequence of
        operations necessary for storing the file in the storage service and registering
        the file location in the file registry. Several overheads are incurred
        in this operation:
      </p>
      <ol start={0}>
        <li><i>Client Disk Overhead</i>: Time to read the file from the client disk into memory (depends on the client's
          disk read bandwidth).
        </li>
        <li><i>Transfer Overhead</i>: Time to transfer the file from the client to the storage
          service (depends on the network bandwidth and latency between the client and
          the storage service).
        </li>
        <li><i>Writing Overhead</i>: Time to write the file contents to the storage server's disk (depends on the
          storage service's disk write bandwidth).
        </li>
        <li><i>Registration Overhead</i>: Time to perform a registration operation in the file
          registry service (depends on the network bandwidth and latency between the
          storage service and file registry service, and any overhead to process the
          registration operation on the file registry service).
        </li>
        <li><i>Registration Notification Overhead</i>: Time to notify the storage service that the registration was
          successful (depends on the network bandwidth and latency between the storage service and file registry
          service).
        </li>
        <li><i>Client Notification Overhead</i>: Time to notify the client (by providing the path to the file location)
          the file has been successfully stored (depends on the network bandwidth and latency between the storage
          service and the client).
        </li>
      </ol>
      <p>
        The steps for retrieving the file from the data service are similar to the ones
        above but in the reverse order. Also, instead of an overhead for registering the file
        in the file registry, now the overhead would be to resolve the query for finding the
        location(s) of the stored file, and then transmit it through the network.
      </p>

      <Header as="h3" block>
        Simulating a Data Service
      </Header>

      <p>
        The simulation app below simulates the execution of the simple data service scenario shown in Figure 1. For this
        simulation, the file registry service has an <i>overhead</i> value represented as the time (in seconds) for
        performing an insert operation (i.e., registering a file), and storing a file in the data service involves the
        steps shown in the sequence diagram (Figure 1, bottom). If you run the simulation using the default values,
        you will notice that the registration overhead nearly doubles the time to perform the storing operation in the
        data service.
      </p>

      <SimulationActivity panelKey="ci-storage-services-simulation" content={<CIStorageServicesSimulation />} />

      <Divider />

      <Header as="h3" block>
         Practice Questions
      </Header>

      <p>
      Answer the practice questions hereafter, which pertain to the setup in the above simulation (You can use
      the simulation to determine or double-check answers).
      </p>

      <PracticeQuestionNumeric
                module={"B.1"}
                question_key={"B.1.p2.1"}
                question={
                    <>
              Keep the file registration overhead at 1 second and the bandwidth at 10 MB/sec in the 
              simulation above. You need to continuously store blocks of data to the above data service, and you 
              must choose the size of these blocks. Doing as small blocks as possible is good for your business 
              because the blocks can then be grabbed quickly from the data service by a third-party compute service. 
              But doing as large blocks as possible is also good because then the data service overhead is not 
              as punishing. What is the smallest block size so that at the end of the day less than 10% of the time 
              was spent experiencing the file registration overhead? 
              You can come up with a rough estimate of the block size, and then use the simulation to refine this 
              estimate.
                    </>
                }
                hint={"You should use the simulation"}
                answer={[77.1,78.5]}
                explanation={
                    <>
                    We want the total execution of a block transfer to take 10s, so that the 1 second file registry overhead
                accounts for 10% of the elapsed time. Roughly, sending <TeX math="n" /> MB of data over to the data
                service takes <TeX math="n/10" /> seconds (in fact it takes more due to disk overhead, network effects,
                etc). So <TeX math="n = 90" /> MB should be getting us close-ish to 10s in total. The simulation shows
                that with a data size of 90 MB the overall time is 11.54 seconds. Doing a simple binary search between,
                for instance, 70 MB and 90 MB gives us the answer: 78 MB. With a block size of 78 MB, the overall time
                is 10.00605 sec, while with 77 MB, the overall time is below 10 seconds, meaning that the file
                registration overhead would then be more than 10% of the overall time.
                    </>
                }
            />


      <Divider />

      <h2>Network Proximity</h2>

      <p>
        In the <a href="/pedagogic_modules/networking_fundamentals">network fundamentals module</a>, we have discussed
        the concepts of latency and bandwidth, and experienced how network topologies and contention could impact
        data transfer times. A key issue in effectively utilizing network resources and services is efficiently and
        quickly locating the desired resources or services in specific network locations. These kinds of location
        services allow a service provider to construct efficient <i>service overlay networks</i>, which for example
        could be used to distribute rich media content, enable a client to identify the closest cache/proxy that has the
        desired data or service, enable a client to quickly locate a well provisioned nearby server for participating
        in a massive multiple-user online game, etc.
      </p>
      <p>
        In a CI deployment, it is common to have copies of data files (a.k.a. <i>replicas</i>) stored on (potentially
        geographically) distributed storage services. For example, an image captured with the Daniel K. Inouye Solar
        Telescope in Haleakalā, Maui, will certainly have a copy of the file on a local storage service, but could also
        distribute replicas of it to storage services worldwide. The goal of creating distributed replicas is to reduce
        the latency when accessing resources over the wide-area network (e.g., Internet), as well as to reduce potential
        network contention when having multiple users accessing a single resource.
      </p>

      <p>
        In order to overcome the above issues, CI deployments typically use <strong>Network Proximity</strong> services
        to identify the "nearest" resource that could perform a particular service efficiently. By nearest, we do not
        simply mean the geographical distance between resources, instead we define it as the lowest time-to-response
        (TTR), which may be affected by:
      </p>
      <ul>
        <li>The network topology, the links bandwidth, and latencies;</li>
        <li>The overhead for performing an operation (e.g., disk speed, number of concurrent requests, etc.);</li>
        <li>among others.</li>
      </ul>

      <p>
        Traditional network proximity services compute proximity based on pairwise distance estimate between any two
        given nodes. Such schemes find the node closest to a client from a given set of potential targets by estimating
        the distance to each candidate and picking the minimum.
      </p>

      <Header as="h3" block>
        Simulating Data Retrieval with Network Proximity
      </Header>

      <SimulationActivity panelKey="ci-storage-network-proximity" content={<CIStorageNetworkProximitySimulation />} />

      <Divider />

      <Header as="h3" block>
        Questions
      </Header>

    </>
  )
}

export default CIStorageServices
