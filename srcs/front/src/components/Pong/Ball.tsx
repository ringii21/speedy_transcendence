import React, { useEffect, useRef, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

interface BallProps {
  position: {
    x: number
    y: number
  }
}

const Ball: React.FC<BallProps> = ({ position }) => {
  const ballStyle: React.CSSProperties = {
    position: 'absolute',
    width: '2vw', // Taille de la balle en fonction de la largeur de la vue
    height: '2vw', // Gardez la balle circulaire
    borderRadius: '50%',
    backgroundColor: 'yellow',
    left: `${position.x}vw`,
    top: `${position.y}vh`,
    transform: 'translate(-50%, -50%)',
  }

  return <div style={ballStyle}></div>
}
export { Ball }
