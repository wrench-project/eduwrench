import React from "react"
import { Accordion, Divider, Header, Icon, Segment } from "semantic-ui-react"
import TeX from "@matejmazur/react-katex"

const JobSubmission = () => {
    return (
        <>
            <Segment.Group className="objectives">
                <Segment inverted><strong>Learning Objectives</strong></Segment>
                <Segment style={{ backgroundColor: "#fafafa" }}>
                    <ul style={{ backgroundColor: "#fafafa" }}>
                        <li>Understand what submitting a batch job entails</li>
                        <li>Be able to use the <tt>sbatch</tt> command</li>
                    </ul>
                </Segment>
            </Segment.Group>

            <h2>The <tt>sbatch</tt> command</h2>

            <p>
                The <tt>sbatch</tt> command is used to
                submit jobs. It takes a single command-line argument, which is the path to a file called
                a <i>batch script</i>. The batch script specifies the job request, and in
                particular the desired number of nodes and duration.
            </p>

            <p>
                When invoked, the <tt>sbatch</tt> command submits the
                job specified in the batch script to the batch scheduler and prints a job ID after
                being invoked, say <tt>job_12</tt>.
            </p>

            <p>
                If the job is successful, upon completion a file <tt>job_12.out</tt> is
                created, which is the standard output produced by the job.
                If the job is not successful, for instance because the job did not request enough
                time, a file <tt>job_12.err</tt> is created that contains some error message
                (as well as possible standard error produced by the job). Note that with Slurm
                it is possible to customize the name of these two files, but in all that follows
                they are named as above (job ID with a <tt>.out</tt> and <tt>.err</tt> suffix).
            </p>


            <h2>Simulated scenario</h2>
            <p>
                You were given an account on a <strong>batch-scheduled cluster with 32 nodes</strong>. You
                have logged in to the cluster's <i>head node</i>, on which you can run Slurm
                commands to use the cluster's nodes.
                In your working directory on the cluster's head node there is:

                <ul>
                    <li>An executable called <tt>myprogram</tt>. This is the program you want to run
                        on the cluster. This program can run on one or more nodes, each time
                        using all the cores on each node. It has the following parallel
                        speedup behavior: <strong>It runs in <TeX math="2 + 20/n"/> hours when
                            executed on <TeX math="n"/> nodes</strong> (typical Amdahl Law behavior). So for instance, running
                        <tt>myprogram</tt> on 5 nodes takes 6 hours.</li>
                    <li>A batch script, stored in file <tt>batch.slurm</tt>, which is to be
                        passed to the Slurm <tt>sbatch</tt> command.  This batch script specifies the desired
                        number nodes and duration for running <tt>myprogram</tt> as a job on the cluster.</li>
                </ul>

                For our purposes, when executed successfully,  <tt>myprogram</tt> simply
                prints some success message on standard output.
                In the real world, <tt>myprogram</tt> would generate additional meaningful output
                files.  Not that in the activity below you will submit multiple jobs to run
                <tt>myprogram.</tt> In the real world, the program would take in some input files,
                and you would be running these jobs for different input files.
            </p>

            <p>
                On your computer, use the following command to run a Docker container (this may take a while):
            </p>

            <p>
                <Segment raised>
                    <tt>
                        docker run -p 8808:8808 --rm -it wrenchproject/eduwrench-slurm-terminal ./run_it.sh tab2
                    </tt>
                </Segment>
            </p>

            <p>
                You can now navigate to this URL in a new browser window: <a href="http://localhost:8808">http://localhost:8808</a>.
            </p>

            <p>
                The new browser window will present you with a simulated
                Linux terminal running on the cluster's head node.  <strong>In this terminal, you can
                type <tt>help</tt> to get some
                information and guidance before proceeding to the questions below.</strong>
            </p>

            <Divider />

            <Header as="h3" block>
                Questions
            </Header>

            <p>

                Interact with the simulated terminal to answer the following questions (recall that <tt>myprogram</tt> runs
                in <TeX math="2 + 20/n"/> hours  on <TeX math="n"/> nodes).
            </p>

            <p>
                <strong>[C.1.q2.1] Successful job execution:</strong>
                <ul>
                    <li> Edit the batch script to specify that you want
                        to run <tt>myprogram</tt> on 4 nodes (use the <tt>edit</tt> command).
                        Specify a duration that is sufficient
                        for <tt>myprogram</tt> to complete successfully.</li>
                    <li> Submit this job to the batch scheduler and move time forward
                        (using the <tt>sleep</tt> command)
                        until after the job should have completed.</li>
                    <li> Check the content of the generated <tt>.out</tt> or <tt>.err</tt> file produced by the job.</li>
                    <li> Did the job complete successfully?</li>
                    <li> At what time did it complete?</li>
                    <li> Did it complete about when you thought it would?</li>
                </ul>
            </p>

            <p><strong>[C.1.q2.2] Failed job execution:</strong>
                <ul>
                    <li> Now Submit a job to run <tt>myprogram</tt> on 6 nodes <strong>without</strong> enough
                        requested time, so that it will certainly fail.</li>
                    <li> Once enough time has passed, check the content of the
                        generated <tt>.out</tt> or <tt>.err</tt> file.</li>
                    <li> Did the job fail?</li>
                    <li> At what time did it fail?</li>
                    <li> Did the job file about when you thought it would?</li>
                </ul>
            </p>

            <Header as="h3" block>
                Take-Away
            </Header>
            <p><strong>
                When submitting a job one must pick a number of nodes and a duration. It is crucial to pick
                a duration that allows the program to run to completion.
            </strong></p>

        </>

    )
}

export default JobSubmission
