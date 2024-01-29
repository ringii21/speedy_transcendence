import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { Socket } from 'socket.io-client'

import { ChatSocketEvent } from '../types/Events'
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

export const logSocketEvent = (event: string) => console.log(event + ' event emitted')

export const SocketProvider = ({ children }: Props) => {
  const [isChatConnected, setChatIsConnected] = useState<boolean>(false)
  const [isGameConnected, setGameIsConnected] = useState<boolean>(false)
  const [isNotificationConnected, setisNotificationConnected] = useState<boolean>(false)

  useEffect(() => {
    chatSocket.on('connect', () => {
      logSocketEvent('connect')
      chatSocket.emit(ChatSocketEvent.SUBSCRIBE)
      logSocketEvent('subscribed')
      setChatIsConnected(true)
    })
    chatSocket.on('disconnect', () => {
      logSocketEvent('disconnect')
      chatSocket.emit(ChatSocketEvent.UNSUBSCRIBE)
      logSocketEvent('unsubscribed')
      setChatIsConnected(false)
    })
    chatSocket.on('connect_error', (e: Error) => {
      logSocketEvent('connect_error')
      console.warn('Connection error', e)
    })

    gameSocket.on('connect', () => {
      logSocketEvent('connect')
      setGameIsConnected(true)
    })
    gameSocket.on('disconnect', () => {
      logSocketEvent('disconnect')
      setGameIsConnected(false)
    })
    gameSocket.on('connect_error', (e: Error) => {
      logSocketEvent('connect_error')
      console.warn('Connection error', e)
    })

    notificationSocket.on('connect', () => {
      logSocketEvent('connect')
      console.log('NotificationSocket connect')
      setisNotificationConnected(true)
    })
    notificationSocket.on('disconnect', () => {
      logSocketEvent('disconnect')
      console.log('NotificationSocket disconnect')
      setisNotificationConnected(false)
    })
    notificationSocket.on('connect_error', (e: Error) => {
      logSocketEvent('connect_error')
      console.warn('Connection error', e)
    })

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
    isGameConnected,
    gameSocket,
    isNotificationConnected,
    notificationSocket,
  }
  return <SocketContext.Provider value={values}>{children}</SocketContext.Provider>
}

export const useSocket = () => useContext(SocketContext)
