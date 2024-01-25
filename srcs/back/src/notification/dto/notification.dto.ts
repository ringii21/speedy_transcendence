import { IsNotEmpty, IsNumber } from 'class-validator'
import { Transform } from 'class-transformer'
import { Friends } from '@prisma/client'

export class NotificationDto implements Partial<Friends> {
  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  friendOfId: number
}
