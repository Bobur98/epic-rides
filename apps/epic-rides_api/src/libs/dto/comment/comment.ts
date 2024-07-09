import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ObjectId } from 'mongoose';
import { CommentGroup, CommentStatus } from '../../enums/comment.enum';
import { MemberDto, TotalCounter } from '../member/member';

@ObjectType()
export class CommentDto {
	@Field(() => String)
	_id: ObjectId;

	@Field(() => CommentStatus)
	commentStatus: CommentStatus;

	@Field(() => CommentGroup)
	commentGroup: CommentGroup;

	@Field(() => String)
	commentContent: string;

	@Field(() => String)
	commentRefId: ObjectId;

	@Field(() => String)
	memberId: ObjectId;

	@Field(() => Date)
	createdAt: Date;

	@Field(() => Date)
	updatedAt: Date;

	/** from aggregation **/

	@Field(() => MemberDto, { nullable: true })
	memberData?: MemberDto;
}

@ObjectType()
export class CommentsDto {
	@Field(() => [CommentDto])
	list: CommentDto[];

	@Field(() => [TotalCounter], { nullable: true })
	metaCounter: TotalCounter[];
}
