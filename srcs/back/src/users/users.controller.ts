import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Patch,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { Request } from 'express'
import { UsersService } from './users.service'
import { UserEntity } from './entity/user.entity'
import { PatchUserDto } from './dto/patch-user.dto'
import { QueryUsersDto } from './dto/query-users.dto'
import JwtTwoFaGuard from 'src/auth/jwt/jwt-2fa.guard'
import { User } from '@prisma/client'
import { UploadUserImage } from './decorator/file-upload.decorator'
import { ConfigService } from '@nestjs/config'

type RequestWithUser = Request & { user: User }

@Controller('users')
@UseGuards(JwtTwoFaGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  private BACKEND_URL = this.configService.getOrThrow('BACKEND_URL')
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  async getUsers(@Query() queryUsersDto: QueryUsersDto) {
    const users = await this.usersService.findMany(queryUsersDto)

    return users.map((user) => new UserEntity(user))
  }

  @Get('me')
  async me(@Req() req: RequestWithUser) {
    return new UserEntity(req.user)
  }

  @Patch('me')
  @UploadUserImage()
  async updateMe(
    @Req() req: RequestWithUser,
    @Body() patchUserDto: PatchUserDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    if (image)
      patchUserDto.image = `${this.BACKEND_URL}/public/${image.filename}`

    const updatedUser = await this.usersService.update({
      where: { id: req.user.id },
      data: patchUserDto,
    })

    return new UserEntity(updatedUser)
  }
}
