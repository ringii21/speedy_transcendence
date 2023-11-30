import { io, Socket } from 'socket.io-client'

import { IChannel } from '../types/Chat'
import { ChatSocketEvent } from '../types/Events'
import { IChannelMessage } from '../types/Message'
import { IUser } from '../types/User'

const URL = process.env.REACT_APP_API_URL ?? 'http://localhost:3000'

export const chatSocket = io(URL + '/chat', {
  withCredentials: true,
  autoConnect: false,
})

export const gameSocket = io(URL + '/game', {
  withCredentials: true,
  autoConnect: false,
})

export const joinChannel = (socket: Socket) => (channel: IChannel, user: IUser) => {
  const socketMessage = {
    channel: {
      id: channel.id,
    },
    user,
  }
  socket.emit(ChatSocketEvent.JOIN_CHANNEL, socketMessage)
}

export const leaveChannel = (socket: Socket) => (channel: IChannel, user: IUser) => {
  const socketMessage = {
    channel: {
      id: channel.id,
    },
    user,
  }
  socket.emit(ChatSocketEvent.LEAVE_CHANNEL, socketMessage)
}
export const sendMessage = (socket: Socket) => (message: IChannelMessage) => {
  socket.emit(ChatSocketEvent.MESSAGE, message)
}

export const sendPrivateMessage = (socket: Socket) => (message: IChannelMessage) => {
  socket.emit(ChatSocketEvent.SENT_PRIVATE_MESSAGE, message)
}
