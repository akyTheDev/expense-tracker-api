import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { KafkaModule } from '../kafka/kafka.module'
import { Transaction } from './entities/transaction.entity'
import { TransactionsController } from './transactions.controller'
import { TransactionsService } from './transactions.service'
import { CreditCard } from '../credit-cards/entities/credit-card.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Transaction, CreditCard]), KafkaModule],
  controllers: [TransactionsController],
  providers: [TransactionsService],
})
export class TransactionsModule {}
