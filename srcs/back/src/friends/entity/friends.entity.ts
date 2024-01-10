import { Type, Exclude } from 'class-transformer';
import { UserEntity } from '../../users/entity/user.entity'
import { Friends as FriendPrisma, User, Friends } from "@prisma/client";

export class FriendEntity implements FriendPrisma {
  friendId: number;
  confirmed: boolean;
  friendOfId: number;

  @Exclude()
  createdAt: Date
  @Exclude()
  deletedAt: Date | null
  @Exclude()
  expiresAt: Date | null
  @Exclude()
  updatedAt: Date

  constructor(partial: Partial<FriendEntity>) {
    Object.assign(this, partial)
  }
}
