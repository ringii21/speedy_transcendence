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
    return this.gameService.getHistory(userId)
  }

  @Get('match_history/:userId')
  async getMatchHistory(@Param('userId') userId: number) {
    return this.gameService.getMatchHistory(userId)
  }

  @Get('ladder/:userId')
  async getladder(@Param('userId') userId: number) {
    return this.gameService.getLadder(userId)
  }
}
