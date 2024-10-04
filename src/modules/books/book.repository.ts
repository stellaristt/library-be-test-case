import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class BookRepository {
  constructor(private readonly prisma: PrismaService) {}
  async findAvailableBooks() {
    return this.prisma.book.findMany();
  }

  async findBookByCode(bookCode: string) {
    return this.prisma.book.findUnique({ where: { code: bookCode } });
  }

  async decreaseBookStock(bookCode: string) {
    return this.prisma.book.update({
      where: { code: bookCode },
      data: {
        stock: {
          decrement: 1,
        },
      },
    });
  }

  async increaseBookStock(bookCode: string) {
    return this.prisma.book.update({
      where: { code: bookCode },
      data: {
        stock: {
          increment: 1,
        },
      },
    });
  }
}
