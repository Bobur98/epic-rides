import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { FollowService } from './follow.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { FollowerDto, FollowersDto, FollowingsDto } from '../../libs/dto/follow/follow';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { ObjectId } from 'mongoose';
import { shapeIntoMongoObjectId } from '../../libs/config';
import { FollowInquiryDto } from '../../libs/dto/follow/follow.input';
import { WithoutGuard } from '../auth/guards/without.guard';

@Resolver()
export class FollowResolver {
	constructor(private readonly followService: FollowService) {}

	@UseGuards(AuthGuard)
	@Mutation((returns) => FollowerDto)
	public async subscribe(@Args('input') input: string, @AuthMember('_id') memberId: ObjectId): Promise<FollowerDto> {
		console.log('Mutation: subscribe');
		const followingId = shapeIntoMongoObjectId(input);
		return await this.followService.subscribe(memberId, followingId);
	}

	@UseGuards(AuthGuard)
	@Mutation((returns) => FollowerDto)
	public async unsubscribe(@Args('input') input: string, @AuthMember('_id') memberId: ObjectId): Promise<FollowerDto> {
		console.log('Mutation: unsubscribe');
		const followingId = shapeIntoMongoObjectId(input);
		return await this.followService.unsubscribe(memberId, followingId);
	}

	@UseGuards(WithoutGuard)
	@Query((returns) => FollowingsDto)
	public async getMemberFollowings(
		@Args('input') input: FollowInquiryDto,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<FollowingsDto> {
		console.log('Query: getMemberFollowings');
		const { followerId } = input.search;
		input.search.followerId = shapeIntoMongoObjectId(followerId);
		return await this.followService.getMemberFollowings(memberId, input);
	}

	@UseGuards(WithoutGuard)
	@Query((returns) => FollowersDto)
	public async getMemberFollowers(
		@Args('input') input: FollowInquiryDto,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<FollowersDto> {
		console.log('Query: getMemberFollowers');
		const { followingId } = input.search;
		input.search.followingId = shapeIntoMongoObjectId(followingId);
		return await this.followService.getMemberFollowers(memberId, input);
	}
}

// AUTH => DAVID(RANDOM USER WHO WAS AUTHINTICATED)
// FOLLOWER(TARGETID) => MARTIN(TARGET )
// FOLLOWING => SHAWN (SHAWN BU TARGET FOLLOW QILYABKANLAR)
