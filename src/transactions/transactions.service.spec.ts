import { NotFoundException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { Transaction } from './entities/transaction.entity'
import { TransactionsService } from './transactions.service'
import { creditCardsFixture } from '../../test/fixtures/credit-cards'
import {
  createTransactionFixture,
  transactions,
  transactionsDb,
} from '../../test/fixtures/transactions'
import { CreditCard } from '../credit-cards/entities/credit-card.entity'

describe('TransactionsService', () => {
  let service: TransactionsService
  let cardRepository: Repository<CreditCard>
  let transactionRepository: Repository<Transaction>

  const mockCardRepository = {
    findOne: jest.fn().mockResolvedValue(undefined),
  }

  const mockTransactionCreateQueryBuilder = {
    innerJoinAndSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    getMany: jest.fn(),
  }

  const mockTransactionRepository = {
    save: jest.fn(),
    create: jest.fn(),
    createQueryBuilder: jest.fn(() => mockTransactionCreateQueryBuilder),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(Transaction),
          useValue: mockTransactionRepository,
        },
        {
          provide: getRepositoryToken(CreditCard),
          useValue: mockCardRepository,
        },

        TransactionsService,
      ],
    }).compile()

    service = module.get<TransactionsService>(TransactionsService)
    cardRepository = module.get<Repository<CreditCard>>(
      getRepositoryToken(CreditCard),
    )
    transactionRepository = module.get<Repository<Transaction>>(
      getRepositoryToken(Transaction),
    )
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('create', () => {
    it('should throw not found error if the card is not found', async () => {
      await expect(
        service.create(1234, createTransactionFixture),
      ).rejects.toThrow(new NotFoundException('Credit card not found!'))

      expect(cardRepository.findOne).toHaveBeenCalledWith({
        where: { id: 23, user: { id: 1234 } },
      })
      expect(transactionRepository.save).not.toHaveBeenCalled()
      expect(transactionRepository.create).not.toHaveBeenCalled()
    })

    it('should correctly insert the transaction', async () => {
      mockCardRepository.findOne.mockResolvedValue(creditCardsFixture[0])

      await service.create(987, createTransactionFixture)

      expect(mockCardRepository.findOne).toHaveBeenCalledWith({
        where: { id: 23, user: { id: 987 } },
      })

      expect(transactionRepository.create).toHaveBeenCalledWith({
        ...createTransactionFixture,
        creditCard: creditCardsFixture[0],
      })
      expect(transactionRepository.save).toHaveBeenCalled()
    })
  })

  describe('fetchAllTransactions', () => {
    it('should throw not found error', async () => {
      mockTransactionCreateQueryBuilder.getMany.mockResolvedValue([])

      await expect(service.fetchAllTransactions(1234)).rejects.toThrow(
        new NotFoundException('No transactions found!'),
      )
    })

    it('should return all transactions', async () => {
      mockTransactionCreateQueryBuilder.getMany.mockResolvedValue(
        transactionsDb,
      )

      const result = await service.fetchAllTransactions(123)

      expect(result).toEqual(transactions)

      expect(transactionRepository.createQueryBuilder).toHaveBeenCalledWith(
        'transaction',
      )
      expect(
        mockTransactionCreateQueryBuilder.innerJoinAndSelect,
      ).toHaveBeenCalledWith('transaction.creditCard', 'creditCard')
      expect(mockTransactionCreateQueryBuilder.where).toHaveBeenCalledWith(
        'creditCard.user = :userId',
        { userId: 123 },
      )
      expect(mockTransactionCreateQueryBuilder.andWhere).not.toHaveBeenCalled()
    })

    it('should return the transactions of a card', async () => {
      mockTransactionCreateQueryBuilder.getMany.mockResolvedValue(
        transactionsDb,
      )

      const result = await service.fetchAllTransactions(123, 987)

      expect(result).toEqual(transactions)

      expect(transactionRepository.createQueryBuilder).toHaveBeenCalledWith(
        'transaction',
      )
      expect(
        mockTransactionCreateQueryBuilder.innerJoinAndSelect,
      ).toHaveBeenCalledWith('transaction.creditCard', 'creditCard')
      expect(mockTransactionCreateQueryBuilder.where).toHaveBeenCalledWith(
        'creditCard.user = :userId',
        { userId: 123 },
      )
      expect(mockTransactionCreateQueryBuilder.andWhere).toHaveBeenCalledWith(
        'creditCard.id = :cardId',
        { cardId: 987 },
      )
      expect(mockTransactionCreateQueryBuilder.andWhere).toHaveBeenCalledTimes(
        1,
      )
    })
  })

  describe('fetchTransaction', () => {
    it('should throw not found error', async () => {
      mockTransactionCreateQueryBuilder.getMany.mockResolvedValue([])

      await expect(service.fetchTransaction(1234, 12)).rejects.toThrow(
        new NotFoundException('No transactions found!'),
      )
    })

    it('should return the specific transaction', async () => {
      mockTransactionCreateQueryBuilder.getMany.mockResolvedValue([
        transactionsDb[0],
      ])

      const result = await service.fetchTransaction(123, 98)

      expect(result).toEqual(transactions[0])

      expect(transactionRepository.createQueryBuilder).toHaveBeenCalledWith(
        'transaction',
      )
      expect(
        mockTransactionCreateQueryBuilder.innerJoinAndSelect,
      ).toHaveBeenCalledWith('transaction.creditCard', 'creditCard')
      expect(mockTransactionCreateQueryBuilder.where).toHaveBeenCalledWith(
        'creditCard.user = :userId',
        { userId: 123 },
      )
      expect(mockTransactionCreateQueryBuilder.andWhere).toHaveBeenCalledTimes(
        1,
      )
      expect(mockTransactionCreateQueryBuilder.andWhere).toHaveBeenCalledWith(
        'transaction.id = :transactionId',
        {
          transactionId: 98,
        },
      )
    })
  })
})
