import { Injectable } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { User } from '@prisma/client';
import { Socket } from 'socket.io';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthService } from 'src/auth/auth.service';

interface WaitingPlayerGameCustom {
  socket: Socket;
  userData: Partial<User> | null;
  socketOpponent: Socket,
  opponentData: Partial<User> | null;
  partyNumber: number;
}
@Injectable()
export class GameService {
  constructor(
    private readonly prisma: PrismaService,
    private eventEmitter: EventEmitter2,
    private readonly authService: AuthService
  ) {
    this.launchGame();
  }


  
  private classicwaitingPlayers: { socket: Socket; userData: Partial<User> | null }[] =
    [];

  private extraWaitingPlayers: { socket: Socket; userData: Partial<User> | null }[] =
    [];

  private queueGamePerso: WaitingPlayerGameCustom[][] = [];

  private nextPartyNumber = 1;


  @OnEvent('game.start')
  async handleGameStartEvent(data: {
    client: Socket;
    gameMode: string;
    mode: string;
  }) {
    if (data.mode === 'register') {
      const client = data.client;
      client.data.user = await this.authService.getSocketUser(client);
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
      client.data.user = await this.authService.getSocketUser(client);
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


  @OnEvent('createGamePerso.start')
  async handleCreateGamePerso(data: {
    client: Socket;
    mode: string;
  }) {
    if (data.mode === 'register') {
        const client = data.client;
        client.data.user = await this.authService.getSocketUser(client);
        if (client.data.user) {
           const userId = client.data.user.id
        }
        const newGame: WaitingPlayerGameCustom = {
            socket: client,
            userData: client.data.user,
            socketOpponent: client,
            opponentData: null, // L'adversaire sera ajouté plus tard
            partyNumber: this.nextPartyNumber++
          };
        
          // Ajouter ce jeu à une nouvelle ligne dans le tableau en deux dimensions
          this.queueGamePerso.push([newGame]);
          client.emit('gamePersoCreated', { partyNumber: newGame.partyNumber })
    } else if (data.mode === 'unregister') {
        const client = data.client;
        client.data.user = await this.authService.getSocketUser(client);
        /* JE SAIS PAS ENCORE */
      }
  }

  @OnEvent('joinGamePerso')
  async handleJoinGamePerso(data: {
    client: Socket;
    partyNumber: string
  }) {
      let two_players
      const client = data.client;
      client.data.user = await this.authService.getSocketUser(client);
      for (const gameArray of this.queueGamePerso) {
        const game = gameArray.find(game => game.partyNumber.toString() === data.partyNumber);
        if (game) {
          game.opponentData = client.data.user; // Mettre à jour uniquement opponentData
          game.socketOpponent = client;
          two_players = [
            { socket: game.socket, userData: game.userData },
            { socket: game.socketOpponent, userData: game.opponentData }
          ];
          
          break; // Sortir de la boucle si le jeu est trouvé et mis à jour
        }
      }
      this.eventEmitter.emit('game.launched', two_players, 'classic');
  }
  //NOTE: add game modes here
  private launchGame() {
    setInterval(() => {
      if (this.classicwaitingPlayers.length >= 2) {
        const two_players = this.classicwaitingPlayers.splice(0, 2);
        console.log(two_players)
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
  
  async getHistory(userId: number) {
    const games = await this.prisma.game.findMany({
      where: {
        OR: [
          { participant1Id: userId },
          { participant2Id: userId },
        ],
      },
      select: {
        winner_id: true,
        participant1Id: true,
        participant2Id: true,
      },
    });
  
    let victories = 0;
    let defeats = 0;
  
    games.forEach(game => {
      if (game.winner_id === userId) {
        victories++;
      } else if (game.participant1Id === userId || game.participant2Id === userId) {
        defeats++;
      }
    });
  
    return { victories, defeats };
  }
}