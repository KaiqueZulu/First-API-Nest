import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { IsPublic } from 'src/user/is-public.decorator';
import { TransactionService } from './transaction.service';
import CreateTransactionDTO from './types/create-transaction.dto';

@IsPublic()
@ApiTags('Transaction')
@Controller('transaction')
export class TransactionController {
  constructor(private transactionService: TransactionService) {}
  @Post()
  createTransaction(@Body() createTransactionDTO: CreateTransactionDTO) {
    return this.transactionService.createTransaction(createTransactionDTO);
  }
}
