import React from "react"
import LearningObjectives from "../../../components/learning_objectives"

import Basics from "../../../images/vector_graphs/batch_scheduling/basics.svg"
import {Header} from "semantic-ui-react";
import FeedbackActivity from "../../../components/feedback/feedback_activity";
import FeedbackQuestions from "../../../components/feedback_questions";

const BasicConcepts = ({ module, tab }) => {
  return (
    <>
      <LearningObjectives module={module} tab={tab} />

      <h2>Batch Schedulers</h2>

      <p>
        Large parallel platforms are expensive, not only for the initial hardware
        purchases and ongoing maintenance, but also in terms of electrical power
        consumption. This is why in most organizations these platforms
        are <strong>shared</strong> among users. This sharing can be done in different ways depending
        on the context. For instance, cloud providers allow sharing by
        giving user virtual machine instances that transparently run on the
        physical machines. In the field of High Performance Computing (HPC), a typical
        way to share physical machines among users is via a <strong>batch scheduler</strong>.
      </p>

      <p>
        Consider a cluster of homogeneous compute nodes (or just "nodes"). A batch
        scheduler is to the cluster what the host at the entrance is to a restaurant. 
        More specifically, it is a software service that allows users to submit <strong>jobs</strong> to the
        cluster. Submitting jobs is typically the only way for users to access the
        cluster's nodes. Each job specifies a desired <i>number of nodes</i>, a
        desired <i>duration</i>, and a program to run on these nodes. For instance, a job can
        say: "I need 4 nodes for 2 hours". These job requests are placed in
        a <strong>queue</strong>, where they wait until the nodes they need are available.
        After waiting in the queue, a job is allocated to and started on available
        nodes. 
      </p>

      <p>
        The diagram below depicts the operation of a batch scheduler. A job (orange) is running using 6 compute nodes.
        Another job (blue)
        was waiting in the queue but, due to the availability of compute nodes, was just started on 7 compute nodes. No
        other job
        is running, leaving 7 compute nodes idle. Another job (green) is still waiting in the queue, likely because it
        needs
        more than 6 compute nodes. Finally, a new job (purple) was just submitted by a user, and has been placed in the
        queue.
      </p>

      <p style={{ textAlign: "center" }}>
        <Basics />
      </p>

      <p>
        Importantly, <strong>jobs are forcefully terminated if they go over their
        time limit!</strong> So if the user's program needs 3 hours to run but the job
        only requested 2 hours, the program will not complete successfully. Unless
        the program has saved its state to disk while it was running, all is lost
        and the program must be restarted from scratch.
      </p>

      <h2>Slurm</h2>

      <p>
        A well-known batch scheduler is <a href="https://slurm.schedmd.com" target="_blank">Slurm</a>. In
        this pedagogic module, you will be presented with simulated scenarios in which Slurm is installed on a cluster
        to
        which you want to submit jobs. We picked Slurm due to its popularity, but
        the same concepts apply to all batch schedulers.
      </p>

      <p>
        <strong>Disclaimer</strong>: This module does not provide comprehensive Slurm training, but is instead
        a gentle introduction to batch scheduling, using Slurm
        as an example. You will only be exposed to a small and simplified subset of
        the Slurm functionality. This module is thus a first step towards
        becoming an expert Slurm user.
      </p>

        <Header as="h3" block>
            Your feedback is appreciated
        </Header>

        <FeedbackActivity content={
            <FeedbackQuestions feedbacks={[
                {
                    tabkey: "basic_concepts",
                    module: "C.1"
                },
            ]} />
        } />

    </>
  )
}

export default BasicConcepts
