import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import * as bcrypt from 'bcrypt'
import { Repository } from 'typeorm'

import { CreateUserDto } from './dto/create-user.dto'
import { UserDto } from './dto/user.dto'
import { User } from './entities/user.entity'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserDto> {
    const { email, name, password } = createUserDto
    await this.checkExistingUsersForConflict(email)
    const hashedPassword = await this.generateHashedPassword(password)
    const newUser = await this.insertUserToDb({
      email,
      name,
      password: hashedPassword,
    })
    return {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
    }
  }

  async getUserInfo(userId: number): Promise<UserDto> {
    const userInfo = await this.getUserInfoById(userId)
    return {
      id: userInfo.id,
      email: userInfo.email,
      name: userInfo.name,
    }
  }

  /**
   * Check whether the email already exists in the database.
   *
   * @param email The email to check.
   * @returns Void.
   * @throws ConflictException if the email already exists.
   */
  private async checkExistingUsersForConflict(email: string): Promise<void> {
    const existingUser = await this.userRepository.findOne({ where: { email } })

    if (existingUser) {
      throw new ConflictException('Email already exists!')
    }
  }

  /**
   * Generate a hashed password from the given password.
   *
   * @param password The password to hash.
   * @returns The hashed password.
   */
  private async generateHashedPassword(password: string): Promise<string> {
    const saltRounds = 10
    return bcrypt.hash(password, saltRounds)
  }

  /**
   * Insert the given user info to db.
   *
   * @param user The user info to insert.
   * @returns The inserted user details.
   */
  private async insertUserToDb(user: Partial<User>): Promise<User> {
    return this.userRepository.save(this.userRepository.create(user))
  }

  /**
   * Get the user info by filtering with id.
   *
   * @param userId The user id to filter.
   * @returns The user info.
   * @throws NotFoundException if the user is not found.
   */
  private async getUserInfoById(userId: number): Promise<User> {
    const userInfo = await this.userRepository.findOne({
      where: { id: userId },
    })

    if (!userInfo) {
      throw new NotFoundException('User not found!')
    }

    return userInfo
  }
}
