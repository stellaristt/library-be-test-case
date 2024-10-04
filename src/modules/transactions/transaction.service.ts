import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { TransactionRepository } from './transaction.repository';
import { differenceInDays } from 'date-fns';
import { MemberRepository } from '../members/member.repository';
import { BookRepository } from '../books/book.repository';

@Injectable()
export class TransactionService {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly memberRepository: MemberRepository,
    private readonly bookRepository: BookRepository,
  ) {}

  async borrowBook(memberCode: string, bookCode: string) {
    const member = await this.memberRepository.findMemberByCode(memberCode);

    if (member.isPenalized) {
      throw new HttpException(
        'Member is currently penalized.',
        HttpStatus.FORBIDDEN,
      );
    }

    const borrowedBooksCount =
      await this.transactionRepository.countBorrowedBooks(memberCode);

    if (borrowedBooksCount >= 2) {
      throw new HttpException(
        'Member cannot borrow more than 2 books.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const book = await this.bookRepository.findBookByCode(bookCode);

    if (book.stock < 1) {
      throw new HttpException(
        'This book is currently borrowed by another member.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const transaction = await this.transactionRepository.createTransaction(
      memberCode,
      bookCode,
    );

    await this.bookRepository.decreaseBookStock(bookCode);

    return transaction;
  }

  async returnBook(transactionId) {
    const id = parseInt(transactionId);
    const transaction =
      await this.transactionRepository.findTransactionById(id);

    if (!transaction) {
      throw new HttpException('Transaction not found.', HttpStatus.NOT_FOUND);
    }

    if (transaction.isReturned) {
      throw new HttpException(
        'This book has already been returned.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const today = new Date();
    const borrowDate = transaction.borrowDate;
    const daysLate = differenceInDays(today, borrowDate) - 7;

    await this.transactionRepository.updateTransactionAsReturned(id, today);

    await this.bookRepository.increaseBookStock(transaction.bookCode);

    if (daysLate > 0) {
      await this.memberRepository.penalizeMember(
        transaction.memberCode,
        new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000),
      );
    }

    return {
      message: 'Book returned successfully',
      daysLate: daysLate > 0 ? daysLate : 0,
      penalty: daysLate > 0 ? 'Penalized' : 'No penalty',
    };
  }
}
