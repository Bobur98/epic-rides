import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ObjectId } from 'mongoose';
import { CommentGroup, CommentStatus } from '../../enums/comment.enum';
import { MemberDto, TotalCounter } from '../member/member';
import { FaqStatus, FaqType } from '../../enums/faq.enum';

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

	@Field(() => FaqStatus, { nullable: true })
	faqStatus?: FaqStatus;

	@Field(() => MemberDto, { nullable: true })
	memberData?: MemberDto;

	@Field(() => Date, { nullable: true })
	createdAt?: Date;

	@Field(() => Date, { nullable: true })
	updatedAt?: Date;
}

@ObjectType()
export class FaqsDto {
	@Field(() => [FaqDto])
	list: FaqDto[];

	@Field(() => [TotalCounter], { nullable: true })
	metaCounter: TotalCounter[];
}
