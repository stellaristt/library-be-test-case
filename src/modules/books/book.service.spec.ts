import { Test, TestingModule } from '@nestjs/testing';
import { BookService } from './book.service';
import { BookRepository } from './book.repository';

describe('BookService', () => {
  let bookService: BookService;
  let bookRepository: BookRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookService,
        {
          provide: BookRepository,
          useValue: {
            findAvailableBooks: jest.fn(),
          },
        },
      ],
    }).compile();

    bookService = module.get<BookService>(BookService);
    bookRepository = module.get<BookRepository>(BookRepository);
  });

  it('should be defined', () => {
    expect(bookService).toBeDefined();
  });

  describe('getAllAvailableBooks', () => {
    it('should return all available books', async () => {
      const mockBooks = [
        {
          code: 'JK-45',
          title: 'Harry Potter',
          author: 'J.K Rowling',
          stock: 1,
        },
      ];
      jest
        .spyOn(bookRepository, 'findAvailableBooks')
        .mockResolvedValue(mockBooks);

      const result = await bookService.getAllAvailableBooks();

      expect(result).toEqual(mockBooks);
      expect(bookRepository.findAvailableBooks).toHaveBeenCalled();
    });
  });
});
