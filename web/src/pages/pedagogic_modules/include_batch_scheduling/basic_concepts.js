import React from "react"
import { Accordion, Divider, Header, Icon, Segment } from "semantic-ui-react"
import TeX from "@matejmazur/react-katex"
import LearningObjectives from "../../../components/learning_objectives";

const BasicConcepts = (module, tab) => {
    return (
        <>

            <LearningObjectives module={module} tab={tab} />

                {/*"Understand the need for batch scheduling",*/}
                {/*"Understand, at a high level, what a batch scheduler does",*/}
                {/*"Be aware of the Slurm batch scheduler"*/}

            <h2>Batch Schedulers</h2>

            <p>
            Large parallel platforms are expensive, not only for initial hardware
            purchases and ongoing maintenance, but also in terms of electrical power
            consumption.  This is why in most organizations these platforms
            are <strong>shared</strong> among users. This sharing can be done in different ways depending
            on the context. For instance, cloud providers allow  sharing by
            giving user virtual machine instances that transparently run on the
            physical machines.  In the field of High Performance Computing, a typical
            way to share physical machines among users is via a <strong>batch scheduler</strong>.
            </p>

            <p>
            Consider a cluster of homogeneous compute nodes (or just "nodes").  A batch
            scheduler is a software service that allows users to submit <strong>jobs</strong> to the
            cluster. Submitting jobs is typically the only way for users to access the
            cluster's nodes.  Each job specifies a desired <i>number of nodes</i>, a
            desired <i>duration</i>, and a program to run on these nodes. For instance, a job can
            say: "I need 4 nodes for 2 hours".  These job requests are placed in
            a <strong>queue</strong>, where they wait until the nodes they need are available. A
            decent real-world analogy is parties of diners waiting for tables at a busy
            restaurant, where the host person is the batch scheduler.  The difference
            is that in addition to saying "we need a table with 4 seats" (in our case
            seats are nodes) parties would also need to give a time limit ("we need 2
            hours to eat").
            </p>

            <p>
            After waiting in the queue, a job is allocated to and started on available
            nodes.  Importantly, <strong>jobs are forcefully terminated if they go over their
            time limit!</strong>  So if the user's program needs 3 hours to run but the job
            only requested 2 hours, the program will not complete successfully. Unless
            the program has saved its state to disk while it was running, all is lost
            and the program must be restarted from scratch.
            </p>

            <h2>Slurm</h2>

            <p>
                A well-known batch scheduler is <a href="https://slurm.schedmd.com">Slurm</a>. In
            this pedagogic module, you will be presented with simulated scenarios in which Slurm is installed on a cluster to
            which you want to submit jobs.  We picked Slurm due to its popularity, but
            the same concepts apply to all batch schedulers.
            </p>

            <p>
            <strong>Disclaimer</strong>: This module does not provides comprehensive Slurm training, but is instead
            a gentle introduction to batch scheduling, using Slurm
            as an example. You will only be exposed to a small and simplified subset of
            the Slurm functionality. This module is thus a first step towards
            becoming an expert Slurm user.
            </p>

        </>
    )
}

export default BasicConcepts
