import { Module } from '@nestjs/common';
import { StatementService } from './statement.service';
import { StatementController } from './statement.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import Transaction from 'src/transaction/transaction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction])],
  providers: [StatementService],
  controllers: [StatementController],
})
export class StatementModule {}
