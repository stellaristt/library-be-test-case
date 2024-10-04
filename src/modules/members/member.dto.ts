export class MemberCheckResponseDto {
  code: string;
  name: string;
  borrowedBooksCount: number;

  constructor(code: string, name: string, borrowedBooksCount: number) {
    this.code = code;
    this.name = name;
    this.borrowedBooksCount = borrowedBooksCount;
  }
}
