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
}
