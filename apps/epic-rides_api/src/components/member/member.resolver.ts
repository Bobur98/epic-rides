import { Mutation, Resolver, Query, Args } from '@nestjs/graphql';
import { MemberService } from './member.service';
import { UsePipes, ValidationPipe } from '@nestjs/common';
import { LoginInputDto, MemberInputDto } from '../../libs/dto/member/member.input.dto';

@Resolver()
export class MemberResolver {
	constructor(private readonly memberService: MemberService) {}

	@Mutation(() => String)
	@UsePipes(ValidationPipe) // it helps us to validate the input before executing resolvers
	public async signup(@Args('input') input: MemberInputDto): Promise<string> {
		console.log('Mutation: Sign up');
		console.log('input: ', input);

		return this.memberService.signup();
	}

	@UsePipes(ValidationPipe)
	@Mutation(() => String)
	public async login(@Args('input') input: LoginInputDto): Promise<string> {
		console.log('Mutation:login');
		return this.memberService.login();
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
