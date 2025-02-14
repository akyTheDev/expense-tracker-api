import {
  Controller,
  Get,
  Post,
  Body,
  HttpStatus,
  UseGuards,
  Param,
  Delete,
  HttpCode,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger'

import { CreditCardsService } from './credit-cards.service'
import { GetUserId, JwtAuthGuard } from '../auth'
import { CreditCardDto } from './dto'
import { CreateCreditCardDto } from './dto/create-credit-card.dto'

@Controller('credit-cards')
export class CreditCardsController {
  constructor(private readonly creditCardsService: CreditCardsService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Create a new credit card',
    description: 'This endpoint creates a new credit card.',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The user has been successfully created',
    type: undefined,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  async create(
    @GetUserId() userId: number,
    @Body() createCreditCardDto: CreateCreditCardDto,
  ): Promise<void> {
    await this.creditCardsService.create(userId, createCreditCardDto)
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Get all credit cards of the user.',
    description: 'Finds all the credit cards of the user.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully fetched credit cards.',
    type: CreditCardDto,
    isArray: true,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Credit cards not found',
  })
  async fetchAllCreditCards(
    @GetUserId() userId: number,
  ): Promise<CreditCardDto[]> {
    return this.creditCardsService.fetchAllCards(userId)
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Get the requested credit card.',
    description: 'Finds the credit card of the user.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully fetched credit card.',
    type: CreditCardDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Credit cards not found',
  })
  fetchCard(@GetUserId() userId: number, @Param('id') cardId: string) {
    return this.creditCardsService.fetchCard(userId, +cardId)
  }

  @Delete(':id')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Delete the credit card.',
    description: 'Delete the credit card of the user.',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Successfully deleted credit card.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Credit cards not found',
  })
  deleteCard(@GetUserId() userId: number, @Param('id') cardId: string) {
    return this.creditCardsService.deleteCard(userId, +cardId)
  }
}
