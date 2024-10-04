import { Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { PrismaService } from '../../prisma/prisma.service';
import { TransactionService } from './transaction.service';
import { TransactionRepository } from './transaction.repository';
import { MemberService } from '../members/member.service';
import { BookService } from '../books/book.service';
import { MemberRepository } from '../members/member.repository';
import { BookRepository } from '../books/book.repository';

@Module({
  controllers: [TransactionController],
  providers: [
    PrismaService,
    TransactionService,
    TransactionRepository,
    MemberService,
    BookService,
    MemberRepository,
    BookRepository,
  ],
})
export class TransactionModule {}
