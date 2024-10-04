import { Controller, Param, Post } from '@nestjs/common';
import { TransactionService } from './transaction.service';

@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post('borrow/:memberCode/:bookCode')
  async borrowBook(
    @Param('memberCode') memberCode: string,
    @Param('bookCode') bookCode: string,
  ) {
    return this.transactionService.borrowBook(memberCode, bookCode);
  }

  @Post('return/:transactionId')
  async returnBook(@Param('transactionId') transactionId: number) {
    return this.transactionService.returnBook(transactionId);
  }
}
