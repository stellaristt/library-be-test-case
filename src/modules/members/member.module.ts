import { Module } from '@nestjs/common';
import { MemberController } from './member.controller';
import { MemberService } from './member.service';
import { MemberRepository } from './member.repository';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [MemberController],
  providers: [MemberService, MemberRepository, PrismaService],
})
export class MemberModule {}
