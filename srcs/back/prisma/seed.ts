import { faker } from '@faker-js/faker'
import { Game, PrismaClient, PrivateMessage, User } from '@prisma/client'

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

const createPrivateMessages = (): Partial<PrivateMessage> => {
  return {
    content: faker.lorem.sentence(),
    senderId: faker.number.int({ min: 1, max: 10 }),
    receiverId: faker.number.int({ min: 1, max: 10 }),
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
  for (const message of makeNOf<PrivateMessage>(createPrivateMessages, 300))
    await prisma.privateMessage.create({ data: message })
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
