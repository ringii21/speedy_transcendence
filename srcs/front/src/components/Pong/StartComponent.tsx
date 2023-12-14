import '../../styles/startcomponent.css'

import React, { useEffect, useRef, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

const StartComponent = () => {
  return (
    <div className='container text-center'>
      <div className='row justify-content-evenly'>
        <div className='col'>
          <button type='button' className='btn btn-outline-primary'>
            START GAME
          </button>
        </div>
        <div className='col'>
          <button type='button' className='btn btn-outline-primary'>
            CUSTOM PLAY
          </button>
        </div>
      </div>
    </div>
  )
}

export { StartComponent }
