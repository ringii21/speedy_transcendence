import { Body, Controller, Get, ValidationPipe } from '@nestjs/common'
import { AuthService } from './auth.service'
import { SignInDto } from './dto/signin.dto'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('signin')
  async signIn(@Body(new ValidationPipe()) signInDto: SignInDto) {
    return this.authService.signin(signInDto)
  }

  @Get('signout')
  async signOut() {
    return this.authService.signout()
  }
}
