import React from "react"
import { Divider, Header, Segment } from "semantic-ui-react"
import TeX from "@matejmazur/react-katex"
import LearningObjectives from "../../../components/learning_objectives"

const JobDuration = ({ module, tab }) => {
  return (
    <>
      <LearningObjectives module={module} tab={tab} />

      <h2>Impact of requested duration</h2>

      <p>
        In the previous tabs, you were instructed to submit jobs that ask for a
        long enough duration that <code>myprogram</code> completes successfully. You may have
        asked for the exact duration needed, or you may have asked for more than
        needed.
      </p>

      <p>
        It turns out that many users, in practice ask for much more time than
        needed. This is because they do not know how long their programs will run
        (for instance, the program runs shorter or longer based on its input data).
        Furthermore, users many not know the speedup behavior of their programs. So
        although they may know how long the program would run on 1 node, they do not
        know how long it will run on 10 nodes. Since asking for too little time
        leads to job failures, most users are conservative and ask for more time.
        This behavior has been studied by researchers (here is a <a
        href="https://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.9.5068&rep=rep1&type=pdf" target="_blank">research
        article on this topic</a> if interested).
      </p>

      <p>
        The problem with asking for too much time is that it can increase a job's
        wait time. This is because most batch schedulers implementing a strategy called
        "backfilling", which allows smaller/shorter jobs to jump ahead in the
        queue. Let's experience first-hand the impact of the requested job duration
        using simulation!
      </p>

      <h2>Simulated scenario</h2>
      <p>
        As with the simulated scenario in the previous tab, you can access
        a simulated terminal on the 32-node cluster's head node by
        using the following command to start a Docker container:
      </p>

      <Segment raised>
        <code>
          docker run -p 8808:8808 --rm -it wrenchproject/eduwrench-slurm-terminal ./run_it.sh tab5
        </code>
      </Segment>

      <p>
        and, in a new browser window, navigate to: <a href="http://localhost:8808"
                                                      target="_blank">http://localhost:8808</a>.
      </p>

      <p>
        As in the previous tab, again, your home directory in the simulated terminal contains the <code>myprogram</code>
        program and the <code>batch.slurm</code> batch script, and there is competition with
        other users.
      </p>

      <Divider />

      <Header as="h3" block>
        Questions
      </Header>

      <p>
        Interact with the simulated terminal to answer the following questions (recall that <code>myprogram</code> runs
        in <TeX math="2 + 20/n " /> hours on <TeX math="n" /> nodes).
      </p>

      <p><strong>[C.1.q5.1] Asking for the right amount of time:</strong></p>
      <ul>
        <li>Feel free to inspect the state of the queue, which will show that all nodes are currently busy.</li>
        <li>Submit a job asking for 16 nodes and just enough time to run <code>myprogram</code>.</li>
        <li>What is the job's turnaround time?</li>
        <li>Could you have expected this behavior based on the state of the batch queue?</li>
      </ul>

      <p><strong>[C.1.q5.2] Asking for too much time:</strong></p>
      <ul>
        <li>Reset the simulation time.</li>
        <li>Resubmit the job, but now asking for 22 hours, pretending to
          be a user who does not know the program's speedup behavior and
          conservatively asks for the sequential time.
        </li>
        <li>What is the job's turnaround time?</li>
        <li>Could you have expected this behavior based on the state of the batch queue?</li>
      </ul>

      <p><strong>[C.1.q5.3] Exploring other options:</strong></p>
      <ul>
        <li>Explore several options by resetting the simulation time and
          submitting the job with different requested durations. You should see that behavior is
          non-continuous: when asking for one more second, the job's wait time can jump by hours!
        </li>
      </ul>

      <Header as="h3" block>
        Take-Away
      </Header>
      <p><strong>
        Jobs that ask for more time can have higher wait times. Therefore, if possible,
        a job should request just enough time for the user program to complete.
      </strong></p>

    </>
  )
}

export default JobDuration
