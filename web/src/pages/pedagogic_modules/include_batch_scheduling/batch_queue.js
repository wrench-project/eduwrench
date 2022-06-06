import React from "react"
import { Divider, Header, Segment } from "semantic-ui-react"
import TeX from "@matejmazur/react-katex"
import LearningObjectives from "../../../components/learning_objectives"
import GanttChart from "../../../images/vector_graphs/batch_scheduling/gantt_chart.svg"
import Basics from "../../../images/vector_graphs/batch_scheduling/basics.svg";
import FeedbackActivity from "../../../components/feedback/feedback_activity";
import FeedbackQuestions from "../../../components/feedback_questions";

const BatchQueue = ({ module, tab }) => {
    return (
        <>
            <LearningObjectives module={module} tab={tab} />

            <h2>The <tt>squeue</tt> command</h2>

            <p>
                The main goal of a batch scheduler is to place job requests in a <strong>batch queue</strong>, in which they
                wait for available
                resources. This is because resources are <i>space-shared</i>, i.e.,
                no two jobs run can use the same compute node.
                Note that Slurm can be configured not to enforce this requirement,
                but in all that follows we assume that it does
                (which is typical in production systems).
            </p>

            <p>
	    <b>The diagram below</b> shows an example scenario, or "batch
	    schedule", for a hypothetical 5-node cluster. Two jobs, shown
	    in red, are currently running. They both use 2 compute nodes,
	    one of them with still 3 hours to go, and the other with still
	    4h to go.  Two jobs are "stuck" in the batch queue. The first
	    job in the batch queue (which will likely run next) is depicted
	    in green. This job has requested 4 nodes and plans to use them
	    for 3 hours. Since there is only one node available right now,
	    it cannot run and has to wait in the queue. The second job in
	    the queue, meaning that it arrived after the green job, is
	    depicted in yellow. The green and the yellow job will never be
	    able to run at the same time since together they request more
	    than 5 compute nodes. <b>If, right now, you were submit a job that
	    requests one compute node for less than 4 hours, then this job
	    would run right away.</b> Most batch schedulers allow jobs to <i>jump ahead in the queue</i> provided they don't delay jobs that are
	    already in the queue. This is called "backfilling".

            </p>

            <p style={{ textAlign: "center" }}>
                <GanttChart />
            </p>

            <p>
                The term <strong>turnaround time</strong> is used to denote the sum of the
                wait time and of the execution time. For instance, say you submit a job
                that executes for 2 hours, but that spent 10 hours in the batch queue
                before being able to execute. The job's turnaround time is 10 + 2 = 12
                hours. In other words, the turnaround time is the time elapsed between submission
                and completion.
            </p>

            <h2>Simulated scenario</h2>
            <p>
                As with the simulated scenario in the previous tab, you can access
                a simulated terminal on the 32-node cluster's head node by
                running the following command on your computer in a terminal (a.k.a. command prompt) to start a Docker container:
            </p>

            <Segment raised>
                <code>
                    docker run -p 8808:8808 --rm -it wrenchproject/eduwrench-slurm-terminal ./run_it.sh tab3
                </code>
            </Segment>

            <p>and, in a new browser window, navigate to: <a href="http://localhost:8808"
                                                             target="_blank">http://localhost:8808</a>.</p>

            <p>
                As in the previous tab, again, your home directory in the simulated terminal contains the <code>myprogram</code>
                program and the <code>batch.slurm</code> batch script.
            </p>

            <Divider />

            <Header as="h3" block>
                Questions
            </Header>

            <p>
                Interact with the simulated terminal to perform the following steps and answer the questions answer the questions (recall that <tt>myprogram</tt> runs
                in <TeX math="2 + 20/n " /> hours on <TeX math="n" /> nodes).
            </p>

            <p><strong>[C.1.q3.1] Inspecting the batch queue:</strong></p>
            <ul>
                <li> Submit a job to run <code>myprogram</code> on 25 nodes with enough requested time so that it will
                    successfully complete.
                </li>
                <li> Use <code>squeue</code> to inspect the state of the batch queue. You should see that your job is running.
                </li>
                <li> Soon after, submit another job to run <code>myprogram</code> successfully again (you can modify the
                    same <code>.slurm</code> file, or copy it), but using 10 nodes.
                </li>
                <li> Use <code>squeue</code> to inspect the state of the batch queue. You should see that your second job is
                    "stuck" in the queue, waiting for the first job to complete.
                </li>
                <li> <b>Question:</b> Without advancing time, estimate the following:
                    <ul>
                        <li> the turnaround time of the first job.</li>
                        <li> the turnaround time of the second job.</li>
                    </ul>
                </li>
                <li> <b>Question</b>: Verify your answers to the above questions by advancing the clock and checking the content of the generated .out files. How accurate were your estimates?
                </li>

            </ul>

            <Header as="h3" block>
                Take-Away
            </Header>

            <p><strong>
                Inspecting the state of the batch queue is easy and can help you understand what is going on on the cluster.
                We'll see in the next tab that it can even help you reduce job turnaround time.
            </strong></p>

            <Header as="h3" block>
                You feedback is appreciated
            </Header>

            <FeedbackActivity content={
                <FeedbackQuestions feedbacks={[
                    {
                        tabkey: "batch_queue",
                        module: "C.1"
                    },
                ]} />
            } />

        </>
    )
}

export default BatchQueue
