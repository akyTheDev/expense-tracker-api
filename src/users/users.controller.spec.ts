import { Test, TestingModule } from '@nestjs/testing'

import { UsersController } from './users.controller'
import { UsersService } from './users.service'
import { userFixture, createUserDtoFixture } from '../../test/fixtures/users'

describe('UsersController', () => {
  let controller: UsersController
  let service: UsersService

  const mockUsersService = {
    create: jest.fn(),
    getUserInfo: jest
      .fn()
      .mockResolvedValue(
        (({ password: _password, ...rest }) => rest)(userFixture),
      ),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile()

    controller = module.get<UsersController>(UsersController)
    service = module.get<UsersService>(UsersService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('create', () => {
    it('should call create correctly', async () => {
      const { password: _password, ...expectedResult } = userFixture

      mockUsersService.create.mockResolvedValue(expectedResult)

      const result = await controller.create(createUserDtoFixture)

      expect(result).toEqual(expectedResult)
      expect(service.create).toHaveBeenCalledWith(createUserDtoFixture)
    })
  })

  describe('getUserInfo', () => {
    it('should call getUserInfo correctly', async () => {
      const result = await controller.getUserInfo(123)
      const { password: _password, ...expectedResult } = userFixture

      expect(result).toEqual(expectedResult)
      expect(service.getUserInfo).toHaveBeenCalledWith(123)
    })
  })
})
