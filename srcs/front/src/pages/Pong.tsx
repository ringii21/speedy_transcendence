import React, { useState } from 'react'
import { BrowserView, isDesktop, isMobile, MobileView, TabletView } from 'react-device-detect'
import { Navigate } from 'react-router-dom'

import { Play } from '../components/Pong/Play'
import { WithNavbar } from '../hoc/WithNavbar'
import { useAuth } from '../providers/AuthProvider'
import { useSocket } from '../providers/SocketProvider'

const Game = () => {
  const { user } = useAuth()

  if (!user) return <Navigate to='/login' replace />
  const { gameSocket, isGameConnected } = useSocket()

  if (!isGameConnected) {
    gameSocket?.connect()
  }
  return (
    <div>
      <Play />
    </div>
  )
}

const PlayWithNavbar = WithNavbar(Game)
export { PlayWithNavbar }
