import React, { useEffect, useRef, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

const InitialState = () => {
  const PADDLE_BOARD_SIZE = 3
  const PADDLE_EDGE_SPACE = 1
  const ROW_SIZE = 10
  const COL_SIZE = 20
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

export { InitialState }
