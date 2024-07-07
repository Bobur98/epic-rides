import { ObjectType, Field, Int } from '@nestjs/graphql';
import { ObjectId } from 'mongoose';
import { MemberType, MemberStatus, MemberAuthType } from '../../enums/member.enum';
import { ViewGroup } from '../../enums/view.enum';

@ObjectType()
export class ViewDto {
	@Field(() => String)
	_id: ObjectId;

	@Field(() => ViewGroup)
	viewGroup: ViewGroup;

	@Field(() => String)
	viewRefId: ObjectId;

	@Field(() => String)
	memberId: ObjectId;

	@Field(() => Date)
	createdAt: Date;

	@Field(() => Date)
	updatedAt: Date;
}
