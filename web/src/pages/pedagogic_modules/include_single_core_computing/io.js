import React from "react"
import { Divider, Header, Icon, Table } from "semantic-ui-react"
import TeX from "@matejmazur/react-katex"
import LearningObjectives from "../../../components/learning_objectives"
import SimulationActivity from "../../../components/simulation/simulation_activity"
import PracticeQuestions from "../../../components/practice_questions"
import IOSimulation from "./io_simulation"

import IOFigure1 from "../../../images/vector_graphs/single_core/IO_figure_1.svg"
import IOFigure2 from "../../../images/vector_graphs/single_core/IO_figure_2.svg"
import IOFigure3 from "../../../images/vector_graphs/single_core/IO_figure_3.svg"
import IOFigure4 from "../../../images/vector_graphs/single_core/IO_figure_4.svg"
import IOFigure5 from "../../../images/vector_graphs/single_core/IO_figure_5.svg"

const IO = () => {
  return (
    <>
      <LearningObjectives objectives={[
        "Understand the concept of IO",
        "Understand the impact of IO operations on computing",
        "Understand the basics of optimizing computation around IO operations"
      ]} />

      <h2>Basic Concepts</h2>

      <p>
        A computer typically does not run a program start to finish in a vacuum. Programs often need to
        consume <strong>I</strong>nput and produce <strong>O</strong>utput, which is done by executing <strong>IO
        operations</strong>. A couple of very common IO operations are reading from disk and writing to disk. As the
        disk is much slower than the CPU, even small disk reads or writes can represent a large (from the CPU’s
        perspective) chunk of time during which the CPU is sitting idle.
      </p>

      <p>
        When it comes to IO operations, not all programs are created equal. Some programs will require more IO time than
        others. In fact, programs are typically categorized as IO- or CPU-intensive. If a program spends more time
        performing IO operations than CPU operations, it is said to be <i>IO-intensive</i>. If the situation is
        reversed, the program is said to be <i>CPU-intensive</i>. For instance, a program that reads a large jpeg image
        from disk, reduces the brightness of every pixel (to make the image darker), and writes the modified image to
        disk is IO-intensive on most standard computers (a lot of data to read/write from/to disk, and very quick
        computation on this data – in this case perhaps just a simple subtraction). By contrast, a program that instead
        of reducing the brightness of the image applies an oil painting filter to it will most likely be CPU-intensive
        (applying an oil painting filter entails many, many more computations than a simple subtraction).
      </p>

      <p>
        As mentioned above, reading from and writing to the disk are slow operations compared to the CPU. Typically,
        there is a difference between read and write speeds as well. Reading is typically significantly faster than
        writing. Furthermore, different kinds of disks have different speeds as well. The table below shows advertised
        read and write speeds for two mass-market SATA disks, a Hard Disk Drive (HDD) and a Solid State Drive (SSD), at
        the time this content is being written:
      </p>

      <Table collapsing>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Disk</Table.HeaderCell>
            <Table.HeaderCell>Read Bandwidth</Table.HeaderCell>
            <Table.HeaderCell>Write Bandwidth</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell>WD HDD (10EZEX)</Table.Cell>
            <Table.Cell>160 MB/sec</Table.Cell>
            <Table.Cell>143 MB/sec</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>Samsung 860 EVO</Table.Cell>
            <Table.Cell>550 MB/sec</Table.Cell>
            <Table.Cell>520 MB/sec</Table.Cell>
          </Table.Row>
        </Table.Body>
        <Table.Footer>
          <Table.Row>
            <Table.HeaderCell colSpan="3">
              The read and write speeds are often referred to as <strong>bandwidths</strong>. The units above is MB/sec
              (MegaByte per second), which is also written as MBps.
            </Table.HeaderCell>
          </Table.Row>
        </Table.Footer>
      </Table>

      <p>
        Determining the exact bandwidth that disk reads and writes will experience during program execution is actually
        difficult (due to the complexity of the underlying hardware and software, and due to how the data is stored and
        accessed on the disk). In this module, we will always assume that disk bandwidths are constant.
      </p>

      <h2>A Program with Computation and IO</h2>

      <p>
        Let us consider a program that performs a task in three phases. First, it reads data from disk. Second, it
        performs some computation on that data to create new data. And third, it writes the new data back to disk. This
        could be one of the image processing programs mentioned in the previous section as examples. If this program is
        invoked to process two images, i.e., so that it performs two tasks, then its execution timeline is as depicted
        below:
      </p>

      <IOFigure1 />
      <div className="caption"><strong>Figure 1:</strong> Example execution timeline.</div>

      <p>
        As can be seen in the figure, at any given time either the CPU is idle (while IO operations are ongoing) or the
        disk is idle (while computation is ongoing). In the above figure, reading an image from disk takes 1 second,
        writing an image to disk takes 1 second, and processing an image takes 2 seconds. (We can thus infer that the
        two images have the same size, and that the disk has identical read and write bandwidths). We can compute the
        CPU Utilization as follows:
      </p>

      <TeX block math="\text{CPU Utilization}  = \frac{T_{Compute}}{T_{Compute} + T_{Idle}} = \frac{4}{4 + 4} = 0.5" />

      <p>
        This means that the CPU is idle for half of the execution of the program. This program is perfectly balanced,
        i.e., it is neither CPU-intensive nor IO-intensive.
      </p>

      <h2>Overlapping computation and IO</h2>

      <p>
        The execution in the previous section can be improved. This is because <strong>the CPU and the disk are two
        different hardware components, and they can work at the same time</strong>. As a result, while the CPU is
        processing the 1st image, the 2nd image could be read from disk! The CPU can then start processing the 2nd image
        right away after it finishes processing the 1st image. The 1st image can be written to disk at the same time.
        This execution is depicted below:
      </p>

      <IOFigure2 />
      <div className="caption"><strong>Figure 2:</strong> Example execution timeline with overlap of IO and computation.
      </div>

      <p>
        The total execution time has dropped by 2 seconds <strong>and</strong> the CPU utilization is increased:
      </p>

      <TeX block math="\text{CPU Utilization} = \frac{T_{Compute}}{T_{Compute} + T_{Idle}} = \frac{4}{4 + 2} = 0.66" />

      <p>
        If there were additional, similar images to process, the CPU utilization would continue to drop as it would be
        idle only at the very beginning and at the very end of the execution.
      </p>

      <p>
        The above is an ideal situation because IO time for an image is exactly equal to compute time. More precisely,
        save for the first and last task, <i>while the program computes task <TeX math="i" /> there is enough time to
        write the output of task <TeX math="i-1" /> and to read the input of task <TeX math="i+1" /></i>.
      </p>

      <p>
        If the above condition does not hold, then there is necessarily CPU idle time. For instance, if the time to read
        an image is instead 2s (for instance because the program reads larger images but writes back down-scaled images)
        and the program must process 3 images, then the execution would be as:
      </p>

      <IOFigure3 />
      <div className="caption"><strong>Figure 3:</strong> Example execution timeline with overlap of IO and computation.
      </div>

      <p>
        As expected, the program first reads 2 images, and then alternates write and read operations while CPU
        computation is going on. But in this case, the CPU experiences idle time because images cannot be read from disk
        fast enough. So although overlapping IO and computation almost always reduces program execution time, the
        benefit can vary based on IO and computation volumes (and especially if these volumes vary from task to task!).
      </p>

      <Divider />

      <h2>Practical concerns</h2>

      <p>
        In practice, one can implement a program that overlaps IO and computation. This can be done by using
        non-blocking IO operations and/or threads. These are techniques that are described in
        Operating Systems <a href="/textbooks">textbooks</a>. The overlap may not be completely "free", as
        reading/writing data from disk
        can still require the CPU to perform some computation. Therefore, there can be time-sharing of the CPU between
        the IO operations and the computation, and the computation is slowed down a little bit by the IO operations
        (something we did not show in the figures above). This said, there are ways for IO operations to use almost no
        CPU cycles. One such technique, which relies on specific but commonplace hardware, is called Direct Memory
        Access (DMA). See Operating Systems <a href="/textbooks">textbooks</a> for more details.
      </p>

      <p>
        Another practical concern is RAM pressure. When going from the example execution in Figure 1 to that in Figure
        2, the peak amount of RAM needed by the program is increased because at some point more than one input images
        are held in RAM. Since tasks could have significant memory requirements, RAM constrains can prevent some overlap
        of IO and computation.
      </p>

      <Header as="h3" block>
        Simulating IO
      </Header>

      <p>
        So that you can gain hands-on experience with the above concepts, use the simulation app below.
      </p>

      <p>
        Initially, you can create a series of identical tasks that have a certain input and output. Run the simulation
        to see the progression of tasks and host utilization without allowing IO to overlap with computation. Once you
        have observed this, try selecting the checkbox to allow overlap. With IO overlap there should be an improvement
        in execution time and host utilization. You can view this in the output graphs that are generated. You can also
        try varying the input/output and computation amounts to create IO-intensive or CPU-intensive tasks.
        Understanding which tasks will benefit from increased R/W or computation speeds will assist you in answering the
        questions to come.
      </p>

      <SimulationActivity panelKey="io" content={<IOSimulation />} />

      <Divider />

      <PracticeQuestions questions={[
        {
          key: "A.1.p4.1]",
          question: "Say you have 10 tasks to execute, where each task reads in 200 MB of input, computes 2500 Gflop, " +
            "and writes out 100MB of output. These 10 tasks are to be executed on the platform shown in the simulation " +
            "app above. What is the total execution time when I/O and computation can be overlapped? Show your work. " +
            "Use the simulation app to check your answer. What is the core utilization percentage? Show your work.",
          content: (
            <>
              Reading 200 MB takes 2 seconds, computing 2500 Gflop takes 25 seconds, and writing 100 MB takes 1 second.
              The compute time is much larger than the I/O time. So the total execution time will
              be <TeX math=" 2 + 10\times 25 + 1 = 253" /> seconds, which is confirmed by the simulation.
              The core is idle for only 3 seconds (at the very beginning and the very of of the execution), and so the
              core utilization is <TeX math="250/253 = 98.8\%" />.
            </>
          )
        },
        {
          key: "A.1.p4.2",
          question: "A program reads 2GB of input from disk, performs a 6 Tflop computation on this input, and then " +
            "writes 1GB of output to disk. It is executed on a computer that has a CPU that computes at speed " +
            "500 Gflop/sec and has a HDD with R/W bandwidth of 200 MB/sec. Is the program execution IO-intensive or " +
            "CPU-intensive? If you could upgrade either the CPU or the HDD, which upgrade would you choose? " +
            "Show your work and reasoning.",
          content: (
            <>
              The execution time breakdown is as follows:
              <ul>
                <li>Read input: 2000 MB / 200 MB/sec = 10 sec</li>
                <li>Compute: 6000 Gflop / 500 Gflop/sec = 12 sec</li>
                <li>Write input: 1000 MB / 200 MB/sec = 5 sec</li>
              </ul>
              Therefore the program's execution is IO-intensive. Therefore one should upgrade the HDD.
            </>
          )
        },
        {
          key: "A.1.p4.3",
          question: (
            <>
              You are working at a company that runs instances of the same task repeatedly. On the currently available
              hardware, the time to process a task instance is as follows:
              <ul>
                <li>Read input: 2 sec</li>
                <li>CPU computation: 3 sec</li>
                <li>Write output: 2 sec</li>
              </ul>
              <p>
                A program was designed to overlap IO and computation when executing multiple task instances in sequence.
                As in Figure 3, the program first reads the input for the first 2 tasks, and then alternates between
                writing the output for task <TeX math="i" /> and reading the input for task <TeX math="i + 2" />, until
                at
                the end it writes the output of the last two tasks one after the other. The computation on the CPU for a
                task is started as soon as its input has been read from disk.
              </p>
              <p>
                What is the total execution time when processing 4 consecutive task instances? Show your work, possibly
                including a depiction of the execution as in Figure 3 above. You can use the simulation app above to
                check your answer!
              </p>
              <p>
                What is the core utilization? Show your work.
              </p>
            </>
          ),
          content: (
            <>
              <p>
                Here is a depiction of the execution:
              </p>
              <IOFigure4 />
              <p>
                The execution time is <strong>18 seconds</strong>. (This result can be generalized for <TeX
                math="n" /> tasks by identifying the repeating pattern: <TeX
                math="2 + 3 + (n-1) \times (3 + 1) + 1 = 4n + 2" />.)
              </p>
              <p>
                We can double-check the result in simulation by setting the number of tasks to 4, the amount of input
                data to 200 MB, the amount of output data to 200 MB, and the task work to 300 Gflop.
              </p>
              <p>
                The CPU is utilized for 12 seconds. Therefore the CPU utilization is 12/18 = 66.6%.
              </p>
            </>
          )
        },
        {
          key: "A.1.p4.4",
          question: (
            <>
              In the same setting as in the previous question, it is decided to purchase a SSD to replace the HDD
              currently being used. The SSD has <strong>twice the bandwidth</strong> of the HDD. What is now the CPU
              utilization when processing 4 consecutive task instances? Show your work, possibly including a depiction
              of the execution as in Figure 3 above.
            </>
          ),
          content: (
            <>
              <p>Here is a depiction of the execution:</p>
              <IOFigure5 />
              <p>
                The execution time is <strong>14 seconds</strong>. (This result can be generalized for <TeX
                math="n" /> tasks easily: <TeX math="3n + 2" />.)
              </p>
              <p>
                The CPU is utilized for 12 seconds. Therefore the CPU utilization is 12/14 = 85.7%.
              </p>
              <p>
                By making the IO faster, input for tasks is always ready for the CPU to process. As the number of tasks
                increases, the CPU utilization tends to 100%.
              </p>
            </>
          )
        }
      ]}
      />

      <Divider />

      <Header as="h3" block>
        Questions
      </Header>

      <p>
        <strong>[A.1.q4.1]</strong> Consider a series of 10 identical tasks. With the hardware we have available, each
        task requires 1 second to read data from disk, 2 seconds for computation, and 0.5 seconds to write the output
        back
        to the disk.
      </p>
      <ul>
        <li>What is the lowest possible execution time if we are not able to perform IO during computation? Show your
          work.
        </li>
        <li>What is the lowest possible execution time when overlap of computation and IO is possible? Show your work.
        </li>
      </ul>
      <p>
        Show your work, depicting executions as in the figures earlier in this page and compute the execution times
        accordingly.
      </p>

      <p>
        <strong>[A.1.q4.2]</strong> A task requires 50 MB of input data to be loaded from disk before computation and
        writes 50 MB of data to disk once computation has been completed. The computation performs 500 Gflop. Instances
        of
        this task are executed continuously in sequence throughout the day, in a way that overlaps IO and computation.
        The
        computer on which this is done has a disk with R/W bandwidth 200 MB/sec and a CPU with compute speed 1.5
        Tflop/sec. We wish to increase the number of task instances we can execute per day. Should we upgrade the
        processor? Or should we upgrade the disk? Show your work by computing execution times for both options, possibly
        depicting executions as in the figures earlier in this page.
      </p>

      <p>
        <strong>[A.1.q4.3]</strong> A task requires 100 MB of input data to be loaded from disk, performs 1 Tflop of
        computation, and writes some output back to disk. A batch of fifty instances of this task is to be run on a
        computer with a processor capable of 250 Gflop/sec and a disk with R/W bandwidths of 100 MB/sec. IO and
        computation are overlapped. How large can the task output be so that the CPU is still 100% utilized? (ignoring
        the initial input read and final output write, during which the CPU is necessarily idle). Show your work by
        writing (and solving) a simple inequation.
      </p>

      <Divider />

      <Header as="h3" block>
        Suggested Activities
      </Header>

      <p>
        <strong>[Programming #1]</strong> Implement a program that first reads in all the bytes in a file into an array
        of bytes in RAM. The program then computes and prints out the number of bytes that are equal to 0. The program
        should also print the time spent reading the file into RAM and the time to compute the result. Determine
        experimentally whether this program is compute- or I/O-intensive. You will need to run the program on a
        sufficiently large file so that you can obtain meaningful results.
      </p>

      <p>
        <strong>[Programming #2]</strong> Modify your program so that it determines which byte value is the most
        frequent in the file. Is this modified program more or less I/O-intensive? By how much?
      </p>

    </>
  )
}

export default IO
