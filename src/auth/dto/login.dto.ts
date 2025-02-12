import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator'

export class LoginDto {
  @ApiProperty({
    description: 'The email of the user',
    example: 'user@example.com',
  })
  @IsEmail()
  email: string

  @ApiProperty({
    description: 'The password of the user',
    example: 'superStrong123',
  })
  @IsNotEmpty()
  @MinLength(4)
  password: string
}
