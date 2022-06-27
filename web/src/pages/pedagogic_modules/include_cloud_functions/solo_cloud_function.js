import React from "react"
import {Divider, Header} from "semantic-ui-react"
import LearningObjectives from "../../../components/learning_objectives";
import SimulationActivity from "../../../components/simulation/simulation_activity";
import Solo_Cloud_Function_Simulation from "./solo_cf_sim";
import FeedbackActivity from "../../../components/feedback/feedback_activity";
import FeedbackQuestions from "../../../components/feedback_questions";

const SoloCloudFunction = ({module, tab}) => {
    return (
        <>
            <LearningObjectives module={module} tab={tab}
            />

            <p>
                You are an employee at a data science company that is working on an on-demand license plate recognition
                service that will be used for real-time video analysis of parking lots. This service will be used continuously
                by various customers and must operate 24/7.
            </p>

            <p>
                The license plate recognition service consists of a function that takes as input an image and returns
                license plate numbers, which can then be searched in a database.  Rather than hosting this function
                on bare-metal servers hosted in-house, the goal is to deploy this system using “cloud functions”.
            </p>

            <p>
                Cloud functions are essentially as the name suggests: they are functions that you can invoke and
                run on the cloud (one term many people use to describe this concept is “serverless computing”).
                Cloud function deployments can scale by provisioning more function instances, that is, increasing
                the number of function executions that can execute concurrently. Two popular examples of cloud function platforms
                are Google Cloud and AWS Lambda.
            </p>

            <p>
                Cloud functions are charged when running, meaning that the customer only incurs cost when
                the function is being executed. (This is in sharp contrast with
                the cost model for virtual machine instances.)
            </p>

            <p>
                Cloud functions systems typically implement a time-out mechanism. That is, when all instances
                provisioned for a cloud function are already running,  if a new function
                invocation is placed it waits. If an instance does not become available within a specific
                time-out duration, then the function invocation fails. (The simulation below assumes the time-out
                is 10 seconds, but this value is not necessary to understand simulation results and/or to answer
                questions hereafter).
            </p>

            <p>
                We assume that the license plate recognition function that your company needs to deploy on the cloud
                runs in <strong>95 seconds</strong> on a cloud function instance.
            </p>

            <p>
                The usage pattern of the license plate recognition function, i.e., the number of function invocation
                requests per time unit, varies throughout time. Specifically, it oscillates between
                a minimum number of requests per seconds (1 per second, say in the middle of the night) and some
                maximum  (say during peak hours). These oscillations have a random component, and therefore there
                is a bit of jitter.
            </p>

            <h3>Simulation</h3>

            <p>
                The simulation application below simulates the system for a couple of days. It takes as input the number of
                provisioned instances and the maximum request rate. The output is the number of total requests, the
                number of requests that have succeeded, and the number of requests that have failed due to a
                time-out (total = succeeded + failed).
            </p>

            <SimulationActivity panelKey="solo_cloud_function" content={<Solo_Cloud_Function_Simulation/>}/>

            <Divider/>
            <Header as="h3" block>
                Questions
            </Header>

            <p>
              <strong>The simulation is deterministic, that is, it always produces the same output for the same input.
                  The results do show jitter, the jitter is sampled from a seeded random number generator
                  and thus, deterministic. In a real-world setting, unlike with this simulation,
                  multiple experiments should be executed to compute statistics.
              </strong>
            </p>

            <p>
                <strong>[C.2.q1.1]</strong> Assume your function is working in an environment in which peak hours
                see at most 20 requests per minute (i.e., max number of requests per minute is set to 20). How many
                instances do you need so that no request fails? Come up with an answer based on reasoning, explaining
                why you need this many instances. Then test your result by running the simulations.
            </p>

            <p>
                <strong>[C.2.q1.2]</strong> Using max 20 requests, what failure rate do you observe when reducing
                the number of instances you estimated in the previous question by 12.5%, 25%, 50%, or by 75%?
                Is the success rate linear in the number of instances?
            </p>

            <p>
                <strong>[C.2.q1.3]</strong> Your business partner estimates that the popularity of the function
                won’t be above 20 max requests. And in the first question above, you came up with a
                number of instances needed to achieve a 0% failure rate.  Your board of directors has decided
                that the cost paid to the cloud function provider is too high, and want to reduce it by $50. What failure rate
                would you then achieve?  Note that you do not know the charging rate, but only can observe the overall cost
                from the simulation. So you should answer this question empirically using the simulation.
            </p>

            <Header as="h3" block>
                You feedback is appreciated
            </Header>

            <FeedbackActivity content={
                <FeedbackQuestions feedbacks={[
                    {
                        tabkey: "solo_cloud_function",
                        module: "C.2"
                    },
                ]} />
            } />


        </>
    )
}

export default SoloCloudFunction
