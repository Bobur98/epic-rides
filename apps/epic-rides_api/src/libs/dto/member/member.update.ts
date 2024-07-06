import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, Length, IsOptional } from 'class-validator';
import { MemberType, MemberAuthType, MemberStatus } from '../../enums/member.enum';
import { ObjectId } from 'mongoose';

@InputType()
export class MemberUpdateDto {
	@IsNotEmpty() // id bolishi shart degani
	@Field(() => String)
	_id: ObjectId;

	@IsOptional() // memberType optional degani
	@Field(() => MemberType, { nullable: true }) // Biz memberType enumlarni yozgan vaqtimiz, shu enumlarnni graphqlgaham boglab olgan edik: registerEnumType(MemberType, { name: 'MemberType' });
	memberType?: MemberType;

	@IsOptional()
	@Field(() => MemberStatus, { nullable: true }) // Biz memberType enumlarni yozgan vaqtimiz, shu enumlarnni graphqlgaham boglab olgan edik: registerEnumType(MemberType, { name: 'MemberType' });
	memberStatus?: MemberStatus;

	@IsOptional()
	@Field(() => String, { nullable: true })
	memberPhone?: string;

	@IsOptional()
	@Length(3, 12)
	@Field(() => String, { nullable: true })
	memberNick?: string;

	@IsOptional()
	@Length(5, 12)
	@Field(() => String, { nullable: true })
	memberPassword?: string;

	@IsOptional()
	@Length(3, 100)
	@Field(() => String, { nullable: true })
	memberFullName?: string;

	@IsOptional()
	@Field(() => String, { nullable: true })
	memberImage?: string;

	@IsOptional()
	@Field(() => String, { nullable: true })
	memberAddress?: string;

	@IsOptional()
	@Field(() => String, { nullable: true })
	memberDesc?: string;

	deletedAt: Date;
}
