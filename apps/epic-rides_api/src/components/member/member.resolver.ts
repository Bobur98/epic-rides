import { Mutation, Resolver, Query, Args } from '@nestjs/graphql';
import { MemberService } from './member.service';
import { InternalServerErrorException, UsePipes, ValidationPipe } from '@nestjs/common';
import { LoginInputDto, MemberInputDto } from '../../libs/dto/member/member.input.dto';
import { MemberDto } from '../../libs/dto/member/member';

@Resolver()
export class MemberResolver {
	constructor(private readonly memberService: MemberService) {}

	@Mutation(() => MemberDto)
	@UsePipes(ValidationPipe) // it helps us to validate the input before executing resolvers
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

	@UsePipes(ValidationPipe)
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

	@Mutation(() => String)
	public async updateMember(): Promise<string> {
		console.log('Mutation: updateMember');
		return this.memberService.updateMember();
	}

	@Query(() => String)
	public async getMember(): Promise<string> {
		console.log('Query: getMember');
		return this.memberService.getMember();
	}
}
