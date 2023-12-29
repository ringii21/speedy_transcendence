export type IChannelMessage = {
  content: string
  senderId: number
  channelId: string
}

export type IDbChannelMessage = {
  id: number
} & IChannelMessage
