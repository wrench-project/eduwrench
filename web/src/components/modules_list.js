import React from "react"
import { Button, List, Segment, SegmentGroup } from "semantic-ui-react"

const ModulesList = () => {
  return (
    <>
      <h3 style={{
        marginBottom: `20px`,
        marginTop: `30px`,
        color: "#525252"
      }}>
        <br />OUR MODULES
      </h3>

      <h4 style={{ margin: 0 }}><br />A. Parallel and Distributed Computing Concepts</h4>

      <SegmentGroup className="modules">
        <Segment><strong>A.1. Single-core Computing</strong></Segment>
        <Segment>
          <p className="module-desc">
            <Button size="mini" color="yellow" floated="left"
                    href="/pedagogic_modules/single_core_computing/">Launch</Button>
            The goal of this module is to provide you with basic knowledge about sequential computing (i.e., running a
            program on a single core).
          </p>
        </Segment>
      </SegmentGroup>

      <SegmentGroup className="modules">
        <Segment><strong>A.2. Multi-core Computing</strong></Segment>
        <Segment>
          <p className="module-desc">
            <Button size="mini" color="yellow" floated="left"
                    href="/pedagogic_modules/multi_core_computing/">Launch</Button>
            The goal of this module is to introduce you to multi-core computing (i.e., running a program on multiple
            cores within the same computer).
          </p>
        </Segment>
      </SegmentGroup>

      <SegmentGroup className="modules">
        <Segment><strong>A.3. Distributed Computing</strong></Segment>
        <Segment>
          <List divided>
            <List.Item>
              <List.Content>
                <Button size="mini" color="yellow" floated="left"
                        href="/pedagogic_modules/networking_fundamentals/">Launch</Button>
                &nbsp;&nbsp;A.3.1 Networking Fundamentals
                <br />
                <span className="module-desc">The goal of this module is to provide you with knowledge of networking,
                  as it relates to the performance of distributed computing applications.</span>
              </List.Content>
            </List.Item>
            <List.Item>
              <List.Content>
                <Button size="mini" color="yellow" floated="left"
                        href="/pedagogic_modules/client_server/">Launch</Button>
                &nbsp;&nbsp;A.3.2 Client-Server
                <br />
                <span className="module-desc">The goal of this module is to introduce you to the fundamental
                  client/server model of computation.</span>
              </List.Content>
            </List.Item>
            <List.Item>
              <List.Content>
                <Button size="mini" color="yellow" floated="left"
                        href="/pedagogic_modules/coordinator_worker/">Launch</Button>
                &nbsp;&nbsp;A.3.3 Coordinator-Worker
                <br />
                <span className="module-desc">The goal of this module is to introduce you to the coordinator/worker
                  model of computation, which in some sense extends client-server.</span>
              </List.Content>
            </List.Item>
            <List.Item>
              <List.Content>
                <Button size="mini" color="yellow" floated="left"
                        href="/pedagogic_modules/workflows/">Launch</Button>
                &nbsp;&nbsp;A.3.4 Workflows
                <br />
                <span className="module-desc">The goal of this module is to introduce you to the workflow model of
                  computation that is used in many real-world scientific applications.</span>
              </List.Content>
            </List.Item>
          </List>
        </Segment>
      </SegmentGroup>

      <h4 style={{ margin: 0 }}><br />B. Cyberinfrastructure Concepts</h4>

      <SegmentGroup className="modules">
        <Segment><strong>B.1. CI Service Concepts</strong></Segment>
        <Segment>
          <p className="module-desc">
            <Button size="mini" color="yellow" floated="left"
                    href="/pedagogic_modules/ci_service_concepts/">Launch</Button>
            The goal of this module is to provide you with basic knowledge about cyberinfrastructure (CI) services.
          </p>
        </Segment>
      </SegmentGroup>

      <h4 style={{ margin: 0 }}><br />C. Specific Cyberinfrastructure Services</h4>

      <SegmentGroup className="modules">
        <Segment><strong>C.1. Batch Scheduling</strong></Segment>
        <Segment>
          <p className="module-desc">
            <Button size="mini" color="yellow" floated="left"
                    href="/pedagogic_modules/batch_scheduling/">Launch</Button>
            The goal of this module is to provide you with fundamental knowledge of and
            hands-on experience with the use of a batch scheduler.
          </p>
        </Segment>
      </SegmentGroup>

    </>
  )
}

export default ModulesList