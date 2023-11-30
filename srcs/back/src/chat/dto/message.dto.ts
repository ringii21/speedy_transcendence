import { IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class MessageDto {
  @IsNumber()
  @IsNotEmpty()
  channelId: number

  @IsNotEmpty()
  @IsString()
  content: string
}
