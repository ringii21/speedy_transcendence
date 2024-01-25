import { Exclude } from 'class-transformer'
import { Friends as FriendsPrisma } from '@prisma/client'

export class NotificationEntity implements FriendsPrisma {
  friendId: number
  friendOfId: number
  confirmed: boolean

  @Exclude()
  createdAt: Date
  @Exclude()
  updatedAt: Date
  @Exclude()
  deletedAt: Date | null
  constructor(partial: Partial<NotificationEntity>) {
    Object.assign(this, partial)
  }
}
