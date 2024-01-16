import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { Socket } from 'socket.io-client'

import { chatSocket as socket } from '../utils/socketService'

interface SocketContextData {
  socket: Socket
  isConnected: boolean
}

type Props = {
  children: ReactNode
}

export const SocketContext = createContext<SocketContextData>({
  socket,
  isConnected: false,
})

export const SocketProvider = ({ children }: Props) => {
  const [isConnected, setIsConnected] = useState<boolean>(false)
  useEffect(() => {
    socket.on('connect', () => {
      console.log('connected')
      setIsConnected(true)
    })
    socket.on('disconnect', () => {
      console.log('disconnected')
      setIsConnected(false)
    })
    socket.on('connect_error', console.error)

    return () => {
      socket.off('connect')
      socket.off('disconnect')
      socket.off('connect_error')
    }
  }, [])

  const values = { socket, isConnected }
  return <SocketContext.Provider value={values}>{children}</SocketContext.Provider>
}

export const useSocket = () => useContext(SocketContext)
