import '../../styles/pong.css'

import React, { useEffect, useRef, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

import ballImageSrc from '../../assets/balle-pong.png'
import { Ball } from './Ball'
import { Grid } from './Grid'
import { Paddle } from './Paddle'

const Pong = () => {
  const gridHeightVh = 80 // Exemple : 80vh
  const paddleHeightVh = 15 // Exemple : 15vh
  const initialPlayerY = (gridHeightVh - paddleHeightVh) / 2
  const [playerPosition, setPlayerPosition] = useState({ x: 8, y: initialPlayerY }) // 5vw du bord gauche
  const [opponentPosition, setOpponentPosition] = useState({ x: 90, y: initialPlayerY }) // 95vw du bord droit
  const [ballPosition, setBallPosition] = useState({ x: 50, y: gridHeightVh / 2 })
  const maxY = gridHeightVh - paddleHeightVh

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowUp') {
        // Exemple : Déplacer la raquette vers le haut
        setPlayerPosition((prevPosition) => ({
          ...prevPosition,
          y: Math.max(prevPosition.y - 10, 18),
        }))
      } else if (event.key === 'ArrowDown') {
        // Exemple : Déplacer la raquette vers le bas
        setPlayerPosition((prevPosition) => ({
          ...prevPosition,
          y: Math.min(prevPosition.y + 10, maxY - 2.5), // 'maxY' dépend de la hauteur de votre terrain de jeu
        }))
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [maxY, paddleHeightVh])

  return (
    <div className='m-10 justify-center items-center'>
      <Grid />
      <Paddle position={playerPosition} isPlayer={true} />
      <Paddle position={opponentPosition} isPlayer={false} />
      <Ball position={ballPosition} />
      {/* Autres éléments du jeu si nécessaire */}
    </div>
  )
}
export { Pong }
