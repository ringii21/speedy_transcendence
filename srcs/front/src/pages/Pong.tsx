import React, { useState } from 'react'
import { BrowserView, isDesktop, isMobile, MobileView, TabletView } from 'react-device-detect'
import { Navigate } from 'react-router-dom'

//import { ChatConv, ChatSelection, ChatUsers } from '../components/Pong'
import { WithNavbar } from '../hoc/WithNavbar'
import { useAuth } from '../providers/AuthProvider'
import { useSocket } from '../providers/SocketProvider'

const Pong = () => {
  const { user } = useAuth()

  if (!user) return <Navigate to='/login' replace />
  const { socket, isConnected } = useSocket()
  if (!isConnected) socket?.connect()

  return <div></div>
}

const PongWithNavbar = WithNavbar(Pong)
export { PongWithNavbar }
