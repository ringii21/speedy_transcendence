import { Channel, ChannelType } from '@prisma/client'
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator'

export class CreateChannelDto implements Partial<Channel> {
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(10)
  name: string | undefined

  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(10)
  password: string | undefined

  @IsEnum(ChannelType)
  @IsNotEmpty()
  channelType: ChannelType
}
