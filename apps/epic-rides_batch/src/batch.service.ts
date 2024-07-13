import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MemberDto } from 'apps/epic-rides_api/src/libs/dto/member/member';
import { ProductDto } from 'apps/epic-rides_api/src/libs/dto/product/product';
import { MemberStatus, MemberType } from 'apps/epic-rides_api/src/libs/enums/member.enum';
import { ProductStatus } from 'apps/epic-rides_api/src/libs/enums/product.enum';

import { Model } from 'mongoose';

@Injectable()
export class BatchService {
	constructor(
		@InjectModel('Product') private readonly productModel: Model<ProductDto>,
		@InjectModel('Member') private readonly memberModel: Model<MemberDto>,
	) {}

	public async batchRollback(): Promise<void> {
		//console.log('batchRollback');
		await this.productModel
			.updateMany(
				{
					productStatus: ProductStatus.ACTIVE,
				},
				{ productRank: 0 },
			)
			.exec();

		await this.memberModel
			.updateMany(
				{
					memberStatus: MemberStatus.ACTIVE,
					MemberType: MemberType.AGENT,
				},
				{ memberRank: 0 },
			)
			.exec();
	}

	public async batchTopProducts(): Promise<void> {
		//console.log('batchProducts');
		const products: ProductDto[] = await this.productModel
			.find({
				productStatus: ProductStatus.ACTIVE,
				productRank: 0,
			})
			.exec();

		const promisedList = products.map(async (ele: ProductDto) => {
			const { _id, productLikes, productViews } = ele;
			const rank = productLikes * 2 + productViews * 1;
			return await this.productModel.findByIdAndUpdate(_id, { productRank: rank });
		});
		await Promise.all(promisedList);
	}

	public async batchTopAgents(): Promise<void> {
		//console.log('batchAgents');
		const agents: MemberDto[] = await this.memberModel
			.find({
				memberType: MemberType.AGENT,
				memberStatus: MemberStatus.ACTIVE,
				memberRank: 0,
			})
			.exec();

		const promisedList = agents.map(async (ele: MemberDto) => {
			const { _id, memberProducts, memberLikes, memberArticles, memberViews } = ele;
			const rank = memberProducts * 5 + memberArticles * 3 + memberLikes * 2 + memberViews * 1;

			return await this.memberModel.findByIdAndUpdate(_id, { memberRank: rank });
		});
		await Promise.all(promisedList);
	}

	getHello(): string {
		return 'Welcome to NESTAR BATCH server!';
	}
}
