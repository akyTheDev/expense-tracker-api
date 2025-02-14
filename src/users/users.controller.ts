import {
  Controller,
  Get,
  Post,
  Body,
  HttpStatus,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger'

import { UserDto } from './dto'
import { CreateUserDto } from './dto/create-user.dto'
import { UsersService } from './users.service'
import { GetUserId, JwtAuthGuard } from '../auth'

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({
    summary: 'Register',
    description:
      'This endpoint creates a new user and returns the created user data.',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The user has been successfully created',
    type: UserDto,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'User already exists.',
  })
  async create(@Body() createUserDto: CreateUserDto): Promise<UserDto> {
    return this.usersService.create(createUserDto)
  }

  @Get('me')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Get user info.',
    description: 'This endpoint returns the current user info.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The user info has been successfully fetched',
    type: UserDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The user info could not be fetched!',
  })
  async getUserInfo(@GetUserId() userId: number) {
    return this.usersService.getUserInfo(userId)
  }
}
