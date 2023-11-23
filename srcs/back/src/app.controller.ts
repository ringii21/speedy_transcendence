import {
  Controller, 
  Get, 
  Param,
  Post,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
// import { PostService } from './post.service';
import { Prisma, User as UserModel } from '@prisma/client';

@Controller()
export class AppController {
  constructor(
    private readonly userService: UserService,
  ) {}

  @Get('user/:email')
  async getUserByEmail(
    @Param('email') email:string
  ):Promise<UserModel>{
    return this.userService.user({email});
  }


  @Post('user')
  async signupUser(
    @Body() userData: { name?: string; email: string },
  ): Promise<UserModel> {
    return this.userService.createUser(userData);
  }
}
