import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, Length, IsOptional } from 'class-validator';
import { MemberType, MemberAuthType } from '../../enums/member.enum';
import { ViewGroup } from '../../enums/view.enum';
import { ObjectId } from 'mongoose';

@InputType()
export class ViewInputDto {
	@IsNotEmpty()
	@Field(() => ViewGroup)
	viewGroup: ViewGroup;

	@IsNotEmpty()
	@Field(() => String)
	viewRefId: ObjectId;

	@IsNotEmpty()
	@Field(() => String)
	memberId: ObjectId;
}
