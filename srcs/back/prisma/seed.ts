import { faker } from '@faker-js/faker'
import { Game, PrismaClient, User } from '@prisma/client'

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

const createRandomGame = (): Partial<Game> => {
  return {
    scoreP1: faker.number.int({ min: 0, max: 100 }),
    scoreP2: faker.number.int({ min: 0, max: 100 }),
    exchangeCount: faker.number.int({ min: 0, max: 1000 }),
    participant1Id: faker.number.int({ min: 1, max: 10 }),
    participant2Id: faker.number.int({ min: 1, max: 10 }),
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
