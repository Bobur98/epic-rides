import { Mutation, Resolver } from '@nestjs/graphql';
import { NoticeService } from './notice.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { MemberType } from '../../libs/enums/member.enum';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from '../auth/guards/roles.guard';

@Resolver()
export class NoticeResolver {
  constructor(private readonly noticeService: NoticeService){}

  @Roles(MemberType.ADMIN, MemberType.AGENT)
  @UseGuards(RolesGuard)
  @Mutation((returns) => )
}
