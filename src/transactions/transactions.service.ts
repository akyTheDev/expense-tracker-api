import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { TransactionDto } from './dto'
import { CreateTransactionDto } from './dto/create-transaction.dto'
import { Transaction } from './entities/transaction.entity'
import { CreditCard } from '../credit-cards/entities/credit-card.entity'

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,

    @InjectRepository(CreditCard)
    private cardRepository: Repository<CreditCard>,
  ) {}

  async create(
    userId: number,
    createTransactionDto: CreateTransactionDto,
  ): Promise<void> {
    const creditCard = await this.fetchCard(userId, createTransactionDto.cardId)

    await this.transactionRepository.save(
      this.transactionRepository.create({
        ...createTransactionDto,
        creditCard,
      }),
    )
  }

  async fetchAllTransactions(
    userId: number,
    cardId?: number,
  ): Promise<TransactionDto[]> {
    return await this.fetchTransactions(userId, cardId, undefined)
  }

  async fetchTransaction(
    userId: number,
    transactionId: number,
  ): Promise<TransactionDto> {
    return (await this.fetchTransactions(userId, undefined, transactionId))[0]
  }

  /**
   * Fetch the credit card of the user from database.
   *
   * @param userId The user id to filter.
   * @param cardId The searched card id.
   * @returns The card information.
   * @throws {NotFoundException} If the card is not found.
   */
  private async fetchCard(userId: number, cardId: number): Promise<CreditCard> {
    const creditCard: CreditCard | undefined =
      await this.cardRepository.findOne({
        where: {
          id: cardId,
          user: {
            id: userId,
          },
        },
      })

    if (!creditCard) {
      throw new NotFoundException('Credit card not found!')
    }

    return creditCard
  }

  /**
   * Fetch the transactions of the user from database.
   *
   * @param userId The user id to filter.
   * @param cardId The card id to filter.
   * @param transactionId The transaction id to filter.
   * @returns The transactions of the user.
   * @throws {NotFoundException} if the user is not found.
   */
  private async fetchTransactions(
    userId: number,
    cardId?: number,
    transactionId?: number,
  ): Promise<TransactionDto[]> {
    const queryBuilder = this.transactionRepository
      .createQueryBuilder('transaction')
      .innerJoinAndSelect('transaction.creditCard', 'creditCard')
      .where('creditCard.user = :userId', { userId })

    if (cardId) {
      queryBuilder.andWhere('creditCard.id = :cardId', { cardId })
    }

    if (transactionId) {
      queryBuilder.andWhere('transaction.id = :transactionId', {
        transactionId,
      })
    }

    const transactions = await queryBuilder.getMany()

    if (!transactions || transactions.length == 0) {
      throw new NotFoundException('No transactions found!')
    }

    return transactions.map((tx) => ({
      id: tx.id,
      date: tx.date,
      amount: tx.amount,
      description: tx.description,
      cardId: tx.creditCard.id,
    }))
  }
}
