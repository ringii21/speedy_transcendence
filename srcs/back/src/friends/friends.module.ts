import { Module } from "@nestjs/common";
import { FriendsControler } from "./friends.controler";
import { FriendsService } from "./friends.service";
import { PrismaService } from "../prisma/prisma.service";
import { JwtAuthModule } from '../auth/jwt/jwt-auth.module'
import { UsersModule } from '../users/users.module'
import { UsersService } from "../users/users.service";

@Module({
	providers: [FriendsService, PrismaService, UsersService],
	exports: [FriendsService],
	controllers: [FriendsControler],
	imports: [JwtAuthModule, UsersModule],
})
export class FriendsModule {}
