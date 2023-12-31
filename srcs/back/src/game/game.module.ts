import { Module } from '@nestjs/common';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtAuthModule } from 'src/auth/jwt/jwt-auth.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [GameController],
  imports: [JwtAuthModule, UsersModule],
  providers: [
    GameService,
    PrismaService]
})
export class GameModule {}
