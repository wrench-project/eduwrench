/**
 * Copyright (c) 2019-2021. The WRENCH Team.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 */

import React, {useEffect, useState} from "react"
import { Divider, Header } from "semantic-ui-react"
import TeX from "@matejmazur/react-katex"
import LearningObjectives from "../../../components/learning_objectives"
import SimulationActivity from "../../../components/simulation/simulation_activity"
import WorkflowsDataLocalitySimulation from "./workflows_data_locality_simulation"

import WorkflowsDataLocalityPlatformZoom
  from "../../../images/vector_graphs/workflows/workflow_data_locality_platform_zoom.svg"
import WorkflowsDataLocalityQuestion from "../../../images/vector_graphs/workflows/workflow_data_locality_question.svg"
import FeedbackActivity from "../../../components/feedback/feedback_activity";
import FeedbackQuestions from "../../../components/feedback_questions";
import PracticeQuestionReveal from "../../../components/practice-questions/reveal";
import PracticeQuestionNumeric from "../../../components/practice-questions/numeric";
import SigninCheck from "../../../components/signin_check";

const WorkflowsDataLocality = ({ module, tab }) => {

  const [auth, setAuth] = useState("false")
  useEffect(() => {
    setAuth(localStorage.getItem("login"))
  })


  return (
      <>
        <LearningObjectives module={module} tab={tab}/>

        <h2>The need for data locality</h2>

        <p>
          In the previous tab, all workflow tasks were reading/writing data at a remote (from their perspective) storage
          site. The wide-area link has lower bandwidth than the disk's, and the data transfer rate it achieves is
          negatively impacted by high latency. As a result, the workflow execution spends a large fraction of time
          performing remote I/O, which hurts performance and parallel efficiency. This is especially damaging for the
          "intermediate" data files, that is those that are output of one task an input to another. These files are
          written to the remote storage and then immediately read back from it. Keeping these files "close" to the compute
          hosts would be much more efficient.
        </p>
        <p>
          Trying to keep/move data close to where the computation takes place is often called <strong>improving data
          locality</strong>. You may have encountered this term in Computer Architecture or Operating Systems <a
            href="/textbooks">textbooks</a> in the context of caches. Here, we use it in the context of network proximity.
        </p>

        <SigninCheck data={[
          <>

            <h2>Better data locality for our workflow</h2>

            <p>
              Going back to the setup in the previous tab, we want to be able to store data on the compute site. So let's
              enhance that site with a bit more hardware!
            </p>

            <WorkflowsDataLocalityPlatformZoom/>
            <div className="caption"><strong>Figure 1:</strong> Added storage capability at the compute site.</div>

            <p>
              Figure 1 above shows the compute site for the platform in the previous tab, but
              with a new host (shown in green). This host is not used for computation but provides access to a
              disk with 500 MB/sec read/write bandwidth.
            </p>
            <p>
              Given the new storage capability, we can now refine the workflow execution
              strategy: unless a task is an exit task of the workflow, it stores its output
              on the disk at the compute site. In this way, <strong>whenever possible, tasks
              will read/write data to the local storage rather than the remote storage</strong>. The
              initial input files to the workflow are still stored at the remote storage site,
              and the output files must end up there as well.
            </p>

            <Header as="h3" block>
              Simulating Better Data Locality
            </Header>

            <p>
              The simulation app below simulates workflow execution when the compute site
              has storage capabilities. The app is similar to that in the previous
              tab, but allows you to pick the
              value of bandwidth of the wide-area network link between the storage site
              and the compute site. It also allows you to toggle the use of storage at
              the compute site (if not checked, the simulated execution behaves as in the
              previous tab, with poor data locality). You can use the app on your own,
              but then you should use it to answer the practice questions hereafter.
            </p>

            <SimulationActivity panelKey="workflows-data-locality-simulation" content={<WorkflowsDataLocalitySimulation/>}/>

            <Divider/>

            <Header as="h3" block>
              Practice Questions
            </Header>

            <PracticeQuestionReveal
                module={"A.3.4"}
                question_key={"A.3.4.p3.1"}
                question={
                  <>
                    When executing the workflow with a 100 MB/sec wide-area link bandwidth and using a single
                    core, how much time is saved when storing intermediate files at the compute site? Use the simulation
                    to answer this question. If you do a back-of-the-envelope estimation of the time saved based on data
                    sizes and bandwidths, do you get the same answer?
                  </>
                }
                explanation={
                  <>
                    <p>This can be answered by just running the simulation:</p>
                    <ul>
                      <li>With only remote storage: 292.28 seconds</li>
                      <li>With local storage: 239.91 seconds</li>
                    </ul>
                    <p>Thus, the saving is 52.37 seconds.</p>
                    <p>
                      The only difference in the two executions is the I/O times for the intermediate files. In both
                      cases, <TeX math="2 \times 20 \times 100 = 4000 \text{MB}"/> of data are being read/written from/to
                      storage. To the remote storage, this should take time 4000/100 = 40 seconds. To the local storage, this
                      should take time 4000/500 = 8 seconds. So we would expect a saving of <TeX
                        math="40 - 8 = 32"/> seconds. In fact, the saving is quite a bit bigger.
                    </p>
                    <p> This is because the wide-area data transfer rate is not 100 MB/sec, due to the high network
                      latency.</p>
                    <p>
                      We saw this in the previous tab but can re-iterate. The application, when not using any local storage,
                      reads/write a total of <TeX math="20 \times 50 + 2 \times 20 \times 100 + 1 = 5001 \text{MB}"/> of
                      data. Since the application computes for 210 seconds, this means that it spends 292.28 - 210 = 82.28
                      seconds transferring the data. Thus, the actual data transfer rate is 5001/82.28 = 60.78 MB/sec, a far
                      cry from the peak 100 MB/sec!
                    </p>
                    <p>
                      So if we re-compute our saving estimate above using this effective data transfer
                      rate we obtain: 4000/60.78 - 4000/500 = 57.81 seconds. This is much closer to what
                      the simulation gives us. The remaining discrepancy is due to other effects/overheads
                      captured by the simulation (which we will mention in upcoming modules).
                    </p>
                  </>
                }
            />

            <PracticeQuestionNumeric
                module={"A.3.4"}
                question_key={"A.3.4.p3.2"}
                question={
                  <>
                    Still using a 100 MB/sec wide-area link bandwidth, what parallel efficiency (in percentage) can we achieve
                    when using 5 4-core hosts and local storage? Use the simulation to answer this question.
                  </>
                }
                answer={[28, 29]}
                explanation={
                  <>
                    <p> As we saw in the previous question, the sequential (1-core) execution time is 239.91 seconds when
                      using local storage. Using the simulation to determine the parallel execution time we get: 41.85
                      seconds.</p>
                    <p> So the parallel efficiency is (239.91 / 41.85) / 20 = 28.6%. This is better than without using local
                      storage, but still not great.</p>
                  </>
                }
            />

            <PracticeQuestionNumeric
                module={"A.3.4"}
                question_key={"A.3.4.p3.3"}
                question={
                  <>
                    What is the parallel efficiency (in percentage) when doubling the wide-area link bandwidth? Use the simulation to answer this question.
                  </>
                }
                answer={[32, 33]}
                explanation={
                  <>
                    Using the simulation again, we get: (239.91 / 36.59) / 20 = 32.78%.
                  </>
                }
            />

            <PracticeQuestionReveal
                module={"A.3.4"}
                question_key={"A.3.4.p3.4"}
                question={
                  <>
                    Now, set the wide-area link bandwidth to a high 500 MB/sec. Do we see big jump in efficiency?
                    What is the effective wide-area data transfer rate? Is it anywhere close to 500 MB/sec?
                  </>
                }
                explanation={
                  <>
                    <p>Using the simulation again, we get: (239.91 / 33.44) / 20 = 35.8%. This is <i>not</i> a big jump at
                      all.</p>
                    <p>
                      From the simulation output, we see that it takes 4.49 seconds for all tasks to read their
                      input from remote storage. That is for a total of <TeX math="20\times 50 = 1000"/> MB. So the data
                      transfer rate is 1000/4.49 = 222.71 MB/sec. This is not even half of 500 MB/sec. The large
                      latency is preventing us from achieving the peak data transfer rate.
                    </p>
                  </>
                }
            />

            <PracticeQuestionReveal
                module={"A.3.4"}
                question_key={"A.3.4.p3.5"}
                question={
                  <>
                    Assuming the wide-area latency was not a problem, and that we would achieve 500 MB/sec data
                    transfer rate, what would the parallel efficiency be? How close is it from the
                    efficiency when assuming that all I/O takes zero time?
                  </>
                }
                explanation={
                  <>
                    <p>
                      Instead, of 4.49 seconds, the tasks would take "only" 1000/500 = 2 seconds to read their input.
                      So we would shave 2.49 seconds off the execution time. (In fact we would also save a tiny bit
                      for the transfer of the workflow's 1 MB output file.) So the efficiency would be:
                      (239.91 / (33.45 - 2.49)) / 20 = 38.7%.
                    </p>
                    <p>
                      If I/O took zero time, the sequential (1-core) execution time would be
                      (20000 + 1000)/100 = 210, and the parallel execution time would be: 20 seconds.
                      So the efficiency would be (210/20) / 20 = 52%.
                    </p>
                    <p> So with 35.8% we are still pretty far from the ideal parallel efficiency.</p>
                  </>
                }
            />

            <Divider/>

            <Header as="h3" block>
              Questions
            </Header>

            <p>Consider the following workflow:</p>
            <WorkflowsDataLocalityQuestion/>
            <br/><br/>

            <p>
              <strong>[A.3.4.q3.1]</strong> Say we execute this workflow at a compute site that hosts
              a 2-core hosts, with cores computing at
              100 Gflop/sec. All data is read/written from/to a remote
              storage site. How many MB are read/written in total? Show your
              work, giving an expression as a sum of terms.
            </p>

            <p>
              <strong>[A.3.4.q3.2]</strong> Say that the read/write data rate for the remote storage
              site is 200 MB/sec (which, as we know from the simulation above, could be
              well below the actual bandwidth). What is the workflow execution time? Show
              your work, estimating I/O and compute times for all tasks. <i>Hint: be
              careful about how the two blue tasks split the bandwidth.</i>
            </p>

            <p>
              <strong>[A.3.4.q3.3]</strong> We now have local storage at the compute site, with data
              access rate 500 MB/sec. What is the workflow execution time now? What is
              the parallel efficiency? Show your work, using the same approach as in the
              previous question.
            </p>


            <Header as="h3" block>
              Your feedback is appreciated
            </Header>

            <FeedbackActivity content={
              <FeedbackQuestions feedbacks={[
                {
                  tabkey: "workflows_data_locality",
                  module: "A.3.4"
                },
              ]}/>
            }/>

          </>
        ]} auth={auth} content="this content"></SigninCheck>

      </>
  )
}

export default WorkflowsDataLocality
