import {
  Body,
  Controller,
  Get,
  Req,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
  BadRequestException,
  Post,
} from '@nestjs/common'
import { FriendsService } from './friends.service'
import { FriendshipRemovalDto } from './dto/friend-removal.dto'
// import { FriendshipSearchDto } from './dto/friend-search.dto'
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard'
import { FriendEntity } from './entity/friends.entity'
import { RequestWithDbUser } from '../types/Request'
import { FriendsRequestDto } from './dto/friend-request.dto'

@Controller('friends')
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class FriendsControler {
  constructor(private readonly friendsService: FriendsService) {}

  @Get()
  async getFriends(@Req() req: RequestWithDbUser) {
    const friends = await this.friendsService.getMyFriends(req.user.id)

    return friends.map((friend) => new FriendEntity(friend))
  }

  // afficher les demandes d'ami
  // confirmer les demandes d'ami

  // @Post()
  // addNewFriend(@Body() friendsRequestDto: FriendsRequestDto) {
  //   console.log('Received data from: ', friendsRequestDto)
  // }

  @Post()
  async addNewFriend(
    @Req() req: RequestWithDbUser,
    @Body() friendsRequestDto: FriendsRequestDto,
  ) {
    if (req.user.id === friendsRequestDto.friendOfId)
      throw new BadRequestException('You cannot be friend with yourself')
    if (
      await this.friendsService.findFriend(
        req.user.id,
        friendsRequestDto.friendOfId,
      )
    )
      throw new BadRequestException(
        'Already friend or friendship not confirmed',
      )
    return this.friendsService.create(req.user.id, friendsRequestDto.friendOfId)
  }

  @Get(':id')
  async removeFriend(
    @Req() req: RequestWithDbUser,
    @Body() friendshipRemovalDto: FriendshipRemovalDto,
  ) {
    return this.friendsService.delete(
      req.user.id,
      friendshipRemovalDto.friendOfId,
    )
  }
}
