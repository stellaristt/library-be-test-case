import { Module } from '@nestjs/common';
import { BookController } from './book.controller';
import { PrismaService } from '../../prisma/prisma.service';
import { BookService } from './book.service';
import { BookRepository } from './book.repository';

@Module({
  controllers: [BookController],
  providers: [PrismaService, BookService, BookRepository],
})
export class BookModule {}
