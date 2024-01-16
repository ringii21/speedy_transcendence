-- CreateEnum
CREATE TYPE "ChannelType" AS ENUM ('public', 'private', 'protected');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('owner', 'user', 'admin');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "two_fa_enabled" BOOLEAN NOT NULL DEFAULT false,
    "two_fa_secret" TEXT,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "channel_messages" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "sender_id" INTEGER NOT NULL,
    "channel_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "channel_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "channels" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT,
    "type" "ChannelType" NOT NULL DEFAULT 'public',
    "owner_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "channels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "channel_members" (
    "user_id" INTEGER NOT NULL,
    "channel_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "present" BOOLEAN NOT NULL DEFAULT true,
    "role" "Role" NOT NULL DEFAULT 'user',

    CONSTRAINT "channel_members_pkey" PRIMARY KEY ("user_id","channel_id")
);

-- CreateTable
CREATE TABLE "channel_actions" (
    "user_id" INTEGER NOT NULL,
    "channel_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "channel_actions_pkey" PRIMARY KEY ("channel_id","user_id")
);

-- CreateTable
CREATE TABLE "games" (
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" SERIAL NOT NULL,
    "participant1Id" INTEGER NOT NULL,
    "participant2Id" INTEGER NOT NULL,
    "winner_id" INTEGER,
    "scoreP1" INTEGER,
    "scoreP2" INTEGER,
    "gametype" TEXT,
    "exchange_count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "games_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_friends" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE INDEX "channel_messages_sender_id_channel_id_idx" ON "channel_messages"("sender_id", "channel_id");

-- CreateIndex
CREATE UNIQUE INDEX "channels_name_key" ON "channels"("name");

-- CreateIndex
CREATE INDEX "channels_name_owner_id_idx" ON "channels"("name", "owner_id");

-- CreateIndex
CREATE UNIQUE INDEX "_friends_AB_unique" ON "_friends"("A", "B");

-- CreateIndex
CREATE INDEX "_friends_B_index" ON "_friends"("B");

-- AddForeignKey
ALTER TABLE "channel_messages" ADD CONSTRAINT "channel_messages_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "channel_messages" ADD CONSTRAINT "channel_messages_channel_id_fkey" FOREIGN KEY ("channel_id") REFERENCES "channels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "channels" ADD CONSTRAINT "channels_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "channel_members" ADD CONSTRAINT "channel_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "channel_members" ADD CONSTRAINT "channel_members_channel_id_fkey" FOREIGN KEY ("channel_id") REFERENCES "channels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "channel_actions" ADD CONSTRAINT "channel_actions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "channel_actions" ADD CONSTRAINT "channel_actions_channel_id_fkey" FOREIGN KEY ("channel_id") REFERENCES "channels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "games" ADD CONSTRAINT "games_participant1Id_fkey" FOREIGN KEY ("participant1Id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "games" ADD CONSTRAINT "games_participant2Id_fkey" FOREIGN KEY ("participant2Id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_friends" ADD CONSTRAINT "_friends_A_fkey" FOREIGN KEY ("A") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_friends" ADD CONSTRAINT "_friends_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
