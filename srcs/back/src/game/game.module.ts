import { Module } from '@nestjs/common';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtAuthModule } from 'src/auth/jwt/jwt-auth.module';
import { UsersModule } from 'src/users/users.module';
import { GameGateway } from './game.gateways';
import { ChatGateway } from 'src/chat/chat.gateway';
import { JwtAuthService } from 'src/auth/jwt/jwt-auth.service';
import { MessageService } from 'src/message/message.service';
import { ChannelService } from 'src/channel/channel.service';

@Module({
  controllers: [GameController],
  imports: [JwtAuthModule, UsersModule],
  providers: [
    GameService,
    PrismaService,
    GameGateway,
    ChatGateway,
    JwtAuthService,
    MessageService,
    ChannelService]
})
export class GameModule {}
