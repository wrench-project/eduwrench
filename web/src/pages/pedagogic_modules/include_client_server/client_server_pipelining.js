import React from "react"
import { Divider, Header } from "semantic-ui-react"
import TeX from "@matejmazur/react-katex"
import LearningObjectives from "../../../components/learning_objectives"
import SimulationActivity from "../../../components/simulation/simulation_activity"
import PracticeQuestions from "../../../components/practice_questions"
import ClientServerPipeliningSimulation from "./client_server_pipelining_simulation"

import PipeliningImage from "../../../images/client_server/client_server_pipelining.svg"

const ClientServerPipelining = () => {
  return (
    <>
      <LearningObjectives objectives={[
        "Understand the need for and the mechanics of pipelining",
        "Be able to reason about how pipelining impacts performance"
      ]} />

      <h2>Adding I/O on the Client</h2>

      <p>
        In the previous tab, we have not considered disk I/O at all, which made
        things simple. But in many real-world cases, data is stored on disk. So let's
        consider a similar client-server setup with a client and two servers,
        but with a <strong>disk on the client</strong>.
      </p>

      <p>
        The 100 MB image to be processed resides on disk as an image file.
        The client program then reads it from disk into RAM and
        sends it over to the server, which performs 1000 Gflop of work.
        This now adds a third phase to the execution
        so that it would proceed as:
      </p>

      <ol>
        <li>Read data from disk into RAM;</li>
        <li>Send data from RAM to the server; and</li>
        <li>Compute on the server and reply to the client.</li>
      </ol>

      <p>Although at first glance this seems fine, there are two problems.</p>

      <p>
        <strong>Problem #1</strong>: What if the image does not fit in RAM? Now,
        this is unlikely for this application, as even high-res, uncompressed
        images can typically fit in RAM on current personal computers. But the client-server model
        could be used for applications for which input data is large. For instance, you
        can surely upload a large file, larger than your RAM, to a server, and yet the
        program that does the upload cannot store that file in RAM! So, in general, the execution cannot
        proceed with the three phases above.
      </p>

      <p>
        <strong>Problem #2</strong>:
        The second problem is poor performance. This is because phase 2 above has
        to wait for phase 1 to complete. So while the disk is doing its job, the
        network is idle. We should be able to do better because the network card
        and the disk are two different hardware components, so they can, in principle, work <i>at
        the same time.</i>
      </p>

      <h2>Pipelining</h2>

      <p>
        A way to solve both problems above is to use <strong>pipelining</strong>. As opposed to
        reading the whole image into RAM, we read only a part of it into a <strong>buffer</strong>, i.e., a relatively
        small zone of RAM. Let's say our <strong>buffer size</strong> is 4 KB, as an example. Then while we send the
        data in the buffer to the server, we read another 4 KB of the image into a second buffer. We wait
        until the first buffer has been sent over to the server, and now we repeat,
        swapping the buffers (that is, we now send the data in the second buffer to
        the server, and load data from disk into the first buffer). For our 1MB
        image file, the file transfer would proceed with 250 disk reads, and 250 network sends.
      </p>

      <p>
        The picture below shows an example timeline for sending a 1GB file stored on disk
        to the network using a 200MB buffer:
      </p>

      <object className="figure" type="image/svg+xml" data={PipeliningImage} />
      <div className="caption"><strong>Figure 1:</strong> Pipelining example.</div>

      <p>
        In the figure we see that, as expected, there are 5 disk reads and 5 network
        sends. Given the bandwidths, each disk
        read takes 1 second and each network send takes 2 seconds.
        The execution proceeds in 6 steps. In the first step there is
        only a disk read. Then there are 4 steps in which there is
        both a disk read and a network send. Finally, in the 6th
        and last step there is only a network send. This makes sense
        since we must begin with a lone disk read to fill the "first" buffer,
        and finish with a lone network send to send the "last" buffer.
        In all other steps, we overlap disk and network operations. We can
        compute the saving due to pipelining. If no pipelining were to be
        used, the total execution would be 15 seconds (5 seconds of disk read
        followed by 10 seconds of network send). Instead, with pipelining
        we are able to execute in only 11 seconds, over a 25% reduction in
        execution time.
      </p>

      <p>
        In this example above, the disk read time is faster than the network
        transfer time. So although the network is used constantly for the entire
        execution (save for the initial step), the disk is not. We call this
        an <strong>unbalanced pipeline</strong>. A simple real-world analogy is a washer and a
        dryer. If you have to do multiple loads of laundry, you typically use
        pipelining: while you are drying a load you are washing the next load. This
        is almost never a balanced pipeline because drying takes longer than
        washing. As a result, the washer often sits idle with wet clothes in it
        waiting to be dried. This is your clothes buffer that has gone through the
        first stage of the pipeline (the washer), but not through the second stage
        (the dryer). And you allow yourself a single wet cloth buffer
        (you do not want a mountain of wet clothes to accumulate in your laundry room!).
      </p>

      <p>
        If the disk read time was equal to the network transfer
        time (i.e., if the disk and the network had the same bandwidth), then we would say we
        have a <strong>balanced</strong> pipeline. In this case, save for the first and last
        step, both hardware resources are used constantly throughout the
        whole execution.
      </p>

      <h2>Buffer size</h2>

      <p>
        Although the principle of pipelining is simple, one question is that of the <strong>buffer size</strong>.
        You may have noted in the previous example that there is no downside to making the buffer
        as small as possible. In fact, the smaller the buffer size, the more overlap we have
        between disk and network activities! This is because with a smaller buffer size, the first and
        last steps of the execution are shorter, and these are (the only) steps during which there
        is no overlap. Pushing this reasoning to the extreme, one would conclude that the best choice is
        to use a 1-byte buffer!
      </p>

      <p>
        If you remember the <a href="/pedagogic_modules/networking_fundamentals">Networking Fundamentals module</a>,
        you may realize why a 1-byte buffer is a bad idea... it is all about <strong>latency</strong>!
      </p>

      <p>
        In the example above, and the figure, we did not say anything about latency. But in fact, each
        network link (and also the disk, but let's forget about this for now) has a latency. Often we have said we could
        neglect latency because
        the data transferred is large. <strong>But now that we split that data into potentially many very small
        "chunks", the latency may play an important role!</strong>
      </p>

      <p>
        For the above example, say we use a 1KB buffer size. Then we perform 1 GB / 1 KB = 1,000,000 individual
        file transfers. Say the network latency is a very low 1 microseconds. Then we will incur 1,000,000 of these
        latencies, for a total of 1 second! So instead of the 11 seconds of execution shown in the figure
        we would instead experience 12 seconds. This is still better than with no pipelining. But if the
        network latency was 10 microseconds, then we would be better off with no pipelining!
      </p>

      <p>
        Conversely, say we make the buffer size 500 MB instead of 200 MB. Then our execution time would be
        500/200 + 500/100 + 500/100 = 12.5 seconds (plus 2 negligible latencies). This is worse than with a
        200 MB buffer size because we have less pipelining.
      </p>

      <p>
        <strong>Bottom line</strong>: if the buffer size is too small, latencies hurt performance; if the buffer
        size is too large, less pipelining hurts performance.
        So one must pick a reasonable buffer size so that there is some pipelining but so that
        the execution does not become latency-bound.
      </p>

      <p>
        Note that pipelining is used in many programs. These program try to use up a "reasonable"
        buffer size. For instance, many versions of the <code>scp</code> secure
        file copy program pipeline disk and I/O operations with a buffer size of 16 KiB. If this
        program was to be used on the disk/network setup above, it would be better off with a bigger buffer
        size. <i>But of course, the developers of that program do not know in advance in what setup the
        program will be used!</i> Other versions of <code>scp</code> allow the user
        to specify a buffer size.
      </p>


      <Header as="h3" block>
        Simulating Client-Server with Pipelining
      </Header>

      <p>
        So that you can experiment with how pipelining works, below is an app that
        allows you to simulate the execution of a client-server setup where a 1GB file
        is stored on the disk at the client and needs to be sent to one of two
        servers, which then performs 1000 Gflop of work. You can choose the network
        latency for Server #1, and you can pick the buffer size used by the client program.
        You can use this app on your own, and then you should use it to answer
        the following practice questions.
      </p>

      <SimulationActivity panelKey="client-server-pipelining-simulation"
                          content={<ClientServerPipeliningSimulation />} />

      <Divider />

      <PracticeQuestions questions={[
        {
          key: "A.3.2.p2.1",
          question: "When using a 1 GB buffer size (i.e., no pipelining), what would you  expect the execution time " +
            "to be when running on Server #2? Show your work. Check your answer with the simulation.",
          content: (
            <>
              <p>One would expect the execution time to be:</p>
              <TeX
                math="T = \frac{1 \text{GB}}{400 \text{MB/sec}} + 10 \text{us} + \frac{1 \text{GB}}{600 \text{MB/sec}} + \frac{1000 \text{Gflop}}{60 \text{Gflop/sec}}"
                block />
              <p>which gives <TeX math="T = 20.83 \text{sec}" />.</p>
              <p>The simulation gives us 20.92 sec. As usual, our back-of-the-envelope estimate is a bit optimistic
                (because it does not capture some network behaviors), but it is close.</p>

            </>
          )
        },
        {
          key: "A.3.2.p2.2",
          question: "Still on Server #2, what do you think the execution time would be when setting the buffer size " +
            "to 500 MB? Show your work and reasoning. Check your answer in simulation.",
          content: (
            <>
              <p>
                With a 500 MB buffer, sending the file over to the server consists of three steps. In the first step,
                500 GB of data is read from the disk into a buffer. This take 500/400 = 1.25 seconds. Then, at the same
                time, this data is sent to the server and another 500 MB is read from the disk. Because the network for
                Server #2 has higher bandwidth than the disk, the disk is the bottleneck, and so this step also takes
                1.25 seconds. Finally, in the third step, 500 MB of data is sent over the network, which takes time
                500/600 = .83 seconds. So overall, the file transfer takes time 1.25 + 1.25 + .83 = 3.33 seconds. The
                server then computes for 1000/60 = 16.66 seconds. So in total, the execution time is 19.99 seconds. Note
                that we neglected network latencies since we incur only three of them.
              </p>

              <p>The simulation gives us 20.04 seconds, which again is very close.</p>
            </>
          )
        },
        
      ]} />

      <Divider />

      <Header as="h3" block>
        Questions
      </Header>


    </>
  )
}

export default ClientServerPipelining
