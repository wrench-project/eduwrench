import React from "react"
import { Accordion, Divider, Header, Icon, Segment } from "semantic-ui-react"
import TeX from "@matejmazur/react-katex"

const BatchQueue = () => {
    return (
        <>
            <Segment.Group className="objectives">
                <Segment inverted><strong>Learning Objectives</strong></Segment>
                <Segment style={{ backgroundColor: "#fafafa" }}>
                    <ul style={{ backgroundColor: "#fafafa" }}>
                        <li>Understand the concept of a batch queue</li>
                        <li>Understand the concept of job turnaround time</li>
                        <li>Be able to use a simple <tt>squeue</tt> command</li>
                    </ul>
                </Segment>
            </Segment.Group>

            <h2>The squeue command</h2>

            <p>
                The main goal of a batch scheduler is to place job requests in a
                <strong>batch queue</strong>, in which they wait for available
                resources. This is because resources are <i>space-shared</i>, i.e.,
                not two jobs run can use the same compute node.
                Note that Slurm can be configured not to enforce this requirement,
                but in all that follow we assume that it does
                (which is typical in production systems).
            </p>

            <p>
                The term <strong>turn-around time</strong> is typically used to denote the sum of the
                wait time and of the execution time. For instance, say you submit a job
                that executes for 2 hours, but that spent 10 hours in the batch queue
                before being able to execute. The job's turn-around time is 10 + 2 = 12
                hours.  In other words, the turn-around time is the time between submission
                and completion.
            </p>

            <h2>Simulation scenario</h2>
            <p>
                As for the simulation scenario in the previous tab, you can access
                a simulation terminal on the cluster's head node by
                using the following command to start a Docker container:

                <p>
                    <Segment raised>
                        <tt>
                            docker run -p 8808:8808 --rm -it wrenchproject/eduwrench-slurm-terminal ./run_it.sh tab3
                        </tt>
                    </Segment>
                </p>

                and, in a new browser window, navigate to: <a href="http://localhost:8808">http://localhost:8808</a>.
            </p>

            <p>
                As in the previous tab, again, your home directory in the simulated terminal contains the <tt>my_program</tt>
                program and the <tt>batch.slurm</tt> batch script.
            </p>

            <Divider />

            <Header as="h3" block>
                Questions
            </Header>

            <p>
                Interact with the simulated terminal to answer the following questions (recall that <tt>myprogram</tt> runs in <TeX math="2 + 20/n "/> hours on <TeX math="n"/> nodes).
            </p>

            <p>
                <strong>[C.1.q2.1] Inspecting the batch queue:</strong>
                <ul>
                    <li> Submit a job to run <tt>myprogram</tt> on 25 nodes with enough requested time so that it will successfully complete.</li>
                    <li> Use `squeue` to inspect the state of the batch queue. You should see that your job is running.</li>
                    <li> Soon after, submit another job to run *myprogram* successfully again (you can modify the same .slurm file, or copy it), but using 10 nodes.</li>
                    <li> Use `squeue` to inspect the state of the batch queue. You should see that your second job is "stuck" in the queue, waiting for the first job to complete.</li>
                    <li> Without advancing time, estimate the following:</li>
                    <ul>
                        <li> the turn-around time of the first job.</li>
                        <li> the turn-around time of the second job.</li>
                    </ul>
                    <li> Verify your answers to the above questions by advancing the clock and checking the content of the generated .out files.</li>

                </ul>
            </p>

        </>

    )
}

export default BatchQueue
