import { Transform } from 'class-transformer'
import { IsNumber, IsNotEmpty } from 'class-validator'
import { User } from '@prisma/client'

export class FriendshipSearchDto implements Partial<User> {
  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value, 10))
  id: number
}