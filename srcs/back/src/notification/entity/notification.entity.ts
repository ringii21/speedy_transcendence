import { Exclude } from 'class-transformer'
import { Notification as NotificationPrisma } from '@prisma/client'

export class NotificationEntity implements NotificationPrisma {
  senderId: number
  receivedId: number
  state: boolean

  @Exclude()
  createdAt: Date

  constructor(partial: Partial<NotificationEntity>) {
    Object.assign(this, partial)
  }
}
