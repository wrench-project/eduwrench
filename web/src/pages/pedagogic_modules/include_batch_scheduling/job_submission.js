import React from "react"
import { Divider, Header, Segment } from "semantic-ui-react"
import TeX from "@matejmazur/react-katex"
import LearningObjectives from "../../../components/learning_objectives"

const JobSubmission = ({ module, tab }) => {
  return (
    <>
      <LearningObjectives module={module} tab={tab} />

      <h2>The <tt>sbatch</tt> command</h2>

      <p>
        The <code>sbatch</code> command is used to
        submit jobs. It takes a single command-line argument, which is the path to a file called
        a <i>batch script</i>. The batch script specifies the job request, and in
        particular the desired number of nodes and duration.
      </p>

      <p>
        When invoked, the <code>sbatch</code> command submits the
        job specified in the batch script to the batch scheduler and prints a job ID after
        being invoked, say <code>job_12</code>.
      </p>

      <p>
        If the job is successful, upon completion a file <code>job_12.out</code> is
        created, which is the standard output produced by the job.
        If the job is not successful, for instance because the job did not request enough
        time, a file <code>job_12.err</code> is created that contains some error message
        (as well as possible standard error produced by the job). Note that with Slurm
        it is possible to customize the name of these two files, but in all that follows
        they are named as above (job ID with a <code>.out</code> and <code>.err</code> suffix).
      </p>

      <h2>Simulated scenario</h2>
      <p>
        You were given an account on a <strong>batch-scheduled cluster with 32 nodes</strong>. You
        have logged in to the cluster's <i>head node</i>, on which you can run Slurm
        commands to use the cluster's nodes. In your working directory on the cluster's head node there is:
      </p>
      <ul>
        <li>An executable called <code>myprogram</code>. This is the program you want to run
          on the cluster. This program can run on one or more nodes, each time
          using all the cores on each node. It has the following parallel
          speedup behavior: <strong>It runs in <TeX math="2 + 20/n" /> hours when
            executed on <TeX math="n" /> nodes</strong> (typical Amdahl Law behavior). So for instance, running
          <code>myprogram</code> on 5 nodes takes 6 hours.
        </li>
        <li>A batch script, stored in file <code>batch.slurm</code>. This script is to be
          passed to the Slurm <code>sbatch</code> command. It specifies the desired
          number of nodes and duration for running <code>myprogram</code> as a job on the cluster.
        </li>
      </ul>

      <p>
        For our purposes, when executed successfully, <code>myprogram</code> simply
        prints some success message on standard output.
        In the real world, <code>myprogram</code> would generate additional meaningful output
        files. Note that in the activity below you will submit multiple jobs to run
        <code>myprogram.</code> In the real world, the program would take in some input files,
        and you would be running these jobs for different input files.
      </p>

      <p>
        Run the following command on your computer in a terminal (a.k.a. command prompt) to run a Docker container (this may take a while):
      </p>

      <Segment raised>
        <code>
          docker run -p 8808:8808 --rm -it wrenchproject/eduwrench-slurm-terminal ./run_it.sh tab2
        </code>
      </Segment>

      <p>
        You can now navigate to this URL in a new browser window: <a href="http://localhost:8808"
                                                                     target="_blank" rel="noreferrer">http://localhost:8808</a>.
      </p>

      <p>
        The new browser window will present you with a simulated Linux terminal running on the cluster's head
        node. <strong>In this terminal, you can type <code>help</code> to get some information and guidance before
        proceeding to the questions below, and <code>exit</code> to stop the server and exit the terminal
        application.</strong>
      </p>

      <Divider />

      <Header as="h3" block>
        Questions
      </Header>

      <p>
        Interact with the simulated terminal to perform the following steps and answer the questions (recall that <code>myprogram</code> runs
        in <TeX math="2 + 20/n" /> hours on <TeX math="n" /> nodes). 
      </p>

      <p><strong>[C.1.q2.1] Successful job execution:</strong></p>
      <ul>
        <li> Edit the batch script to specify that you want
          to run <code>myprogram</code> on 4 nodes (use the <code>edit</code> command).
          Specify a duration that is sufficient
          for <code>myprogram</code> to complete successfully.
        </li>
        <li> Submit this job to the batch scheduler and move time forward
          (using the <code>sleep</code> command)
          until after the job should have completed.
        </li>
        <li> Check the content of the generated <code>.out</code> or <code>.err</code> file produced by the job.</li>
        <li> <b>Question:</b> Did the job complete successfully?</li>
        <li> <b>Question:</b> At what time did it complete?</li>
        <li> <b>Question:</b> Did it complete about when you thought it would and why?</li>
      </ul>

      <p><strong>[C.1.q2.2] Failed job execution:</strong></p>
      <ul>
        <li> Now Submit a job to run <code>myprogram</code> on 6 nodes <strong>without</strong> enough
          requested time, so that it will certainly fail.
        </li>
        <li> Once enough time has passed, check the content of the
          generated <code>.out</code> or <code>.err</code> file.
        </li>
        <li> <b>Question:</b> Did the job fail?</li>
        <li> <b>Question:</b> At what time did it fail?</li>
        <li> <b>Question:</b> Did the job fail about when you thought it would and why?</li>
      </ul>

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
