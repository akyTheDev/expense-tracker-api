import { Body, Controller, HttpStatus, Post } from '@nestjs/common'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'

import { AuthService } from './auth.service'
import { LoginDto, TokenDto } from './dto'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({
    summary: 'Login',
    description: 'This endpoint generates a JWT token.',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The user has logged in successfully.',
    type: TokenDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  login(@Body() loginDto: LoginDto): Promise<TokenDto> {
    return this.authService.login(loginDto)
  }
}
