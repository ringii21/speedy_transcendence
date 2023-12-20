import '../../styles/pong.css'

import React, { useEffect, useRef, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

import ballImageSrc from '../../assets/balle-pong.png'
import { Ball } from './Ball'
import { Grid } from './Grid'
import { Paddle } from './Paddle'

const Pong = () => {
  const gridHeightVh = 80 // Exemple : 80vh
  const gridWidthVw = 80
  const paddleHeightVh = 15 // Exemple : 15vh
  const initialPlayerY = (gridHeightVh - paddleHeightVh) / 2

  const [playerPosition, setPlayerPosition] = useState({ x: 7, y: initialPlayerY }) // 5vw du bord gauche
  const [opponentPosition, setOpponentPosition] = useState({
    x: gridWidthVw + 10,
    y: initialPlayerY,
  }) // 95vw du bord droit
  const [ballPosition, setBallPosition] = useState({ x: 50, y: gridHeightVh / 2 })
  const maxY = gridHeightVh - paddleHeightVh

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowUp') {
        // Exemple : Déplacer la raquette vers le haut
        setPlayerPosition((prevPosition) => ({
          ...prevPosition,
          y: Math.max(prevPosition.y - 2, 18.5),
        }))
      } else if (event.key === 'ArrowDown') {
        // Exemple : Déplacer la raquette vers le bas
        setPlayerPosition((prevPosition) => ({
          ...prevPosition,
          y: Math.min(prevPosition.y + 2, maxY - 1.5), // 'maxY' dépend de la hauteur de votre terrain de jeu
        }))
      }
    }
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [maxY, paddleHeightVh])

  const ballSpeed = 1 // Vitesse de la balle
  const [ballDirection, setBallDirection] = useState(1) // 1 pour le bas, -1 pour le haut

  useEffect(() => {
    const moveBall = () => {
      setBallPosition((prevPosition) => {
        const newX = prevPosition.x + ballSpeed * ballDirection

        // Inverser la direction si la balle atteint les côtés gauche ou droit du Grid
        if (newX <= 10 || newX >= gridWidthVw + 10) {
          setBallDirection(-ballDirection)
        }

        return { ...prevPosition, x: newX }
      })
    }

    const intervalId = setInterval(moveBall, 10) // Ajustez selon la fluidité souhaitée

    return () => {
      clearInterval(intervalId)
    }
  }, [ballDirection, gridWidthVw])
  return (
    <div className='mt-10'>
      <Grid />
      <Paddle position={playerPosition} isPlayer={true} />
      <Paddle position={opponentPosition} isPlayer={false} />
      <Ball position={ballPosition} />
      {/* Autres éléments du jeu si nécessaire */}
    </div>
  )
}
export { Pong }
