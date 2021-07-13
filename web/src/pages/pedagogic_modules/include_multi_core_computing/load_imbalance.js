import React from "react"
import TeX from "@matejmazur/react-katex"
import LearningObjectives from "../../../components/learning_objectives"

import Utilization from "../../../images/svgs/utilization.svg"

const equation1 = `
$
\\frac{2 \\times w}{1000} = 30
$
`

const LoadImbalance = () => {
  return (
    <>
      <LearningObjectives objectives={[
        "Understand the concept of load imbalance and how it causes idle time",
        "Understand and quantify the relationship between idle time, speedup, and efficiency"
      ]} />

      <h2>Load Imbalance and Idle Time</h2>

      <p>
        One reason why a parallel program’s parallel efficiency can be less than 100% is <strong>idle time</strong>:
        time during which one or more cores are not able to work while other cores are working. A common cause of idle
        time is <strong>load imbalance</strong>.
      </p>

      <p>
        Consider a parallel program that consists of <TeX math="n" /> tasks, each of them running in the same amount of
        time on a core. We run this program on a computer with <TeX math="p" /> cores. If <TeX math="n" /> is not
        divisible by <TeX math="p" />, then at least one core will be idle during program execution. For example, if we
        have 8 tasks, that each run for 1 hour; and 5 cores, all cores will be busy running the first 5 tasks in
        parallel. But once this phase of execution is finished, we have 3 tasks left and 5 available cores.
        So 2 cores will have nothing to do for 1 hour. In this situation, we say that <strong>the load is not
        well-balanced across cores</strong>. Some cores will run two tasks, while others will run only one task.
      </p>

      <p>
        There is a <strong>direct relationship</strong> between idle time and parallel efficiency, assuming idle time is
        the only cause of loss in parallel efficiency. <strong> The parallel efficiency is the sum of the core non-idle
        times divided by the product of the number of cores by the overall execution time.</strong>
      </p>

      <p>
        The above statement may sound complicated, but it is very intuitive on an example. Consider a 2-core computer
        that executes a multi-task program in 35 minutes. One core computes for the full 35 minutes, while the other
        core computes for 20 minutes and then sits idle for 15 minutes. This execution is depicted in the figure below:
      </p>

      <Utilization />
      <div className="caption"><strong>Figure 1:</strong> Example 35-minute execution on a 2-core computer. The white
        area is the core idle time, the yellow area is the core compute time.
      </div>

      <p>
        What the above statement says is that the parallel efficiency is the yellow area divided by the area of the
        whole rectangle. The white area is the number of <i>idle core minutes</i> in the execution. In this case it is
        equal to <TeX math="1 \times 15" /> minutes. <i>The more white in the figure, the lower the parallel
        efficiency.</i> In this example, the parallel efficiency is <TeX
        math="(1 \times 35 + 1 \times 20)/(2 \times 35) = 78.5\%" />. You can note that this is exactly the speedup
        (55/35) divided by the number of cores (2).
      </p>

    </>
  )
}

export default LoadImbalance
