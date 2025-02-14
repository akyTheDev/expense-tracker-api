import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber } from 'class-validator'

export class CreditCardDto {
  @ApiProperty({
    description: 'Unique identifier for the credit card',
    example: 1,
  })
  @IsNumber()
  id: number

  @ApiProperty({
    description: 'The name of the card to describe',
    example: '...Bank',
  })
  @IsNotEmpty()
  name: string
}
