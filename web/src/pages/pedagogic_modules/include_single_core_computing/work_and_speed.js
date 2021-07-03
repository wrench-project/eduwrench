import React from "react"
import { Accordion, Divider, Header, Icon, Segment } from "semantic-ui-react"
import TeX from "@matejmazur/react-katex"

const WorkAndSpeed = () => {
  return (
    <>
      <Segment.Group className="objectives">
        <Segment inverted><strong>Learning Objectives</strong></Segment>
        <Segment style={{ backgroundColor: "#fafafa" }}>
          <ul style={{ backgroundColor: "#fafafa" }}>
            <li>Understand the concepts of <i>work</i> and of <i>compute speed</i></li>
            <li>Be familiar with Flop as a measure of work and with Flop/sec as a measure of compute speed</li>
            <li>Understand the simple relationship between program execution time, work, and compute speed</li>
          </ul>
        </Segment>
      </Segment.Group>

      <h2>Measures of Work and Compute Speed</h2>

      <p>
        In these pedagogic modules we rarely consider programs that are interactive, i.e., that react based on real-time
        user input via the keyboard or the mouse. A text editor would fall in this category. Instead, we almost always
        consider programs that have some amount of computation, or <strong>work</strong>, to perform and then terminate.
        An example would be a program that mines a cryptocurrency.
      </p>

      <p>
        The simplest model of performance when executing a non-interactive program on a core of a computer is to assume
        that the computer delivers constant <i>compute speed</i>, which is measured by the quantity of work performed
        per time unit. For instance, a program with 100 units of work would run in 50 seconds on a core with a speed of
        2 units of work per second. This last number is called the program’s <strong>execution time</strong>.
      </p>

      <p>
        Generalizing the above example, for a given amount of work to perform there is a linear relationship between the
        program’s execution time and the speed of the core on which it is executed:
      </p>

      <TeX math="\text{execution time} = \frac{\text{work}}{\text{compute speed}}." block />

      <p>
        There are many options for choosing an appropriate way to quantify work. One possibility is to use a measure
        that is specific to what the program does. For instance, if the program renders movie frames, a good measure of
        work would be the number of frames to render. One would then want to measure a core’s speed in terms of the
        number of frames that can be rendered per second (assuming all frames require the same amount of computation).
      </p>

      <p>
        Another possibility is to use a more generic measure, for instance, the number of instructions. The work of a
        program would then be measured by its number of instructions (e.g., the number of hardware instructions the
        program performs) and the speed of a core would be in number of instructions per second. This approach is known
        to have problems, as instructions are not all equal, and especially across different families of processors.
        Therefore, a processor that delivers fewer instructions per seconds than another could actually be preferred for
        running some program.
      </p>

      <h2>Flop and Flop/sec</h2>

      <p>
        It turns out that the question of defining a universal unit of work is not possible, but we haver have to pick a
        consistent measure in these pedagogic modules. One option would be Million of Instructions, and thus the
        well-known MIPS (Million Instructions Per Second) measure of compute speed. A problem with this metric is that
        instructions (i.e., hardware instructions) are different across microprocessor families, thus leading to
        apples-to-oranges comparisons. Another metric, which is more related to what is being computed is the number of
        floating-point operations, or <strong>Flop</strong>, to perform (making the implicit assumptions that the
        programs we consider mostly perform floating point computations). This is the metric that we use in these
        pedagogic modules, unless specified otherwise. We thus measure the speed of a core in Flop/sec, which is
        commonly used in the field of high-performance scientific computing.
      </p>

      <p>
        Like any single measure of work, the Flop count is imperfect (e.g., programs do non-floating-point computations,
        floating-point operations are not all the same). Fortunately, all the concepts we learn in these pedagogic
        modules are agnostic to the way in which we measure work. And so we just pick Flop counts to be consistent
        throughout.
      </p>

      <p>
        Say a program that performs 100 Tflop ("100 TeraFlop") is executed on a core with speed 35 Gflop/sec (“35
        GigaFlop per second”). The program’s execution time would then be:
      </p>

      <TeX
        math="\text{execution time} = \frac{100 \times 10^{12}\text{Flop}}{35 \times 10^{9}\text{Flop/sec}}\ \simeq 2,857.14\text{sec}"
        block />

      <p>
        If a program that performs 12 Gflop runs in 5 seconds on a core, then the speed of this core in Mflop/sec
        (“MegaFlop per second”) is:
      </p>

      <TeX
        math="\text{speed} = \frac{12 \times 10^{9}\text{Flop}}{5\text{sec}} \times \frac{1}{10^{6}}\ = 2,400\text{Mflop/sec} "
        block />

      <p>
        Make sure you know your units: K(ilo): <TeX math="10^3" /> - M(ega): <TeX math="10^6" /> - G(iga): <TeX
        math="10^9" /> -T(era): <TeX math="10^{12}" /> - P(eta): <TeX math="10^{15}" /> - E(exa): <TeX math="10^{18}" />
      </p>

      <Divider />

      <Header as="h3" block>
        Practice Questions
      </Header>

      <Accordion exclusive={false} panels={[
        {
          key: "A.1.p1.1",
          title: "[A.1.p1.1] You have to run a program that performs 4000 Gflop, and your core computes at speed 30 " +
            "Tflop/sec. How long will the program run for in seconds?",
          content: {
            content: (
              <Segment>
                <TeX math="\frac{4\text{Tflop}}{30\text{Tflop/sec}} \simeq 0.13\text{sec}" block />
              </Segment>
            )
          }
        },
        {
          key: "A.1.p1.2",
          title: "[A.1.p1.2] A program just ran in 0.32 sec on a core with speed 2 Tflop/sec, how many Gflop does the program perform?",
          content: {
            content: (
              <Segment>
                <TeX math="2000\text{Gflop/sec} \times 0.32\text{sec} = 640\text{Gflop}" block />
              </Segment>
            )
          }
        }
      ]
      } />

      <Divider />

      <Header as="h3" block>
        Questions
      </Header>

      <p>
        <strong>[A.1.q1.1]</strong> You have to run a program that performs 2000 Tflop, and your core computes at speed
        450 Gflop/sec. How long will the program run for in minutes?
      </p>

      <p>
        <strong>[A.1.q1.2]</strong> A program that performs 3000 Gflop just ran in 1.5 minutes on a core. What is the
        core speed in Tflop/sec?
      </p>

      <p>
        <strong>[A.1.q1.3]</strong> On a given core, a program just ran in 14 seconds. By what factor should the core
        speed be increased if you want the program to run in 10 seconds?
      </p>

      <Divider />

      <Header as="h3" block>
        Suggested Activities
      </Header>

      <p>
        <strong>[Benchmarking #1]:</strong> Find on-line resources that provide benchmark results for currently
        available cores. What is the fastest currently available core in terms of floating point benchmarked
        performance? Are there other kinds of benchmarks?
      </p>

      <p>
        <strong>[Benchmarking #2]:</strong> Determine the compute speed of a core of your computer by searching for,
        downloading, and running a freely available floating point benchmark program.
      </p>

      <p>
        <strong>[Programming]:</strong> Implements a program that performs a large, but known, number of floating point
        operations and use it to perform your own benchmarking of your machine. Implement this program in different
        languages and observe whether the Gflop/sec measurement varies across languages.
      </p>
    </>
  )
}

export default WorkAndSpeed
