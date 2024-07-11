import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { LikeDto, MeLikedDto } from '../../libs/dto/like/like';
import { LikeInputDto } from '../../libs/dto/like/like.input';
import { T } from '../../libs/types/common';
import { Message } from '../../libs/enums/common.enum';
import { LikeGroup } from '../../libs/enums/like.enum';
import { lookupFavorite } from '../../libs/config';
import { OrdinaryInquiryDto } from '../../libs/dto/product/product.input';
import { ProductsDto } from '../../libs/dto/product/product';

@Injectable()
export class LikeService {
	constructor(@InjectModel('Like') private readonly likeModel: Model<LikeDto>) {}

	public async toggleLike(input: LikeInputDto): Promise<number> {
		const search: T = { memberId: input.memberId, likeRefId: input.likeRefId };
		const exist = await this.likeModel.findOne(search).exec();

		let modifier = 1;

		if (exist) {
			await this.likeModel.findOneAndDelete(search).exec();
			modifier = -1;
		} else {
			try {
				await this.likeModel.create(input);
			} catch (err) {
				console.log('ERROR, Like Service.model', err);
				throw new BadRequestException(Message.CREATE_FAILED);
			}
		}

		console.log(`- Like modifier: ${modifier} -`);

		return modifier;
	}

	public async checkLikeExistence(input: LikeInputDto): Promise<MeLikedDto[]> {
		const { memberId, likeRefId } = input;
		console.log(input, 'input');

		const result = await this.likeModel.findOne({ memberId: memberId, likeRefId: likeRefId }).exec();
		console.log(result, 'result');

		return result ? [{ memberId: memberId, likeRefId: likeRefId, myFavorite: true }] : [];
	}

	public async geFavoriteProducts(memberId: ObjectId, input: OrdinaryInquiryDto): Promise<ProductsDto> {
		const { page, limit } = input;
		const match: T = { likeGroup: LikeGroup.PRODUCT, memberId: memberId };

		const data: T = await this.likeModel
			.aggregate([
				{ $match: match },
				{ $sort: { updatedAt: -1 } },
				{
					$lookup: {
						from: 'products',
						localField: 'likeRefId', // biz like bosgan productlarni idisi
						foreignField: '_id', // products collectiondan _idga teng bolganlarni izlamoqdamiz
						as: 'favoriteProduct',
					},
				},
				{ $unwind: '$favoriteProduct' },
				{
					$facet: {
						list: [
							{ $skip: (page - 1) * limit },
							{ $limit: limit },
							lookupFavorite,
							{ $unwind: '$favoriteProduct.memberData' },
						],
						metaCounter: [{ $count: 'total' }],
					},
				},
			])
			.exec();

		const result: ProductsDto = { list: [], metaCounter: data[0].metaCounter };
		result.list = data[0].list.map((ele: { favoriteProduct: string[] }) => ele.favoriteProduct);
		console.log(result);

		return result;
	}
}
