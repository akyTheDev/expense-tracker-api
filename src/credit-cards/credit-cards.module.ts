import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { CreditCardsController } from './credit-cards.controller'
import { CreditCardsService } from './credit-cards.service'
import { CreditCard } from './entities/credit-card.entity'

@Module({
  imports: [TypeOrmModule.forFeature([CreditCard])],
  controllers: [CreditCardsController],
  providers: [CreditCardsService],
})
export class CreditCardsModule {}
