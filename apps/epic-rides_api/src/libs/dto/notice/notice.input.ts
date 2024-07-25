import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { ObjectId } from 'mongoose';
import { CommentGroup, CommentStatus } from '../../enums/comment.enum';
import { MemberDto, TotalCounter } from '../member/member';
import { FaqType } from '../../enums/faq.enum';
import { IsNotEmpty, Min, IsOptional, IsIn, Length } from 'class-validator';
import { availableCommentSorts, availableNoticeSorts, availableProductSorts } from '../../config';
import { NoticeStatus, NoticeType } from '../../enums/notice.enum';
import { Direction } from '../../enums/common.enum';

@InputType()
export class NoticeInputDto {
	@IsNotEmpty()
	@Field(() => NoticeType)
	noticeType: NoticeType;

	@IsNotEmpty()
	@Length(1, 300)
	@Field(() => String)
	noticeContent: string;

	@Field(() => NoticeStatus)
	noticeStatus: NoticeStatus;

	memberId?: ObjectId;
}

class NISearch {}

@InputType()
export class NoticeInquiryDto {
	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	page: number;

	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	limit: number;

	@IsOptional()
	@IsIn(availableNoticeSorts)
	@Field(() => String, { nullable: true })
	sort?: string;

	@IsOptional()
	@Field(() => Direction, { nullable: true })
	direction?: Direction;

	@IsOptional()
	@IsIn(Object.values(NoticeType))
	@Field(() => NoticeType, { nullable: true })
	noticeType?: NoticeType;
}
