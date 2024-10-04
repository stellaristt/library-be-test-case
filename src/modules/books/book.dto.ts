export class BookCheckResponseDto {
  code: string;
  title: string;
  author: string;
  stock: number;

  constructor(code: string, title: string, author: string, stock: number) {
    this.code = code;
    this.title = title;
    this.author = author;
    this.stock = stock;
  }
}
