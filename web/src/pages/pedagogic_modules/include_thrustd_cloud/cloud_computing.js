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

            <p>
                <b>Your company has decided that a low carbon footprint is a high priority</b>. As a result, 
                from now on, the local cluster is configured by powering on only <b>12 nodes</b>
                all at <b>p-state 0</b>. Other nodes are simply turned off for the day-to-day business. 
            </p>


            <h3>A remote cloud to the rescue</h3>

            <p>
                To still make it possible to run the workflow quickly, your boss has secured access to a <b>remote cloud platform</b>, on 
                which your company has <b>16 virtual machines (VMs)</b> available for running workflow
                tasks. Each VM has XX cores that compute at speed XX GHz. The cloud is accessible via
                the wide-area network, and the data transfer rate is 15 MBps. The good thing about this cloud
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
            

            The simulation app below allows you to experiment with different resource allocation
            schemes. Use the sliders to set, for each workflow level, the fraction of its tasks
            that should run on the remote cluster. You can explore diferent options yourself, but you 
            should also use the simulation to answer the questions hereafter. 

            <SimulationActivity panelKey="cloud_computing" content={<Thrustd_Cloud_Simulation />} />

            <Divider />
            <Header as="h3" block>
                Questions
            </Header>

            <p>
                <strong>[D.1.q2.1]</strong> TBD
            </p>

        </>
    )
}

export default CloudComputing
