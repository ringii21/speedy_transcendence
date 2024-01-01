import { faker } from '@faker-js/faker'
import { ChannelMessage, Game, PrismaClient, User } from '@prisma/client'
import { Channel } from 'diagnostics_channel'
import { FriendsService } from 'src/friends/friends.service'

const prisma = new PrismaClient()

const createRandomUser = (): Partial<User> => {
  return {
    username: faker.internet.userName(),
    twoFaEnabled: false,
    accessToken: '',
    refreshToken: '',
    email: faker.internet.email(),
    image: faker.image.avatar(),
  }
}

const createChannelMessages = (): Partial<ChannelMessage> => {
  return {
    content: faker.lorem.sentence(),
    channelId: faker.number.int({ min: 1, max: 10 }),
    senderId: faker.number.int({ min: 1, max: 10 }),
  }
}

const createChannels = (): Partial<Channel> => {
  return {
    name: faker.lorem.word(),

  }
}

const createRandomGame = (): Partial<Game> => {
  return {
    scoreP1: faker.number.int({ min: 0, max: 100 }),
    scoreP2: faker.number.int({ min: 0, max: 100 }),
    exchangeCount: faker.number.int({ min: 0, max: 1000 }),
    player1Id: faker.number.int({ min: 1, max: 10 }),
    player2Id: faker.number.int({ min: 1, max: 10 }),
  }
}

export const makeNOf = <T>(cb: any, count = 5): T[] => {
  return faker.helpers.multiple<T>(cb, { count })
}

async function main() {
  for (const user of makeNOf<User>(createRandomUser, 10))
    await prisma.user.create({ data: user })

  for (const game of makeNOf<Game>(createRandomGame, 300))
    await prisma.game.create({ data: game })
  for (const message of makeNOf<ChannelMessage>(createChannelMessages, 300))
    await prisma.channelMessage.create({ data: message })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
