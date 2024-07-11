import { ObjectType, Field, Int } from '@nestjs/graphql';
import { ObjectId } from 'mongoose';
import { MemberType, MemberStatus, MemberAuthType } from '../../enums/member.enum';
import { MeLikedDto } from '../like/like';
import { MeFollowedDto } from '../follow/follow';

@ObjectType()
export class MemberDto {
	@Field(() => String)
	_id: ObjectId;

	@Field(() => MemberType) // Biz memberType enumlarni yozgan vaqtimiz, shu enumlarnni graphqlgaham boglab olgan edik: registerEnumType(MemberType, { name: 'MemberType' });
	memberType: MemberType;

	@Field(() => MemberStatus)
	memberStatus: MemberStatus;

	@Field(() => MemberAuthType)
	memberAuthType: MemberAuthType;

	@Field(() => String)
	memberPhone: string;

	@Field(() => String)
	memberNick: string;

	memberPassword?: string; // bu yerda memberPasswordni graphqlga biriktirmadik, shuning uchun @Field decoratoridan foydalanmadik

	@Field(() => String, { nullable: true }) // memberFullName optional bolganligi uchun nullable: true
	memberFullName?: string;

	@Field(() => String)
	memberImage: string;

	@Field(() => String, { nullable: true })
	memberAddress?: string;

	@Field(() => String, { nullable: true })
	memberDesc?: string;

	@Field(() => Int)
	memberProducts: number;

	@Field(() => Int)
	memberArticles: number;

	@Field(() => Int)
	memberFollowings: number;

	@Field(() => Int)
	memberPoints: number;

	@Field(() => Int)
	memberLikes: number;

	@Field(() => Int)
	memberViews: number;

	@Field(() => Int)
	memberComments: number;

	@Field(() => Int)
	memberRank: number;

	@Field(() => Int)
	memberWarnings: number;

	@Field(() => Int)
	memberBlocks: number;

	@Field(() => Date)
	createdAt: Date;

	@Field(() => Date)
	updatedAt: Date;

	@Field(() => Date, { nullable: true })
	deletedAt?: Date;

	@Field(() => String, { nullable: true })
	accessToken?: string;

	/** from aggregation **/
	@Field(() => [MeLikedDto], { nullable: true })
	meLiked?: MeLikedDto[];

	@Field(() => [MeFollowedDto], { nullable: true })
	meFollowed?: MeFollowedDto[];
}

@ObjectType()
export class TotalCounter {
	@Field(() => Int, { nullable: true })
	total?: number;
}

@ObjectType()
export class MembersDto {
	@Field(() => [MemberDto])
	list: MemberDto[];

	@Field(() => [TotalCounter], { nullable: true })
	metaCounter: TotalCounter[];
}
