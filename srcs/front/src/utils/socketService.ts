import { io, Socket } from 'socket.io-client'

import { IChannel } from '../types/Chat'
import { ChatSocketEvent, NotificationSocketEvent } from '../types/Events'
import { IChannelMessage } from '../types/Message'
import { INotification, IUser } from '../types/User'

const URL = process.env.REACT_APP_API_URL ?? 'http://localhost:3000'

export const chatSocket = io(URL + '/chat', {
  withCredentials: true,
  autoConnect: false,
})

export const gameSocket = io(URL + '/game', {
  withCredentials: true,
  autoConnect: false,
})

export const notificationSocket = io(URL + '/notification', {
  withCredentials: true,
  autoConnect: false,
})

// ********************************* Socket Channel ************************************ //

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

// ********************************* Socket Notification ************************************ //

export const receivedNotification = (socket: Socket) => (receiver: INotification, user: IUser) => {
  console.log('HEYYY')
  const socketMessage = {
    receiver: {
      state: receiver.state,
    },
    user,
  }
  console.log('socket message: ', socketMessage)
  socket.emit(NotificationSocketEvent.RECEIVED, socketMessage)
}

export const notificationAccepted = (socket: Socket) => (sender: INotification, user: IUser) => {
  const socketMessage = {
    sender: {
      senderId: sender.senderId,
    },
    user,
  }
  socket.emit(NotificationSocketEvent.ACCEPTED, socketMessage)
}

export const notificationDeclined = (socket: Socket) => (sender: INotification, user: IUser) => {
  const socketMessage = {
    sender: {
      senderId: sender.senderId,
    },
    user,
  }
  socket.emit(NotificationSocketEvent.DECLINED, socketMessage)
}
