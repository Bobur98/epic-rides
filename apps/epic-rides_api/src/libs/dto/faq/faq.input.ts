import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { ObjectId } from 'mongoose';
import { CommentGroup, CommentStatus } from '../../enums/comment.enum';
import { MemberDto, TotalCounter } from '../member/member';
import { FaqType } from '../../enums/faq.enum';
import { IsNotEmpty, Min, IsOptional, IsIn, Length } from 'class-validator';
import { availableCommentSorts } from '../../config';

@InputType()
export class FaqInputDto {
	@IsNotEmpty()
	@Length(10, 50)
	@Field(() => String)
	faqQuestion: string;

	@IsNotEmpty()
	@Length(10, 150)
	@Field(() => String)
	faqAnswer: string;

	@IsNotEmpty()
	@Field(() => FaqType)
	faqType: FaqType;

	memberId?: ObjectId;
}

@InputType()
export class FaqInquiryDto {
	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	page: number;

	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	limit: number;

	@IsOptional()
	@IsIn(Object.values(FaqType))
	@Field(() => FaqType, { nullable: true })
	faqType?: FaqType;
}
