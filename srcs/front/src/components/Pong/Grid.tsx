import React, { useEffect, useRef, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

import { InitialState } from './InitialState'

const ROW_SIZE = 10
const COL_SIZE = 20

const Grid = () => {
  const style = {
    width: '250px',
    heigth: '250px',
    display: 'grid',
    gridTemplate: `repeat(${ROW_SIZE}, 1fr) / repeat(${COL_SIZE}, 1fr)`,
  }
  return <div style={style}></div>
}

export { Grid }
