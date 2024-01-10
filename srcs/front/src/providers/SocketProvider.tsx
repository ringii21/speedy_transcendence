import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { Socket } from 'socket.io-client'

import { chatSocket, gameSocket, notificationSocket } from '../utils/socketService'

interface SocketContextData {
  chatSocket: Socket
  gameSocket: Socket
  notificationSocket: Socket
  isChatConnected: boolean
  isGameConnected: boolean
  isNotificationConnected: boolean
}

type Props = {
  children: ReactNode
}

export const SocketContext = createContext<SocketContextData>({
  chatSocket,
  gameSocket,
  notificationSocket,
  isChatConnected: false,
  isGameConnected: false,
  isNotificationConnected: false,
})

export const SocketProvider = ({ children }: Props) => {
  const [isChatConnected, setIsChatConnected] = useState<boolean>(false)
  const [isGameConnected, setIsGameConnected] = useState<boolean>(false)
  const [isNotificationConnected, setIsNotificationConnected] = useState<boolean>(false)

  useEffect(() => {
    chatSocket.on('connect', () => setIsChatConnected(true))
    chatSocket.on('disconnect', () => setIsChatConnected(false))
    chatSocket.on('connect_error', console.error)

    gameSocket.on('connect', () => setIsGameConnected(true))
    gameSocket.on('disconnect', () => setIsGameConnected(false))
    gameSocket.on('connect_error', console.error)

    notificationSocket.on('connect', () => setIsNotificationConnected(true))
    notificationSocket.on('disconnect', () => setIsNotificationConnected(false))
    notificationSocket.on('connect_error', console.error)

    return () => {
      chatSocket.removeAllListeners()
      chatSocket.disconnect()

      gameSocket.removeAllListeners()
      gameSocket.disconnect()

      notificationSocket.removeAllListeners()
      notificationSocket.disconnect()
    }
  }, [])

  const values = {
    chatSocket,
    isChatConnected,
    gameSocket,
    isGameConnected,
    notificationSocket,
    isNotificationConnected,
  }
  return <SocketContext.Provider value={values}>{children}</SocketContext.Provider>
}

export const useSocket = () => useContext(SocketContext)
