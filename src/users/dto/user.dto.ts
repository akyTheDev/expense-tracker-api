import { ApiProperty } from '@nestjs/swagger'

export class UserDto {
  @ApiProperty({ description: 'Unique identifier for the user' })
  id: number

  @ApiProperty({ description: 'The email of the user' })
  email: string

  @ApiProperty({ description: 'User name' })
  name: string
}
