import React from "react"
import {Divider, Header, Table} from "semantic-ui-react"
import LearningObjectives from "../../../components/learning_objectives";
import MontageWorkflow from "../../../images/vector_graphs/thrustd/montage_workflow.svg";
import Thrustd_Local_Simulation from "./thrustd_local_simulation";
import SimulationActivity from "../../../components/simulation/simulation_activity";

const LocalComputing = ({module, tab}) => {
    return (
        <>
            <LearningObjectives module={module} tab={tab}
            />

            <p>
                You are an employee at a space agency that needs to run a well-known Astronomy workflow application
                called <a href="http://montage.ipac.caltech.edu/">Montage</a>. The objective of Montage is to
                assemble telescope images into a mosaic of the sky (see a <a
                href="http://montage.ipac.caltech.edu/gallery.html">gallery</a> of
                such mosaics). As part of the operation of your agency, Montage has to be executed often and
                regularly. Therefore, it is crucial that its execution be efficient.
            </p>


            <h3>Your Montage workflow</h3>

            <p>
                The structure of the Montage workflow you need to execute is depicted below:
            </p>

            <MontageWorkflow/>

            <p>
                This workflow takes 234 input files as input, for a total of 129.29 MB, and consists of 8 levels. Some levels have single task and others have hundreds of tasks. All tasks
                in a level perform the same kind of computation on different data. The task
                dependency structure is relatively straightforward, with each task at a level depending on some (or all) of
                the tasks in the previous level.  For each level, the figure above indicates the number of tasks, the total work (in GFlop) of these tasks. The number of input/output
                files and their total size in MB are indicated in between each workflow level.  
            </p>

            <h3>Your local cluster</h3>

            <p>
                Your agency has access to an in-house, 128-node cluster with 8 cores on each node. Each montage task,
                the way you have compiled them, uses 4 cores on a node. You have decided to never oversubscribe
                nodes. That is, <b>at most two Montage tasks can run at the same time on a node of your cluster</b>.
            </p>

            <p>
                Executing Montage on this cluster has an energy costs in terms of money and CO2 emissions. In particular,
                given the power company your agency uses, one MWh of energy costs <b>$XXX</b> and produces <b>XXX grams of
                CO2 emissions</b>.
            </p>

            <p>
                You can perform <b>power management</b> on your cluster. This is because the nodes
                be configured to operate in different power states, or <b>p-states</b>. Each
                p-state corresponds to a particular frequency used by the processor, which is directly correlated to
                the performance of the processor and to its energy consumption. By decreasing the p-state, you are
                lowering the frequency at which the processor operates, thus making the tasks on that processor compute
                at a slower rate. Conversely, increasing the p-state increases the frequency, which leads to faster
                rates of computation. You can think of the p-state as being the dial on a stove: by cranking up the
                stove dial from low to high, you are increasing its power, thus allowing food to cook faster.  But then
                the higher power consumption has a cost (both monetary and environmental).
            </p>

            <p>
                The processors on your cluster nodes have 7 p-state values (0 to 6). Each value corresponds to a
                particular clock rate and power consumption.
            </p>

            <p>
                <strong>Below is the table of GHz vs speed:</strong>
            </p>

            <b>TODO: CHANGE FLOPS TO GFLOPS AND SCALE EVERYTHING</b>

            <Table compact collapsing>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>pstate</Table.HeaderCell>
                        <Table.HeaderCell>GHz</Table.HeaderCell>
                        <Table.HeaderCell>Compute Speed (flops)</Table.HeaderCell>
                        <Table.HeaderCell>Power Consumption (watts)</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    <Table.Row>
                        <Table.Cell>0</Table.Cell>
                        <Table.Cell>1.8</Table.Cell>
                        <Table.Cell>0.5217</Table.Cell>
                        <Table.Cell>120</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>1</Table.Cell>
                        <Table.Cell>2.1</Table.Cell>
                        <Table.Cell>2.6087</Table.Cell>
                        <Table.Cell>130</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>2</Table.Cell>
                        <Table.Cell>2.4</Table.Cell>
                        <Table.Cell>0.6957</Table.Cell>
                        <Table.Cell>140</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>3</Table.Cell>
                        <Table.Cell>2.7</Table.Cell>
                        <Table.Cell>0.7826</Table.Cell>
                        <Table.Cell>150</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>4</Table.Cell>
                        <Table.Cell>3.0</Table.Cell>
                        <Table.Cell>0.8696</Table.Cell>
                        <Table.Cell>160</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>5</Table.Cell>
                        <Table.Cell>3.3</Table.Cell>
                        <Table.Cell>0.9565</Table.Cell>
                        <Table.Cell>170</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>6</Table.Cell>
                        <Table.Cell>3.5</Table.Cell>
                        <Table.Cell>1</Table.Cell>
                        <Table.Cell>190</Table.Cell>
                    </Table.Row>
                </Table.Body>
            </Table>

            <p>
                You can pick the p-state value of the nodes at will. <b>We will assume that all nodes are always set
                to the same pstate.</b>
            </p>

            <p>
                Furthermore, you can decide to <b>power off some of the nodes</b>. This is because an idling 
                node still consumes power. Specifically, the cluster nodes consume 98 Watts when idling. It thus may
                be preferable to power some of them off, since your Montage workflow may not be able to use all 128
                compute nodes anyway (due to limited parallelism).
            </p>

            <h3>Running Experiments!</h3>

            <p>
                To experiment with different cluster power management option, you need to run experiments. To do so we
                provide you with the simulation application below. You can experiment with the simulation yourself if you
                want, but you should use it for answering the questions hereafter.
            </p>



            <SimulationActivity panelKey="local_computing" content={<Thrustd_Local_Simulation/>}/>

            <Divider/>
            <Header as="h3" block>
                Questions
            </Header>

            <p>
                <strong>[D.1.q1.1]</strong> Using the simulator, execute the workflow on the cluster configured at
                top performance: use the maximum number of nodes (128) and configure the nodes to the maximum p-state
                (6). What is the workflow execution time? What is the speedup and parallel efficiency? What is the
                total cost of the execution in terms of $ and CO2 emissions?
            </p>

            <p>
                <strong>[D.1.q1.2]</strong> It turns out that, according to your boss, running the workflow as fast
                as possible is overkill. Instead, it is only necessary that the workflow run in under an hour
                (e.g., running in 30 minutes bring no extra benefits when compared to running on 59 minutes). With
                this is mind, you can reconfigure the cluster to save on energy. You have two options to choose from:
                <br/>
            </p>
            <ul>
                <li>Option 1: Turn off some of the cluster nodes and simply not use them. Using a binary search,
                    find the smallest number of nodes that satisfies the 1-hour time limit.
                </li>
                <li>Option 2: Downclock all the cluster nodes to a lower p-state. Using a binary search, find the
                    smallest p-state that satisfies the 1-hour time limit.
                </li>
            </ul>
            <p>
                For both these options give the $ cost, the CO2 emission, and the parallel efficiency. What should
                you tell your boss regarding which option is more desirable?
            </p>

            <p>
                <strong>[D.1.q1.3]</strong> Your boss says that running at parallel efficiency below 75% is just
                unacceptable, because they remember from a college course that low parallel efficiency means that
                compute resources are wasted. So they ask you to first find the maximum number of nodes, with all
                nodes configured at the maximum p-state, that leads to a parallel efficiency of 75%. Then, using
                that number of nodes, you're supposed to find which p-state you can downclock to so as to save energy,
                while still remaining under the 1-hour time limit.
                <br/><br/>
                Report on the number of nodes and p-state that you end up using. It turns out that the optimal cluster
                configuration in terms of number of nodes used and p-state leads to a $ cost of $X with an execution
                of XXX minutes. How far is your answer from the optimal?
            </p>
        </>
    )
}

export default LocalComputing
