import { Exclude } from 'class-transformer'
import { User as UserPrisma } from '@prisma/client'

export class UserEntity implements Partial<UserPrisma> {
  id: number
  email?: string | undefined
  username: string
  image?: string | undefined
  createdAt?: Date | undefined
  updatedAt?: Date | undefined
  twoFaEnabled?: boolean | undefined

  @Exclude()
  accessToken: string | null
  @Exclude()
  refreshToken: string | null
  @Exclude()
  twoFaSecret: string | null
  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial)
  }
}
