import React, { useState } from "react"
import MathJax from "react-mathjax2"
import MathJaxOrig from "react-mathjax"
import Card from "react-bootstrap/Card"
import Accordion from "react-bootstrap/Accordion"
import Markdown from '../../../Components/Markdown';
import "katex/dist/katex.min.css"
//import { InlineMath, BlockMath } from "react-katex"
import TeX from '@matejmazur/react-katex';


const equation1 = `
$$
\\text{Speedup}(p) = \\frac{\\text{Execution Time with 1 core}}{\\text{Execution Time with p cores}}
$$
`;

const equation2 = `
$$
\\text{Speedup}(2) = \\frac{3}{2} = 1.5
$$
`;

const TaskParallelism = () => {
  return (
    <>
      <Card className="main">
        <Card.Body className="card">
          <div className="banner-div">
            <h6 className="banner-header">
              <a id="learningobjectives">Learning Objectives</a>
            </h6>
          </div>
          <br />
          <div className="highlighted">
            <ul style={{ marginTop: 10 }} className="highlighted">
              <li className="highlighted">
                Understand the need for and the basics of multi-core computers
              </li>
              <li className="highlighted">
                Undertand the notion of program consisting of independent tasks
              </li>
              <li className="highlighted">
                Understand and apply the concepts of parallel speedup and
                efficiency
              </li>
            </ul>
          </div>
          <hr />
          <br />
          <h5 className="header-small">Basic Concept</h5>
          <p style={{ display: "inline-block" }} className="card">
            A multi-core processor provides multiple processing units, or cores,
            that are capable of executing computer code independently of each
            other. Multi-core processors have become ubiquitous. This is because
            starting in the early 2000’s it became increasingly difficult, and
            eventually impossible, to increase the clock rate of processors. The
            reasons are well-documented power/heat issues (see the 2007 classic{" "}
            <a
              style={{ display: "inline-block" }}
              className="link"
              href="http://www.gotw.ca/publications/concurrency-ddj.htm"
              target="_blank"
              rel="noreferrer"
            >
              The Free Lunch Is Over
            </a>{" "}
            article). As a solution to this problem, microprocessor
            manufacturers started producing multi-core processors.
          </p>
          <p style={{ display: "inline-block" }} className="card">
            For a program to exploit the compute power of a multi-core
            processor, it must create{" "}
            <b style={{ display: "inline-block" }} className="card">
              tasks
            </b>{" "}
            that can run at the same time on different cores. This is called{" "}
            <b style={{ display: "inline-block" }} className="card">
              parallelism
            </b>{" "}
            and we call this kind of programs{" "}
            <b style={{ display: "inline-block" }} className="card">
              parallel programs
            </b>
            . There are a few ways in which a program can implement this notion
            of tasks, such as having tasks be different processes or different
            threads. See Operating Systems{" "}
            <a className="link" href="/textbooks/">
              textbooks
            </a>{" "}
            for details on processes and threads, and how they communicate
            and/or share memory. In these pedagogic modules we will mostly refer
            to tasks, without needing to specify the underlying implementation
            details.
          </p>
          <p className="card">
            Each task in a parallel program performs some computation on some
            input data, which can be in RAM or on disk, and which produces some
            output data. For instance, we could have a 5-task program where each
            task renders a different frame of a movie. Or we could have a
            program in which tasks do different things altogether. For instance,
            a 2-task program could have one task apply some analysis to a
            dataset and another task render a live visualization of that
            dataset.
          </p>
          <p style={{ display: "inline-block" }} className="card">
            As mentioned in the{" "}
            <a
              style={{ display: "inline-block" }}
              className="link"
              href="/pedagogic_modules/single_core_computing"
            >
              Single Core Computing
            </a>{" "}
            module, we do not consider time sharing. That is,{" "}
            <b style={{ display: "inline-block" }} className="card">
              we will only consider executions in
            </b>{" "}
            <b style={{ display: "inline-block" }} className="card">
              which at most one task runs on a core at a given time
            </b>
            . Operating systems do allow time-sharing (as explained in the{" "}
            <a
              style={{ display: "inline-block" }}
              className="link"
              href="/pedagogic_modules/single_core_computing"
            >
              Time Sharing tab of the Single Core Computing module
            </a>
            ). But time sharing incurs performance penalties. The typical
            approach when aiming for high performance is to avoid time sharing
            altogether. Therefore, in all that follows, a task that begins
            executing on a core executes uninterrupted and by itself on that
            same core until completion.
          </p>
          <hr />
          <br />
          <h5 className="header-small">Speedup and Efficiency</h5>
          <p style={{ display: "inline-block" }} className="card">
            A common motivation for running the tasks of a program on multiple
            cores is speed. For example, if you have tasks that a single core
            can complete in one hour, it will take four hours to complete four
            tasks. If you have two cores in a computer, now you can complete the
            same four tasks in less time, ideally in two hours.{" "}
            <b style={{ display: "inline-block" }} className="card">
              With parallelism we can decrease program execution time
            </b>
            . Note that another common term for “execution time” is{" "}
            <i style={{ display: "inline-block" }} className="card">
              makespan
            </i>
            .
          </p>
          <p style={{ display: "inline-block" }} className="card">
            Unfortunately, most real-world programs do not have ideal
            parallelism behavior. In other words, they do not run{" "}
            <i className="var">p</i> times faster when executed on{" "}
            <i className="var">p</i> cores. Instead, they execute less than{" "}
            <i className="var">p</i> times faster. This may seem surprising, but
            comes about due to many reasons. One of these reasons is that
            program tasks running on different cores still compete for shared
            hardware and/or software resources. Each time tasks compete for such
            resources, i.e., one task has to wait for the other task being done
            using that resource, there is a loss in parallel efficiency. These
            resources can include the network card, the disk, the network, the
            operating system’s kernel data structures. One hardware resource for
            which program tasks that run on different cores almost always
            compete is the memory hierarchy, e.g., the L3 cache and the memory
            bus (we refer you to Computer Architecture{" "}
            <a className="link" href="/textbooks/">
              textbooks
            </a>{" "}
            for details on the memory hierarchy). The memory hierarchy is thus a
            notorious culprit for loss of parallel efficiency loss.
          </p>
          <p style={{ display: "inline-block" }} className="card">
            In this module, we make the simplifying assumptions that program
            tasks running on different cores do not compete for any of the above
            resources.{" "}
            <i style={{ display: "inline-block" }} className="card">
              And yet, there are other reasons why a program cannot achieve
              ideal parallelism!
            </i>{" "}
            Before we get to these reasons, let us first define two crucial
            metrics:{" "}
            <i style={{ display: "inline-block" }} className="card">
              Parallel Speedup and Parallel Efficiency.
            </i>{" "}
          </p>
          <br />
          <h5 className="header-small">Parallel Speedup</h5>
          <p style={{ display: "inline-block" }} className="card">
            Parallel speedup, or just{" "}
            <i style={{ display: "inline-block" }} className="card">
              speedup
            </i>
            , is a metric used to quantify the reduction in execution time of a
            parallel program due to the use of multiple cores. It is calculated
            by dividing the execution time of the program when executed on a
            single core by the execution time of this same program when executed
            on multiple cores. Let <i className="var">p</i> be the number of
            cores used to execute a program. The speedup on{" "}
            <i className="var">p</i> cores is:
          </p>

          <div>
          <Markdown className="equation">{equation1}</Markdown>
          </div>
          
          <p style={{ display: "inline-block" }} className="card">
            For instance, if a program runs in 3 hours on 1 core but runs in 2
            hours on 2 cores, then its speedup is:
          </p>

          <div>
          <Markdown className="equation">{equation2}</Markdown>
          </div>

          <p style={{ display: "inline-block" }} className="card">
            In this example, we would be somewhat “unhappy” because although we
            have 2 cores, we only go 1.5 times faster. We would likely be hoping
            to go twice as fast. Let’s quantify this “disappointment” formally
            using another metric!
          </p>
          <br />
          <h5 className="header-small">Parallel Efficiency</h5>
          <p style={{ display: "inline-block" }} className="card">
            Parallel efficiency, or just{" "}
            <b style={{ display: "inline-block" }} className="card">
              efficiency
            </b>
            , is a metric that captures how much useful work the cores can do
            for a program, or how much “bang” do you get for your “buck”. The
            “bang” is the speedup, and the “buck” is the number of cores.
          </p>
          <p style={{ display: "inline-block" }} className="card">
            More formally, the efficiency of an execution on p cores is:
          </p>
          <img
            className="formula"
            src="https://quicklatex.com/cache3/a7/ql_ce8bddf25243559c1852c3137b547ea7_l3.png"
            alt="new"
          />
          <p style={{ display: "inline-block" }} className="card">
            If the speedup on 2 cores is 1.5, then the efficiency on 2 cores is:
          </p>

          <img
            className="formula"
            style={{ width: "30%" }}
            src="https://i.ibb.co/f41KBLp/Screen-Shot-2021-04-07-at-3-37-28-PM.png"
            alt="new"
            border="0"
          />

          <p style={{ display: "inline-block" }} className="card">
            Ideally, the efficiency would be 100%, which corresponds to going{" "}
            <i className="var">p</i> times faster with <i className="var">p</i>{" "}
            cores. In the above example, it is only 75%. This means that we are
            “wasting” some of the available compute capacity of our computer
            during the program’s execution. We have 2 cores, but our performance
            is as if we had only 1.5 cores. In other terms, we are wasting half
            the compute power of a core. In the next tab we explore one of the
            reasons why such waste occurs.
          </p>
          <div className="banner-div">
            <h6 className="banner-header">
              <a id="practicequestions">Practice Questions</a>
            </h6>
          </div>
          <br />
          <p style={{ display: "inline-block" }} className="card">
            <b style={{ display: "inline-block" }} className="card">
              [A.2.p1.1]
            </b>{" "}
            Consider a parallel program that runs in 1 hour on a single core of
            a computer. The program’s execution on 6 cores has 80% parallel
            efficiency. What is the program’s execution time when running on 6
            cores? Show your work.
          </p>
          <Accordion>
            <Card>
              <Accordion.Toggle as={Card.Header} eventKey="0">
                <b>(CLICK TO SEE ANSWER)</b>
              </Accordion.Toggle>
              <Accordion.Collapse eventKey="0">
                <Card.Body style={{ backgroundColor: "white" }}>
                  Let <i className="var">S</i> be the speedup on 6 cores for
                  this program. Since the efficiency is equal to{" "}
                  <span className="var">
                    <i className="var">S</i>/6
                  </span>
                  , we have{" "}
                  <span className="var">
                    <i className="var">S</i>/6 = 0.8
                  </span>
                  , which gives us{" "}
                  <span className="var">
                    <i className="var">S</i> = 4.8
                  </span>
                  . Therefore, the program runs in{" "}
                  <span className="var">60/4.8 = 4.8</span> minutes.
                </Card.Body>
              </Accordion.Collapse>
            </Card>
          </Accordion>
          <br />
          <p style={{ display: "inline-block" }} className="card">
            <b style={{ display: "inline-block" }} className="card">
              [A.2.p1.2]
            </b>{" "}
            A parallel program has a speedup of 1.6 when running on 2 cores, and
            runs 10 minutes faster when running on 3 cores than when running on
            2 cores. Give a formula for T(1) (the execution time on one core in
            minutes) as a function of T(3) (the execution time on 3 cores in
            minutes).
          </p>
          <Accordion>
            <Card>
              <Accordion.Toggle as={Card.Header} eventKey="0">
                <b>(CLICK TO SEE ANSWER)</b>
              </Accordion.Toggle>
              <Accordion.Collapse eventKey="0">
                <Card.Body style={{ backgroundColor: "white" }}>
                  <p style={{ display: "inline-block" }} className="card">
                    Because the speedup on 2 cores is 1.6, we have:{" "}
                    <img
                      className="formula-inline"
                      src="https://quicklatex.com/cache3/2e/ql_e642dedfa3dfccfb7885006e983f7e2e_l3.png"
                    ></img>
                  </p>
                  <br />
                  <p style={{ display: "inline-block" }} className="card">
                    And the 10-minute time reduction gives us:{" "}
                    <img
                      className="formula-inline"
                      src="https://quicklatex.com/cache3/33/ql_c7fc238c681645c572953d1c45c2d833_l3.png"
                    ></img>
                  </p>
                  <p className="card">Therefore,</p>
                  <img
                    className="formula-newline"
                    src="https://quicklatex.com/cache3/53/ql_796045a83f7b67cc99f2d8658fe21253_l3.png"
                  ></img>
                  <br />
                  <p className="card">which we can rewrite as:</p>
                  <img
                    className="formula-newline"
                    src="https://quicklatex.com/cache3/1f/ql_e54f387dd7b20771bdc98f35c0961f1f_l3.png"
                  ></img>
                </Card.Body>
              </Accordion.Collapse>
            </Card>
          </Accordion>
          <hr />
          <div className="banner-div">
            <h6 className="banner-header">
              <a id="questions">Questions</a>
            </h6>
          </div>
          <br />
          <p style={{ display: "inline-block" }} className="card">
            <b style={{ display: "inline-block" }} className="card">
              [A.2.q1.1]
            </b>{" "}
            You are told that a parallel program runs in 1 hour on a 3-core
            machine, and that the parallel efficiency is 90%. How long, in
            minutes, would the program take if executed using a single core?
            Show your work.
          </p>
          <p style={{ display: "inline-block" }} className="card">
            <b style={{ display: "inline-block" }} className="card">
              [A.2.q1.2]
            </b>{" "}
            You are told that a parallel program runs in 10 hours when using the
            4 cores of some computer with parallel efficiency 80%. Using 8
            cores, the program runs in 6 hours. What is the parallel efficiency
            of this 8-core execution? Show your work and reasoning.
          </p>
        </Card.Body>
      </Card>
    </>
  )
}

export default TaskParallelism
