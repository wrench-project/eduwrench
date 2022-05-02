import React from "react"
import {Divider, Header} from "semantic-ui-react"
import LearningObjectives from "../../../components/learning_objectives";
import SimulationActivity from "../../../components/simulation/simulation_activity";

const SoloCloudFunction = ({module, tab}) => {
    return (
        <>
            <LearningObjectives module={module} tab={tab}
            />

            <p>
                You are an employee at a data science company that is working on an on-demand facial recognition
                service that will be used for real-time video analysis. This service will be used continuously
                by various customers and must operate continuously.
            </p>

            <p>
                The facial recognition service consists of a function that takes as input an image and returns
                extracted features, which can then be searched in a database.  Rather than hosting this function
                on bare-metal servers at your company, the goal is to deploy this system using “cloud functions”.
            </p>

            <p>
                Cloud functions are essentially as the name suggests. They are functions that you can run on the
                cloud, and one term many people use to describe this is serverless. Cloud functions are typically
                scalable and the code is typically run together with event-driven code in order to create the
                code product that you need. Two popular examples of cloud function platforms are Google Cloud
                and AWS Lambda.
            </p>

            <p>
                In terms of cost, cloud functions are charged when running, meaning that cost only incurs when the
                function is running, not when the function is idle. Typically, this means you pay a rate per time
                unit for the amount of time that the function is running as opposed to paying for uptime.
            </p>

            <p>
                One feature that cloud functions have is a time-out mechanism. This is when all instances
                provisioned for a cloud function have been taken up. If a job is to be run but there are no free
                instances at the time, the cloud function will wait for the amount of time that the time-out
                specifies. If an instance has still not been freed up for the job to run on, the job fails and
                the function moves on. In the case of this module, we assume the time-out mechanism implements a
                time-out of 10 seconds.
            </p>

            <p>
                We also assume that this function runs in 1 minute on a cloud function instance.
            </p>

            <p>
                The usage pattern of the facial recognition function, i.e., the number of function invocation
                requests by customers per time unit, varies throughout time. Specifically, it oscillates between
                some minimum number of requests per seconds (1 per minute, say in the middle of the night) and some
                maximum  (say during peak hours). These oscillations have a random component, and therefore there
                is a bit of jitter.
            </p>

            <h3>Simulation</h3>

            <p>
                The simulation application below simulates the system for 1 week. The input takes the number of
                instances and the maximum request rate. The output is the number of total requests, with there
                being 3 divisions: arrived, succeeded, and failed (arrived = succeeded + failed).
            </p>



            {/*<SimulationActivity panelKey="local_computing" content={<Thrustd_Local_Simulation/>}/>*/}

            <Divider/>
            <Header as="h3" block>
                Questions
            </Header>

            <p>
                <strong>[C.2.q1.1]</strong> Assume your function is working in an environment in which peak hours
                see a max X requests per second (i.e., max number of requests per second is set to X). How many
                instances do you need so that no request fails? Come up with an answer based on analysis
                (e.g., math), and then test your theory by running the simulation and explain why you need that
                many instances.
            </p>

            <p>
                <strong>[C.2.q1.2]</strong> Using max X requests, what failure rate do you observe when reducing
                the number of instances by 10%, 25%, or by 50%? Is the increase in failure rate linear with the
                decrease in number of instances?
            </p>

            <p>
                <strong>[C.2.q1.3]</strong> Your business partner estimates that the popularity of the function
                won’t be above Y max requests. How many instances would then be sufficient to achieve a failure
                rate below 1%?
            </p>

            <p>
                <strong>[C.2.q1.4]</strong> Using max Y requests, the number of instances you picked in Question 3
                leads to a cost of $XXX.  It turns out that your board of directors deems that a 10% failure rate
                of function invocations is still acceptable (that is, if 10% of invocations fail then customers
                will still find the system useful).  What cost saving would occur when allowing for a 10% failure
                rate?
            </p>
        </>
    )
}

export default SoloCloudFunction
