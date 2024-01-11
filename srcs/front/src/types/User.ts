export interface IUser {
  id: number
  email: string
  username: string
  image: string
  twoFaEnabled: boolean
  friends?: IFriends[]
  notifier?: INotify[]
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
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date
}

export type INotify = {
  sender: IUser
  received: IUser
  senderId: number
  receivedId: number
  createdAt: Date
}
