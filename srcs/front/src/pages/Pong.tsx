import React, { useState } from 'react'
import { BrowserView, isDesktop, isMobile, MobileView, TabletView } from 'react-device-detect'
import { Navigate } from 'react-router-dom'

import { Play } from '../components/Pong/Play'
import { WithNavbar } from '../hoc/WithNavbar'
import { useAuth } from '../providers/AuthProvider'
import { useGameSocket } from '../providers/GameSocketProvider'

const Game = () => {
  const { user } = useAuth()

  if (!user) return <Navigate to='/login' replace />
  const { socket, isConnected } = useGameSocket()
  if (!isConnected) socket?.connect()

  return (
    <div>
      <Play />
    </div>
  )
}

const PlayWithNavbar = WithNavbar(Game)
export { PlayWithNavbar }
