import { Test, TestingModule } from '@nestjs/testing';
import { MemberService } from './member.service';
import { MemberRepository } from './member.repository';
import { MemberCheckResponseDto } from './member.dto';

describe('MemberService', () => {
  let memberService: MemberService;
  let memberRepository: MemberRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MemberService,
        {
          provide: MemberRepository,
          useValue: {
            findAllMembersWithBorrowedBooks: jest.fn(),
          },
        },
      ],
    }).compile();

    memberService = module.get<MemberService>(MemberService);
    memberRepository = module.get<MemberRepository>(MemberRepository);
  });

  it('should be defined', () => {
    expect(memberService).toBeDefined();
  });

  describe('getMembersWithBorrowedBooks', () => {
    it('should return an array of MemberCheckResponseDto', async () => {
      const mockMembers = [
        {
          code: 'M001',
          name: 'Member 1',
          isPenalized: false,
          penaltyEndDate: new Date(),
          Transactions: [
            {
              id: 1,
              borrowDate: new Date(),
              returnDate: new Date(),
              isReturned: false,
              memberCode: 'M001',
              bookCode: 'B001',
            },
          ],
        },
        {
          code: 'M002',
          name: 'Member 2',
          isPenalized: false,
          penaltyEndDate: new Date(),
          Transactions: [
            {
              id: 2,
              borrowDate: new Date(),
              returnDate: new Date(),
              isReturned: true,
              memberCode: 'M002',
              bookCode: 'B002',
            },
            {
              id: 3,
              borrowDate: new Date(),
              returnDate: null,
              isReturned: false,
              memberCode: 'M002',
              bookCode: 'B003',
            },
          ],
        },
      ];

      jest
        .spyOn(memberRepository, 'findAllMembersWithBorrowedBooks')
        .mockResolvedValue(mockMembers);

      const expectedResult: MemberCheckResponseDto[] = [
        new MemberCheckResponseDto('M001', 'Member 1', 1),
        new MemberCheckResponseDto('M002', 'Member 2', 2),
      ];

      const result = await memberService.getMembersWithBorrowedBooks();

      expect(result).toEqual(expectedResult);
      expect(
        memberRepository.findAllMembersWithBorrowedBooks,
      ).toHaveBeenCalled();
    });
  });
});
