import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FollowerDto, FollowersDto, FollowingDto, FollowingsDto } from '../../libs/dto/follow/follow';
import { Model, ObjectId } from 'mongoose';
import { MemberService } from '../member/member.service';
import { Direction, Message } from '../../libs/enums/common.enum';
import { FollowInquiryDto } from '../../libs/dto/follow/follow.input';
import { T } from '../../libs/types/common';
import { lookupAuthMemberFollowed, lookupFollowerData, lookupFollowingData } from '../../libs/config';
import { lookupAuthMemberLiked } from '../../libs/config';
import { NotificationGroup, NotificationStatus, NotificationType } from '../../libs/enums/notification.enum';
import { NotificationInput } from '../../libs/dto/notification/notification.input';
import { NotificationService } from '../notification/notification.service';
import { MemberDto } from '../../libs/dto/member/member';
import { MemberStatus } from '../../libs/enums/member.enum';

@Injectable()
export class FollowService {
	constructor(
		@InjectModel('Follow') private readonly followModel: Model<FollowerDto | FollowingDto>,
		@InjectModel('Member') private readonly memberModel: Model<MemberDto>,

		private readonly memberService: MemberService,
		private readonly notificationService: NotificationService,
	) {}

	public async subscribe(followerId: ObjectId, followingId: ObjectId): Promise<FollowerDto> {
		if (followerId.toString() === followingId.toString()) {
			throw new InternalServerErrorException(Message.SELF_SUBSCRIPTION_DENIED);
		}

		const targetMember = await this.memberService.getMember(null, followingId);
		if (!targetMember) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

		const result = await this.registerSubscription(followerId, followingId);

		//notification
		const authMember: MemberDto = await this.memberModel
			.findOne({ _id: followerId, memberStatus: MemberStatus.ACTIVE })
			.exec();
		if (!authMember) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

		const notificInput: NotificationInput = {
			notificationGroup: NotificationGroup.ARTICLE,
			notificationType: NotificationType.SUBSCRIBE,
			notificationStatus: NotificationStatus.WAIT,
			notificationTitle: `Follow`,
			notificationDesc: `${targetMember.memberNick} followed you `,
			authorId: followerId,
			receiverId: followingId,
			// propertyId: likeRefId,
		};
		await this.notificationService.createNotification(notificInput);

		await this.memberService.memberStatsEditor({ _id: followerId, targetKey: 'memberFollowings', modifier: 1 });
		await this.memberService.memberStatsEditor({ _id: followingId, targetKey: 'memberFollowers', modifier: 1 });
		return result;
	}

	private async registerSubscription(followerId: ObjectId, followingId: ObjectId): Promise<FollowerDto> {
		try {
			return await this.followModel.create({
				followingId: followingId,
				followerId: followerId,
			});
		} catch (err) {
			console.log('Error, Service.model:', err.message);
			throw new BadRequestException(Message.CREATE_FAILED);
		}
	}

	public async unsubscribe(followerId: ObjectId, followingId: ObjectId): Promise<FollowerDto> {
		const targetMember = await this.memberService.getMember(null, followingId);
		if (!targetMember) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

		const result = await this.followModel
			.findOneAndDelete({
				followingId: followingId,
				followerId: followerId,
			})
			.exec();

		const authMember: MemberDto = await this.memberModel
			.findOne({ _id: followerId, memberStatus: MemberStatus.ACTIVE })
			.exec();
		if (!authMember) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

		const notificInput: NotificationInput = {
			notificationGroup: NotificationGroup.ARTICLE,
			notificationType: NotificationType.UNSUBSCRIBE,
			notificationStatus: NotificationStatus.WAIT,
			notificationTitle: `Follow`,
			notificationDesc: `${authMember.memberNick} unfollowed you `,
			authorId: followerId,
			receiverId: followingId,
			// propertyId: likeRefId,
		};
		await this.notificationService.createNotification(notificInput);

		if (!result) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

		await this.memberService.memberStatsEditor({ _id: followerId, targetKey: 'memberFollowings', modifier: 1 });
		await this.memberService.memberStatsEditor({ _id: followingId, targetKey: 'memberFollowers', modifier: 1 });
		return result;
	}

	public async getMemberFollowings(memberId: ObjectId, input: FollowInquiryDto): Promise<FollowingsDto> {
		const { page, limit, search } = input;

		if (!search?.followerId) throw new InternalServerErrorException(Message.BAD_REQUEST);

		const match: T = { followerId: search?.followerId };
		console.log('match', match);

		const result = await this.followModel
			.aggregate([
				{ $match: match },
				{ $sort: { createdAt: Direction.DESC } },
				{
					// IKTA AGGRIGATIONNI HOSIL QILYABMIZ. UNI ALOHIDA PIPELARI BOR
					$facet: {
						list: [
							{ $skip: (page - 1) * limit },
							{ $limit: limit },
							// meLiked
							lookupAuthMemberLiked(memberId, '$followingId'), // followingId nomini yozganimizni sababi follow databasemizda shu nom bilan yozganmiz
							// meFollowed
							lookupAuthMemberFollowed({ followerId: memberId, followingId: '$followingId' }),
							lookupFollowingData,
							{ $unwind: '$followingData' },
						],
						metaCounter: [{ $count: 'total' }],
					},
				},
			])
			.exec();
		if (!result.length) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

		return result[0];
	}

	public async getMemberFollowers(memberId: ObjectId, input: FollowInquiryDto): Promise<FollowersDto> {
		const { page, limit, search } = input;

		if (!search?.followingId) throw new InternalServerErrorException(Message.BAD_REQUEST);

		const match: T = { followingId: search?.followingId };
		console.log('match', match);

		const result = await this.followModel
			.aggregate([
				{ $match: match },
				{ $sort: { createdAt: Direction.DESC } },
				{
					$facet: {
						list: [
							{ $skip: (page - 1) * limit },
							{ $limit: limit },
							// meLiked
							lookupAuthMemberLiked(memberId, '$followerId'),
							// meFollowed
							lookupAuthMemberFollowed({ followerId: memberId, followingId: '$followerId' }),
							lookupFollowerData,
							{ $unwind: '$followerData' },
						],
						metaCounter: [{ $count: 'total' }],
					},
				},
			])
			.exec();
		if (!result.length) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

		return result[0];
	}
}
