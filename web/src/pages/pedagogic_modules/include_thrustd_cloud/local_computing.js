import React from "react"
import { Divider, Header, Table } from "semantic-ui-react"
import TeX from "@matejmazur/react-katex"
import LearningObjectives from "../../../components/learning_objectives"
import IOFigure1 from "../../../images/vector_graphs/single_core/IO_figure_1.svg";
import Thrustd_local_simulation from "./thrustd_local_simulation";
import SimulationActivity from "../../../components/simulation/simulation_activity";

const LocalComputing = () => {
    return (
        <>
            <LearningObjectives objectives={[
                "TO BE CHANGED",
                "Be familiar with Flop as a measure of work and with Flop/sec as a measure of compute speed",
                "Understand the simple relationship between program execution time, work, and compute speed"
            ]} />

            <h2>Measures of Work and Compute Speed</h2>

            <p>
                You are an employee at a space agency that needs to run a well-known Astronomy workflow application
                called <a href="http://montage.ipac.caltech.edu/">Montage</a>. The objective of Montage is to
                assemble telescope images into a mosaic of the sky (see a <a href="http://montage.ipac.caltech.edu/gallery.html">gallery</a> of
                such mosaics). As part of the operation of your agency, Montage has to be executed often and
                regularly. Therefore, it is crucial that its execution be efficient.
            </p>

            <p>
                The structure of a Montage workflow looks like this:
            </p>

            <object className="figure" type="image/svg+xml" data={IOFigure1} />

            <p>
                [DESCRIPTION OF TASKS]
            </p>

            <p>
                At work, you have access to a 128-node cluster with 8 cores on each node. Each montage task,
                the way you have compiled them, uses 4 cores on a node. You have decided to never oversubscribe
                nodes. That is, at most two Montage tasks can run at the same time on a node of your cluster.
            </p>

            <p>
                Executing Montage on this cluster has energy costs in terms of money and CO2 emissions. In particular,
                given the power company your agency uses, one MWh of energy costs $XXX and produces XXX grams of
                CO2 emissions.
            </p>

            <p>
                The nodes of your cluster can be configured to operate in different power states, or "pstates". Each
                pstate corresponds to a particular frequency used by the processor, which is directly correlated to
                the performance of the processor and to its energy consumption. By decreasing the pstate, you are
                lowering the frequency at which the processor operates, thus making the tasks on that processor compute
                at a slower rate. Conversely, increasing the pstate increases the frequency, which leads to faster
                rates of computation. You can think of the pstate as being the dial on a stove: by cranking up the
                stove dial from low to high, you are increasing its power, thus allowing food to cook faster. Of
                course, operating at a higher pstate increases power consumption.
            </p>

            <p>
                The processors on your cluster's nodes have 7 pstate values (0 to 6). Each value corresponds to a
                particular clock rate and power consumption.
            </p>

            <p>
                <strong>Below is the table of GHz vs speed:</strong>
            </p>
            <p>
                <Table compact collapsing>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>pstate</Table.HeaderCell>
                            <Table.HeaderCell>GHz</Table.HeaderCell>
                            <Table.HeaderCell>Compute Speed (flops)</Table.HeaderCell>
                            <Table.HeaderCell>Power Consumption</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        <Table.Row>
                            <Table.Cell>0</Table.Cell>
                            <Table.Cell>1.2</Table.Cell>
                            <Table.Cell>0.5217</Table.Cell>
                            <Table.Cell>XXX</Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell>1</Table.Cell>
                            <Table.Cell>1.4</Table.Cell>
                            <Table.Cell>0.6087</Table.Cell>
                            <Table.Cell>XXX</Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell>2</Table.Cell>
                            <Table.Cell>1.6</Table.Cell>
                            <Table.Cell>0.6957</Table.Cell>
                            <Table.Cell>XXX</Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell>3</Table.Cell>
                            <Table.Cell>1.8</Table.Cell>
                            <Table.Cell>0.7826</Table.Cell>
                            <Table.Cell>XXX</Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell>4</Table.Cell>
                            <Table.Cell>2.0</Table.Cell>
                            <Table.Cell>0.8696</Table.Cell>
                            <Table.Cell>XXX</Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell>5</Table.Cell>
                            <Table.Cell>2.2</Table.Cell>
                            <Table.Cell>0.9565</Table.Cell>
                            <Table.Cell>XXX</Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell>6</Table.Cell>
                            <Table.Cell>2.3</Table.Cell>
                            <Table.Cell>1</Table.Cell>
                            <Table.Cell>XXX</Table.Cell>
                        </Table.Row>
                    </Table.Body>
                </Table>
            </p>

            <p>
                You can pick the pstate value of the nodes at will, and we'll assume that all nodes are always set
                to the same pstate.
            </p>

            <p>
                Furthermore, you can decide to power off some of the compute nodes. This is because an idling compute
                node still consumes power. Specifically, these compute nodes consume 98 Watts when idling. It thus may
                be preferable to turn some of them off, since your Montage workflow may not be able to use all 128
                compute nodes (due to limited parallelism in the workflow).
            </p>

            <p>
                Here is the simulator:
            </p>

            <SimulationActivity panelKey="local_computing" content={<Thrustd_Local_Simulation />} />

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
                <br /><br />
                <ul>
                    <li>Option 1: Turn off some of the cluster nodes and simply not use them. Using a binary search,
                        find the smallest number of nodes that satisfies the 1-hour time limit.</li>
                    <li>Option 2: Downclock all the cluster nodes to a lower pstate. Using a binary search, find the
                        smallest pstate that satisfies the 1-hour time limit.</li>
                </ul>
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
                <br /><br />
                Report on the number of nodes and pstate that you end up using. It turns out that the optimal cluster
                configuration in terms of number of nodes used and pstate leads to a $ cost of $X with an execution
                of XXX minutes. How far is your answer from the optimal?
            </p>
        </>
    )
}

export default LocalComputing
