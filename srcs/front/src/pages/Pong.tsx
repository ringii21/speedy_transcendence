import React, { useState } from 'react'
import { BrowserView, isDesktop, isMobile, MobileView, TabletView } from 'react-device-detect'
import { Navigate } from 'react-router-dom'

import PongComponent from '../components/Pong'
import { Play } from '../components/Pong/Play'
import { Pong } from '../components/Pong/Pong'
import { StartComponent } from '../components/Pong/StartComponent'
import { WithNavbar } from '../hoc/WithNavbar'
import { useAuth } from '../providers/AuthProvider'
import { useGameSocket } from '../providers/GameSocketProvider'

const Game = () => {
  console.log('BONJOURRR')
  const { user } = useAuth()

  if (!user) return <Navigate to='/login' replace />
  const { socket, isConnected } = useGameSocket()
  if (!isConnected) socket?.connect()

  /* if (socket?.connected) {
    console.log('OK')
  } else {
    console.log('NOO')
  } */

  return (
    <div>
      <Play />
    </div>
  )
}

const PongWithNavbar = WithNavbar(Game)
export { PongWithNavbar }
