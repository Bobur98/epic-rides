import { Module } from '@nestjs/common';
import { MemberResolver } from './member.resolver';
import { MemberService } from './member.service';
import { MongooseModule, Schema } from '@nestjs/mongoose';
import MemberSchema from '../../schemas/Member.model';
import { AuthModule } from '../auth/auth.module';
import { ViewModule } from '../view/view.module';
import { LikeModule } from '../like/like.module';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: 'Member', schema: MemberSchema }]),
		AuthModule,
		ViewModule,
		MemberModule,
		LikeModule,
	], // to use Schema model in service model, we need to import it module file
	providers: [MemberResolver, MemberService],
	exports: [MemberService], // Ensure it is exported here
})
export class MemberModule {}
