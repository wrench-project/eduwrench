import React from "react"
import { Divider, Header } from "semantic-ui-react"
import TeX from "@matejmazur/react-katex"
import LearningObjectives from "../../../components/learning_objectives"

import MultiCoreCapstoneFigure from "../../../images/vector_graphs/multi_core/multicore_capstone.svg"

const MultiCoreCapstone = () => {
  return (
    <>
      <LearningObjectives objectives={[
        "Be able to apply (most of) the concepts in this module to a case-study"
      ]} />

      <h2>A Bioinformatics program</h2>

      <p>
        Below is the DAG for a program that implements bioinformatics computations on a large database of DNA sequences.
        A first task applies some simple cleanup process to the sequences. After that, three tasks need to be executed
        to compute different similarity metrics between the sequences in the database. Once all these metrics are
        obtained, a complicated machine learning classification process is applied to the metrics (Task 5). The work and
        RAM footprint of each task is shown in the figure below.
      </p>

      {/*<object className="figure" type="image/svg+xml" data={MultiCoreCapstoneFigure} />*/}
      <MultiCoreCapstoneFigure />

      <p>
        We have to run this program on a <strong>2-core</strong> Virtual Machine (VM) with 20 GB of RAM, where each core
        computes with speed 400 Gflop/sec, and data is read from storage at bandwidth 100 MB/sec.
      </p>

      <Header as="h3" block>
        Questions
      </Header>

      <p>
        <strong>[A.2.q6.1]</strong> What is the execution time of this program on this VM? Show your work (e.g., a
        mathematical expression, a narrative).
      </p>

      <Divider />

      <h2>Saving money?</h2>

      <p>
        You have found that the execution time is longer than 1 minute. If not, re-check your work for Question #1!
      </p>

      <p>
        This VM is "leased" from some cloud infrastructure that charges 1c for each minute of usage. As a result, a
        program that runs in, say, 61 seconds, will be charged 2c. If we could run it in under 60 seconds, we could save
        your organization 1c for each program execution. This does not sound like a lot, but this program runs thousands
        times each day on hundreds of similar VM instances. So at the end of the year you could have saved a substantial
        amount of money.
      </p>

      <p>
        Given a budget your organization has allocated to making the program run faster, you have the following options
        at your disposal:
      </p>

      <ul>
        <li><strong>Option #1:</strong> Upgrade your VM so that the storage read bandwidth is 150 MB/sec.</li>
        <li><strong>Option #2:</strong> Upgrade your VM so that it has 3 cores and 30 GB of RAM.</li>
        <li><strong>Option #3:</strong> Upgrade your VM so that cores compute at 440 Gflop/sec.</li>
        <li><strong>Option #4:</strong> Pay a software developer to re-implement Task 5 so that it exposes some data
          parallelism. This is done by replacing the current Task 5 by a 1000 Gflop task (that requires 15 GB of RAM)
          followed by <TeX math="n" /> independent tasks, each with work <TeX math="9000/n" /> Gflop (and
          requiring <TeX math="15/n" /> GB of RAM).
        </li>
      </ul>

      <p>
        Each option above costs money, and you can afford only one of them. But the money spent is worth it if <i>it
        makes the program run in under 60s</i>.
      </p>

      <Header as="h3" block>
        Questions
      </Header>

      <p>
        <strong>[A.2.q6.2]</strong> Which of the options above are worth it? Show your work for each option (e.g.,
        mathematical expressions, narratives).
      </p>

    </>
  )
}

export default MultiCoreCapstone
