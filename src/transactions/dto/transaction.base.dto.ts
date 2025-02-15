import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
  IsDate,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator'

export class BaseTransactionDto {
  @ApiProperty({
    description: 'The description of the transaction',
    example: 'Coffee Shop',
  })
  @IsString()
  description: string

  @ApiProperty({
    description: 'The amount of the transaction',
    example: 123.99,
  })
  @IsPositive()
  @IsNumber()
  amount: number

  @ApiProperty({
    description: 'The card id of the transaction.',
    example: 1001,
  })
  @Type(() => Number)
  @IsPositive()
  @IsInt()
  cardId: number

  @ApiProperty({
    description: 'Transaction date with timezone in ISO8601 format (UTC).',
    example: '2025-02-14T12:00:00Z',
  })
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  date: Date
}
