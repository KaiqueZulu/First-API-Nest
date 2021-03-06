import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import CreditCard from 'src/credit-card/credit-card.entity';
import { Repository } from 'typeorm';
import Transaction from './transaction.entity';
import CreateTransactionDTO from './types/create-transaction.dto';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectRepository(CreditCard)
    private creditCardRepository: Repository<CreditCard>,
  ) {}
  async createTransaction(createTransactionDTO: CreateTransactionDTO) {
    const { credit_card } = createTransactionDTO;
    const creditCard = await this.creditCardRepository.findOne({
      number: credit_card,
    });
    if (!creditCard) {
      throw new BadRequestException('Cartão de crédito não existe');
    }
    const hasLimit = creditCard.balance >= createTransactionDTO.value;
    if (!hasLimit) {
      throw new BadRequestException('Não possui limite disponivel');
    }
    const entity = this.transactionRepository.create({
      date: new Date().toISOString(),
      value: createTransactionDTO.value,
      credit_card: creditCard,
    });
    this.creditCardRepository.update(creditCard.id, {
      balance: creditCard.balance - createTransactionDTO.value,
    });
    return this.transactionRepository.save(entity);
  }
}
