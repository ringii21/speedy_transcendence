import { Injectable } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { User } from '@prisma/client';
import { Socket } from 'socket.io';
import { ChatGateway } from 'src/chat/chat.gateway';
import { PrismaService } from 'src/prisma/prisma.service';
//import { PICTURE } from 'src/profile/dto/profile.dto';

@Injectable()
export class GameService {
  constructor(
    private readonly prisma: PrismaService,
    private eventEmitter: EventEmitter2,
    private readonly chatGateway: ChatGateway
  ) {
    this.launchGame();
  }

  private classicwaitingPlayers: { socket: Socket; userData: Partial<User> | null }[] =
    [];

  private extraWaitingPlayers: { socket: Socket; userData: Partial<User> | null }[] =
    [];

  @OnEvent('game.start')
  async handleGameStartEvent(data: {
    client: Socket;
    gameMode: string;
    mode: string;
  }) {
    if (data.mode === 'register') {
      const client = data.client;
      client.data.user = await this.chatGateway.getUser(client);
      client.data.user.inQueue = false
      if (client.data.user?.inQueue) {
        return;
      }
      const gameMode = data.gameMode;
      if (client.data.user) {
        const userId = client.data.user.id
      }
      client.data.user.inQueue = true;

      if (gameMode === 'classic')
        this.classicwaitingPlayers.push({ socket: client, userData: client.data.user });
      else if (gameMode === 'extra')
        this.extraWaitingPlayers.push({ socket: client, userData: client.data.user });
    } else if (data.mode === 'unregister') {
      const client = data.client;
      client.data.user = await this.chatGateway.getUser(client);
      const gameMode = data.gameMode;
      client.data.user.inQueue = false;
      if (gameMode === 'classic')
        this.classicwaitingPlayers = this.classicwaitingPlayers.filter(
          (player) => player.socket.id !== client.id,
        );
      else if (gameMode === 'extra')
        this.extraWaitingPlayers = this.extraWaitingPlayers.filter(
          (player) => player.socket.id !== client.id,
        );
    }
  }

  //NOTE: add game modes here
  private launchGame() {
    setInterval(() => {
      if (this.classicwaitingPlayers.length >= 2) {
        const two_players = this.classicwaitingPlayers.splice(0, 2);
        this.eventEmitter.emit('game.launched', two_players, 'classic');
      }
      if (this.extraWaitingPlayers.length >= 2) {
        const two_players = this.extraWaitingPlayers.splice(0, 2);
        this.eventEmitter.emit('game.launched', two_players, 'extra');
      }
    }, 5027);
  }
  async getUser(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        username: true,
        image: true,
      },
    });
    return user;
  }
  async getHistory(userId: number, offset: number, limit: number) {
    const matches = await this.prisma.game.findMany({
      skip: offset,
      take: limit,
      where: {
        OR: [
          {
            participant1Id: userId,
          },
          {
            participant2Id: userId,
          },
        ],
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        createdAt: true,
        scoreP1: true,
        scoreP2: true,
        participant1: {
          select: {
            id: true,
            username: true,
            image: true,
          },
        },
        participant2: {
          select: {
            id: true,
            username: true,
            image: true,
          },
        },
      },
    });
    return matches.map((game: any) => {
      /* const avatar1: PICTURE = {
        thumbnail: `https://res.cloudinary.com/trandandan/image/upload/c_thumb,h_48,w_48/${game.participant1.avatar}`,
        medium: `https://res.cloudinary.com/trandandan/image/upload/c_thumb,h_72,w_72/${game.participant1.avatar}`,
        large: `https://res.cloudinary.com/trandandan/image/upload/c_thumb,h_128,w_128/${game.participant1.avatar}`,
      };
      const avatar2: PICTURE = {
        thumbnail: `https://res.cloudinary.com/trandandan/image/upload/c_thumb,h_48,w_48/${game.participant2.avatar}`,
        medium: `https://res.cloudinary.com/trandandan/image/upload/c_thumb,h_72,w_72/${game.participant2.avatar}`,
        large: `https://res.cloudinary.com/trandandan/image/upload/c_thumb,h_128,w_128/${game.participant2.avatar}`,
      }; */
      return {
        game: {
          createdAt: game.createdAt,
          Player1: {
            id: game.participant1.userId,
            username: game.participant1.Username,
            score: game.score1,
           // avatar: avatar1,
          },
          Player2: {
            id: game.participant2.userId,
            username: game.participant2.Username,
            score: game.score2,
            //avatar: avatar2,
          },
        },
      };
    });
  }
}