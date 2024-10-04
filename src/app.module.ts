import { Module } from '@nestjs/common';
import { MemberModule } from './modules/members/member.module';
import { BookModule } from './modules/books/book.module';
import { TransactionModule } from './modules/transactions/transaction.module';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [MemberModule, BookModule, TransactionModule],
  providers: [PrismaService],
})
export class AppModule {}
