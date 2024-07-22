import { Mutation, Resolver, Query, Args } from '@nestjs/graphql';
import { MemberService } from './member.service';
import { InternalServerErrorException, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import {
	AgentsInquiryDto,
	LoginInputDto,
	MemberInputDto,
	MembersInquiryDto,
} from '../../libs/dto/member/member.input.dto';
import { MemberDto, MembersDto } from '../../libs/dto/member/member';
import { AuthGuard } from '../auth/guards/auth.guard';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { ObjectId } from 'mongoose';
import { Roles } from '../auth/decorators/roles.decorator';
import { MemberType } from '../../libs/enums/member.enum';
import { RolesGuard } from '../auth/guards/roles.guard';
import { MemberUpdateDto } from '../../libs/dto/member/member.update';
import { getSerialForImage, shapeIntoMongoObjectId, validMimeTypes } from '../../libs/config';
import { WithoutGuard } from '../auth/guards/without.guard';
import { Message } from '../../libs/enums/common.enum';
import { createWriteStream } from 'fs';
import { GraphQLUpload, FileUpload } from 'graphql-upload';

@Resolver()
export class MemberResolver {
	constructor(private readonly memberService: MemberService) {}

	@Mutation(() => MemberDto)
	//@UsePipes(ValidationPipe) // it helps us to validate the input before executing resolvers, but we do global error handling in main.ts with app.module
	public async signup(@Args('input') input: MemberInputDto): Promise<MemberDto> {
		console.log('Mutation: Sign up');
		console.log('input: ', input);
		try {
			return await this.memberService.signup(input);
		} catch (error) {
			console.log('ERROR ON: SIGNUP', error);
			throw new InternalServerErrorException(error);
		}
	}

	@Mutation(() => MemberDto)
	public async login(@Args('input') input: LoginInputDto): Promise<MemberDto> {
		console.log('Mutation:login');
		try {
			return await this.memberService.login(input);
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
		return await this.memberService.updateMember(memberId, input);
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
		return await this.memberService.getMember(memberId, targetId);
	}

	@UseGuards(WithoutGuard)
	@Query(() => MembersDto)
	public async getAgents(
		@Args('input') input: AgentsInquiryDto,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<MembersDto> {
		console.log('Query, getAgents');
		console.log('1');

		return await this.memberService.getAgents(memberId, input);
	}

	// Like
	@UseGuards(AuthGuard)
	@Mutation(() => MemberDto)
	public async likeTargetMember(
		@Args('memberId') input: string,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<MemberDto> {
		console.log('Mutation: likeTargetMember');
		const likeRefId = shapeIntoMongoObjectId(input);
		return await this.memberService.likeTargetMember(memberId, likeRefId);
	}

	/** ADMIN **/
	// Authorization: Admins
	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Query(() => MembersDto)
	public async getAllMembersByAdmin(@Args('input') input: MembersInquiryDto): Promise<MembersDto> {
		return await this.memberService.getAllMembersByAdmin(input);
	}
	// Authorization: Admin
	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Mutation(() => MemberDto)
	public async UpdateMemberByAdmin(@Args('input') input: MemberUpdateDto): Promise<MemberDto> {
		return await this.memberService.UpdateMemberByAdmin(input);
	}

	/** UPLOADER **/
	/** IMAGE UPLOADER **/

	@UseGuards(AuthGuard)
	@Mutation((returns) => String)
	public async imageUploader(
		@Args({ name: 'file', type: () => GraphQLUpload })
		{ createReadStream, filename, mimetype }: FileUpload,
		@Args('target') target: String,
	): Promise<string> {
		console.log('Mutation: imageUploader');

		if (!filename) throw new Error(Message.UPLOAD_FAILED);
		const validMime = validMimeTypes.includes(mimetype);
		if (!validMime) throw new Error(Message.PROVIDE_ALLOWED_FORMAT);

		// SECURITIES

		const imageName = getSerialForImage(filename);
		const url = `uploads/${target}/${imageName}`;
		const stream = createReadStream();

		const result = await new Promise((resolve, reject) => {
			stream
				.pipe(createWriteStream(url))
				.on('finish', async () => resolve(true))
				.on('error', () => reject(false));
		});
		if (!result) throw new Error(Message.UPLOAD_FAILED);

		return url;
	}

	@UseGuards(AuthGuard)
	@Mutation((returns) => [String])
	public async imagesUploader(
		@Args('files', { type: () => [GraphQLUpload] })
		files: Promise<FileUpload>[],
		@Args('target') target: String,
	): Promise<string[]> {
		console.log('Mutation: imagesUploader');

		const uploadedImages = [];
		const promisedList = files.map(async (img: Promise<FileUpload>, index: number): Promise<Promise<void>> => {
			try {
				const { filename, mimetype, encoding, createReadStream } = await img;

				const validMime = validMimeTypes.includes(mimetype);
				if (!validMime) throw new Error(Message.PROVIDE_ALLOWED_FORMAT);

				const imageName = getSerialForImage(filename);
				const url = `uploads/${target}/${imageName}`;
				const stream = createReadStream();

				const result = await new Promise((resolve, reject) => {
					stream
						.pipe(createWriteStream(url))
						.on('finish', () => resolve(true))
						.on('error', () => reject(false));
				});
				if (!result) throw new Error(Message.UPLOAD_FAILED);

				uploadedImages[index] = url;
			} catch (err) {
				console.log('Error, file missing!');
			}
		});

		await Promise.all(promisedList);
		return uploadedImages;
	}
}
