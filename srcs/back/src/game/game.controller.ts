import { Controller, Get, Param, UseGuards, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import JwtTwoFaGuard from '../auth/jwt/jwt-2fa.guard'
import { GameService } from './game.service';

@Controller('game')
@UseGuards(JwtTwoFaGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class GameController {
    constructor(private gameService: GameService) {}

  @Get('stats/:userId')
  async getUserStats(@Param('userId') userId: number) {
    console.log('Je passe bien dans la bonne fonction')
    return await this.gameService.getHistory(userId);
  }
}
