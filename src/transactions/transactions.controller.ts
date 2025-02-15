import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpStatus,
  Get,
  Query,
  Param,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger'

import { GetUserId, JwtAuthGuard } from '../auth'
import { TransactionDto } from './dto'
import { CreateTransactionDto } from './dto/create-transaction.dto'
import { TransactionsService } from './transactions.service'
import { OptionalParseIntPipe } from '../common/pipes'

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Create a new transaction to the card.',
    description: 'This endpoint creates a new transaction to the credit card.',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The transaction has been successfully created.',
    type: undefined,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Credit card not found!',
  })
  async create(
    @GetUserId() userId: number,
    @Body() createTransactionDto: CreateTransactionDto,
  ) {
    await this.transactionsService.create(userId, createTransactionDto)
    return {
      message: 'Ok',
    }
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Get all transactions of the user.',
    description: 'Finds all the transactions of the user.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully fetched transactions.',
    type: TransactionDto,
    isArray: true,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Transactions not found',
  })
  @ApiQuery({
    name: 'cardId',
    type: Number,
    required: false,
    description:
      'The credit card ID to filter transactions. Provide this to return transactions for a specific card.',
  })
  async fetchAllTransactions(
    @GetUserId() userId: number,
    @Query('cardId', OptionalParseIntPipe) cardId?: number,
  ): Promise<TransactionDto[]> {
    return this.transactionsService.fetchAllTransactions(userId, cardId)
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Get the requested transaction.',
    description: 'Finds one transaction.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully fetched transaction.',
    type: TransactionDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Transactions not found',
  })
  async fetchOneTransaction(
    @GetUserId() userId: number,
    @Param('id') transactionId: string,
  ): Promise<TransactionDto> {
    return this.transactionsService.fetchTransaction(userId, +transactionId)
  }
}
