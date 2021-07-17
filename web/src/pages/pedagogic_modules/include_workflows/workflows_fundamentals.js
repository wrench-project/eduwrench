import React from "react"
import { Divider, Header } from "semantic-ui-react"
import TeX from "@matejmazur/react-katex"
import LearningObjectives from "../../../components/learning_objectives"
import SimulationActivity from "../../../components/simulation/simulation_activity"
import PracticeQuestions from "../../../components/practice_questions"

import ExampleWorkflow from "../../../images/workflows/example_workflow_1.svg"

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

      <Divider />

      <Header as="h3" block>
        Questions
      </Header>


    </>
  )
}

export default WorkflowsFundamentals
