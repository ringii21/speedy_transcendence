import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { Socket } from 'socket.io-client'

import { ChatSocketEvent } from '../types/Events'
import { chatSocket, gameSocket } from '../utils/socketService'

interface SocketContextData {
  chatSocket: Socket
  gameSocket: Socket
  isChatConnected: boolean
  isGameConnected: boolean
}

type Props = {
  children: ReactNode
}

export const SocketContext = createContext<SocketContextData>({
  chatSocket,
  gameSocket,
  isChatConnected: false,
  isGameConnected: false,
})

export const logSocketEvent = (socket: Socket, event: string) =>
  console.log(socket.io['uri'], event + ' event emitted')

export const SocketProvider = ({ children }: Props) => {
  const [isChatConnected, setChatIsConnected] = useState<boolean>(false)
  const [isGameConnected, setGameIsConnected] = useState<boolean>(false)

  useEffect(() => {
    chatSocket.on('connect', () => {
      logSocketEvent(chatSocket, 'connect')
      chatSocket.emit(ChatSocketEvent.SUBSCRIBE)
      logSocketEvent(chatSocket, 'subscribed')
      setChatIsConnected(true)
    })

    chatSocket.on('disconnect', () => {
      logSocketEvent(chatSocket, 'disconnect')
      chatSocket.emit(ChatSocketEvent.UNSUBSCRIBE)
      logSocketEvent(chatSocket, 'unsubscribed')
      setChatIsConnected(false)
    })

    chatSocket.on('connect_error', (e: Error) => {
      logSocketEvent(chatSocket, 'connect_error')
      console.warn('Connection error', e)
    })

    gameSocket.on('connect', () => {
      logSocketEvent(gameSocket, 'connect')
      setGameIsConnected(true)
    })

    gameSocket.on('disconnect', () => {
      logSocketEvent(gameSocket, 'disconnect')
      setGameIsConnected(false)
    })

    gameSocket.on('connect_error', (e: Error) => {
      logSocketEvent(gameSocket, 'connect_error')
      console.warn('Connection error', e)
    })

    return () => {
      chatSocket.removeAllListeners()
      chatSocket.disconnect()
      gameSocket.removeAllListeners()
      gameSocket.disconnect()
    }
  }, [])

  const values = { chatSocket, isChatConnected, isGameConnected, gameSocket }
  return <SocketContext.Provider value={values}>{children}</SocketContext.Provider>
}

export const useSocket = () => useContext(SocketContext)
