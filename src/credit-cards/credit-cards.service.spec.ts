import { NotFoundException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { CreditCardsService } from './credit-cards.service'
import { CreditCard } from './entities/credit-card.entity'
import { createCreditCardFixture } from '../../test/fixtures/credit-cards/create-credit-card.fixture'
import { creditCardsFixture } from '../../test/fixtures/credit-cards/credit-cards.fixture'

describe('CreditCardsService', () => {
  let service: CreditCardsService
  let cardRepository: Repository<CreditCard>

  const mockCardRepository = {
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreditCardsService,
        {
          provide: getRepositoryToken(CreditCard),
          useValue: mockCardRepository,
        },
      ],
    }).compile()

    service = module.get<CreditCardsService>(CreditCardsService)
    cardRepository = module.get<Repository<CreditCard>>(
      getRepositoryToken(CreditCard),
    )
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('create', () => {
    it('should create the credit card', async () => {
      await service.create(123, createCreditCardFixture)

      expect(cardRepository.create).toHaveBeenCalledWith({
        ...createCreditCardFixture,
        user: {
          id: 123,
        },
      })
      expect(cardRepository.save).toHaveBeenCalled()
    })
  })

  describe('fetchAllCards', () => {
    it('should throw not found error', async () => {
      mockCardRepository.find.mockResolvedValue([])
      await expect(service.fetchAllCards(1234)).rejects.toThrow(
        new NotFoundException('Credit cards not found!'),
      )

      expect(mockCardRepository.find).toHaveBeenCalledWith({
        where: { user: { id: 1234 } },
      })
    })

    it('should return the credit cards', async () => {
      mockCardRepository.find.mockResolvedValue(creditCardsFixture)
      const result = await service.fetchAllCards(123)

      expect(result).toEqual(creditCardsFixture)
      expect(mockCardRepository.find).toHaveBeenCalledWith({
        where: { user: { id: 123 } },
      })
    })
  })

  describe('fetchCard', () => {
    it('should throw not found error', async () => {
      mockCardRepository.find.mockResolvedValue([])

      await expect(service.fetchCard(1234, 123)).rejects.toThrow(
        new NotFoundException('Credit cards not found!'),
      )

      expect(mockCardRepository.find).toHaveBeenCalledWith({
        where: { user: { id: 1234 }, id: 123 },
      })
    })
    it('should return the credit card', async () => {
      mockCardRepository.find.mockResolvedValue([creditCardsFixture[0]])
      const result = await service.fetchCard(123, 1)

      expect(result).toEqual(creditCardsFixture[0])
      expect(mockCardRepository.find).toHaveBeenCalledWith({
        where: { user: { id: 123 }, id: 1 },
      })
    })
  })

  describe('deleteCard', () => {
    it('should throw not found error', async () => {
      mockCardRepository.find.mockResolvedValue([])

      await expect(service.deleteCard(1234, 123)).rejects.toThrow(
        new NotFoundException('Credit cards not found!'),
      )

      expect(mockCardRepository.find).toHaveBeenCalledWith({
        where: { user: { id: 1234 }, id: 123 },
      })
      expect(mockCardRepository.delete).not.toHaveBeenCalled()
    })

    it('should delete the credit card', async () => {
      mockCardRepository.find.mockResolvedValue([creditCardsFixture[0]])
      await service.deleteCard(123, 987)

      expect(mockCardRepository.find).toHaveBeenCalledWith({
        where: { user: { id: 123 }, id: 987 },
      })
      expect(mockCardRepository.delete).toHaveBeenCalledWith(987)
    })
  })
})
