import { Test, TestingModule } from '@nestjs/testing'
import { UsersService } from './users.service'
import { PrismaService } from 'src/prisma/prisma.service'
import { PrismaClient, User } from '@prisma/client'
import { mockDeep, DeepMockProxy } from 'jest-mock-extended'

describe('UsersService', () => {
  let service: UsersService
  let prisma: DeepMockProxy<PrismaClient>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, PrismaService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile()

    service = module.get(UsersService)
    prisma = module.get(PrismaService)
  })

  it('should retrieve users from the database', () => {
    const testUsers: User[] = []
    prisma.user.findMany.mockRejectedValueOnce(testUsers)
    expect(service.users({})).resolves.toBe(testUsers)
  })
})
