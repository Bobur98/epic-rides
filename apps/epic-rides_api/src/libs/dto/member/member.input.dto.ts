import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, Length } from 'class-validator';
import { MemberType, MemberAuthType } from '../../enums/member.enum';

@InputType()
export class MemberInputDto {
	@IsNotEmpty()
	@Length(3, 12)
	@Field(() => String)
	memberNick: string;

	@IsNotEmpty()
	@Length(5, 12)
	@Field(() => String)
	memberPassword: string;

	@IsNotEmpty()
	@Field(() => String)
	memberPhone: string;

	@IsOptional()
	@Field(() => MemberType, { nullable: true }) // Biz memberType enumlarni yozgan vaqtimiz, shu enumlarnni graphqlgaham boglab olgan edik: registerEnumType(MemberType, { name: 'MemberType' });
	memberType?: MemberType;

	@IsOptional()
	@Field(() => MemberAuthType, { nullable: true }) // memberFullName optional bolganligi uchun nullable: true
	memberAuthType?: MemberAuthType;
}

@InputType()
export class LoginInputDto {
	@IsNotEmpty()
	@Length(3, 12)
	@Field(() => String)
	memberNick: string;

	@IsNotEmpty()
	@Length(5, 12)
	@Field(() => String)
	memberPassword: string;
}
