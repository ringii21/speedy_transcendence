import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import {} from '@nestjs/platform-socket.io'
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter'
import { PrismaService } from 'src/prisma/prisma.service'
import { Game } from 'src/game/game'
import * as crypto from 'crypto'
import { UsersService } from 'src/users/users.service'
import { AuthService } from 'src/auth/auth.service'
import { StatusChangeEvent } from 'src/notification/events/notification.event'
import { Status } from 'src/status/types/Status'
import { StatusService } from 'src/status/status.service'

interface GameInvite {
  inviter: string
  opponentId: string
  gameMode: string
  client: Socket
  gameId: string
}

@WebSocketGateway({
  namespace: 'game',
  cors: {
    origin: process.env.FRONT_URL ?? 'http://localhost:3001',
    credentials: true,
  },
})

  export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
    constructor(
      private prisma: PrismaService,
      private readonly eventEmitter: EventEmitter2,
      private readonly usersService: UsersService,
      private readonly authService: AuthService,
      private readonly statusService: StatusService,
    ) {}
  
    @WebSocketServer() private server: Server;
    private games_map = new Map<string, Game>();
    private game_invites = new Set<GameInvite>();
    async handleConnection(client: Socket) {
      const user = await this.authService.getSocketUser(client)
      if (!user) {
        client.disconnect()
        return
      }
    }
  
    async handleDisconnect(client: Socket) {
      console.log('Je passe dans le handleDisconnect')
      const user = await this.authService.getSocketUser(client)
      if (!user) {
        client.disconnect()
        return
      }
  
      this.eventEmitter.emit('game.start', {
        client,
        gameMode: 'classic',
        mode: 'unregister',
      });
      this.eventEmitter.emit('game.start', {
        client,
        gameMode: 'extra',
        mode: 'unregister',
      });
    }
  
  
    @SubscribeMessage('status')
    async handleStatusEvent(@MessageBody() data: any) {
      const userId = data.userId;
      const userSockets = await this.server.in(`User:${userId}`).fetchSockets();
      let inGame = false;
      for await (const socket of userSockets) {
        if (socket.data.user.inGame) {
          inGame = true;
          break;
        }
      }
      return { /* status,  */inGame };
    }
  
    @SubscribeMessage('startGame')
    handleGameStartEvent(client: Socket, data: { gameMode: string }) {
      this.eventEmitter.emit('game.start', {
        client,
        gameMode: data.gameMode,
        mode: 'register',
      });
    }
    @SubscribeMessage('createGamePerso')
    handleCreateGamePerso(client: Socket) {
        this.eventEmitter.emit('createGamePerso.start', {
            client,
            mode: 'register'
        })
    }

    @SubscribeMessage('acceptGameInvite')
    handleAcceptGameInvite(client: Socket, data: { partyNumber: string }) {
        this.eventEmitter.emit('joinGamePerso', {
            client,
            partyNumber: data.partyNumber
        })
    }
  
    @SubscribeMessage('quitQueue')
    async handleQuitQueueEvent(client: Socket, data: { gameMode: string }) {
      this.eventEmitter.emit('game.start', {
        client,
        gameMode: data.gameMode,
        mode: 'unregister',
      });
    }

    @SubscribeMessage('game.stop')
    async handleGameStop(client: Socket, data: { gameid: string, gameState: any }) {
      const user = await this.authService.getSocketUser(client)
      const game = this.games_map.get(data.gameid)
      if (!user || !game) {
        return 
      }

      if (data.gameState.ball.p1Score < 11 && data.gameState.ball.p2Score < 11) {
        
        client.emit('finish')
      }
    }

    private async checkIfCanInvite(userId: string) {
      const opententSockets = await this.server
        .in(`User:${userId}`)
        .fetchSockets();
      if (opententSockets.length === 0) {
        return { error: 'offline' };
      }
      for await (const socket of opententSockets) {
        if (socket.data.user?.inGame) {
          return { error: 'already in game' };
        }
        if (socket.data.user?.inQueue) {
          return { error: 'already in queue' };
        }
      }
      const invite = Array.from(this.game_invites).find(
        (invite) => invite.opponentId === userId || invite.inviter === userId,
      );
      if (invite) {
        return { error: 'already Invited or Inviting to a game' };
      }
      return { error: null };
    }
  
    @SubscribeMessage('inviteToGame')
    async handleInviteToGameEvent(client: Socket, data: any) {
      const [inviter, opponent] = await Promise.all([
        this.checkIfCanInvite(client.data.user.sub),
        this.checkIfCanInvite(data.opponentId),
      ]);
  
      if (inviter.error || opponent.error) {
        return {
          error: inviter.error ? `You are ${inviter.error}` : opponent.error,
        };
      }
  
      const gameId = crypto.randomBytes(16).toString('hex');
      this.server.to(`User:${data.opponentId}`).emit('invitedToGame', {
        inviterId: client.data.user.sub,
        gameId,
      });
      this.game_invites.add({
        inviter: client.data.user.sub,
        gameMode: data.gameMode,
        client,
        gameId,
        opponentId: data.opponentId,
      });
      return { error: null, gameId };
    }
  
    @SubscribeMessage('acceptGame')
    async handleAcceptGameEvent(client: Socket, data: any) {
      const game_invite = Array.from(this.game_invites).find(
        (invite) => invite.gameId === data.gameId,
      );
      if (!game_invite) {
        client.emit('game.declined', {
          gameId: data.gameId,
        });
        return;
      }
      this.game_invites.delete(game_invite);
      this.server.to(`User:${data.inviterId}`).emit('game.accepted', {
        accepter: client.data.user.sub,
      });
  
      const invterData = await this.usersService.find(data.inviterId);
      const opponentData = await this.usersService.find(
        client.data.user.sub,
      );
  
      // launch the game
      this.eventEmitter.emit(
        'game.launched',
        [
          {
            socket: game_invite.client,
            userData: invterData,
          },
          {
            socket: client,
            userData: opponentData,
          },
        ],
        game_invite.gameMode,
      );
    }

  @OnEvent('game.launched')
  async handleGameLaunchedEvent(clients: any, mode: string) {
    // Create id of the game
    const game_channel = crypto.randomBytes(16).toString('hex')

    clients.forEach((client: any) => {
      client.socket.join(game_channel)
      client.socket.data.user.inGame = true
      client.socket.data.user.inQueue = false
    })
    // Create new object game
    const new_game = new Game(this.eventEmitter, this.server, mode)

    new_game.setplayerSockets(
      game_channel,
      clients[0].socket,
      clients[1].socket,
      clients[0].userData,
      clients[1].userData,
    )
    new_game.start(game_channel)
    this.games_map.set(game_channel, new_game)
    this.server.to(game_channel).emit('game.launched', game_channel)
    // Set status of the players
    this.statusService.setStatus(clients[0].userData.id, Status.IN_GAME)
    this.statusService.setStatus(clients[1].userData.id, Status.IN_GAME)
    this.eventEmitter.emit(StatusChangeEvent.name, {
      userId: clients[0].userData.id,
      newStatus: this.statusService.getStatus(clients[0].userData.id),
    })
    this.eventEmitter.emit(StatusChangeEvent.name, {
      userId: clients[1].userData.id,
      newStatus: this.statusService.getStatus(clients[1].userData.id),
    })
  }
  
    @OnEvent('game.end')
    async handleGameEndEvent(data: any) {
      this.games_map.delete(data.gameid);
      const sockets = await this.server.in(data.gameid).fetchSockets();
      this.server.to(data.gameid).emit('game.end', data);
  
      for await (const socket of sockets) {
        socket.data.user.inGame = false;
      }
      if (data.resign === 0) {
        await this.prisma.game.create({
          data: {
            participant1Id: data.p1Data.id,
            participant2Id: data.p2Data.id,
            winner_id:
              data.p1Score > data.p2Score
                ? data.p1Data.id
                : data.p2Data.id,
            scoreP1: data.p1Score,
            scoreP2: data.p2Score,
          },
        });
        const winner_id = (data.p1Score > data.p2Score
            ? data.p1Data.id
            : data.p2Data.id)
        const loser_id = (data.p1Score < data.p2Score
            ? data.p1Data.id
            : data.p2Data.id)
        await this.usersService.updateElo(winner_id, loser_id)
      } else if (data.resign === 1) {
        await this.prisma.game.create({
          data: {
            participant1Id: data.p1Data.id,
            participant2Id: data.p2Data.id,
            winner_id: data.p2Data.id,
            scoreP1: 0,
            scoreP2: 5,
          },
        });
        await this.usersService.updateElo(data.p2Data.id, data.p1Data.id)
      } else if (data.resign === 2) {
        await this.prisma.game.create({
          data: {
            participant1Id: data.p1Data.id,
            participant2Id: data.p2Data.id,
            winner_id: data.p1Data.id,
            scoreP1: 5,
            scoreP2: 0,
          },
        });
        await this.usersService.updateElo(data.p1Data.id, data.p2Data.id)
      }

    this.statusService.setStatus(data.p1Data.id, Status.ONLINE)
    this.statusService.setStatus(data.p2Data.id, Status.ONLINE)
    this.eventEmitter.emit(StatusChangeEvent.name, {
      userId: data.p1Data.id,
      newStatus: this.statusService.getStatus(data.p1Data.id),
    })
    this.eventEmitter.emit(StatusChangeEvent.name, {
      userId: data.p2Data.id,
      newStatus: this.statusService.getStatus(data.p2Data.id),
    })
  }

  
    @SubscribeMessage('PingOnline')
    async handlePingOnlineEvent(client: Socket, data: any) {
      const friendId = data.friendId;
      if (this.server.sockets.adapter.rooms.get(`User:${friendId}`)?.size) {
        client.emit('friendOnline', friendId);
      } else {
        client.emit('friendOffline', friendId);
      }
    }
  }