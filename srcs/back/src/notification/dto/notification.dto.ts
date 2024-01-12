import { IsNotEmpty, IsNumber } from 'class-validator'
import { Transform } from 'class-transformer'

export class NotificationDto {
  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  receivedId: number
}
