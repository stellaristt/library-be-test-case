import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class MemberRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAllMembersWithBorrowedBooks() {
    return this.prisma.member.findMany({
      include: {
        Transactions: {
          where: {
            isReturned: false,
          },
        },
      },
    });
  }

  async findMemberByCode(memberCode: string) {
    return this.prisma.member.findUnique({ where: { code: memberCode } });
  }

  async penalizeMember(memberCode: string, penaltyEndDate: Date) {
    return this.prisma.member.update({
      where: { code: memberCode },
      data: {
        isPenalized: true,
        penaltyEndDate,
      },
    });
  }
}
