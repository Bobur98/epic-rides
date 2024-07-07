import { Mutation, Resolver, Query, Args } from '@nestjs/graphql';
import { MemberService } from './member.service';
import { InternalServerErrorException, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { LoginInputDto, MemberInputDto } from '../../libs/dto/member/member.input.dto';
import { MemberDto } from '../../libs/dto/member/member';
import { AuthGuard } from '../auth/guards/auth.guard';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { ObjectId } from 'mongoose';
import { Roles } from '../auth/decorators/roles.decorator';
import { MemberType } from '../../libs/enums/member.enum';
import { RolesGuard } from '../auth/guards/roles.guard';
import { MemberUpdateDto } from '../../libs/dto/member/member.update';
import { shapeIntoMongoObjectId } from '../../libs/config';
import { WithoutGuard } from '../auth/guards/without.guard';

@Resolver()
export class MemberResolver {
	constructor(private readonly memberService: MemberService) {}

	@Mutation(() => MemberDto)
	//@UsePipes(ValidationPipe) // it helps us to validate the input before executing resolvers, but we do global error handling in main.ts with app.module
	public async signup(@Args('input') input: MemberInputDto): Promise<MemberDto> {
		console.log('Mutation: Sign up');
		console.log('input: ', input);
		try {
			return this.memberService.signup(input);
		} catch (error) {
			console.log('ERROR ON: SIGNUP', error);
			throw new InternalServerErrorException(error);
		}
	}

	@Mutation(() => MemberDto)
	public async login(@Args('input') input: LoginInputDto): Promise<MemberDto> {
		console.log('Mutation:login');
		try {
			return this.memberService.login(input);
		} catch (error) {
			console.log('ERROR ON: MUTATION', error);
			throw new InternalServerErrorException(error);
		}
	}

	@UseGuards(AuthGuard)
	@Mutation(() => MemberDto)
	public async updateMember(
		@Args('input') input: MemberUpdateDto,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<MemberDto> {
		console.log('Mutation: updateMember');
		delete input._id;
		return this.memberService.updateMember(memberId, input);
	}
	@UseGuards(AuthGuard)
	@Query(() => String)
	public async checkAuth(@AuthMember('memberNick') memberNick: string): Promise<string> {
		console.log('Query: checkAuth');

		return `Hi ${memberNick}`;
	}

	@Roles(MemberType.USER, MemberType.AGENT)
	@UseGuards(RolesGuard)
	@Query(() => String)
	public async checkAuthRoles(@AuthMember() authMember: MemberDto): Promise<string> {
		console.log('Query: checkAuthRoles');

		return `Hi ${authMember.memberNick}, you are ${authMember.memberType} (memberId: ${authMember._id})`;
	}

	@UseGuards(WithoutGuard)
	@Query(() => MemberDto)
	public async getMember(@Args('memberId') input: string, @AuthMember('_id') memberId: ObjectId): Promise<MemberDto> {
		console.log('Query: getMember');
		console.log('memberId', memberId);

		const targetId = shapeIntoMongoObjectId(input);
		return this.memberService.getMember(memberId, targetId);
	}

	/** ADMIN **/
	// Authorization: Admin
	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Mutation(() => String)
	public async getAllMembersByAdmin(): Promise<string> {
		return this.memberService.getAllMembersByAdmin();
	}
	// Authorization: Admin
	@Mutation(() => String)
	public async UpdateMemberByAdmin(): Promise<string> {
		return this.memberService.UpdateMemberByAdmin();
	}
}
