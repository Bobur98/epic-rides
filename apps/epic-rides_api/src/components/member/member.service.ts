import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MemberDto } from '../../libs/dto/member/member';
import { LoginInputDto, MemberInputDto } from '../../libs/dto/member/member.input.dto';
import { MemberStatus } from '../../libs/enums/member.enum';
import { Message } from '../../libs/enums/common.enum';

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

	public async login(input: LoginInputDto): Promise<MemberDto> {
		const { memberNick, memberPassword } = input;

		const response: MemberDto = await this.memberModel
			.findOne({ memberNick: memberNick })
			.select('+memberPassword')
			.exec();

		if (!response || response.memberStatus === MemberStatus.DELETE) {
			throw new InternalServerErrorException(Message.NO_MEMBER_NICK);
		} else if (response.memberStatus === MemberStatus.BLOCK) {
			throw new InternalServerErrorException(Message.BLOCKED_USER);
		}

		const isMatch = memberPassword === response.memberPassword;
		if (!isMatch) throw new InternalServerErrorException(Message.WRONG_PASSWORD);
		return response;
	}

	public async updateMember(): Promise<string> {
		return 'updateMember executed';
	}

	public async getMember(): Promise<string> {
		return 'getMember executed';
	}
}
