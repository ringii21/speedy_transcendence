import React, { useEffect, useRef, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

interface ModalPongProps {
  closeModal: () => void
}

const ModalPong: React.FC<ModalPongProps> = ({ closeModal }) => {
  const handleClose = () => {
    closeModal()
  }

  return (
    <div
      className='modal fade'
      id='gameModal'
      tabIndex={-1}
      aria-labelledby='gameModalLabel'
      aria-hidden='true'
    >
      <div className='modal-dialog'>
        <div className='modal-content'>
          <div className='modal-header'>
            <h5 className='modal-title' id='gameModalLabel'>
              Start Game
            </h5>
            <button
              type='button'
              className='btn-close'
              data-bs-dismiss='modal'
              aria-label='Close'
              onClick={handleClose}
            ></button>
          </div>
          <div className='modal-body'>Contenu de votre modal ici.</div>
          <div className='modal-footer'>
            <button
              type='button'
              className='btn btn-secondary'
              data-bs-dismiss='modal'
              onClick={handleClose}
            >
              Close
            </button>
            <button type='button' className='btn btn-primary'>
              Save changes
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export { ModalPong }
