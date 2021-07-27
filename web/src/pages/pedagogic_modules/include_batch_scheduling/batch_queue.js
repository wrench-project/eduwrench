import React from "react"
import { Accordion, Divider, Header, Icon, Segment } from "semantic-ui-react"
import TeX from "@matejmazur/react-katex"
import LearningObjectives from "../../../components/learning_objectives";

const BatchQueue = ({module, tab}) => {
    return (
        <>
            <LearningObjectives module={module} tab={tab} />

            <h2>The <tt>squeue</tt> command</h2>

            <p>
                The main goal of a batch scheduler is to place job requests in a <strong>batch queue</strong>, in which they wait for available
                resources. This is because resources are <i>space-shared</i>, i.e.,
                not two jobs run can use the same compute node.
                Note that Slurm can be configured not to enforce this requirement,
                but in all that follows we assume that it does
                (which is typical in production systems).
            </p>

            <p>
                The term <strong>turnaround time</strong> is used to denote the sum of the
                wait time and of the execution time. For instance, say you submit a job
                that executes for 2 hours, but that spent 10 hours in the batch queue
                before being able to execute. The job's turnaround time is 10 + 2 = 12
                hours.  In other words, the turnaround time is the time elapsed between submission
                and completion.
            </p>

            <h2>Simulated scenario</h2>
            <p>
                As for the simulated scenario in the previous tab, you can access
                a simulated terminal on the 32-node cluster's head node by
                using the following command to start a Docker container:
            </p>

            <p>
                <Segment raised>
                    <tt>
                        docker run -p 8808:8808 --rm -it wrenchproject/eduwrench-slurm-terminal ./run_it.sh tab3
                    </tt>
                </Segment>
            </p>

            <p>
                and, in a new browser window, navigate to: <a href="http://localhost:8808">http://localhost:8808</a>.
            </p>

            <p>
                As in the previous tab, again, your home directory in the simulated terminal contains the <tt>myprogram</tt>
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
                <strong>[C.1.q3.1] Inspecting the batch queue:</strong>
                <ul>
                    <li> Submit a job to run <tt>myprogram</tt> on 25 nodes with enough requested time so that it will successfully complete.</li>
                    <li> Use <tt>squeue</tt> to inspect the state of the batch queue. You should see that your job is running.</li>
                    <li> Soon after, submit another job to run <tt>myprogram</tt> successfully again (you can modify the same <tt>.slurm</tt> file, or copy it), but using 10 nodes.</li>
                    <li> Use <tt>squeue</tt> to inspect the state of the batch queue. You should see that your second job is "stuck" in the queue, waiting for the first job to complete.</li>
                    <li> Without advancing time, estimate the following:</li>
                    <ul>
                        <li> the turnaround time of the first job.</li>
                        <li> the turnaround time of the second job.</li>
                    </ul>
                    <li> Verify your answers to the above questions by advancing the clock and checking the content of the generated .out files.</li>

                </ul>
            </p>

            <Header as="h3" block>
                Take-Away
            </Header>
            <p><strong>
                Inspecting the state of the batch queue is easy and can help you understand what is going on on the cluster.
                We'll see in the next tab that it can even help you reduce job turnaround time.
            </strong></p>

        </>

    )
}

export default BatchQueue
