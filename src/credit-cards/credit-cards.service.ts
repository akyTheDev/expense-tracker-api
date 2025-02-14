import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { CreditCardDto } from './dto'
import { CreateCreditCardDto } from './dto/create-credit-card.dto'
import { CreditCard } from './entities/credit-card.entity'
import { User } from '../users/entities/user.entity'

@Injectable()
export class CreditCardsService {
  constructor(
    @InjectRepository(CreditCard)
    private cardRepository: Repository<CreditCard>,
  ) {}

  async create(
    userId: number,
    createCreditCardDto: CreateCreditCardDto,
  ): Promise<void> {
    await this.cardRepository.save(
      this.cardRepository.create({
        ...createCreditCardDto,
        user: {
          id: userId,
        } as User,
      }),
    )
  }

  async fetchAllCards(userId: number): Promise<CreditCardDto[]> {
    return this.getCreditCardsFromDb(userId)
  }

  async fetchCard(userId: number, cardId: number): Promise<CreditCardDto> {
    return (await this.getCreditCardsFromDb(userId, cardId))[0]
  }

  async deleteCard(userId: number, cardId: number): Promise<void> {
    await this.getCreditCardsFromDb(userId, cardId)
    await this.cardRepository.delete(cardId)
  }

  /**
   * Get credit cards of the user from database.
   *
   * @param userId The user id to filter.
   * @param [cardId] The card id to filter
   * @returns The credit cards of the user.
   * @throws {NotFoundException} if the user is not found.
   */
  private async getCreditCardsFromDb(
    userId: number,
    cardId: number | undefined = undefined,
  ): Promise<CreditCard[]> {
    const queryParams: Record<string, number | Record<string, number>> = {
      user: {
        id: userId,
      },
    }

    if (cardId) {
      queryParams.id = cardId
    }

    const creditCards = await this.cardRepository.find({
      where: queryParams,
    })

    if (!creditCards || creditCards.length === 0) {
      throw new NotFoundException('Credit cards not found!')
    }

    return creditCards
  }
}
