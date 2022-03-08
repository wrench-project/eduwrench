import React, { useState, useEffect } from "react"
import Modal from "./modal"
import axios from "axios"

const Hint = ({ question_key, hintText }) => {
  const [modalOpen, setModalOpen] = useState(false)

  const openModal = () => {
    setModalOpen(true)
  }
  const closeModal = () => {
    setModalOpen(false)
  }

  const hint22 = async () => {
    return (
      axios
        .post("http://localhost:3000/update/hint", {
          question_key: question_key,
        })
        .then(response => {
          console.log(hintText)
          return response
        })
        .catch(err => {
          console.error(err)
        })
    )
  }

  return (
    <>
      <button onClick={openModal}>Hint</button>
      <Modal open={modalOpen} close={closeModal}>
        {hint22()}
      </Modal>
    </>
  )
}

export default Hint
