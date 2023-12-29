import { Type, Exclude } from 'class-transformer';
import { UserEntity } from '../../users/entity/user.entity'
import { User as PrismaUserFriend } from '@prisma/client'

export class UserFriendEntity implements PrismaUserFriend {
  id: number
  userId: number
  name: string | null
  username: string
  image: string

  @Exclude()
  email: string
  @Exclude()
  twoFaEnabled: boolean
  @Exclude()
  twoFaSecret: string | null
  @Exclude()
  refreshToken: string | null
  @Exclude()
  accessToken: string | null
  @Exclude()
  createdAt: Date
  @Exclude()
  deletedAt: Date | null
  @Exclude()
  expiresAt: Date | null
  @Exclude()
  updatedAt: Date
  
  constructor(partial: Partial<UserFriendEntity>) {
    Object.assign(this, partial)
  }
}
