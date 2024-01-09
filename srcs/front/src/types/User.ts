export interface IUser {
  id: number
  email: string
  username: string
  image: string
  twoFaEnabled: boolean
  expiresAt?: Date
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date
  friends: IFriends[]
  friendsOf: IFriendsOf[]
}

export type IFriends = {
  id: number
  userId: number
  expiresAt?: Date
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date
  user: IUser
}

export type IFriendsOf = {
  id: number
  userId: number
  expiresAt?: Date
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date
  user: IUser
  friendId: IFriends
}
