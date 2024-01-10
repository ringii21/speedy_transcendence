import { Transform } from 'class-transformer'
import { IsNumber, IsNotEmpty, NotEquals } from 'class-validator'

export class FriendsRequestDto {
  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  friendOfId: number
}
