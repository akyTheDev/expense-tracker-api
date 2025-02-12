import { Test, TestingModule } from '@nestjs/testing'

import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { loginDtoFixture as loginDto } from '../../test/fixtures/auth'

describe('AuthController', () => {
  let controller: AuthController
  let service: AuthService

  const mockService = {
    login: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: AuthService,
          useValue: mockService,
        },
      ],
      controllers: [AuthController],
    }).compile()

    controller = module.get<AuthController>(AuthController)
    service = module.get<AuthService>(AuthService)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('login', () => {
    it('should call login correctly', async () => {
      const tokenResult = {
        token_type: 'bearer',
        token: 'TOKEN',
      }

      mockService.login.mockResolvedValue(tokenResult)

      const result = await controller.login(loginDto)

      expect(result).toEqual(tokenResult)
      expect(service.login).toHaveBeenCalledWith(loginDto)
    })
  })
})
