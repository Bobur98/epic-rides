import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MemberDto } from '../../libs/dto/member/member';
import { MemberInputDto } from '../../libs/dto/member/member.input.dto';

@Injectable()
export class MemberService {
	constructor(@InjectModel('Member') private readonly memberModel: Model<MemberDto>) {}

	public async signup(input: MemberInputDto): Promise<MemberDto> {
		// hash password

		try {
			const result = await this.memberModel.create(input);
			// todo: Authentication via tokens
			return result;
		} catch (error) {
			console.log('ERROR ON: SIGNUP SERVICE', error);
			throw new BadRequestException(error);
		}
	}

	public async login(): Promise<string> {
		return 'login executed';
	}

	public async updateMember(): Promise<string> {
		return 'updateMember executed';
	}

	public async getMember(): Promise<string> {
		return 'getMember executed';
	}
}
