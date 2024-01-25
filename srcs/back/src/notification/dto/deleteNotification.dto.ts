import { IsNumber } from 'class-validator'
import { Transform } from 'class-transformer'

export class DeleteNotificationDto {
  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  friendOfId: number
}
