import { Mutation, Resolver, Query, Args } from '@nestjs/graphql';
import { MemberService } from './member.service';
import { InternalServerErrorException, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { LoginInputDto, MemberInputDto } from '../../libs/dto/member/member.input.dto';
import { MemberDto } from '../../libs/dto/member/member';
import { AuthGuard } from '../auth/guards/auth.guard';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { ObjectId } from 'mongoose';

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
	@Mutation(() => String)
	public async updateMember(@AuthMember('_id') memberId: ObjectId): Promise<string> {
		console.log('Mutation: updateMember');

		return this.memberService.updateMember();
	}
	@UseGuards(AuthGuard)
	@Query(() => String)
	public async checkAuth(@AuthMember('memberNick') memberNick: string): Promise<string> {
		console.log('Query: checkAuth');

		return `Hi ${memberNick}`;
	}

	@Query(() => String)
	public async getMember(): Promise<string> {
		console.log('Query: getMember');
		return this.memberService.getMember();
	}

	/** ADMIN **/
	// Authorization: Admin
	@Mutation(() => String)
	public async getALlMembersByAdmin(): Promise<string> {
		return this.memberService.getALlMembersByAdmin();
	}
	// Authorization: Admin
	@Mutation(() => String)
	public async UpdateMemberByAdmin(): Promise<string> {
		return this.memberService.UpdateMemberByAdmin();
	}
}
