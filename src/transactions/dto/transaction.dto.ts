import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsInt, IsPositive } from 'class-validator'

import { BaseTransactionDto } from './transaction.base.dto'

export class TransactionDto extends BaseTransactionDto {
  @ApiProperty({
    description: 'The card id of the transaction.',
    example: 1001,
  })
  @Type(() => Number)
  @IsPositive()
  @IsInt()
  id: number
}
