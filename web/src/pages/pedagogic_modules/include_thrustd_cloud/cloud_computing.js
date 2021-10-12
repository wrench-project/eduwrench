import React from "react"
import { Divider, Header} from "semantic-ui-react"
import LearningObjectives from "../../../components/learning_objectives"
import Thrustd_Cloud_Simulation from "./thrustd_cloud_simulation";
import SimulationActivity from "../../../components/simulation/simulation_activity";

const CloudComputing = ({module, tab}) => {
    return (
        <>

            <LearningObjectives module={module} tab={tab}
            />

            <h2>Cloud Computing</h2>

            <p>
                Your boss mentions that your company now has access to a commercial cloud. The
                advantage this provides over local computing is that the cloud is CO2 efficient
                because of renewables so that saves some cost in the CO2 department.
            </p>

            <p>
                On the cloud you can request any number of VMs, each costing $XX/hour and you can
                use each VM for up to 10 hours.
            </p>

            <p>
                You can now combine the local cluster with the cloud to distribute the tasks of
                the workflow via horizontal/vertical partitioning, meaning tasks are grouped via
                rows/columns where each group can be assigned to the local cluster or the cloud.
                The task distribution needs to be done while trying to maintain cost and CO2
                efficiency.
            </p>

            <p>
                The bandwidth to the cloud is XXX GB/sec, meaning that it's low, so you don't want
                to send a lot of data back and forth.
            </p>

            <p>
                What you need to do is figure out:
                <br />
            </p>
            <ul>
                <li>How many VMs to ask for on the cloud</li>
                <li>Which tasks should run on the cloud</li>
            </ul>

            <p>
                Here is the simulator:
            </p>

            <SimulationActivity panelKey="cloud_computing" content={<Thrustd_Cloud_Simulation />} />

            <Divider />
            <Header as="h3" block>
                Questions
            </Header>

            <p>
                <strong>[D.1.q1.1]</strong> Using the simulator, execute the workflow on the cluster configured at
                top performance: use the maximum number of nodes (128) and configure the nodes to the maximum pstate
                (6). What is the workflow execution time? What is the speedup and parallel efficiency? What is the
                total cost of the execution in terms of $ and CO2 emissions?
            </p>

            <p>
                <strong>[D.1.q1.2]</strong> It turns out that, according to your boss, running the workflow as fast
                as possible is overkill. Instead, it is only necessary that the workflow run in under an hour
                (e.g., running in 30 minutes bring no extra benefits when compared to running on 59 minutes). With
                this is mind, you can reconfigure the cluster to save on energy. You have two options to choose from:
                <br />
                For both these options give the $ cost, the CO2 emission, and the parallel efficiency. What should
                you tell your boss regarding which option is more desirable?
            </p>

            <p>
                <strong>[D.1.q1.3]</strong> Your boss says that running at parallel efficiency below 75% is just
                unacceptable, because they remember from a college course that low parallel efficiency means that
                compute resources are wasted. So they ask you to first find the maximum number of nodes, with all
                nodes configured at the maximum pstate, that leads to a parallel efficiency of 75%. Then, using
                that number of nodes, you're supposed to find which pstate you can downclock to so as to save energy,
                while still remaining under the 1-hour time limit.
                <br />
                Report on the number of nodes and pstate that you end up using. It turns out that the optimal cluster
                configuration in terms of number of nodes used and pstate leads to a $ cost of $X with an execution
                of XXX minutes. How far is your answer from the optimal?
            </p>
        </>
    )
}

export default CloudComputing
