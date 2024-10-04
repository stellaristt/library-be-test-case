import { Injectable } from '@nestjs/common';
import { BookRepository } from './book.repository';

@Injectable()
export class BookService {
  constructor(private readonly bookRepository: BookRepository) {}

  async getAllAvailableBooks() {
    return this.bookRepository.findAvailableBooks();
  }
}
