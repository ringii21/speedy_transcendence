import { User } from '@prisma/client'
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator'

export class PatchUserDto implements Partial<User> {
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  @IsOptional()
  username?: string | undefined

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  image?: string | undefined

  @IsOptional()
  @IsBoolean()
  twoFaEnabled?: boolean | undefined
}
