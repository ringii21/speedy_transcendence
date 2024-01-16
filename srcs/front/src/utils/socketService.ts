import { io } from 'socket.io-client'

const URL = process.env.REACT_APP_API_URL ?? 'http://localhost:3000'

export const chatSocket = io(URL + '/chat', {
  withCredentials: true,
  autoConnect: true,
  reconnection: true,
})

export const gameSocket = io(URL + '/game', {
  withCredentials: true,
  autoConnect: false,
})
