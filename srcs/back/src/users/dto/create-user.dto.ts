import { User } from '@prisma/client'
import { IsBoolean, IsEmail, IsString, Length } from 'class-validator'

type TCreateUserDto = Omit<
  User,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'lastSeen'
>

export class CreateUserDto implements TCreateUserDto {
  @IsEmail()
  email: string

  @IsString()
  @Length(3, 20)
  username: string

  @IsString()
  image: string

  @IsBoolean()
  twofaenabled: boolean
}
