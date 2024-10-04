import { Injectable } from '@nestjs/common';
import { MemberRepository } from './member.repository';
import { MemberCheckResponseDto } from './member.dto';

@Injectable()
export class MemberService {
  constructor(private readonly memberRepository: MemberRepository) {}

  async getMembersWithBorrowedBooks(): Promise<MemberCheckResponseDto[]> {
    const members =
      await this.memberRepository.findAllMembersWithBorrowedBooks();

    return members.map((member) => {
      const borrowedBooksCount = member.Transactions.length;
      return new MemberCheckResponseDto(
        member.code,
        member.name,
        borrowedBooksCount,
      );
    });
  }
}
