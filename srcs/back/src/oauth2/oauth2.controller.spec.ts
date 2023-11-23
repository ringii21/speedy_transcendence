import { Test, TestingModule } from '@nestjs/testing'
import { OAuth2Controller as OAuth2Controller } from './oauth2.controller'

describe('AuthController', () => {
  let controller: OAuth2Controller

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OAuth2Controller],
    }).compile()

    controller = module.get<OAuth2Controller>(OAuth2Controller)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
