import React from "react"
import { Divider, Header, Segment } from "semantic-ui-react"
import TeX from "@matejmazur/react-katex"
import LearningObjectives from "../../../components/learning_objectives"

const JobNumNodes = ({ module, tab }) => {
  return (
    <>
      <LearningObjectives module={module} tab={tab} />

      <h2>Impact of requested number of nodes</h2>

      <p>
        Because we know that <code>myprogram</code> runs in <TeX math="2 + 20/n" /> hours on <TeX math="n" /> nodes, we
        can always ask for the exact duration needed,
        which is never detrimental and often beneficial.
        But what about the number of nodes? When submitting a job, should we ask
        for 1 node, 2 nodes, more? In an earlier tab, you submitted a job that asked
        for whatever number of nodes was currently idle, which is one possible
        strategy. But that number may be zero, so then what? That was the case
        in the previous tab, and the activity just said "ask for 16 nodes". But would
        17 nodes have led to some benefit? Or would it have instead been a worse choice?
      </p>

      <p>
        Formally, our goal is to <i>minimize turnaround time</i>. Asking for more nodes can
        increase wait time (because we need to wait for that many nodes to become
        available). But asking for more nodes will shorten execution time because
        parallelism is good. There is thus a sweet spot. This sweet spot, unfortunately,
        depends on the state of the queue, that is,
        on your competitors, which is out of your control. So all
        users of batch-scheduled platforms try to optimize their turnaround
        times on a daily basis, but are mostly in the dark. Let's get a sense for
        this in simulation...
      </p>

      <h2>Simulated scenario</h2>
      <p>
        As with the simulated scenario in the previous tab, you can access
        a simulated terminal on the 32-node cluster's head node by
        using the following command to start a Docker container:
      </p>

      <Segment raised>
        <code>
          docker run -p 8808:8808 --rm -it wrenchproject/eduwrench-slurm-terminal ./run_it.sh tab6
        </code>
      </Segment>

      <p>
        and, in a new browser window, navigate to: <a href="http://localhost:8808"
                                                      target="_blank">http://localhost:8808</a>.
      </p>

      <p>
        As in the previous tab, again, your home directory in the simulated terminal contains the <code>myprogram</code>
        program and the <code>batch.slurm</code> batch script, and there is competition with other users.
      </p>

      <Divider />

      <Header as="h3" block>
        Questions
      </Header>

      <p>
        Interact with the simulated terminal to perform the following steps and answer the questions answer the questions (recall that <code>myprogram</code> runs
        in <TeX math="2 + 20/n" /> hours on <TeX math="n" /> nodes).
      </p>

      <p><strong>[C.1.q6.1] Trying multiple job sizes:</strong></p>
      <ul>
        <li> Inspect the state of the queue. You should see that only 1 node is available right now.</li>
        <li> <b>Question:</b> If you were to submit a 1-node job right now, what turnaround time would you experience?</li>
        <li> Submit a 2-node job, asking for just enough time for <code>myprogram</code> to complete successfully.</li>
        <li> <b>Question:</b> What is this job's turnaround time?</li>
        <li> Reset the simulation and submit a 4-node job, asking for just enough time for <code>myprogram</code> to
          complete successfully.
        </li>
        <li> <b>Question:</b> What is this job's turnaround time?</li>
        <li> <b>Question:</b> Which option was better: using 1 node, 2 nodes, or 4 nodes?</li>
        <li> <b>Question:</b> Is there any way you could have predicted this based on initial state of the batch queue?</li>
        <li> Feel free to experiment with different numbers of nodes, so see which one is best.</li>
      </ul>

      <Header as="h3" block>
        Take-Away
      </Header>

      <p><strong>
        The question "how many nodes should I ask for to minimize turnaround time?"
        is not an easy one. Asking for too few may hurt turnaround time because
        of long execution time. But asking for too many may hurt turnaround
        time because of long wait time.
      </strong></p>

    </>
  )
}

export default JobNumNodes
