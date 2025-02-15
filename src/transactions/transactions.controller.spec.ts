import { Test, TestingModule } from '@nestjs/testing'

import { TransactionsController } from './transactions.controller'
import { TransactionsService } from './transactions.service'
import {
  createTransactionFixture,
  transactions,
} from '../../test/fixtures/transactions'

describe('TransactionsController', () => {
  let controller: TransactionsController
  let service: TransactionsService

  const serviceMock = {
    create: jest.fn().mockResolvedValue(undefined),
    fetchAllTransactions: jest.fn().mockResolvedValue(transactions),
    fetchTransaction: jest.fn().mockResolvedValue(transactions[0]),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsController],
      providers: [
        {
          provide: TransactionsService,
          useValue: serviceMock,
        },
      ],
    }).compile()

    controller = module.get<TransactionsController>(TransactionsController)
    service = module.get<TransactionsService>(TransactionsService)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('create', () => {
    it('should call service correctly', async () => {
      const result = await controller.create(123, createTransactionFixture)

      expect(result).toEqual({
        message: 'Ok',
      })

      expect(service.create).toHaveBeenCalledWith(123, createTransactionFixture)
    })
  })

  describe('fetchAllTransactions', () => {
    it('should call service function correctly', async () => {
      const result = await controller.fetchAllTransactions(123)

      expect(result).toEqual(transactions)
      expect(service.fetchAllTransactions).toHaveBeenCalledWith(123, undefined)
    })

    it('should call service function correctly if card is given', async () => {
      const result = await controller.fetchAllTransactions(123, 9)

      expect(result).toEqual(transactions)
      expect(service.fetchAllTransactions).toHaveBeenCalledWith(123, 9)
    })
  })

  describe('fetchOneTransaction', () => {
    it('should call service function correctly', async () => {
      const result = await controller.fetchOneTransaction(123, '2')

      expect(result).toEqual(transactions[0])
      expect(service.fetchTransaction).toHaveBeenCalledWith(123, 2)
    })
  })
})
