import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { MemberService } from '../member/member.service';
import { ProductService } from '../product/product.service';
import { BoardArticleService } from '../board-article/board-article.service';
import { CommentInputDto, CommentsInquiryDto } from '../../libs/dto/comment/comment.input';
import { Direction, Message } from '../../libs/enums/common.enum';
import { CommentGroup, CommentStatus } from '../../libs/enums/comment.enum';
import { CommentDto, CommentsDto } from '../../libs/dto/comment/comment';
import { CommentUpdateDto } from '../../libs/dto/comment/comment.update';
import { T } from '../../libs/types/common';
import { lookupMember } from '../../libs/config';
import { MemberDto } from '../../libs/dto/member/member';
import { NotificationGroup, NotificationStatus, NotificationType } from '../../libs/enums/notification.enum';
import { ProductDto } from '../../libs/dto/product/product';
import { BoardArticleDto } from '../../libs/dto/board-article/board-article';
import { NotificationService } from '../notification/notification.service';
import { MemberStatus } from '../../libs/enums/member.enum';

@Injectable()
export class CommentService {
	constructor(
		@InjectModel('Comment') private readonly commentModel: Model<CommentDto>,
		@InjectModel('Member') private readonly memberModel: Model<MemberDto>,
		@InjectModel('Product') private readonly productModel: Model<ProductDto>,
		@InjectModel('BoardArticle') private readonly boardArticleModel: Model<BoardArticleDto>,
		private readonly memberService: MemberService,
		private readonly productService: ProductService,
		private readonly boardArticleService: BoardArticleService,
		private readonly notificationService: NotificationService,
	) {}

	public async createComment(memberId: ObjectId, input: CommentInputDto) {
		input.memberId = memberId;

		let result = null;
		try {
			result = await this.commentModel.create(input);
		} catch (err) {
			console.log('Error, Comment Service model:', err.message);
			throw new BadRequestException(Message.CREATE_FAILED);
		}

		switch (input.commentGroup) {
			case CommentGroup.PRODUCT:
				await this.productService.productStatsEditor({
					_id: input.commentRefId,
					targetKey: 'productComments',
					modifier: 1,
				});
				// notification part on product comment
				const product = await this.productModel.findOne({ _id: input.commentRefId }).exec();
				if (product) {
					const authMember: MemberDto = await this.memberModel
						.findOne({ _id: memberId, memberStatus: MemberStatus.ACTIVE })
						.exec();

					if (!authMember) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

					const notificInput = {
						notificationType: NotificationType.COMMENT,
						notificationStatus: NotificationStatus.WAIT,
						notificationGroup: NotificationGroup.PRODUCT,
						notificationTitle: 'New Comment',
						notificationDesc: `${authMember.memberNick} comment on your product ${product.productBrand}`,
						authorId: memberId,
						receiverId: product.memberId,
						productId: input.commentRefId,
					};
					await this.notificationService.createNotification(notificInput);
				}
				break;
			case CommentGroup.ARTICLE:
				await this.boardArticleService.boardArticleStatsEditor({
					_id: input.commentRefId,
					targetKey: 'articleComments',
					modifier: 1,
				});

				// notification part on product comment
				const article = await this.boardArticleModel.findOne({ _id: input.commentRefId }).exec();
				if (article) {
					const authMember: MemberDto = await this.memberModel
						.findOne({ _id: memberId, memberStatus: MemberStatus.ACTIVE })
						.exec();

					if (!authMember) throw new InternalServerErrorException(Message.NO_DATA_FOUND);
					const notificInput = {
						notificationType: NotificationType.COMMENT,
						notificationStatus: NotificationStatus.WAIT,
						notificationGroup: NotificationGroup.ARTICLE,
						notificationTitle: 'New Comment',
						notificationDesc: `${authMember.memberNick} comment on your article ${article.articleTitle}`,
						authorId: memberId,
						receiverId: article.memberId,
						productId: input.commentRefId,
					};
					await this.notificationService.createNotification(notificInput);
				}
				break;
			case CommentGroup.MEMBER:
				await this.memberService.memberStatsEditor({
					_id: input.commentRefId,
					targetKey: 'memberComments',
					modifier: 1,
				});

				const member = await this.memberModel.findOne({ _id: input.commentRefId }).exec();
				if (member) {
					const notificInput = {
						notificationType: NotificationType.COMMENT,
						notificationStatus: NotificationStatus.WAIT,
						notificationGroup: NotificationGroup.MEMBER,
						notificationTitle: 'New Comment',
						notificationDesc: `${member.memberNick} comment on your profile`,
						authorId: memberId,
						receiverId: article.memberId,
					};
					await this.notificationService.createNotification(notificInput);
				}
				break;
		}

		if (!result) throw new InternalServerErrorException(Message.CREATE_FAILED);
		return result;
	}

	public async updateComment(memberId: ObjectId, input: CommentUpdateDto): Promise<CommentDto> {
		const { _id } = input;
		const result = await this.commentModel
			.findOneAndUpdate(
				{
					_id: _id,
					memberId: memberId,
					commentStatus: CommentStatus.ACTIVE,
				},
				input,
				{ new: true },
			)
			.exec();
		if (!result) throw new InternalServerErrorException(Message.UPDATE_FAILED);

		return result;
	}

	public async getComments(memberId: ObjectId, input: CommentsInquiryDto): Promise<CommentsDto> {
		const { commentRefId } = input.search;
		const match: T = { commentRefId: commentRefId, commentStatus: CommentStatus.ACTIVE };
		const sort: T = { [input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC };

		const result: CommentsDto[] = await this.commentModel
			.aggregate([
				{ $match: match },
				{ $sort: sort },
				{
					$facet: {
						list: [
							{ $skip: (input.page - 1) * input.limit },
							{ $limit: input.limit },
							// meLiked
							lookupMember,
							{ $unwind: '$memberData' },
						],
						metaCounter: [{ $count: 'total' }],
					},
				},
			])
			.exec();
		if (!result.length) throw new InternalServerErrorException(Message.NO_DATA_FOUND);
		return result[0];
	}

	public async removeCommentByAdmin(input: ObjectId): Promise<CommentDto> {
		const result = await this.commentModel.findByIdAndDelete(input).exec();
		if (!result) throw new InternalServerErrorException(Message.REMOVE_FAILED);
		return result;
	}
}
