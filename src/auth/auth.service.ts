import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import * as bcrypt from 'bcrypt'
import { Repository } from 'typeorm'

import { LoginDto, TokenDto } from './dto'
import { User } from '../users/entities/user.entity'

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto): Promise<TokenDto> {
    const { email, password } = loginDto
    const user = await this.findUserByEmail(email)
    await this.checkPassword(password, user.password)
    const token = await this.generateToken(user.id)

    return {
      token,
      token_type: 'bearer',
    }
  }

  /**
   * Find the user by email.
   *
   * @param email The email of the user to filter.
   * @returns The user info.
   * @throws UnauthorizedException If the user is not found.
   */
  private async findUserByEmail(email: string): Promise<User> {
    const userInfo = await this.userRepository.findOne({ where: { email } })

    if (!userInfo) {
      throw new UnauthorizedException()
    }
    return userInfo
  }

  /**
   * Compare the given password with the hashed password.
   *
   * @param password The password to compare from user.
   * @param hashedPassword The hashed password from db.
   * @returns Void
   * @throws UnauthorizedException If the password is invalid.
   */
  private async checkPassword(
    password: string,
    hashedPassword: string,
  ): Promise<void> {
    const checkPasswordResult = await bcrypt.compare(password, hashedPassword)
    if (!checkPasswordResult) {
      throw new UnauthorizedException()
    }
  }

  /**
   * Generate a new bearer token by using the given user id.
   *
   * @param userId The user id to generate a token.
   * @returns The generated token.
   */
  private async generateToken(userId: number): Promise<string> {
    return await this.jwtService.signAsync({ userId })
  }
}
