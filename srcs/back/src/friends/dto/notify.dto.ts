import { IsNotEmpty, IsNumber } from 'class-validator'
import { Transform } from 'class-transformer'

export class NotifyDto {
  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  receiverId: number
}
