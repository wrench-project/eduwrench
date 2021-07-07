import React from "react"
import { Accordion, Divider, Header, Icon, Segment } from "semantic-ui-react"
import TeX from "@matejmazur/react-katex"

const JobCancellation = () => {
    return (
        <>
            <Segment.Group className="objectives">
                <Segment inverted><strong>Learning Objectives</strong></Segment>
                <Segment style={{ backgroundColor: "#fafafa" }}>
                    <ul style={{ backgroundColor: "#fafafa" }}>
                        <li>Understand what canceling a job entails</li>
                        <li>Be able to use a simple <tt>scancel</tt> command</li>
                        <li>Understand how inspecting the batch queue can help pick
                            job parameters that reduce job turnaround time</li>
                    </ul>
                </Segment>
            </Segment.Group>

            <h2>The scancel command</h2>

            <p>
                You have learned to use the <tt>sbatch</tt> command to submit jobs. The
                <tt>scancel</tt> command is used to cancel a job that has previously been
                submitted. It takes a job ID (which was returned by <tt>sbatch</tt>) as its
                single command-line argument.
            </p>

            <h2>Simulation scenario</h2>
            <p>
                As for the simulation scenario in the previous tab, you can access
                a simulation terminal on the 32-node cluster's head node by
                using the following command to start a Docker container:

                <p>
                    <Segment raised>
                        <tt>
                            docker run -p 8808:8808 --rm -it wrenchproject/eduwrench-slurm-terminal ./run_it.sh tab4
                        </tt>
                    </Segment>
                </p>

                and, in a new browser window, navigate to: <a href="http://localhost:8808">http://localhost:8808</a>.
            </p>

            <p>
                As in the previous tab, again, your home directory in the simulated terminal contains the <tt>myprogram</tt>
                program and the <tt>batch.slurm</tt> batch script.
            </p>

            <p>
                <strong>User competition:</strong> In the previous tab, you were the only user on the cluster.
                Now, instead, <b>you are competing with other users!</b> These other users
                submit whatever jobs whenever they want, which is out of your control.

            </p>

            <Divider />

            <Header as="h3" block>
                Questions
            </Header>

            <p>
                Interact with the simulated terminal to answer the following questions (recall that <tt>myprogram</tt> runs in <TeX math="2 + 20/n "/> hours on <TeX math="n"/> nodes).
            </p>

            <p>
                <strong>[C.1.q4.1] Job submission and cancellation:</strong>
                <ul>
                    <li> Submit a job to run <tt>myprogram</tt> on <strong>16</strong> nodes with enough requested time.</li>
                    <li> Soon after submission, inspect the state of the batch queue and answer the following questions:</li>
                    <ul>
                        <li>How many jobs are currently pending?</li>
                        <li>How many jobs are currently running?</li>
                        <li>Is your job pending or running? (your username is <tt>slurm_user</tt>)</li>
                    </ul>
                    <li> Advance simulation time until your job has completed. You'll have to advance time by quite a lot.
                        Imagine what it would be in the real world where, unlike in simulation,
                        you can't fast-forward time (if you can, contact us immediately!)</li>
                    <li> What was your job's wait time? (you can infer it based on the time of
                        submission and the time of completion, since you know the execution time)</li>
                </ul>
            </p>

            <p>
                <strong>[C.1.q4.2] Sneaky job submission:</strong>
                <ul>
                    <li> Reset the time to zero, to pretend the above never happened.</li>
                    <li> Inspect the state of the queue and answer the following questions:</li>
                    <ul>
                        <li> How many nodes are currently in used by running jobs?</li>
                        <li> How many nodes are currently idle?</li>
                    </ul>
                    <li> Submit a job to run <tt>myprogram</tt> successfully, asking for as many nodes as
                        possible so that your job can run right now (unless another competing
                        job shows up in the nick of time!)</li>
                    <li> Inspect the state of the queue. Is your job running?</li>
                    <li> Advance time until your job completes</li>
                    <li> Compare an contrast your job turn-around time with that in the previous question.</li>

                </ul>
            </p>
        </>

    )
}

export default JobCancellation
