import { Controller, Get } from '@nestjs/common';
import { MemberService } from './member.service';
import { MemberCheckResponseDto } from './member.dto';

@Controller('members')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Get()
  async checkMembers(): Promise<MemberCheckResponseDto[]> {
    return this.memberService.getMembersWithBorrowedBooks();
  }
}
