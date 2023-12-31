import React, { createContext, useContext, useEffect, useState } from 'react'
import { Socket } from 'socket.io-client'

import { gameSocket as socket } from '../utils/socketService'

interface GameSocketContextData {
  socket: Socket | null
  isConnected: boolean
}

type Props = {
  children: React.ReactNode
}

export const GameSocketContext = createContext<GameSocketContextData>({
  socket: null,
  isConnected: false,
})

export const GameSocketProvider = ({ children }: Props) => {
  const [isConnected, setIsConnected] = useState<boolean>(false)

  useEffect(() => {
    socket.on('connect', () => setIsConnected(true))
    socket.on('disconnect', () => setIsConnected(false))
    socket.on('connect_error', console.error)

    return () => {
      socket.removeAllListeners()
      socket.disconnect()
    }
  }, [])

  const values = { socket, isConnected }
  return <GameSocketContext.Provider value={values}>{children}</GameSocketContext.Provider>
}

export const useGameSocket = () => useContext(GameSocketContext)
