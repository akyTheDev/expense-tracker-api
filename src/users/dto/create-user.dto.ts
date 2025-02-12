import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator'

export class CreateUserDto {
  @ApiProperty({
    description: 'The email of the user',
    example: 'user@example.com',
  })
  @IsEmail()
  email: string

  @ApiProperty({
    description: 'User password',
    example: 'superStrong123',
  })
  @IsNotEmpty()
  @MinLength(4)
  password: string

  @ApiProperty({
    description: 'User name',
    example: 'Name Surname',
  })
  @IsNotEmpty()
  @MinLength(3)
  name: string
}
