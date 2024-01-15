export interface IUser {
  id: number
  email: string
  username: string
  image: string
  twoFaEnabled: boolean
  friends?: IFriends[]
  notifier?: INotification[]
  expiresAt?: Date
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date
}

export type IFriends = {
  friend: IUser
  friendOf: IUser
  friendId: number
  friendOfId: number
  confirmed: boolean
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date
}

export type INotification = {
  sender: IUser
  received: IUser
  senderId: number
  receivedId: number
  state: boolean
  createdAt: Date
}
