import { Module } from "@nestjs/common";
import { FriendsControler } from "./friends.controler";
import { FriendsService } from "./friends.service";
import { PrismaService } from "src/prisma/prisma.service";

@Module({
	providers: [FriendsService, PrismaService],
	exports: [FriendsService],
	controllers: [FriendsControler],
})
export class FriensModule {}
