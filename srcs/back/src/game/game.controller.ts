import { Controller, UseGuards, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import JwtTwoFaGuard from '../auth/jwt/jwt-2fa.guard'

@Controller('game')
@UseGuards(JwtTwoFaGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class GameController {}
