import { IsNotEmpty, IsString } from 'class-validator'

export class SignInDto {
  @IsString()
  @IsNotEmpty()
  readonly access_token: string
}
