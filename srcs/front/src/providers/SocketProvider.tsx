import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { Socket } from 'socket.io-client'

import { chatSocket as socket } from '../utils/socketService'

interface SocketContextData {
  socket: Socket | null
  isConnected: boolean
}

type Props = {
  children: ReactNode
}

export const SocketContext = createContext<SocketContextData>({
  socket: null,
  isConnected: false,
})

export const SocketProvider = ({ children }: Props) => {
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
  return <SocketContext.Provider value={values}>{children}</SocketContext.Provider>
}

export const useSocket = () => useContext(SocketContext)
