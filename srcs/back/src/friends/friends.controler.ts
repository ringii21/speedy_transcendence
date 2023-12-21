import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { FriendsService } from "./friends.service";
import { JwtPayload } from "../auth/jwt/jwt-auth.strategy";
import { UserDecorator } from "../users/decorator/users.decorator";

@UseGuards(AuthGuard)
@Controller('friends')
export class FriendsControler {
  constructor(
    private friendsService: FriendsService
  ) { }

  @Post('new')
  addNewFriend(@UserDecorator() user: JwtPayload, @Body() payload: { userId: number }) {
    return this.friendsService.addFriend(user.sub, payload.userId)
  }

  @Get('remove')
  removeFriend(@UserDecorator() user: JwtPayload, @Body() payload: { userId: number }) {
    return this.friendsService.deleteFriend(user.sub, payload.userId)
  }

  @Get('nonFriends')
  getNonFriends(@UserDecorator() user: JwtPayload, @Body() payload: { userId: number }) {
    return this.friendsService.isNotFriend(user.sub, payload.userId)
  }

  @Get('all')
  getAllFriends(@UserDecorator() @Body() payload: { userId: number}) {
    return this.friendsService.allFriends(payload.userId)
  }
}
