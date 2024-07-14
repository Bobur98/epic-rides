import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ObjectId } from 'mongoose';
import { CommentGroup, CommentStatus } from '../../enums/comment.enum';
import { MemberDto, TotalCounter } from '../member/member';
import { FaqType } from '../../enums/faq.enum';

@ObjectType()
export class FaqDto {
	@Field(() => String)
	_id: ObjectId;

	@Field(() => String)
	faqQuestion: string;

	@Field(() => String)
	faqAnswer: string;

	@Field(() => FaqType)
	faqType: FaqType;

	@Field(() => MemberDto, { nullable: true })
	memberData?: MemberDto;
}

@ObjectType()
export class FaqsDto {
	@Field(() => [FaqDto])
	list: FaqDto[];

	@Field(() => [TotalCounter], { nullable: true })
	metaCounter: TotalCounter[];
}
