import React from "react"
import TeX from "@matejmazur/react-katex"
import { Divider, Header } from "semantic-ui-react"
import LearningObjectives from "../../../components/learning_objectives"

import WorkflowsCapstoneScenario from "../../../images/vector_graphs/workflows/workflow_capstone.svg"

const WorkflowsCapstone = ({module, tab}) => {
    return (
        <>
            <LearningObjectives module={module} tab={tab}
            />

            <h2>Scenario</h2>

            <p> Consider the scenario (i.e., a workflow to be executed on a distributed platform) depicted in this
                figure: </p>
            <WorkflowsCapstoneScenario />

            <p>
                The 4-task workflow needs to be executed on a 2-host platform, with all
                workflow data hosted at a remote storage site. The first task of the
                workflow is a data-parallel task; 10% of its sequential execution time
                cannot be parallelized (i.e., <TeX math="\alpha = 0.9" />).
            </p>
            <p>
                Note that in the platform above, we give you the actual data transfer rate
                achieved by the wide-area link (20 MB/sec). As we saw in previous tabs, due
                to high latencies, the achieved data transfer rate can be well below the
                link bandwidth. We give you the data transfer rate so that it
                is straightforward to estimate data transfer times accurately.
            </p>

            <h2>Possible platform upgrades</h2>

            <p>
                The compute resources in the platform are really virtual machines that
                you have leased from a cloud provider. With the current configuration
                the workflow executes in 74 seconds, but you want it to run it
                as fast as possible since you want to execute this workflow as many times
                as possible per day (with different input data).
            </p>
            <p>
                After looking at the cloud provider's website, you
                figure out you can afford <strong>one</strong> of the following upgrades:
            </p>
            <ul>
                <li><strong>Upgrade #1:</strong> Double the wide-area data transfer rate;</li>
                <li><strong>Upgrade #2:</strong> Add 2 cores to each host; or</li>
                <li><strong>Upgrade #3:</strong> Add 8 GB of RAM to each host.</li>
            </ul>

            <Divider />

            <Header as="h3" block>
                Questions
            </Header>

            <p><strong>[A.3.4.q5.1]</strong> Which upgrade should you pick? Show your work, by deriving the completion time of
                the last task from a Gantt chart of the workflow execution for each option above.</p>

        </>
    )
}

export default WorkflowsCapstone
