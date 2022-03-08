import React, { useState } from 'react';
import Modal from './modal';

const GiveUp = () => {
  const [modalOpen, setModalOpen] = useState(false)
  const openModal = () => {
    setModalOpen(true)
  }
  const closeModal = () => {
    setModalOpen(false)
  }
  return (
    <>
      <button class="ui primary button" onClick={openModal}>Don't Know</button>
      <Modal open={modalOpen} close={closeModal}>
        answer..?
      </Modal>
    </>
  )
}

export default GiveUp