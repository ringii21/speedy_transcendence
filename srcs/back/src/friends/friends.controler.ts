import { 
  Body, 
  Controller, 
  Get, 
  Post, 
  Req, 
  UseGuards, 
  Query, 
  UseInterceptors, 
  NotFoundException, 
  ClassSerializerInterceptor,
  Param,
  ParseIntPipe,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { FriendsService } from './friends.service';
import { JwtPayload } from "../auth/jwt/jwt-auth.strategy";
import { UserDecorator } from "../users/decorator/users.decorator";
import { FriendshipRemovalDto } from './dto/friend-removal.dto'
import { FriendshipSearchDto } from "./dto/friend-search.dto";
import { FriendsRequestDto } from "./dto/friend-request.dto";
import { QueryFindUsersDto } from '../users/dto/query-users.dto';
import { Friends, Prisma, User } from '@prisma/client';
import { UserEntity } from '../users/entity/user.entity';
import { UsersService } from "../users/users.service";
import { JwtAuthGuard } from "../auth/jwt/jwt-auth.guard";
import { FriendEntity } from "./entity/friends.entity";
import { RequestWithDbFriends, RequestWithDbUser } from "../types/Request";
import { addFriends } from "../../../front/src/utils/friendService";

@Controller('friends')
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class FriendsControler {
  constructor(
    private readonly friendsService: FriendsService
  ) { }

  @Get()
  async getFriends(@Query()  friendshipSearchDto:  FriendshipSearchDto) {
    const friends = await this.friendsService.findManyFriends(friendshipSearchDto)

    return friends.map((friend) => new FriendEntity(friend))
  }

  // @Get(':id')
  // async friendById(@Req() req: RequestWithDbFriends) {
  //   try {
  //     const friend = await this.friendsService.findFriendById(req.friends.id)
  //     return new FriendEntity(friend)
  //   } catch (e) {
  //     if (e instanceof NotFoundException) {
  //       return { message: 'Friend not found', status: 404 }
  //     }
  //     return { message: 'Internal server error', status: 505 }
  //   }
  // }

  @Post()
  async addNewFriend(
    @Req() req: RequestWithDbUser,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const friends = await this.friendsService.addFriends(
      req.user.id,
      id,
    )
    console.log('friend controler: ', friends)
    if (!friends) {
      console.error('Error: Friend not found')
      return new NotFoundException('Friend not found')
    }
    return new FriendEntity(friends)
  }

  @Get(':id')
  async removeFriend(@Req() req: RequestWithDbFriends) {
    return this.friendsService.delete(req.friends)
  }
}
