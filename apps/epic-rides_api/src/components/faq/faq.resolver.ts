import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { MemberType } from '../../libs/enums/member.enum';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { FaqService } from './faq.service';
import { FaqDto } from '../../libs/dto/faq/faq';
import { FaqInputDto } from '../../libs/dto/faq/faq.input';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { ObjectId } from 'mongoose';
import { FaqUpdateDto } from '../../libs/dto/faq/faq.upade';
import { shapeIntoMongoObjectId } from '../../libs/config';

@Resolver()
export class FaqResolver {
	constructor(private readonly faqService: FaqService) {}

	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Mutation((returns) => FaqDto)
	public async createFaq(@Args('input') input: FaqInputDto, @AuthMember('_id') memberId: ObjectId): Promise<FaqDto> {
		console.log('Query: createFaq');
		const data = await this.faqService.createFaq(memberId, input);
		return data;
	}

	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Mutation((returns) => FaqDto)
	public async updateFaq(@Args('input') input: FaqUpdateDto, @AuthMember('_id') memberId: ObjectId): Promise<FaqDto> {
		console.log('Query: updateFaq');
		const data = await this.faqService.updateFaq(memberId, input);
		return data;
	}

	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Mutation((returns) => FaqDto)
	public async deleteFaq(@Args('input') input: string, @AuthMember('_id') memberId: ObjectId): Promise<FaqDto> {
		console.log('Query: deleteFaq');
		const faqId = shapeIntoMongoObjectId(input);
		const data = await this.faqService.deleteFaq(faqId);
		return data;
	}
}
