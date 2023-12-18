import '../../styles/startcomponent.css'

import React, { useEffect, useRef, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

import { ModalPong } from './ModalStartGame'

const StartComponent = () => {
  const [isModalVisible, setIsModalVisible] = useState(false)

  const showModal = () => {
    console.log('HEYYY')
    setIsModalVisible(true)
  }

  const hideModal = () => {
    setIsModalVisible(false)
  }

  return (
    <div className='container text-center'>
      <div className='row justify-content-evenly'>
        <div className='col'>
          <button type='button' className='btn btn-outline-primary' onClick={showModal}>
            START GAME
          </button>
        </div>
        <div className='col'>
          <button type='button' className='btn btn-outline-primary' onClick={showModal}>
            CUSTOM PLAY
          </button>
        </div>
      </div>
      {isModalVisible && <ModalPong closeModal={hideModal} />}
    </div>
  )
}

export { StartComponent }
