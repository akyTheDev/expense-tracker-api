import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class CreateCreditCardDto {
  @ApiProperty({
    description: 'The name of the card to describe',
    example: '...Bank',
  })
  @IsNotEmpty()
  name: string
}
