import { Test, TestingModule } from '@nestjs/testing'

import { CreditCardsController } from './credit-cards.controller'
import { CreditCardsService } from './credit-cards.service'
import {
  createCreditCardFixture,
  creditCardsFixture,
} from '../../test/fixtures/credit-cards'

describe('CreditCardsController', () => {
  let controller: CreditCardsController
  let service: CreditCardsService

  const mockCardService = {
    create: jest.fn(),
    deleteCard: jest.fn(),
    fetchAllCards: jest.fn().mockResolvedValue(creditCardsFixture),
    fetchCard: jest.fn().mockResolvedValue(createCreditCardFixture[0]),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CreditCardsController],
      providers: [
        {
          provide: CreditCardsService,
          useValue: mockCardService,
        },
      ],
    }).compile()

    controller = module.get<CreditCardsController>(CreditCardsController)
    service = module.get<CreditCardsService>(CreditCardsService)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('create', () => {
    it('should call service correctly', async () => {
      await controller.create(987, createCreditCardFixture)

      expect(service.create).toHaveBeenCalledWith(987, createCreditCardFixture)
    })
  })

  describe('fetchAllCreditCards', () => {
    it('should call service correctly', async () => {
      const result = await controller.fetchAllCreditCards(987)

      expect(result).toEqual(creditCardsFixture)
      expect(service.fetchAllCards).toHaveBeenCalledWith(987)
    })
  })

  describe('fetchCard', () => {
    it('should call service correctly', async () => {
      const result = await controller.fetchCard(987, '123')

      expect(result).toEqual(createCreditCardFixture[0])
      expect(service.fetchCard).toHaveBeenCalledWith(987, 123)
    })
  })

  describe('delete', () => {
    it('should call service correctly', async () => {
      await controller.deleteCard(987, '456')

      expect(service.deleteCard).toHaveBeenCalledWith(987, 456)
    })
  })
})
