import { Field, Int, ObjectType } from '@nestjs/graphql';
import { BoardArticleCategory, BoardArticleStatus } from '../../enums/board-article.enum';
import { ObjectId } from 'mongoose';
import { MemberDto, TotalCounter } from '../member/member';
import { MeLikedDto } from '../like/like';

@ObjectType()
export class BoardArticleDto {
	@Field(() => String)
	_id: ObjectId;

	@Field(() => BoardArticleCategory)
	articleCategory: BoardArticleCategory;

	@Field(() => BoardArticleStatus)
	articleStatus: BoardArticleStatus;

	@Field(() => String)
	articleTitle: string;

	@Field(() => String)
	articleContent: string;

	@Field(() => String, { nullable: true })
	articleImage?: string;

	@Field(() => Int)
	articleViews: number;

	@Field(() => Int)
	articleLikes: number;

	@Field(() => Int)
	articleComments: number;

	@Field(() => String)
	memberId: ObjectId;

	@Field(() => Date)
	createdAt: Date;

	@Field(() => Date)
	updatedAt: Date;

	/** from aggregation **/
	@Field(() => [MeLikedDto], { nullable: true })
	meLiked?: MeLikedDto[];

	@Field(() => MemberDto, { nullable: true })
	memberData?: MemberDto;
}

@ObjectType()
export class BoardArticlesDto {
	@Field(() => [BoardArticleDto])
	list: BoardArticleDto[];

	@Field(() => [TotalCounter], { nullable: true })
	metaCounter: TotalCounter[];
}
