import { UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import * as bcrypt from 'bcrypt'
import { Repository } from 'typeorm'

import { AuthService } from './auth.service'
import { loginDtoFixture as loginDto } from '../../test/fixtures/auth'
import { userFixture } from '../../test/fixtures/users/user.fixture'
import { User } from '../users/entities/user.entity'

describe('AuthService', () => {
  let service: AuthService
  let userRepository: Repository<User>
  let jwtService: JwtService

  const mockUserRepository = {
    findOne: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getRepositoryToken(User), useValue: mockUserRepository },
        {
          provide: JwtService,
          useValue: { signAsync: jest.fn().mockResolvedValue('BEARER_TOKEN') },
        },
      ],
    }).compile()

    service = module.get<AuthService>(AuthService)
    userRepository = module.get<Repository<User>>(getRepositoryToken(User))
    jwtService = module.get<JwtService>(JwtService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('login', () => {
    const passwordCompareSpy = jest.spyOn(bcrypt, 'compare') as jest.Mock

    beforeEach(async () => {
      mockUserRepository.findOne.mockResolvedValue(userFixture)
      passwordCompareSpy.mockResolvedValue(true)
    })

    it('should throw unauthorized exception if user not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(undefined)
      await expect(service.login(loginDto)).rejects.toThrow(
        new UnauthorizedException('Unauthorized'),
      )

      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { email: loginDto.email },
      })
    })

    it('should throw unauthorized exception if password is invalid', async () => {
      passwordCompareSpy.mockResolvedValue(false)

      await expect(service.login(loginDto)).rejects.toThrow(
        new UnauthorizedException('Unauthorized'),
      )

      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { email: loginDto.email },
      })

      expect(passwordCompareSpy).toHaveBeenCalledWith(
        loginDto.password,
        userFixture.password,
      )
    })

    it('should generate the token and return', async () => {
      const result = await service.login(loginDto)

      const token = 'BEARER_TOKEN'

      const expectedResult = {
        token_type: 'bearer',
        token,
      }

      expect(result).toEqual(expectedResult)

      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { email: loginDto.email },
      })
      expect(passwordCompareSpy).toHaveBeenCalledWith(
        loginDto.password,
        userFixture.password,
      )

      expect(jwtService.signAsync).toHaveBeenCalledWith({
        userId: userFixture.id,
      })
    })
  })
})
