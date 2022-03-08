import React, { useState } from 'react';
import Modal from './modal';

const Hint = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const modalClose = () => {
    setModalOpen(!modalOpen)
  }

  return (
    <>
      <button onClick={modalClose}>Hint</button>
      { modalOpen && <Modal modalClose={modalClose}></Modal>}
    </>
  );
}

export default Hint;