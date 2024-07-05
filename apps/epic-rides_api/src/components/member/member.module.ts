import { Module } from '@nestjs/common';
import { MemberResolver } from './member.resolver';
import { MemberService } from './member.service';
import { MongooseModule, Schema } from '@nestjs/mongoose';
import MemberSchema from '../../schemas/Member.model';
import { AuthModule } from '../auth/auth.module';

@Module({
	imports: [MongooseModule.forFeature([{ name: 'Member', schema: MemberSchema }]), AuthModule], // to use Schema model in service model, we need to import it module file
	providers: [MemberResolver, MemberService],
})
export class MemberModule {}
