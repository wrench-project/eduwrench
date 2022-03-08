import React, { useState } from 'react';
import Modal from './modal';

const GiveUp = () => {
  const [modalOpen, setModalOpen] = useState(false)
  const modalClose = () => {
    setModalOpen(!modalOpen)
  }

  return (
    <>
      <button class="ui primary button" onClick={modalClose}>
        Don't Konw
      </button>
      {modalOpen && <Modal modalClose={modalClose}></Modal>}
    </>
  )
}
export default GiveUp
