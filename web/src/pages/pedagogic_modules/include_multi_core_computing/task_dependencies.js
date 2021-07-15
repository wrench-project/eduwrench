import React from "react"
import { Divider, Header, Table } from "semantic-ui-react"
import TeX from "@matejmazur/react-katex"
import LearningObjectives from "../../../components/learning_objectives"
import SimulationActivity from "../../../components/simulation/simulation_activity"
import PracticeQuestions from "../../../components/practice_questions"
import TaskDependencies3CoresSimulation from "./task_dependencies_3_cores_simulation"
import TaskDependencies2CoresSimulation from "./task_dependencies_2_cores_simulation"

import ExampleChainDAG from "../../../images/multi_core/multicore_example_chain_dag.svg"
import ExampleCarDAG from "../../../images/multi_core/multicore_example_car_dag.svg"
import ExampleSimulatedDAG from "../../../images/multi_core/multicore_example_simulated_dag.svg"
import PracticeQuestionDAG1 from "../../../images/multi_core/multicore_practice_dag_1.svg"
import PracticeQuestionDAG2 from "../../../images/multi_core/multicore_practice_dag_2.svg"
import QuestionDAG1 from "../../../images/multi_core/multicore_question_dag_1.svg"
import QuestionDAG2 from "../../../images/multi_core/multicore_question_dag_2.svg"
import ExampleIODAG from "../../../images/multi_core/multicore_example_io_dag.svg"

const TaskDependencies = () => {
  return (
    <>
      <LearningObjectives objectives={[
        "Understand the concept of task dependencies",
        "Understand and quantify the impact of task dependencies on parallelism"
      ]} />

      <h2>Basic Concept</h2>

      <p>
        So far, we have only considered <i>independent</i> tasks in our parallel programs, i.e., tasks that can be
        executed in any order and concurrently. In other words, given a computer with as many cores as tasks and
        sufficient RAM capacity, all tasks can run at the same time. But in many real-world programs this is not the
        case. Instead, tasks exhibit <strong>dependencies</strong>. In other words, some tasks cannot execute before
        other tasks are done. This could be because the output of a task serves as input to another, or more generally
        because a specific ordering of some tasks is necessary for program correctness.
      </p>

      <p>
        As an analogy, consider a chef cooking a meal. First, they need to select and procure the ingredients. Second,
        they need to cook these ingredients. Finally, the cooked ingredients must be plated. None of these tasks may be
        completed out of order. The "cook ingredients" task depends on the "procure ingredients" task, and the "plate
        meal" task depends on the "cook ingredients" task. A convenient way to represent such programs is
        a <strong>Directed Acyclic Graph (DAG)</strong>, in which <i>vertices are tasks</i> and <i>edges are
        dependencies</i>. For the "cook a meal" program, the DAG representation is straightforward, and depicted in the
        figure below:
      </p>

      <object className="figure" type="image/svg+xml" data={ExampleChainDAG} />
      <div className="caption"><strong>Figure 1:</strong> DAG for the "chef" example.</div>

      <p>
        Here is a typical example of task dependencies in a parallel program. Consider a program that counts the number
        of car objects in a set of compressed street images. Each image needs to be uncompressed, pre-processed, (e.g.,
        to remove noise), analyzed (to find and count cars). Once this has been done for each image, car count
        statistics need to be displayed. If we have 5 compressed pictures, the program's DAG is:
      </p>

      <object className="figure" type="image/svg+xml" data={ExampleCarDAG} />
      <div className="caption"><strong>Figure 2:</strong> DAG for the "car counting" example.</div>

      <p>
        Note that each task above can involve both I/O and computation. For instance, an "uncompress" task must read in
        an image file from disk to uncompress it. Then, whether it writes back to disk the uncompressed image or keeps
        it in RAM so that the "pre-process" task can do its job is up to the program's software implementation. Given
        that the DAG above does not show any output file for these tasks, the idea is to keep everything in RAM and/or
        I/O operations. Clearly keeping things in RAM can avoid costly I/O operation, but as we know RAM capacity is
        limited. So, based on what we learned in the previous tab, we could lose parallel efficiency due to RAM
        constraints.
      </p>

      <Header as="h3" block>
        Simulating Simple Task Dependencies
      </Header>

      <p>
        For now, to keep things simple, let's assume that tasks take zero RAM and that they perform no I/O. Let's
        consider an example program that is used to analyze some dataset. It begins with a "start" task that does some
        pre-processing of the in-RAM dataset. Then, once the pre-processing is done, it needs to perform three things.
        Namely, it needs to produce some visualization, perform some analysis, and compute some statistics:
      </p>

      <ul>
        <li>The visualization consists of a sequence of two tasks: "viz" (computes what to visualize) and "plot"
          (generates a fancy 3-D plot)
        </li>
        <li>The analysis consists of a sequence of two tasks : "analyze" (performs data analysis) and "summarize"
          (generates summary analysis results)
        </li>
        <li>The statistics consists of a single task: "stats" (computes some statistics)</li>
      </ul>

      <p>
        Once all the above is done, a "display" task displays all results. The "analyze" task has an amount of work that
        is user-defined. The more work, the more in-depth the analysis results.
      </p>

      <p>
        The program's DAG is shown below, with the work of each task (and just X for the analysis task):
      </p>

      <object className="figure" type="image/svg+xml" data={ExampleSimulatedDAG} />
      <div className="caption"><strong>Figure 3:</strong> DAG for the "data set analysis" example.</div>

      <p>
        To gain hands-on experience with the task dependency concept, use the simulation app below to simulate the
        execution of the above program on a 3-core computer, where <strong>each core computes at speed 10
        Gflop/sec</strong>. You can pick the amount of work for the "analyze" task. The execution strategy used for this
        execution is very simple: whenever a task can be executed (because all its parent tasks have been executed) and
        a core is (or becomes) idle, then execute that task on that core immediately. We call a task whose parents have
        all executed a <strong>ready task</strong>. The following practice questions are based on this simulation app.
      </p>

      <SimulationActivity panelKey="multicore-task-dependencies-3-cores"
                          content={<TaskDependencies3CoresSimulation />} />

      <PracticeQuestions questions={[
        {
          key: "A.2.p4.1",
          question: "Say we run the program with an \"analyze\" task that has 100 Gflop work. What is the parallel " +
            "efficiency when running the program on the 3-core computer and when using a single analysis task? Show " +
            "your work, and feel free to use the simulation app to help you.",
          content: (
            <>
              The sequential program's execution on 1 core, T(1), is simply the sum of individual task execution times,
              <TeX math="T(1) = 5 + 20 + 10 + 10 + 10 + 40 + 1 = 96\text{sec}" block />
              The simulated execution time on our 3-core computer is:
              <TeX math="T(3) = 46\text{sec}" block />
              <p>
                So the parallel efficiency is <TeX math="E(3) = (96 / 46) / 3 =" /> <strong>69.56%</strong>.
              </p>
            </>
          )
        },
        {
          key: "A.2.p4.2",
          question: "What is the number of idle core seconds when running the program when the \"analyze\" task has " +
            "300 Gflop work on our 3-core computer? Show your work. You can double-check your answer in simulation.",
          content: (
            <>
              <p>
                This is a very similar question as the previous one. The sequential execution time is 126 seconds, and
                the execution time on 3 cores is still 46 seconds. Therefore, the number of core idle seconds
                is <TeX math="46 \times 3 − 126 = 12" /> seconds.
              </p>
              <p>
                We can double check this answer by counting the number of idle seconds as shown in the Host Utilization
                graph of the simulation app.
              </p>
            </>
          )
        },
        {
          key: "A.2.p4.3",
          question: "For what amount of work of the \"analyze\" task is the parallel efficiency maximized? Show your " +
            "work. You could use the simulation app to \"search\" for the right answer, but that would be really " +
            "tedious. Try using analysis and/or intuition first. This is not an easy question, as it requires " +
            "careful reasoning. Hint: consider two cases depending on whether the critical path is the analysis " +
            "path or the statistics path.",
          content: (
            <>
              <p>
                Let's first do a purely analytical solution. Let <TeX math="x" /> be the work of the "analyze" task in
                Gflop. The sequential execution time is <TeX math="x / 10 + 86" /> seconds.
              </p>

              <p>
                The parallel execution time is a bit trickier.
              </p>
              <p>
                The visualization path takes time <TeX math="5 + 20 + 10 + 1 = 36" /> seconds, which is shorter than the
                statistics path, which takes 46 seconds. The analysis path takes time <TeX
                math="5 + x / 10 + 10 + 1 = 16 + x / 10" /> seconds.
              </p>

              <p>
                So, we have two cases: If <TeX math="16 + x / 10 \leq 46" />, that is, if <TeX math="x \leq 300" />, the
                critical path is the analysis path, otherwise the critical path is the statistics path. So let’s examine
                both cases:
              </p>
              <ul>
                <li>
                  <TeX math="x \leq 300" />: the parallel execution time is 46 seconds, and so the parallel efficiency
                  is equal to <TeX math="(( x / 10 + 86 ) / 46 ) / 3" />. This is maximized for <TeX math="x = 300" />,
                  and is then equal to 84.05%.
                </li>
                <li>
                  <TeX math="x \geq 300" />: the parallel execution time is <TeX math="16 + x/10" />, and so the
                  parallel efficiency is equal to <TeX math="(( x / 10 + 86 ) / ( 16 + x / 10 )) / 3" />. This is a
                  decreasing function on the [300, infinity] domain, and so on that domain it is maximized for <TeX
                  math="x = 300" />.
                </li>
              </ul>
              <p>The final answer is thus 300 Gflop.</p>
              <p>
                The above is quite formal, but we could have given a purely common-sense answer. The parallel efficiency
                is maximized when all three paths take time as close as possible as the longest such path, so as have
                cores working as much as possible. This is the same load balancing idea that we have seen in the
                <a href="/pedagogic_modules/multi_core_computing/">Parallelism tab</a> for independent tasks! This is
                achieved when the analysis path and the statistics path are equal (nothing can be done about the
                visualization path), that is, when <TeX math="x = 300" />.
              </p>
              <p>
                For <TeX math="x = 300" /> the efficiency is 84.05%, which is the best this program can ever achieve.
              </p>
            </>
          )
        }
      ]} />

      <Divider />

      <h2>Levels, Width, Critical Path</h2>

      <p>
        In the previous section, and the practice questions, we touched upon some fundamental concepts without naming
        them explicitly. Let's do so now.
      </p>

      <p>
        A first concept is that of a <strong>DAG level</strong>. A task is on level <TeX math="n" /> of the DAG if the
        longest path from the entry task(s) to this task is of length <TeX math="n" />, <strong>where the path length is
        measured in number of vertices traversed before reaching this task</strong>. By this definition, an entry task
        is in level 0. Every child task of an entry task is in level 1, and so on. Formally, the level of a task is one
        plus the maximum of the levels of its parent tasks (this is a recursive definition).
      </p>

      <p>For our example DAG in Figure 3 above, we can determine the level of each task:</p>

      <Table collapsing size="small" compact>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>task</Table.HeaderCell>
            <Table.HeaderCell>level</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          <Table.Row>
            <Table.Cell>start</Table.Cell>
            <Table.Cell>0</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>viz</Table.Cell>
            <Table.Cell>1</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>analyze</Table.Cell>
            <Table.Cell>1</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>stats</Table.Cell>
            <Table.Cell>1</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>plot</Table.Cell>
            <Table.Cell>2</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>summarize</Table.Cell>
            <Table.Cell>2</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>display</Table.Cell>
            <Table.Cell>3</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>

      <p>
        So we say that this DAG has four levels. Note that this does not mean that the DAG tasks must be executed level
        by level. For instance, we could execute task "plot" (level 2) before task "analyze" (level 1).
      </p>

      <p>
        A second concept is that of <strong>maximum level width</strong>: the maximum number of tasks in the workflow
        levels. For instance, for our example DAG, the maximum level width is 3 because level 1 has 3 tasks (and all
        other levels have fewer tasks). This means that using 3 cores should lead to better performance than using 2
        cores. If we enforce that tasks are executed level-by-level, then we cannot make use of more than 3 cores.
        Otherwise, in general, it may be possible to use more cores to gain some performance advantage. But this is not
        the case for the example DAG in Figure 3, for which a 4th core would never be used.
      </p>

      <p>
        A third concept is that of the <strong>critical path</strong>: the longest path in the DAG from the entry
        task(s) to the exit task(s), where <strong>the path length is measured in task durations, including the entry
        and the exit task(s)</strong>. No matter how many cores are used, the program cannot execute faster than the
        length of the critical path. For instance, consider our example DAG, assuming that the "analyze" task has work
        250 Gflop. There are three paths from "start" to "display". The length of the visualization path
        is <TeX math="5+20+10+1 = 36" /> seconds. The length of the statistics path is <TeX math="5+40+1=46" /> seconds.
        The length of the analysis path is <TeX math="5+25+10+1=41" /> seconds. And so the critical path is {"{"}start"
        -> "stats" -> "display"{"}"}, of length 46 seconds. No matter how many 10 Gflop/sec cores are used to execute
        this program, it can never run in less than 46 seconds!
      </p>

      <Divider />

      <PracticeQuestions questions={[
        {
          key: "A.2.p4.4",
          question: (
            <>
              For the DAG below, give the number of levels, the maximum level width, and the length of the critical path
              in seconds (name and execution time are shown for each task).
              <object className="figure" type="image/svg+xml" data={PracticeQuestionDAG1} />
            </>
          ),
          content: (
            <>
              <ul>
                <li>Number of levels: 4</li>
                <li>Maximum level width: 3 (level 3 has 3 tasks: G, E, and F)</li>
                <li>Length of the critical path: 30s (A 1s, D 20s, F 7s, and H 2s)</li>
              </ul>
            </>
          )
        },
        {
          key: "A.2.p4.5",
          question: (
            <>
              For the DAG below, would it be useful to use more than 3 cores? Can the execution time be ever shorter
              than 29 seconds? Could you modify one edge's end point to increase the DAG's maximum level width? Show
              your work and reasoning.<br />
              <object className="figure" type="image/svg+xml" data={PracticeQuestionDAG2} />
            </>
          ),
          content: (
            <>
              Here is the set of DAG levels:
              <Table collapsing size="small" compact>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>level</Table.HeaderCell>
                    <Table.HeaderCell>tasks</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>

                <Table.Body>
                  <Table.Row>
                    <Table.Cell>0</Table.Cell>
                    <Table.Cell>A</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>1</Table.Cell>
                    <Table.Cell>B, C</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>2</Table.Cell>
                    <Table.Cell>D, E, F</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>3</Table.Cell>
                    <Table.Cell>G</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>4</Table.Cell>
                    <Table.Cell>H</Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table>
              <p>
                It would never be useful to use more than 3 cores because the width of the DAG is 3 (level 2). The DAG's
                critical path is {"{"}A->B->D->G->H{"}"}, which has length 28s. So yes, the execution (on 3 cores) could
                be lower than 29s.
              </p>
              <p>
                Replacing the D->G edge by a D->H edge would make the DAG’s maximum level width 4 (i.e., level 2 would
                have 4 tasks in it).
              </p>
            </>
          )
        }
      ]} />

      <Divider />

      <h2>Choosing which task to run next</h2>

      <p>
        In our example dataset analysis program, there was never a choice for deciding which task to run next. First, we
        have to run "start". Then, we have three tasks that are <strong>ready</strong>, that is, whose parents have all
        executed. Since we have 3 cores, we run all three, each on one core. In other words, since we have 3 paths in
        the DAG and 3 cores, we just run each path on its own core.
      </p>

      <p>
        In general however, we could have <strong>more ready tasks than idle cores, in which case we have to pick which
        ready tasks to run</strong>. This, turns out, can be a difficult problem known as "DAG scheduling". We explore
        this advanced topic in later modules, but for now we can get a sense for it via our example.
      </p>

      <p>
        Let's say that we now must run the program on a 2-core computer. We have a choice after "start" completes: we
        have 3 ready tasks and only 2 cores. Say we run "analyze" and "stats". If "analyze" completes before "stats",
        then we have another choice: should we run "viz" or "summarize"? It turns out that some of these choices are
        better than others. In this small example the "bad" choices are not terrible, but for larger DAGs they could
        lead to a large performance loss.
      </p>

      <p>
        There are some rules of thumb for selecting ready tasks. A good and popular one is: Whenever there is a choice
        <strong>pick the task that is on the critical path</strong>. After all it is critical. But this is not
        guaranteed to be always best. It just happens to work well for many DAGs.
      </p>

      <Header as="h3" block>
        Simulating Execution on a 2-core Computer
      </Header>

      <p>
        To see the impact of task selection decisions, the simulation app below allows you to simulate the execution of
        our dataset analysis program <strong>on 2 cores</strong> while prioritizing some execution paths. For instance,
        if you select "viz/analyze", whenever there is a choice, we always pick a visualization or an analysis task over
        the "stats" task.
      </p>

      <p>
        You can experiment yourself with different settings, and use the app to answer the practice questions
        thereafter.
      </p>

      <SimulationActivity panelKey="multicore-task-dependencies-2-cores"
                          content={<TaskDependencies2CoresSimulation />} />

      <Divider />

      <PracticeQuestions questions={[
        {
          key: "A.2.p4.6",
          question: "Setting the \"analyze\" task's work to 10 Gflop, does it matter which paths are prioritized " +
            "when executing the program on 2 cores? If so, which ones should be prioritized? Can you venture an " +
            "explanation? Show your work and reasoning.",
          content: (
            <>
              <p>
                Yes, it does matter! Not prioritizing the statistics path is a mistake. This is because the statistics
                path is the critical path. Not counting the "start" and "display" tasks, the visualization path runs in
                30s, the analysis path in 11s, and the stats path in 40s. This is <strong>exactly</strong> the problem
                we looked at in the <a href="/pedagogic_modules/multi_core_computing">first tab</a>: partition a set of
                numbers into two groups so that their sums are as close to each other as possible! The best choice for
                this grouping here is clearly {"{"}30, 11{"}"} and {"{"}40{"}"}. In other words, on one core we should
                run the visualization and the analysis path, and on the other we should run the statistics path.
              </p>
              <p>
                So, if we prioritize both the visualization and analysis paths after task "start" completes, they will
                run on different cores, which is a bad choice (as the groupings will be {"{"}30{"}"} and {"{"}11,
                40{"}"}). Conclusion: the "stats" path should be part of the two prioritized paths.
              </p>
              <p>All this can be seen easily in the simulation app.</p>
            </>
          )
        },
        {
          key: "A.2.p4.7",
          question: "Say now we set the work of the \"analyze\" task to be 300 Gflop. What are the execution times " +
            "with each of the three path prioritization options? Show your work and explain why the results are " +
            "as they are.",
          content: (
            <>
              <p>
                All three prioritization schemes give a 76 second execution time. In other words, path prioritization
                does not matter. With a 300 Gflop work for the "analyze" task, the visualization path takes 30 seconds,
                and both the analysis and the statistics paths take 40 seconds. (Without counting the "start" and the
                "display" tasks). No matter what we do, running on two cores three tasks that take 30s, 40s, and 40s
                will take 70s.
              </p>
              <p>
                If you really want to spell it out, we can just look at all possibilities. If both 40s paths start
                first, each on a core, then the 30s path starts after that, for 70s of execution. If the 30s path starts
                with a 40s path, each on a core, then the 2nd 40s path will start on the core that ran the 30s path,
                since it becomes idle first. This, again, is a 70s execution. So overall, the execution will always be 5
                + 70 + 1 = 76s.
              </p>
            </>
          )
        },
        {
          key: "A.2.p4.8",
          question: "Is it possible that, for some amount of work of the \"analyze\" task, all three different " +
            "prioritizing options lead to three different execution times (when executing the program on 2 cores)? " +
            "Show your work and reasoning. Although you may have a rapid intuition of whether the answer is yes " +
            "or no, deriving a convincing argument is not that easy...",
          content: (
            <>
              <p>
                This is perhaps not an easy question, as it requires to think about this abstractly (so as to avoid
                examining all possibilities). The answer is "no". Let’s see why.
              </p>
              <p>
                We can look at this question at a very abstract level: we have three "things" to run, let’s call
                them <TeX math="A" />, <TeX math="B" />, and <TeX math="C" />. (Each of them is one of our three paths,
                excluding the "start" and "display" tasks). Let <TeX math="a" />, <TeX math="b" />, and <TeX
                math="c" /> be their execution times. Say, without loss of generality, that <TeX
                math="a \leq b \leq c" />. Then, we can see what runs on each core for each option that prioritizes two
                of them:
              </p>
              <Table collapsing size="small" compact>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>prioritizing</Table.HeaderCell>
                    <Table.HeaderCell>core #1</Table.HeaderCell>
                    <Table.HeaderCell>core #2</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>

                <Table.Body>
                  <Table.Row>
                    <Table.Cell><TeX math="A" /> and <TeX math="B" /></Table.Cell>
                    <Table.Cell><TeX math="A" /> then <TeX math="C" /></Table.Cell>
                    <Table.Cell><TeX math="B" /></Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell><TeX math="A" /> and <TeX math="C" /></Table.Cell>
                    <Table.Cell><TeX math="A" /> then <TeX math="B" /></Table.Cell>
                    <Table.Cell><TeX math="C" /></Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell><TeX math="B" /> and <TeX math="C" /></Table.Cell>
                    <Table.Cell><TeX math="B" /> then <TeX math="A" /></Table.Cell>
                    <Table.Cell><TeX math="C" /></Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table>
              <p>
                The two prioritized things start first. Then the third thing runs on the core that becomes idle first
                (i.e., the core that was running the shortest thing).
              </p>
              <p>
                We note that in the table above, the 2nd and 3rd rows are identical. That is, the cores finish computing
                at the same time. The only thing that changes is the order in which things run on core #1 ("<TeX
                math="A" /> then <TeX math="B" />" or "<TeX math="B" /> then <TeX math="A" />"). Therefore, two of the
                prioritization options always produce the same outcome in terms of overall program execution time!
              </p>
            </>
          )
        }
      ]} />

      <Divider />

      <Header as="h3" block>
        Questions
      </Header>

      <p>
        <strong>[A.2.q4.1]</strong> For the DAG below, where each task has an execution time in seconds on a core of
        some computer, give the number of levels, the maximum level width, and the length of the critical path in
        seconds.
      </p>
      <object className="figure" type="image/svg+xml" data={QuestionDAG1} />

      <p>
        <strong>[A.2.q4.2]</strong> For the DAG in the previous question, what would be the parallel efficiency on 3
        cores? Show your work and reasoning.
      </p>

      <p>
        <strong>[A.2.q4.3]</strong> We now execute this same DAG on 2 cores. Whenever there is a choice for picking a
        ready task for execution, we always pick the ready task with the largest work (this is a "I should do the most
        time-consuming chores first" approach). What is the execution time? Show your work. It is likely a good idea to
        depict the execution as a Gantt chart, as seen in the simulation output.
      </p>

      <p>
        <strong>[A.2.q4.4]</strong> Still for that same DAG on 2 cores, we now pick the ready task with the smallest
        work first (this is a "I should do the easiest chores first" approach). What is the execution time? It is better
        than the previous approach? Show your work. Use the same approach as in the previous question.
      </p>

      <p>
        <strong>[A.2.q4.5]</strong> For this new DAG below, executed on 2 cores, what are the execution times of the
        "pick the ready task with the largest work" and "pick the ready task with the smallest work" approaches? Which
        approach is better? Show your work. For each approach it is likely a good idea to depict the Gantt chart of the
        application execution for determining the execution time.
      </p>
      <object className="figure" type="image/svg+xml" data={QuestionDAG2} />

    </>
  )
}

export default TaskDependencies
