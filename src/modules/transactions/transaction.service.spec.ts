import { Test, TestingModule } from '@nestjs/testing';
import { TransactionService } from './transaction.service';
import { TransactionRepository } from './transaction.repository';
import { MemberRepository } from '../members/member.repository';
import { BookRepository } from '../books/book.repository';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('TransactionService', () => {
  let transactionService: TransactionService;
  let transactionRepository: TransactionRepository;
  let memberRepository: MemberRepository;
  let bookRepository: BookRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        {
          provide: TransactionRepository,
          useValue: {
            countBorrowedBooks: jest.fn(),
            createTransaction: jest.fn(),
            findTransactionById: jest.fn(),
            updateTransactionAsReturned: jest.fn(),
          },
        },
        {
          provide: MemberRepository,
          useValue: {
            findMemberByCode: jest.fn(),
            penalizeMember: jest.fn(),
          },
        },
        {
          provide: BookRepository,
          useValue: {
            findBookByCode: jest.fn(),
            decreaseBookStock: jest.fn(),
            increaseBookStock: jest.fn(),
          },
        },
      ],
    }).compile();

    transactionService = module.get<TransactionService>(TransactionService);
    transactionRepository = module.get<TransactionRepository>(
      TransactionRepository,
    );
    memberRepository = module.get<MemberRepository>(MemberRepository);
    bookRepository = module.get<BookRepository>(BookRepository);
  });

  it('should be defined', () => {
    expect(transactionService).toBeDefined();
  });

  describe('borrowBook', () => {
    it('should throw an error if member is penalized', async () => {
      const memberCode = 'M001';
      const bookCode = 'B001';
      jest.spyOn(memberRepository, 'findMemberByCode').mockResolvedValue({
        name: 'Rohsyam Sidik',
        code: memberCode,
        isPenalized: true,
        penaltyEndDate: new Date(),
      });

      await expect(
        transactionService.borrowBook(memberCode, bookCode),
      ).rejects.toThrow(
        new HttpException(
          'Member is currently penalized.',
          HttpStatus.FORBIDDEN,
        ),
      );
    });

    it('should throw an error if member has borrowed 2 books', async () => {
      const memberCode = 'M001';
      const bookCode = 'B001';
      jest.spyOn(memberRepository, 'findMemberByCode').mockResolvedValue({
        name: 'Rohsyam Sidik',
        code: memberCode,
        isPenalized: false,
        penaltyEndDate: new Date(),
      });
      jest
        .spyOn(transactionRepository, 'countBorrowedBooks')
        .mockResolvedValue(2);

      await expect(
        transactionService.borrowBook(memberCode, bookCode),
      ).rejects.toThrow(
        new HttpException(
          'Member cannot borrow more than 2 books.',
          HttpStatus.BAD_REQUEST,
        ),
      );
    });

    it('should throw an error if book stock is not available', async () => {
      const memberCode = 'M001';
      const bookCode = 'B001';
      jest.spyOn(memberRepository, 'findMemberByCode').mockResolvedValue({
        name: 'Rohsyam Sidik',
        code: memberCode,
        isPenalized: false,
        penaltyEndDate: new Date(),
      });
      jest
        .spyOn(transactionRepository, 'countBorrowedBooks')
        .mockResolvedValue(1);
      jest.spyOn(bookRepository, 'findBookByCode').mockResolvedValue({
        code: bookCode,
        title: 'The Interstellar Project',
        author: 'Christoper Nolan',
        stock: 0,
      });

      await expect(
        transactionService.borrowBook(memberCode, bookCode),
      ).rejects.toThrow(
        new HttpException(
          'This book is currently borrowed by another member.',
          HttpStatus.BAD_REQUEST,
        ),
      );
    });

    it('should create a transaction and decrease book stock', async () => {
      const memberCode = 'M001';
      const bookCode = 'B001';
      const transactionMock = {
        id: 1,
        memberCode,
        bookCode,
        borrowDate: new Date(),
        returnDate: null,
        isReturned: false,
      };

      jest.spyOn(memberRepository, 'findMemberByCode').mockResolvedValue({
        name: 'Rohsyam Sidik',
        code: memberCode,
        isPenalized: false,
        penaltyEndDate: new Date(),
      });
      jest
        .spyOn(transactionRepository, 'countBorrowedBooks')
        .mockResolvedValue(1);
      jest.spyOn(bookRepository, 'findBookByCode').mockResolvedValue({
        code: bookCode,
        title: 'The Interstellar Project',
        author: 'Christoper Nolan',
        stock: 1,
      });
      jest
        .spyOn(transactionRepository, 'createTransaction')
        .mockResolvedValue(transactionMock);
      jest
        .spyOn(bookRepository, 'decreaseBookStock')
        .mockResolvedValue(undefined);

      const result = await transactionService.borrowBook(memberCode, bookCode);

      expect(result).toEqual(transactionMock);
      expect(bookRepository.decreaseBookStock).toHaveBeenCalledWith(bookCode);
    });
  });

  describe('returnBook', () => {
    it('should throw an error if transaction is not found', async () => {
      const transactionId = '1';
      jest
        .spyOn(transactionRepository, 'findTransactionById')
        .mockResolvedValue(null);

      await expect(
        transactionService.returnBook(transactionId),
      ).rejects.toThrow(
        new HttpException('Transaction not found.', HttpStatus.NOT_FOUND),
      );
    });

    it('should throw an error if book has already been returned', async () => {
      const transactionId = '1';
      const transactionMock = {
        id: 1,
        borrowDate: new Date(),
        returnDate: new Date(),
        isReturned: true,
        memberCode: 'M001',
        bookCode: 'B001',
      };
      jest
        .spyOn(transactionRepository, 'findTransactionById')
        .mockResolvedValue(transactionMock);

      await expect(
        transactionService.returnBook(transactionId),
      ).rejects.toThrow(
        new HttpException(
          'This book has already been returned.',
          HttpStatus.BAD_REQUEST,
        ),
      );
    });

    it('should update transaction as returned and increase book stock', async () => {
      const transactionId = '1';
      const today = new Date();
      const transactionMock = {
        id: 1,
        borrowDate: new Date(today.getTime() - 10 * 24 * 60 * 60 * 1000),
        returnDate: null,
        isReturned: false,
        memberCode: 'M001',
        bookCode: 'B001',
      };

      jest
        .spyOn(transactionRepository, 'findTransactionById')
        .mockResolvedValue(transactionMock);
      jest
        .spyOn(transactionRepository, 'updateTransactionAsReturned')
        .mockResolvedValue(undefined);
      jest
        .spyOn(bookRepository, 'increaseBookStock')
        .mockResolvedValue(undefined);
      jest
        .spyOn(memberRepository, 'penalizeMember')
        .mockResolvedValue(undefined);

      const result = await transactionService.returnBook(transactionId);

      expect(result).toEqual({
        message: 'Book returned successfully',
        daysLate: 3,
        penalty: 'Penalized',
      });
      expect(bookRepository.increaseBookStock).toHaveBeenCalledWith(
        transactionMock.bookCode,
      );
      expect(memberRepository.penalizeMember).toHaveBeenCalled();
    });

    it('should not penalize if book is returned on time', async () => {
      const transactionId = '1';
      const today = new Date();
      const transactionMock = {
        id: 1,
        borrowDate: new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000),
        returnDate: null,
        isReturned: false,
        memberCode: 'M001',
        bookCode: 'B001',
      };

      jest
        .spyOn(transactionRepository, 'findTransactionById')
        .mockResolvedValue(transactionMock);
      jest
        .spyOn(transactionRepository, 'updateTransactionAsReturned')
        .mockResolvedValue(undefined);
      jest
        .spyOn(bookRepository, 'increaseBookStock')
        .mockResolvedValue(undefined);

      const result = await transactionService.returnBook(transactionId);

      expect(result).toEqual({
        message: 'Book returned successfully',
        daysLate: 0,
        penalty: 'No penalty',
      });
      expect(bookRepository.increaseBookStock).toHaveBeenCalledWith(
        transactionMock.bookCode,
      );
      expect(memberRepository.penalizeMember).not.toHaveBeenCalled();
    });
  });
});
