import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MemberDto } from '../../libs/dto/member/member';
import { LoginInputDto, MemberInputDto } from '../../libs/dto/member/member.input.dto';
import { MemberStatus } from '../../libs/enums/member.enum';
import { Message } from '../../libs/enums/common.enum';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class MemberService {
	constructor(
		@InjectModel('Member') private readonly memberModel: Model<MemberDto>,
		private authService: AuthService,
	) {}

	public async signup(input: MemberInputDto): Promise<MemberDto> {
		// hash password
		input.memberPassword = await this.authService.hashPassword(input.memberPassword);

		try {
			const result = await this.memberModel.create(input);
			// todo: Authentication via tokens
			return result;
		} catch (error) {
			console.log('ERROR ON: SIGNUP SERVICE', error);
			throw new BadRequestException(Message.USED_MEMBER_NICK_OR_PHONE); // we are passing our customized error to golab error handling which is handled in app module
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

		const isMatch = await this.authService.comparePasswords(input.memberPassword, response.memberPassword);
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
