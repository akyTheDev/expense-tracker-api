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
import { KafkaService } from '../kafka/kafka.service'

describe('TransactionsService', () => {
  let service: TransactionsService
  let cardRepository: Repository<CreditCard>
  let transactionRepository: Repository<Transaction>
  let kafkaService: KafkaService

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
        {
          provide: KafkaService,
          useValue: {
            sendMessage: jest.fn().mockResolvedValue(undefined),
          },
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
    kafkaService = module.get<KafkaService>(KafkaService)
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
      expect(kafkaService.sendMessage).not.toHaveBeenCalled()
    })

    it('should correctly insert the transaction', async () => {
      mockCardRepository.findOne.mockResolvedValue(creditCardsFixture[0])
      mockTransactionRepository.save.mockResolvedValue({
        id: 1234,
        date: new Date('2024-01-03T12:15:00Z'),
        amount: 123,
        description: 'Test transaction',
        creditCard: creditCardsFixture[0],
      })

      await service.create(987, createTransactionFixture)

      expect(mockCardRepository.findOne).toHaveBeenCalledWith({
        where: { id: 23, user: { id: 987 } },
      })

      expect(transactionRepository.create).toHaveBeenCalledWith({
        ...createTransactionFixture,
        creditCard: creditCardsFixture[0],
      })
      expect(transactionRepository.save).toHaveBeenCalled()
      expect(kafkaService.sendMessage).toHaveBeenCalledWith(
        'transaction.create',
        {
          userId: 987,
          date: new Date('2024-01-03T12:15:00Z'),
          amount: 123,
          description: 'Test transaction',
          cardId: 1,
        },
      )
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
