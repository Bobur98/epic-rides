import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ProductDto, ProductsDto } from '../../libs/dto/product/product';
import { Model, ObjectId } from 'mongoose';
import { AuthService } from '../auth/auth.service';
import { ViewService } from '../view/view.service';
import { MemberService } from '../member/member.service';
import {
	AgentProductsInquiryDto,
	AllProductsInquiryDto,
	OrdinaryInquiryDto,
	ProductInputDto,
	ProductsInquiryDto,
} from '../../libs/dto/product/product.input';
import { ProductStatus } from '../../libs/enums/product.enum';
import * as moment from 'moment';
import { lookupAuthMemberLiked, lookupMember, shapeIntoMongoObjectId } from '../../libs/config';
import { Message, Direction } from '../../libs/enums/common.enum';
import { LikeGroup } from '../../libs/enums/like.enum';
import { ViewGroup } from '../../libs/enums/view.enum';
import { StatisticModifier, T } from '../../libs/types/common';
import { ProductUpdateDto } from '../../libs/dto/product/product.update';
import { LikeInputDto } from '../../libs/dto/like/like.input';
import { LikeService } from '../like/like.service';
import { MemberDto } from '../../libs/dto/member/member';
import { MemberStatus } from '../../libs/enums/member.enum';
import { NotificationInput } from '../../libs/dto/notification/notification.input';
import { NotificationGroup, NotificationStatus, NotificationType } from '../../libs/enums/notification.enum';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class ProductService {
	constructor(
		@InjectModel('Product') private readonly productModel: Model<ProductDto>,
		@InjectModel('Member') private readonly memberModel: Model<MemberDto>,

		private authService: AuthService,
		private viewService: ViewService,
		private memberService: MemberService,
		private likeService: LikeService,
		private notificationService: NotificationService,
	) {}

	public async createProduct(input: ProductInputDto): Promise<ProductDto> {
		try {
			const result = await this.productModel.create(input);
			// increase memberProducts
			await this.memberService.memberStatsEditor({ _id: result.memberId, targetKey: 'memberProducts', modifier: 1 });

			return result;
		} catch (err) {
			console.log('Error, Service.model', err.message);
			throw new BadRequestException(Message.CREATE_FAILED); // bu error nestjsni error handling methodi bolsa, demak bu yerda errorni handle qilsak u bizning global error handlingmizni error messagega joylashadimi?
		}
	}

	public async getProduct(memberId: ObjectId, productId: ObjectId): Promise<ProductDto> {
		const search: T = {
			_id: productId,
			productStatus: ProductStatus.ACTIVE,
		};

		const targetProduct: ProductDto = await this.productModel.findOne(search).lean().exec();
		if (!targetProduct) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

		if (memberId) {
			const viewInput = { memberId: memberId, viewRefId: productId, viewGroup: ViewGroup.PRODUCT };
			const newView = await this.viewService.recordView(viewInput);
			if (newView) {
				await this.productStatsEditor({ _id: productId, targetKey: 'productViews', modifier: 1 });
				targetProduct.productViews++;
			}
			// meLiked
			const likeInput = { memberId: memberId, likeRefId: productId, likeGroup: LikeGroup.PRODUCT };
			targetProduct.meLiked = await this.likeService.checkLikeExistence(likeInput);
		}

		targetProduct.memberData = await this.memberService.getMember(null, targetProduct.memberId);
		return targetProduct;
	}

	public async updateProduct(memberId: ObjectId, input: ProductUpdateDto): Promise<ProductDto> {
		let { productStatus, soldAt, deletedAt } = input;
		const search: T = {
			_id: input._id,
			memberId: memberId,
			productStatus: ProductStatus.ACTIVE,
		};

		if (productStatus === ProductStatus.SOLD) soldAt = moment().toDate();
		else if (productStatus === ProductStatus.DELETE) deletedAt = moment().toDate();

		const result = await this.productModel.findOneAndUpdate(search, input, { new: true }).exec();
		if (!result) throw new InternalServerErrorException(Message.UPDATE_FAILED);

		if (soldAt || deletedAt) {
			await this.memberService.memberStatsEditor({
				_id: memberId,
				targetKey: 'memberProducts',
				modifier: -1,
			});
		}
		return result;
	}

	public async getProducts(memberId: ObjectId, input: ProductsInquiryDto): Promise<ProductsDto> {
		const match: T = { productStatus: ProductStatus.ACTIVE };
		const sort: T = { [input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC };

		console.log(input.search, 'INPUT');

		this.shapeMatchQuery(match, input);

		console.log(match, 'MATCH');

		const result = await this.productModel
			.aggregate([
				{ $match: match },
				{ $sort: sort },
				{
					$facet: {
						list: [
							{ $skip: (input.page - 1) * input.limit },
							{ $limit: input.limit },
							// meLiked
							lookupAuthMemberLiked(memberId),
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

	private shapeMatchQuery(match: T, input: ProductsInquiryDto): void {
		const {
			memberId,
			locationList,
			typeList,
			modelList,
			engine,
			engineRangeCc,
			powerRange,
			torqueRange,
			conditionList,
			pricesRange,
			yearsRange,
			weightRange,
			options,
			text,
			brandList,
		} = input.search;

		if (memberId) match.memberId = shapeIntoMongoObjectId(memberId);
		if (locationList && locationList.length) match.productLocation = { $in: locationList };
		if (brandList && brandList.length) match.productBrand = { $in: brandList };
		if (modelList && modelList.length) match.productModel = { $in: modelList };
		if (typeList && typeList.length) match.productType = { $in: typeList };
		if (conditionList && conditionList.length) match.productCondition = { $in: conditionList };

		if (engineRangeCc) match.productEngineCc = { $gte: engineRangeCc.start, $lte: engineRangeCc.end };
		if (powerRange) match.productPower = { $gte: powerRange.start, $lte: powerRange.end };
		if (torqueRange) match.productTorque = { $gte: torqueRange.start, $lte: torqueRange.end };
		if (pricesRange) match.productPrice = { $gte: pricesRange.start, $lte: pricesRange.end };
		if (yearsRange) match.productYear = { $gte: yearsRange.start, $lte: yearsRange.end };
		if (weightRange) match.productWeight = { $gte: weightRange.start, $lte: weightRange.end };

		if (text) match.productBrand = { $regex: new RegExp(text, 'i') };

		if (options) {
			match['$or'] = options.map((ele) => {
				return { [ele]: true };
			});
		}
	}

	public async getFavorites(memberId: ObjectId, input: OrdinaryInquiryDto): Promise<ProductsDto> {
		return await this.likeService.geFavoriteProducts(memberId, input);
	}

	public async getVisited(memberId: ObjectId, input: OrdinaryInquiryDto): Promise<ProductsDto> {
		return await this.viewService.geVisitedProducts(memberId, input);
	}

	public async getAgentProducts(memberId: ObjectId, input: AgentProductsInquiryDto): Promise<ProductsDto> {
		const { productStatus } = input.search;
		if (productStatus === ProductStatus.DELETE) throw new InternalServerErrorException(Message.NOT_ALLOWED_REQUEST);

		const match: T = {
			memberId: memberId,
			productStatus: productStatus ?? { $ne: ProductStatus.DELETE },
		};

		const sort: T = { [input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC };

		const result = await this.productModel
			.aggregate([
				{ $match: match },
				{ $sort: sort },
				{
					$facet: {
						list: [
							{ $skip: (input.page - 1) * input.limit },
							{ $limit: input.limit },
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

	public async likeTargetProduct(memberId: ObjectId, likeRefId: ObjectId): Promise<ProductDto> {
		const target: ProductDto = await this.productModel
			.findOne({ _id: likeRefId, productStatus: ProductStatus.ACTIVE })
			.exec();
		if (!target) throw new InternalServerErrorException(Message.NO_DATA_FOUND);
		const input: LikeInputDto = {
			memberId: memberId,
			likeRefId: likeRefId,
			likeGroup: LikeGroup.PRODUCT,
		};

		// LIKE TOGGLE
		const modifier: number = await this.likeService.toggleLike(input);
		const result = await this.productStatsEditor({ _id: likeRefId, targetKey: 'productLikes', modifier: modifier });

		//notification
		const authMember: MemberDto = await this.memberModel
			.findOne({
				_id: memberId,
				memberStatus: MemberStatus.ACTIVE,
			})
			.exec();
		if (!authMember) throw new InternalServerErrorException(Message.NO_DATA_FOUND);
		const notificInput: NotificationInput = {
			notificationType: NotificationType.LIKE,
			notificationStatus: NotificationStatus.WAIT,
			notificationGroup: NotificationGroup.PRODUCT,
			notificationTitle: 'Like',
			notificationDesc: `${authMember.memberNick} like your property`,
			authorId: memberId,
			receiverId: target.memberId,
		};
		await this.notificationService.createNotification(notificInput);

		if (!result) throw new InternalServerErrorException(Message.SOMETHING_WENT_WRONG);
		return result;
	}

	public async getAllProductsByAdmin(input: AllProductsInquiryDto): Promise<ProductsDto> {
		const { productStatus, productLocationList } = input.search;
		const match: T = {};
		const sort: T = { [input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC };

		if (productStatus) match.productStatus = productStatus;
		if (productLocationList) match.productLocation = { $in: productLocationList };

		const result = await this.productModel
			.aggregate([
				{ $match: match },
				{ $sort: sort },
				{
					$facet: {
						list: [
							{ $skip: (input.page - 1) * input.limit },
							{ $limit: input.limit },
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

	public async updateProductByAdmin(input: ProductUpdateDto): Promise<ProductDto> {
		let { productStatus, soldAt, deletedAt } = input;
		const search: T = {
			_id: input._id,
			productStatus: ProductStatus.ACTIVE,
		};

		// sotilganiga kop  vaqt bolgan bolsachi?
		if (productStatus === ProductStatus.SOLD) soldAt = moment().toDate();
		else if (productStatus === ProductStatus.DELETE) deletedAt = moment().toDate();

		const result = await this.productModel
			.findOneAndUpdate(search, input, {
				new: true,
			})
			.exec();
		if (!result) throw new InternalServerErrorException(Message.UPDATE_FAILED);

		if (soldAt || deletedAt) {
			await this.memberService.memberStatsEditor({
				_id: result.memberId,
				targetKey: 'memberProducts',
				modifier: -1,
			});
		}

		return result;
	}

	public async removeProductByAdmin(productId: ObjectId): Promise<ProductDto> {
		const search: T = { _id: productId, productStatus: ProductStatus.DELETE };
		const result = await this.productModel.findOneAndDelete(search).exec();
		if (!result) throw new InternalServerErrorException(Message.REMOVE_FAILED);

		return result;
	}

	public async productStatsEditor(input: StatisticModifier): Promise<ProductDto> {
		const { _id, targetKey, modifier } = input;
		return await this.productModel.findByIdAndUpdate(_id, { $inc: { [targetKey]: modifier } }, { new: true }).exec();
	}
}
