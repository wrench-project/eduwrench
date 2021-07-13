import React, { useState } from "react"
import { Divider, Header, Segment } from "semantic-ui-react"
import TeX from "@matejmazur/react-katex"
import LearningObjectives from "../../../components/learning_objectives"

const Capstone = () => {
  return (
    <>
      <LearningObjectives objectives={[
        "Be able to apply the concepts learned in this module to reason about and optimize the performance of a\n" +
        "scenario that includes computation activities, I/O activities, and RAM constraints"
      ]} />

      <h2>Production Scenario</h2>

      <p>
        You are working for a company that uses a single-core computer to run computational tasks as part of day-to-day
        business. The specifications of the computer and tasks are as follows:
      </p>

      <p>
        <strong>Machine</strong>
        <ul>
          <li>1 1-Core CPU that computes at 50 Gflop/sec</li>
          <li>12 GB of RAM</li>
          <li>1 HDD with 1TB capacity and 200 MB/sec R/W bandwidth</li>
        </ul>
      </p>

      <p><strong>Tasks</strong></p>
      <p>
        Two tasks need to be run back-to-back throughout the day. Each task proceeds in three phases: (i) it reads its
        input file fully; (ii) it computes; and (iii) it writes its output file fully. Each task has a memory footprint
        that must be allocated to it throughout its execution (i.e., from the time it begins reading its input file
        until it finishes writing its output file).
      </p>

      <ul>
        <li>Task A:</li>
        <ul>
          <li>500 Gflop</li>
          <li>Requires 12 GB of RAM</li>
          <li>Input File (Read from disk before computation can start): 4 GB</li>
          <li>Output File (Written to disk after computation has completed): 2 GB</li>
        </ul>
        <li>Task B:</li>
        <ul>
          <li>800 Gflop</li>
          <li>Requires 12 GB of RAM</li>
          <li>Input File (Read from disk before computation can start): 2 GB</li>
          <li>Output File (Written to disk after computation has completed): 4 GB</li>
        </ul>
      </ul>

      <h3>Phase #1: Hardware upgrades for the current implementation</h3>

      <p>
        In the current implementation of the software that executes the two tasks, the first task must run to completion
        (i.e., its output file must be written to disk) before the next task cant start executing (i.e., start reading
        its input file from disk).
      </p>

      <p>
        Your manager has tasked you with decreasing the total execution time for executing the two tasks. Ignoring
        things like hardware wear-and-tear and reliability, you have some decisions to make as far as allocating funds
        to upgrade the computer used to run the tasks. Here are possible upgrades:
      </p>

      <p><strong>CPU Upgrades</strong></p>
      <ul>
        <li>Keep current 50 Gflop/sec CPU for $0</li>
        <li>Upgrade CPU to 100 Gflop/sec for $100</li>
        <li>Upgrade CPU to 200 Gflop/sec for $250</li>
      </ul>

      <p><strong>RAM Upgrades</strong></p>

      <ul>
        <li>Keep current 12 GB RAM for $0</li>
        <li>Upgrade to 16GB RAM for $50</li>
        <li>Upgrade to 32GB RAM for $100</li>
      </ul>

      <p><strong>Storage Upgrades</strong></p>

      <ul>
        <li>Keep current 200 MB/sec HDD for $0</li>
        <li>Upgrade to SSD with 400 MB/sec R/W for $100</li>
        <li>Upgrade to SSD with 500 MB/sec R/W for $250</li>
      </ul>

      <p>
        Your manager has allocated $250 to spend for upgrades. Leftover money is encouraged if spending it will not
        decrease execution time further.
      </p>

      <Header as="h3" block>
        Questions
      </Header>

      <p>
        <strong>[A.1.q5.1]</strong> What is the execution time of this 2-task application on that computer? Show your
        work by computing and adding all I/O and compute times for each task.
      </p>

      <p>
        <strong>[A.1.q5.2]</strong> Is the execution I/O-intensive or CPU-intensive? Explain your reasoning.
      </p>

      <p>
        <strong>[A.1.q5.3]</strong> If you were given only $100 to spend on upgrades, which upgrade in the list above
        would you purchase? You can answer this question purely via reasoning without computing anything. Show your
        work.
      </p>

      <p>
        <strong>[A.1.q5.4]</strong> What is the optimal way to spend the $250 on upgrades to decrease execution time and
        what is the corresponding execution time? Show your work by discussing all possible ways to spend the money and
        estimating the execution time for each.
      </p>

      <p>
        <strong>[A.1.q5.5]</strong> Will the execution then be I/O-intensive or CPU-intensive? Explain your reasoning.
      </p>

      <Divider />

      <h3>Phase #2: Hardware upgrades for a better implementation</h3>

      <p>
        Before you purchase the upgrades you determined in question A.1.q5.4 above, your manager informs you that a
        software engineer in the company has just rewritten the software so that the execution can be more efficient:
        when the first task starts performing its computation, the second task can then start reading its input file
        from disk. However, only one task can compute at a time, and only one I/O operation can be performed at a time.
        So, for instance, if at time <TeX math="t" /> the first task begins computing, which will last 100 seconds, and
        the second task begins reading its input file, which will last 200 seconds, then the first task will only start
        writing its output file at time <TeX math="t + 200" /> (i.e., it has to wait for the disk to be idle). The above
        is only feasible if there is <strong>sufficient RAM to accommodate both tasks</strong>.
      </p>

      <Header as="h3" block>
        Questions
      </Header>

      <p>
        <strong>[A.1.q5.6]</strong> If you execute A before B, what is the best way to spend the $250 on upgrades?
        Consider all possible ways to spend the money. Hint: one upgrade is necessary to make the execution different
        from that in A.1.q5.4 above. Show your work by expressing the execution time as a mathematical expression (it’s
        a good idea to depict the execution as in the figures in the previous tab), and modifying the terms in this
        expression based on different upgrades to compare their effect on execution time.
      </p>

      <p>
        <strong>[A.1.q5.7]</strong> If you execute B before A, what is the best way to spend the $250 on upgrades? Use
        the same approach as for the previous question and show your work similarly.
      </p>

      <p>
        <strong>[A.1.q5.8]</strong> Considering the best of these two options (i.e., A.1.q5.6 and A.1.q5.7), compare and
        contrast to your answer to A.1.q5.4 in terms of money spend and execution time achieved. Is the more complex
        implementation worthwhile? Show your reasoning.
      </p>

    </>
  )
}

export default Capstone
