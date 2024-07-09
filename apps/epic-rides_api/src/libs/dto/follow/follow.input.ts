import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, Min } from 'class-validator';
import { ObjectId } from 'mongoose';

@InputType()
class FollowSearchDto {
	@IsOptional()
	@Field(() => String, { nullable: true })
	followingId?: ObjectId;

	@IsOptional()
	@Field(() => String, { nullable: true })
	followerId?: ObjectId;
}

@InputType()
export class FollowInquiryDto {
	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	page: number;

	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	limit: number;

	@IsNotEmpty()
	@Field(() => FollowSearchDto)
	search: FollowSearchDto;
}
