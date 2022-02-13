import React, { useState } from "react"
import { Input, Button, Form } from "semantic-ui-react"

const Numeric = () => {
  let [text, setText] = useState("")
  let [correct, setCorrect] = useState("")
  let outputText

  const handleInput = (e, data) => {
    e.preventDefault()
    setText(data)
  }

  const handleClick = e => {
    e.preventDefault()
    if (text.value === "Hello") {
      setCorrect("Correct")
    } else {
      setCorrect("Incorrect")
    }
  }

  if (correct === "Correct") {
    outputText = <p>The answer is correct</p>
  } else if (correct === "Incorrect") {
    outputText = <p>The answer is incorrect</p>
  }

  return (
    <>
      <Form>
        <Input type="text" onChange={handleInput} placeholder="Input Answer" />
        <Button content="Submit" onClick={handleClick} />
      </Form>
      {outputText}
    </>
  )
}

export default Numeric
