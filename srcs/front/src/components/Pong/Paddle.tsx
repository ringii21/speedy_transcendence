import React, { useEffect, useRef, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

interface PaddleProps {
  position: {
    x: number
    y: number
  }
  isPlayer: boolean
}

const Paddle: React.FC<PaddleProps> = ({ position, isPlayer }) => {
  const paddleStyle: React.CSSProperties = {
    position: 'absolute',
    width: '2vw', // par exemple, 2% de la largeur de la vue
    height: '15vh', // par exemple, 15% de la hauteur de la vue
    backgroundColor: isPlayer ? 'blue' : 'red',
    left: `${position.x}vw`,
    top: `${position.y}vh`,
    transform: 'translate(-50%, -50%)',
    margin: '10px',
  }

  return <div style={paddleStyle}></div>
}

export { Paddle }
