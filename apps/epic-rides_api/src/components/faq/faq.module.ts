import { Module, UseGuards } from '@nestjs/common';
import { FaqResolver } from './faq.resolver';
import { FaqService } from './faq.service';
import { MongooseModule } from '@nestjs/mongoose';
import FaqSchema from '../../schemas/Faq.model';
import { MemberModule } from '../member/member.module';
import { Roles } from '../auth/decorators/roles.decorator';
import { MemberType } from '../../libs/enums/member.enum';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Mutation } from '@nestjs/graphql';
import { AuthModule } from '../auth/auth.module';

@Module({
	imports: [MongooseModule.forFeature([{ name: 'Faq', schema: FaqSchema }]), MemberModule, AuthModule],
	providers: [FaqResolver, FaqService],
})
export class FaqModule {}
