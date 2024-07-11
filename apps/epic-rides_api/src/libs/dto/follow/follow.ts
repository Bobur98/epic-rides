import { Field, ObjectType } from '@nestjs/graphql';
import { ObjectId } from 'mongoose';
import { MemberDto, TotalCounter } from '../member/member';
import { MeLikedDto } from '../like/like';

@ObjectType()
export class MeFollowedDto {
	@Field(() => String)
	followingId: ObjectId;

	@Field(() => String)
	followerId: ObjectId;

	@Field(() => Boolean)
	myFollowing: boolean;
}

@ObjectType()
export class FollowerDto {
	@Field(() => String)
	_id: ObjectId;

	@Field(() => String)
	followingId: ObjectId;

	@Field(() => String)
	followerId: ObjectId;

	@Field(() => Date)
	createdAt: Date;

	@Field(() => Date)
	updatedAt: Date;

	/** from aggregation **/

	@Field(() => [MeLikedDto], { nullable: true })
	meLiked?: MeLikedDto[];

	@Field(() => [MeFollowedDto], { nullable: true })
	meFollowed?: MeFollowedDto[];

	@Field(() => MemberDto, { nullable: true })
	followerData?: MemberDto;
}

@ObjectType()
export class FollowingDto {
	@Field(() => String)
	_id: ObjectId;

	@Field(() => String)
	followingId: ObjectId;

	@Field(() => String)
	followerId: ObjectId;

	@Field(() => Date)
	createdAt: Date;

	@Field(() => Date)
	updatedAt: Date;

	/** from aggregation **/

	@Field(() => [MeLikedDto], { nullable: true })
	meLiked?: MeLikedDto[];

	@Field(() => [MeFollowedDto], { nullable: true })
	meFollowed?: MeFollowedDto[];

	@Field(() => MemberDto, { nullable: true })
	followingData?: MemberDto;
}

@ObjectType()
export class FollowingsDto {
	@Field(() => [FollowingDto])
	list: FollowingDto[];

	@Field(() => [TotalCounter], { nullable: true })
	metaCounter: TotalCounter[];
}

@ObjectType()
export class FollowersDto {
	@Field(() => [FollowerDto])
	list: FollowerDto[];

	@Field(() => [TotalCounter], { nullable: true })
	metaCounter: TotalCounter[];
}
