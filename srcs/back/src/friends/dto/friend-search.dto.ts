import { Transform } from 'class-transformer'
import { IsNumber, IsNotEmpty, IsOptional } from 'class-validator'
import { User } from '@prisma/client'

export class FriendshipSearchDto {
  @IsOptional()
  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value, 10))
  skip: number

  @IsOptional()
  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value, 10))
  take: number
}