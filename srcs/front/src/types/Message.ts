import { IUser } from './User'

export type IMessage = {
  author: Partial<IUser>
  content: string
  createdAt: Date
}
