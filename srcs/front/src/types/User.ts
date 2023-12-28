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
  image: string
  username: string
  email: string
  userId: number
  user: IUser
}

export type IFriendsOf = {
  id: number
  image: string
  username: string
  userId: number
  user: IUser
}
