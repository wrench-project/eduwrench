import React from "react"
import { Divider, Header, Segment } from "semantic-ui-react"
import TeX from "@matejmazur/react-katex"
import LearningObjectives from "../../../components/learning_objectives"

const JobCancellation = ({ module, tab }) => {
  return (
    <>
      <LearningObjectives module={module} tab={tab} />

      <h2>The <tt>scancel</tt> command</h2>

      <p>
        You have learned to use the <code>sbatch</code> command to submit jobs. The
        <code>scancel</code> command is used to cancel a job that has previously been
        submitted. It takes a job ID (which was returned by <code>sbatch</code>) as its
        single command-line argument.
      </p>

      <h2>Simulated scenario</h2>
      <p>
        As with the simulated scenario in the previous tab, you can access
        a simulated terminal on the 32-node cluster's head node by
        using the following command to start a Docker container:
      </p>

      <Segment raised>
        <code>
          docker run -p 8808:8808 --rm -it wrenchproject/eduwrench-slurm-terminal ./run_it.sh tab4
        </code>
      </Segment>

      <p> and, in a new browser window, navigate to: <a href="http://localhost:8808"
                                                        target="_blank">http://localhost:8808</a>. </p>

      <p>
        As in the previous tab, again, your home directory in the simulated terminal contains the <code>myprogram</code>
        program and the <code>batch.slurm</code> batch script.
      </p>

      <p>
        <strong>User competition:</strong> In the previous tab, you were the only user on the cluster.
        Now, instead, <strong>you are competing with other users!</strong> These other users
        submit whatever jobs whenever they want, which is out of your control. <b>All these other users,
        when submitting a job, ask for <i>exactly</i> the time they need</b>.
      </p>


      <Divider />

      <Header as="h3" block>
        Questions
      </Header>

      <p>
        Interact with the simulated terminal to perform the following steps and answer the questions answer the questions (recall that <code>myprogram</code> runs
        in <TeX math="2 + 20/n " /> hours on <TeX math="n" /> nodes).
      </p>

      <p><strong>[C.1.q4.1] Job submission and cancellation:</strong></p>
      <ul>
        <li>Submit a job to run <code>myprogram</code> on <strong>16</strong> nodes with enough requested time.</li>
        <li><b>Question</b>: Soon after submission, inspect the state of the batch queue and answer the following questions:
          <ul>
            <li>How many jobs are currently pending?</li>
            <li>How many jobs are currently running?</li>
            <li>Is your job pending or running? (your username is <code>slurm_user</code>)</li>
          </ul>
        </li>

        <li> Advance the time until your job has completed (using the <code>sleep</code> command). You will have to
          advance time by quite a lot. Imagine what it would be in the real world where, unlike in simulation, you
          cannot fast-forward time (if you can, contact us immediately!)
        </li>
        <li><b>Question</b>: What was your job's wait time? (you can infer it based on the time of submission and the time of
          completion, since you know the execution time)
        </li>
      </ul>

      <p><strong>[C.1.q4.2] Sneaky job submission:</strong></p>
      <ul>
        <li> Reset the time to zero, to pretend the above never happened.</li>
        <li> <b>Question:</b> Inspect the state of the queue and answer the following questions:
          <ul>
            <li> How many nodes are currently in use by running jobs?</li>
            <li> How many nodes are currently idle?</li>
          </ul>
        </li>

        <li> Submit a job to run <code>myprogram</code> successfully, asking for as many nodes as
          possible so that your job can run right now (unless another competing
          job shows up in the nick of time!)
        </li>
            <ul>
            <li> Note that it's not because <TeX math="n" /> nodes are idle right now that any job
                 that asks for <TeX math="n" /> nodes will start right now. If the job requests too much
                 time, then starting it right now may postpone previously submitted jobs, which in our
                 cluster is disallowed. So answering this question is not as simple as it seems.
            </li>
            </ul>
        <li> Inspect the state of the queue to make sure that your job runs right away</li>
        <li> <b>Question:</b> How many nodes did you end up using?</li>
        <li> Advance time until your job completes.</li>
        <li> <b>Question:</b> Compare and contrast your job turnaround time with that in the previous question.</li>
      </ul>

      <Header as="h3" block>
        Take-Away
      </Header>
      <p><strong>
        Cancelling a job is easy, and often a good idea if the job is "stuck" in the batch queue and
        should be resubmitted with different parameters (requested numbers of node, requested duration).
      </strong></p>


    </>

  )
}

export default JobCancellation
