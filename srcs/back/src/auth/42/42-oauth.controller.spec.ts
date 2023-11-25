import { Test, TestingModule } from '@nestjs/testing'
import { FortyTwoOAuthController as FortyTwoOAuthController } from './42-oauth.controller'

describe('AuthController', () => {
  let controller: FortyTwoOAuthController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FortyTwoOAuthController],
    }).compile()

    controller = module.get<FortyTwoOAuthController>(FortyTwoOAuthController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
