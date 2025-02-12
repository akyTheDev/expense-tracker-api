import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class TokenDto {
  @ApiProperty({
    description: 'The JWT token.',
  })
  @IsString()
  @IsNotEmpty()
  token: string

  @ApiProperty({
    description: 'The token type',
    example: 'bearer',
  })
  @IsNotEmpty()
  token_type: string
}
