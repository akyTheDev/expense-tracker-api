import { ConflictException, NotFoundException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import * as bcrypt from 'bcrypt'
import { Repository } from 'typeorm'

import { User } from './entities/user.entity'
import { UsersService } from './users.service'
import { userFixture, createUserDtoFixture } from '../../test/fixtures/users'

describe('UsersService', () => {
  let service: UsersService
  let userRepository: Repository<User>

  const mockUserRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: mockUserRepository },
      ],
    }).compile()

    service = module.get<UsersService>(UsersService)
    userRepository = module.get<Repository<User>>(getRepositoryToken(User))
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('create', () => {
    it('should throw a conflict exception if the user already exists', async () => {
      mockUserRepository.findOne.mockResolvedValue({
        id: 1,
        email: 'test@example.com',
      })

      await expect(service.create(createUserDtoFixture)).rejects.toThrow(
        new ConflictException('Email already exists!'),
      )

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email: createUserDtoFixture.email },
      })
    })

    it('should create and return a new user when there is no duplicate', async () => {
      mockUserRepository.findOne.mockResolvedValue(null)

      const hashedPassword = 'hashedPassword'
      const passwordHashSpy = jest.spyOn(bcrypt, 'hash') as jest.Mock
      passwordHashSpy.mockResolvedValue(hashedPassword)

      mockUserRepository.create.mockReturnValue(userFixture)
      mockUserRepository.save.mockResolvedValue(userFixture)

      const result = await service.create(createUserDtoFixture)

      const { password: _password, ...expectedResult } = userFixture

      expect(result).toEqual(expectedResult)

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email: createUserDtoFixture.email },
      })
      expect(passwordHashSpy).toHaveBeenCalledWith(
        createUserDtoFixture.password,
        10,
      )
      expect(mockUserRepository.create).toHaveBeenCalledWith({
        email: createUserDtoFixture.email,
        password: hashedPassword,
        name: createUserDtoFixture.name,
      })
      expect(mockUserRepository.save).toHaveBeenCalledWith(userFixture)
    })
  })

  describe('getUserInfo', () => {
    it('should throw a not found exception if the user is not found', async () => {
      await expect(service.getUserInfo(123)).rejects.toThrow(
        new NotFoundException('User not found!'),
      )

      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { id: 123 },
      })
    })

    it('should return the user info', async () => {
      mockUserRepository.findOne.mockResolvedValue(userFixture)

      const result = await service.getUserInfo(123)

      const { password: _password, ...expectedResult } = userFixture

      expect(result).toEqual(expectedResult)
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: 123 },
      })
    })
  })
})
