import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Patch,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard'
import { Request } from 'express'
import { UsersService } from './users.service'
import { UserEntity } from './entity/user.entity'
import { PatchUserDto } from './dto/patch-user.dto'
import { QueryUsersDto } from './dto/query-users.dto'

@Controller('users')
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getUsers(@Query() queryUsersDto: QueryUsersDto) {
    const users = await this.usersService.findMany(queryUsersDto)

    return users.map((user) => new UserEntity(user))
  }

  @Get('me')
  async me(@Req() req: Request) {
    return new UserEntity(req.user)
  }

  @Patch('me')
  async updateMe(@Req() req: Request, @Body() patchUserDto: PatchUserDto) {
    const updatedUser = await this.usersService.update({
      where: { id: req.user.id },
      data: patchUserDto,
    })

    return new UserEntity(updatedUser)
  }
}
