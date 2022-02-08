import React from 'react';
import './modal.css';

const Modal = ({modalClose}) => {
  return (
      <div className="modalContainer" onClick={modalClose}>
          <div className="modal">
              <button className="modalButton" onClick={modalClose}>Close</button>
          </div>
      </div>
  )
}

export default Modal