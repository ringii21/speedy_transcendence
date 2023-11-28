export interface IUser {
  id: string
  email: string
  username: string
  image: string
  twoFaEnabled: boolean
  expiresAt?: Date
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date
}
