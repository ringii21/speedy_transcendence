import { User } from '@prisma/client'
import { Transform } from 'class-transformer'
import { IsNumber, IsNotEmpty } from 'class-validator'

export class FriendsRequestDto implements Partial<User> {
  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  id: number
  friendId: number
}
