import { Field, ObjectType } from '@nestjs/graphql';
import { ObjectId } from 'mongoose';
import { NotificationGroup, NotificationStatus, NotificationType } from '../../enums/notification.enum';
import { MemberDto, TotalCounter } from '../member/member';

@ObjectType()
export class MeNotified {
	@Field()
	authorId: ObjectId;

	@Field()
	notificationRefId: ObjectId;

	@Field(() => Boolean)
	myNotification: boolean;
}

@ObjectType()
export class NotificDto {
	@Field(() => String)
	_id: ObjectId;

	@Field(() => NotificationType, { nullable: true })
	notificationType?: NotificationType;

	@Field(() => NotificationStatus, { nullable: true })
	notificationStatus?: NotificationStatus;

	@Field(() => NotificationGroup, { nullable: true })
	notificationGroup?: NotificationGroup;

	@Field()
	notificationTitle: string;

	@Field()
	notificationDesc?: string;

	@Field()
	authorId: string;

	@Field()
	receiverId: string;

	@Field(() => String, { nullable: true })
	productId?: string;

	@Field(() => String, { nullable: true })
	articleId?: string;

	@Field(() => MemberDto, { nullable: true })
	memberData?: MemberDto;
}

@ObjectType()
export class Notifications {
	@Field(() => [NotificDto])
	list: NotificDto[];

	@Field(() => [TotalCounter], { nullable: true })
	metaCounter: TotalCounter[];
}
