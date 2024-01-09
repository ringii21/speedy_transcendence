import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { Socket } from 'socket.io-client'

import { chatSocket as socket, friendsSocket as friends } from '../utils/socketService'

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
  const [friendsRequest, setFriendsRequest] = useState<string[]>([])
  useEffect(() => {
    socket.on('connect', () => setIsConnected(true))
    friends.on('connect', () => setIsConnected(true))
    socket.on('disconnect', () => setIsConnected(false))
    friends.on('disconnect', () => setIsConnected(false))

    friends.on('friends_request', (request) => {
      setFriendsRequest((prevRequest) => [...prevRequest, request])
    })

    socket.on('connect_error', console.error)
    friends.on('connect_error', console.error)

    return () => {
      socket.removeAllListeners()
      friends.removeAllListeners()
      socket.disconnect()
      friends.disconnect()
    }
  }, [])

  const values = { socket, friends, isConnected, friendsRequest }
  return <SocketContext.Provider value={values}>{children}</SocketContext.Provider>
}

export const useSocket = () => useContext(SocketContext)
