import React from "react"
import { Divider, Header} from "semantic-ui-react"
import LearningObjectives from "../../../components/learning_objectives"
import Thrustd_Cloud_Simulation from "./thrustd_cloud_simulation";
import SimulationActivity from "../../../components/simulation/simulation_activity";
import TeX from "@matejmazur/react-katex"

const CloudComputing = ({module, tab}) => {
    return (
        <>

            <LearningObjectives module={module} tab={tab}
            />

            <p>
                <b>Your company has decided that a low carbon footprint is a high priority</b>. As a result,
                from now on, the local cluster is configured by powering on <b>12 8-core nodes all at p-state 0</b>.
                Other nodes are simply turned off for the day-to-day business.
            </p>


            <h3>A remote cloud to the rescue</h3>

            <p>
                To still make it possible to run the workflow quickly, your boss has secured access to a <b>remote cloud platform</b>, on
                which your company has <b>16 virtual machines (VMs)</b> available for running workflow
                tasks. <b>Each VM has 16 cores that compute at speed 34.4 GHz</b>. The cloud is accessible via
                the wide-area network, and the data transfer rate is 15 MBps.  The cloud has a storage system with read/write bandwidth of 100 MBps just
                like your local cluster.
                The good thing about this cloud
                is that it is powered by a green energy source, and thus has very low carbon footprint.
                This setup is depicted in the figure below, with relevant data.
            </p>

            <p>
                <b>ADD A FIGURE</b>
            </p>

            <h3>Allocating tasks to resources</h3>


            <p>
                Now that you have access to both the 12-node local cluster and the 16-VM cloud,
                you need to decide which tasks run locally and which tasks run remotely, knowing that
                workflow data may then have to be communicated on the wide-area.
            </p>

            <p>
                You can now combine the local cluster with the cloud to
                distribute the tasks of the workflow. That is, you can
                decide, for each level of the workflow, what fraction of
                the tasks will be executed on the local cluster and what
                fraction of the tasks will be executed on the remote cloud.
                Different resource allocation schemes will lead to
                different workflow execution times and carbon footprint.
            </p>

            <h3> Running Experiments!</h3>

            <p>
            The simulation app below allows you to experiment with different resource allocation
            schemes. <b>Sliders allow you to, for each level, set the fraction of tasks that run on the cloud.</b> You can explore different options yourself, but you
            should also use the simulation to answer the questions hereafter.
            </p>

            <SimulationActivity panelKey="cloud_computing" content={<Thrustd_Cloud_Simulation />} />

            <Divider />
            <Header as="h3" block>
                Questions
            </Header>

            <p>
                <strong>[D.1.q2.1]</strong> The two "extreme" options are to either run all tasks on the local cluster or run all tasks on the remote cloud.
                Note that the input data to the workflow initially resides on the storage system of the local cluster. Use
                the simulation to evaluate both these options in terms of workflow execution time. Considering total execution time and carbon footprint, is one option
                strictly better than the other, and if so which one? If the wide-area link
                were of infinite bandwidth, how much faster would the cloud-only execution be?
            </p>

            <p>
                <strong>[D.1.q2.2]</strong> Most of the computation in the workflow happens in the first two levels. Let's consider the following three options:
                <ul>
                    Option #1: Run all of Level 1 (the first level) on the cloud, and all other levels on the local cluster;
                    Option #1: Run all of Level 2 on the cloud, and all other levels on the local cluster;
                    Option #2: Run all of Levels 1 and 2 on the cloud, and all other levels on the local cluster;
                </ul>
                Explain why one of these options, and say which one, should be better than the other two. Use the simulation to precisely compare these options.
                Are any of these options better than the "run everything on the cloud" options?

            </p>

            <p>
                <strong>[D.1.q2.3]</strong>So now you're on a mission to determine whether using the local cluster at all is a good idea. After all,
                its cores are slower that that of the cloud VMs, and the local cluster has only <TeX math="12\times 8=96"/> cores
                while the cloud VMs have a total of <TeX math="16\times 16 = 256"/> cores.  Let's use the "run all on the cloud" option as a starting point and
                think of having some portion of that tasks in <strong>one level</strong> running on the local cluster. Say we consider doing this
                for either Level 1 or Level 2. For which of these two levels do you think this would pay off the most and why?
            </p>

            <p>
                <strong>[D.1.q2.4]</strong> Say we decide to run some fraction of the tasks in Level 2 on the local cluster. Which fraction of the tasks running on the local cluster is best?
                How much faster then is the whole execution than the cloud-only execution? What about the carbon footprint?
            </p>

            <p>
                <strong>[D.1.q2.5]</strong> Experiment with running tasks in other levels on the cluster. Can you take the execution time even lower?
                     What is the corresponding increase in CO2, if any?
            </p>

        </>
    )
}

export default CloudComputing
