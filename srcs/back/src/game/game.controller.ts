import {
  Controller,
  Get,
  Param,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common'
import JwtTwoFaGuard from '../auth/jwt/jwt-2fa.guard'
import { GameService } from './game.service'

@Controller('game')
@UseGuards(JwtTwoFaGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class GameController {
  constructor(private gameService: GameService) {}

  @Get('stats/:userId')
  async getUserStats(@Param('userId') userId: number) {
    return await this.gameService.getHistory(userId)
  }

  @Get('match_history/:userId')
  async getMatchHistory(@Param('userId') userId: number) {
    const game = await this.gameService.getMatchHistory(userId)
    console.log('------------------------------------------------', game)
    return game
  }
}
