import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { Socket } from 'socket.io-client'

import { ChatSocketEvent } from '../types/Events'
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

export const logSocketEvent = (event: string) => console.log(event + ' event emitted')

export const SocketProvider = ({ children }: Props) => {
  const [isConnected, setIsConnected] = useState<boolean>(false)
  useEffect(() => {
    socket.on('connect', () => {
      logSocketEvent('connect')
      socket.emit(ChatSocketEvent.SUBSCRIBE)
      logSocketEvent('subscribed')
      setIsConnected(true)
    })
    socket.on('disconnect', () => {
      logSocketEvent('disconnect')
      socket.emit(ChatSocketEvent.UNSUBSCRIBE)
      logSocketEvent('unsubscribed')
      setIsConnected(false)
    })
    socket.on('connect_error', (e: Error) => {
      logSocketEvent('connect_error')
      console.warn('Connection error', e)
    })

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
