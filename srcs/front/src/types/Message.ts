export type IChannelMessage = {
  content: string
  senderId: number
  channelId: number
}

export type IDbChannelMessage = {
  id: number
} & IChannelMessage
