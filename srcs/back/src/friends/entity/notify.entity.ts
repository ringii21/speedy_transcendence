import { Exclude } from 'class-transformer'
import { Notify as NotifyPrisma } from '@prisma/client'

export class NotifyEntity implements NotifyPrisma {
  senderId: number
  receivedId: number

  @Exclude()
  createdAt: Date

  constructor(partial: Partial<NotifyEntity>) {
    Object.assign(this, partial)
  }
}
