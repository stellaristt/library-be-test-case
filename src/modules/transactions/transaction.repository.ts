import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TransactionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async countBorrowedBooks(memberCode: string) {
    return this.prisma.transaction.count({
      where: { memberCode, isReturned: false },
    });
  }

  async createTransaction(memberCode: string, bookCode: string) {
    return this.prisma.transaction.create({
      data: {
        memberCode,
        bookCode,
        borrowDate: new Date(),
      },
    });
  }

  async findTransactionById(transactionId: number) {
    return this.prisma.transaction.findUnique({ where: { id: transactionId } });
  }

  async updateTransactionAsReturned(transactionId: number, returnDate: Date) {
    return this.prisma.transaction.update({
      where: { id: transactionId },
      data: {
        returnDate,
        isReturned: true,
      },
    });
  }
}
