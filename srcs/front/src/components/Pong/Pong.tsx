import '../../styles/pong.css'

import React, { useEffect, useRef, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

import ballImageSrc from '../../assets/balle-pong.png'

/*Pour l'instant je suis un tuto pong qui se trouve ici: https://javascript.plainenglish.io/create-ping-pong-game-using-react-2d78c8e1cd9b
Je fais des tests pour me familiariser avec React et typescript
- Comment on va s'organiser pour le match making
- Estce que je dois decouper en plusieurs petit component le jeu de pong
	(exemple: 1 component pour le box, 1 component pour les raquettes)
Bwef voila ou j'en suis dans ma vie mdr c'est pas ouf
*/

const PADDLE_BOARD_SIZE = 3
const PADDLE_EDGE_SPACE = 1
const ROW_SIZE = 10
const COL_SIZE = 20
const board = [...Array(ROW_SIZE * COL_SIZE)]

const style = {
  width: '250px',
  heigth: '250px',
  display: 'grid',
  gridTemplate: `repeat(${ROW_SIZE}, 1fr) / repeat(${COL_SIZE}, 1fr)`,
}

const InitialState = () => {
  const board = [...Array(PADDLE_BOARD_SIZE)].map((_, pos) => pos)
  return {
    /* Paddle Array */
    player: board.map((x) => x * COL_SIZE + PADDLE_EDGE_SPACE),
    opponent: board.map((x) => (x + 1) * COL_SIZE - (PADDLE_EDGE_SPACE + 1)),
    /* ball */
    ball: Math.round((ROW_SIZE * COL_SIZE) / 2) + ROW_SIZE,
    ballSpeed: 100, // speed of ball
    deltaY: -COL_SIZE, // change ball in Y AXIS
    deltaX: -1, // change ball in  X AXIS
    /* pause */
    pause: true, // pause the game
    /* Score */
    playerScore: 0,
    opponentScore: 0,
  }
}

interface GameState {
  player: number[]
  opponent: number[]
  ball: number
  ballSpeed: number
  deltaY: number
  deltaX: number
  pause: boolean
  playerScore: number
  opponentScore: number
}

const Pong: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(InitialState())
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const ballImage = useRef<HTMLImageElement>(new Image())

  useEffect(() => {
    ballImage.current.src = ballImageSrc
    const canvas = canvasRef.current

    const context = canvas?.getContext('2d')
    if (!context || !canvas) return

    const updateCanvasSize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      // Autres ajustements basés sur la nouvelle taille
    }

    window.addEventListener('resize', updateCanvasSize)
    updateCanvasSize() // Mise à jour initiale

    const draw = () => {
      context.clearRect(0, 0, canvas.width, canvas.height)

      // Ajustements basés sur la taille du canvas
      const paddleWidth = canvas.width / 40 // Exemple de largeur de raquette
      const paddleHeight = canvas.height / 10 // Exemple de hauteur de raquette
      const ballRadius = canvas.width / 40 // Exemple de taille de la balle

      // Dessiner la raquette du joueur
      context.fillStyle = 'black'
      gameState.player.forEach((pos) => {
        context.fillRect(
          (pos % COL_SIZE) * (canvas.width / COL_SIZE),
          Math.floor(pos / COL_SIZE) * (canvas.height / ROW_SIZE),
          paddleWidth,
          paddleHeight,
        )
      })

      // Dessiner la raquette de l'opposant
      gameState.opponent.forEach((pos) => {
        context.fillRect(
          (pos % COL_SIZE) * (canvas.width / COL_SIZE),
          Math.floor(pos / COL_SIZE) * (canvas.height / ROW_SIZE),
          paddleWidth,
          paddleHeight,
        )
      })

      //Si on veut une balle normale
      /*context.beginPath();
		 context.arc(
			(gameState.ball % COL_SIZE) * (canvas.width / COL_SIZE),
			Math.floor(gameState.ball / COL_SIZE) * (canvas.height / ROW_SIZE),
			ballRadius,
			0,
			2 * Math.PI
		);
		context.fill(); */

      const ballX = (gameState.ball % COL_SIZE) * (canvas.width / COL_SIZE)
      const ballY = Math.floor(gameState.ball / COL_SIZE) * (canvas.height / ROW_SIZE)
      const ballSize = 50
      context.drawImage(ballImage.current, ballX, ballY, ballSize, ballSize)

      requestAnimationFrame(draw)
    }

    draw()

    return () => {
      window.removeEventListener('resize', updateCanvasSize)
    }
  }, [gameState])

  return (
    <div className='pong-container'>
      <canvas ref={canvasRef} className='pong-canvas'></canvas>
    </div>
  )
}

export { Pong }
