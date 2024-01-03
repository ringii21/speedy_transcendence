import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { FriendsService } from './friends.service';
import { JwtPayload } from "../auth/jwt/jwt-auth.strategy";
import { UserDecorator } from "../users/decorator/users.decorator";
import { FriendshipRemovalDto } from './dto/friend-removal.dto'
import { FriendshipSearchDto } from './dto/friend-search.dto'
import { FriendsRequestDto } from './dto/friend-add.dto'
import { QueryFindUsersDto } from '../users/dto/query-users.dto';
import { Friends } from '@prisma/client';
import { UserEntity } from '../users/entity/user.entity';

@UseGuards(AuthGuard())
@Controller('friends')
export class FriendsControler {
  constructor(
    private friendsService: FriendsService
  ) { }

  @Post(':id')
  addNewFriend(@UserDecorator() user: JwtPayload, @Body() payload: FriendsRequestDto) {
    return this.friendsService.addFriend(user.sub, payload.friendId)
  }

  @Post(':id')
  removeFriend(@UserDecorator() user: JwtPayload, @Body() payload: FriendshipRemovalDto) {
    return this.friendsService.deleteFriend(user.sub, payload.friendId)
  }

}
