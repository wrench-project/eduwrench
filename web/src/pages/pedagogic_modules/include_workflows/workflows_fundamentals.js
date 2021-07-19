import React from "react"
import { Divider, Header, Table } from "semantic-ui-react"
import TeX from "@matejmazur/react-katex"
import LearningObjectives from "../../../components/learning_objectives"
import SimulationActivity from "../../../components/simulation/simulation_activity"
import WorkflowFundamentalsSimulation from "./workflow_fundamentals_simulation"
import PracticeQuestions from "../../../components/practice_questions"

import ExampleWorkflow from "../../../images/workflows/example_workflow_1.svg"
import WorkflowsFundamentalsQuestion from "../../../images/workflows/workflow_fundamental_question.svg"

const WorkflowsFundamentals = () => {
  return (
    <>
      <LearningObjectives objectives={[
        "Understand the concept of a workflow",
        "Be able to reason about the performance of a workflow on a multi-core computer"
      ]} />

      <h2>What is a workflow?</h2>

      <p>
        A <strong>workflow</strong> (a.k.a. "scientific workflow") application is comprised of individual computational
        tasks that must all be executed in some particular sequence to produce a final desired output (e.g., all the
        steps necessary to perform some complex genomic analysis can be organized as a bioinformatics workflow). In
        practice, <strong>the tasks are stand-alone executable programs that read in input files and produce output
        files</strong>. A file produced as output by one task can be required as input for another task. Consequently, a
        workflow is typically represented as a <strong>DAG of tasks</strong> where edges are file dependencies (see
        the <a href="/pedagogic_modules/multi_core_computing">Dependencies tab of the Multi Core Computing module</a>)
        in which we already discussed dependencies between tasks).
      </p>

      <p>There are two typical "rules of execution" in practice:</p>
      <ul>
        <li><i>A task cannot start before all its input files have been generated.</i></li>
        <li><i>A task's output file is available only once all of that task's output files have been generated.</i></li>
      </ul>
      <p>
        In other words, a task is considered completed only once it has written all
        its output files. Until then, its output files are "invisible" to
        other tasks. This is because, unless we know the details of a task's
        implementation, we can never be sure when an output file is finalized before
        the task's program actually exits.
      </p>

      <p><strong>For now, we assume that a task can only run using a single core</strong>.</p>

      <p>The figure below depicts an example workflow application:</p>

      <object className="figure" type="image/svg+xml" data={ExampleWorkflow} />
      <div className="caption"><strong>Figure 1:</strong> Example workflow application, where each task has an
        amount of work to do (in GFlop) and a memory footprint (in GB). Some examples of real-world workflows for
        scientific applications, along with their DAG representations, can be found <a
          href="https://pegasus.isi.edu/application-showcase/" target="_blank">here</a>.
      </div>

      <p>
        <strong>Note:</strong> In this module, for simplicity, we assume that workflow tasks "communicate" only via
        files. While this is the case for many real-world workflow applications, other options are of course also common
        (e.g., network communications, sharing memory).
      </p>

      <Header as="h3" block>
        Simulating Multi-core Workflow Execution
      </Header>

      <p>
        This module relies heavily on concepts introduced in previous modules. To make sure you master these concepts,
        we provide you with a simulation app and accompanying practice questions thereafter. <strong>If you find this
        content too difficult or are missing key knowledge, you may want to review the previous modules</strong>. In
        particular, many concepts come from the <a href="/pedagogic_modules/single_core_computing">Single Core Computing
        module</a> and the <a href="/pedagogic_modules/multi_core_computing">Multi Core Computing module</a>.
      </p>

      <p>
        The app below simulates the execution of the example workflow in Figure 1 on a computer with 50 Gflop/sec cores
        and 16 GB of RAM. Attached to this computer is a disk. The app allows you to pick the number of cores and the
        disk read/write bandwidth.
      </p>

      <p>
        As these pedagogic modules increase in complexity and sophistication, the number of execution options also
        increases. The example workflow above is designed to have an execution that is relatively constrained in terms
        of the number of execution options. But we still need to specify some aspects of the execution strategy
        simulated by the app:
      </p>

      <ul>
        <li>A core never runs more than one task at time (this is because, as in all previous modules, we disallow
          time-sharing of cores);
        </li>
        <li>When there is not enough free RAM on the computer, tasks cannot be started;</li>
        <li>When there are multiple ready tasks, they are started on cores in lexicographical order (i.e., "task2" would
          start before "task3");
        </li>
        <li>When two ready tasks are started they immediately read their input files. For instance, if task2 and task3
          are ready and can both run simultaneously (enough cores, enough RAM), they do start at the same time
          and read their input files simultaneously. Importantly, these tasks then split the disk bandwidth equally.
        </li>
      </ul>

      <SimulationActivity panelKey="workflows-fundamentals-simulation" content={<WorkflowFundamentalsSimulation />} />

      <PracticeQuestions
        header={
          <>
            Answer these practice questions, using the simulation app and/or using analysis (and then using the app for
            double-checking your results):
          </>
        }
        questions={[
          {
            key: "A.3.4.p1.1",
            question: "How many MB of data are read and written by the workflow when executed on this computer? " +
              "Show your work.",
            content: (
              <>
                <p>
                  This can easily be done analytically. The table below shows for each file the
                  total amount of read/write it causes in MB:
                </p>

                <Table striped collapsing compact>
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell>file</Table.HeaderCell>
                      <Table.HeaderCell>size in MB</Table.HeaderCell>
                      <Table.HeaderCell>times read</Table.HeaderCell>
                      <Table.HeaderCell>times written</Table.HeaderCell>
                      <Table.HeaderCell>total MB read/written</Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    <Table.Row>
                      <Table.Cell>data</Table.Cell>
                      <Table.Cell>500</Table.Cell>
                      <Table.Cell>1</Table.Cell>
                      <Table.Cell>0</Table.Cell>
                      <Table.Cell>500</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>filtered</Table.Cell>
                      <Table.Cell>400</Table.Cell>
                      <Table.Cell>3</Table.Cell>
                      <Table.Cell>1</Table.Cell>
                      <Table.Cell>1600</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>finalA</Table.Cell>
                      <Table.Cell>200</Table.Cell>
                      <Table.Cell>1</Table.Cell>
                      <Table.Cell>1</Table.Cell>
                      <Table.Cell>400</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>finalB</Table.Cell>
                      <Table.Cell>200</Table.Cell>
                      <Table.Cell>1</Table.Cell>
                      <Table.Cell>1</Table.Cell>
                      <Table.Cell>400</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>finalC</Table.Cell>
                      <Table.Cell>200</Table.Cell>
                      <Table.Cell>1</Table.Cell>
                      <Table.Cell>1</Table.Cell>
                      <Table.Cell>400</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>aggBC</Table.Cell>
                      <Table.Cell>200</Table.Cell>
                      <Table.Cell>1</Table.Cell>
                      <Table.Cell>1</Table.Cell>
                      <Table.Cell>400</Table.Cell>
                    </Table.Row>
                  </Table.Body>
                </Table>
                <p>So the total amount of data read/written is <TeX math="500 + 1600 + 4 \times 400 = 3700" /> MB.</p>
                <p>
                  We can verify this in simulation. Running the app with 1 core and with disk bandwidth set to 100, the
                  total execution time is 231 seconds. The time to perform the computation is the sum of the task
                  execution times: <TeX math="10 + 20 + 100 + 20 + 40 + 4 = 194" /> seconds.
                </p>
                <p>
                  So the time to perform the I/O is <TeX math="231 - 194 = 37" /> seconds. Since the disk bandwidth is
                  100 MB/sec, this means the total data size is: 3700 MB!
                </p>
              </>
            )
          },
          {
            key: "A.3.4.p1.2",
            question: "What is the parallel efficiency when executing the workflow on 3 cores and when the disk " +
              "bandwidth is 150 MB/sec? Show your work.",
            content: (
              <>
                The simulation shows that the 1-core execution takes time 218.67 seconds,
                while the 3-core execution takes time 197.33 seconds. So the speedup
                on 3 cores is 218.67 / 197.33 = 1.108. Meaning that the parallel efficiency
                is 1.108/3 = 36.9%. This is pretty low.
              </>
            )
          },
          {
            key: "A.3.4.p1.3",
            question: "Explain why there is never any improvement when going from a 2-core execution to a  3-core " +
              "execution for this workflow?  Show your work.",
            content: (
              <>
                <p>
                  The lack of improvement is easy to see in the simulation. In fact, executions look
                  identical with 2 and 3 cores.
                </p>
                <p>
                  The width of the DAG is 3, so in principle using 3 cores could be useful.
                  The only level of the DAG with 3 tasks is the "blue" level. Unfortunately,
                  the 3 tasks in that level cannot run concurrently due to RAM constraints.
                  At most 2 of them can run concurrently (task3 and task4) since together
                  they use less than 16 GB of RAM.
                </p>
              </>
            )
          },
          {
            key: "A.2.3.p1.4",
            question: "Consider the execution of this workflow on 2 cores with disk bandwidth set to 50 MB/sec. " +
              "Is the disk ever used concurrently by tasks? How can you tell based on the simulation output? " +
              "Show your work.",
            content: (
              <>
                <p>
                  Tasks task3 and task4 use the disk concurrently. This is easily seen in the
                  "Workflow Task Data" section of the simulation output. For instance, task3 spends 16
                  seconds reading its input file. Given that this file is 400 MB, this means that
                  task3 experiences a read bandwidth of 400/16 = 25 MB/sec. This is half of
                  the disk bandwidth, meaning that the disk is used concurrently by another task (task4),
                  which also gets half of the disk bandwidth.
                </p>
              </>
            )
          },
          {
            key: "A.2.3.p1.5",
            question: "Considering a 1-core execution of the workflow, for which disk bandwidth would the execution " +
              "be perfectly balanced between computation time and I/O time? Show your work.",
            content: (
              <>
                <p>
                  Let <TeX math="B" /> be the unknown bandwidth. The compute time is, as we saw in question A.2.3.p1.1
                  above, 194 seconds. The I/O time, again based on what we saw in that previous question, is <TeX
                  math="3700 / B" /> seconds. So we simply need to solve:
                </p>
                <TeX math="3700 / B = 194" block />
                <p>
                  which gives <TeX math="B" /> = 19.07 MB/sec. We can verify this in simulation by setting
                  <TeX math="B" /> to 19. The simulation shows a total execution time of 388.7 seconds,
                  which is almost exactly twice 194.
                </p>
              </>
            )
          },
          {
            key: "A.2.3.p1.6",
            question: "Considering computation and I/O, what is the length of the workflow's critical path (in " +
              "seconds) if the disk bandwidth is 100 MB/sec? show your work.",
            content: (
              <>
                <p>
                  In the <a href="/pedagogic_modules/multi_core_computing">Task Dependencies tab of the Multi Core
                  Computing module</a> we defined the critical path without any I/O. Extending this notion to I/O is
                  straightforward (one can simply consider file reads and writes as extra tasks to perform).
                </p>
                <p>
                  We have 3 possible paths in the workflow, and for each one we can compute
                  its length (i.e., duration in seconds), as follows (note that all intermediate files
                  are both written and read, and hence are counted "twice"):
                </p>
                <ul>
                  <li>task1->task2->task6: 5 + 10 + 4 + 4 + 20 + 2 + 2 + 4 = 51 seconds</li>
                  <li>task1->task3->task5->task6: 5 + 10 + 4 + 4 + 100 + 2 + 2 + 40 + 2 + 2 + 4 = 175 seconds</li>
                  <li>task1->task4->task5->task6: 5 + 10 + 4 + 4 + 20 + 2 + 2 + 40 + 2 + 2 + 4 = 95 seconds</li>
                </ul>
                <p>
                  The critical path (the middle path) has length 175 seconds. No execution can proceed faster
                  than 175 seconds no matter how many cores are used.
                </p>
              </>
            )
          },
          {
            key: "A.2.3.p1.7",
            question: "Explain why this workflow is poorly suited for parallel execution in general and on our " +
              "3-core computer in particular. Hint: There are several reasons why.",
            content: (
              <>
                <p>There are three clear problems here:</p>
                <ul>
                  <li><i>Problem #1:</i> Only 1 level of the workflow has 3 tasks, and all other levels have
                    1 task. So this workflow is mostly sequential, and <strong>Amdahl's law</strong> tells us this is
                    bad news.
                  </li>

                  <li><i>Problem #2:</i> The only parallel level (the "blue" level) suffers from high
                    <strong>load imbalance</strong>. One task runs in 100 seconds, while the other two
                    run in 20 seconds. So, when running on 3 cores, assuming no I/O, the parallel efficiency is
                    at most (140/100)/3 = 46.6%.
                  </li>

                  <li><i>Problem #3:</i> On our particular computer, the <strong>RAM constraints</strong> make things
                    even worse as the workflow's width becomes essentially 2 instead of 3. We can never run the
                    3 blue tasks in parallel.
                  </li>
                </ul>
                <p>
                  To get a sense of how "bad" this workflow is, let's assume infinite
                  disk bandwidth and infinite RAM capacity (which removes Problem #3 above). In this case, on 3 cores,
                  the workflow would run in time: 10 + 100 + 40 + 4 = 154 seconds. The
                  sequential execution time would be 194 seconds. So the speedup would only
                  be 1.26, for a parallel efficiency of only 42%. <i>Amdahl's law is never
                  good news.</i>
                </p>
              </>
            )
          }
        ]} />

      <Divider />

      <Header as="h3" block>
        Questions
      </Header>

      <p>Given the workflow below, answer the following questions:</p>

      <object className="figure" type="image/svg+xml" data={WorkflowsFundamentalsQuestion}/>

      <p>
        <strong>[A.2.3.q1.1]</strong> How many MB of data are read during an execution of this workflow? How many are
        written? Show your work.
      </p>

      <p>
        <strong>[A.2.3.q1.2]</strong> Say we run this workflow on a 1-core computer where the core speed is 100
        Gflop/sec and the disk has read/write bandwidth at 100 MB/sec. What is the workflow execution time? Show your
        work.
      </p>

      <p>
        <strong>[A.2.3.q1.3]</strong> Say now this computer has 2 cores, and the workflow execution strategy is,
        whenever there is a choice, to start the task with the **highest work**. What is the execution time? What is the
        parallel efficiency? Show your work. It is likely a good idea to draw the Gantt chart of the execution to
        estimate the execution time as a sum of terms.
      </p>

      <p>
        <strong>[A.2.3.q1.4]</strong> Would the result be different if we instead picked the tasks with the **lowest
        work** first? Explain why or why not.
      </p>

      <p>
        <strong>[A.2.3.q1.5]</strong> Say we now have 4 cores. Explain why there is no way to get the parallel
        efficiency above 60% even if the disk can be upgraded at will.
      </p>

    </>
  )
}

export default WorkflowsFundamentals
