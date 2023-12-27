import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { UsersService } from './users.service'
import { UserEntity } from './entity/user.entity'
import { PatchUserDto } from './dto/patch-user.dto'
import { QueryFindUsersDto, QueryUsersDto } from './dto/query-users.dto'
import JwtTwoFaGuard from '../auth/jwt/jwt-2fa.guard'
import { UploadUserImage } from './decorator/file-upload.decorator'
import { ConfigService } from '@nestjs/config'
import { RequestWithDbUser } from '../types/Request'

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

  @Post()
  async postAllUsers(@Query() queryUsersDto: QueryUsersDto) {
    const users = await this.usersService.findMany(queryUsersDto)

    return users.map((user) => new UserEntity(user))
  }

  @Get('me')
  async me(@Req() req: RequestWithDbUser) {
    return new UserEntity(req.user)
  }

  // ******************** Get user by id *************************
  // @Get(':id')
  // async userId(
  //   @Req() req: RequestWithDbUser,
  //   @Param('id', ParseIntPipe) id: number
  //   ) {
  //     if (!(await this.usersService.isUserExist(req.user.id)))
  //       throw new BadRequestException('Users is not found')
  //     // const users = await this.usersService.
  //   return new UserEntity(req.user)
  // }
  // *************************************************************

  // *************** Post user's data from id ******************** //
  @Post(':id')
  async getAllUsers(@Query() queryUsersDto: QueryFindUsersDto) {
    const allUsers = await this.usersService.findMany(queryUsersDto)
    return allUsers.map((users) => new UserEntity(users))
  }

  @Post(':id')
  async id(@Req() req: RequestWithDbUser) {
    return new UserEntity(req.user)
  }
  // ***********************************************************

  @Patch('me')
  @UploadUserImage()
  async updateMe(
    @Req() req: RequestWithDbUser,
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
