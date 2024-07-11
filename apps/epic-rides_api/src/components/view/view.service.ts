import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { ViewDto } from '../../libs/dto/view/view';
import { ViewInputDto } from '../../libs/dto/view/view.input';
import { T } from '../../libs/types/common';
import { ProductsDto } from '../../libs/dto/product/product';
import { lookupVisit } from '../../libs/config';
import { OrdinaryInquiryDto } from '../../libs/dto/product/product.input';
import { ViewGroup } from '../../libs/enums/view.enum';

@Injectable()
export class ViewService {
	constructor(@InjectModel('View') private readonly viewModel: Model<ViewDto>) {}

	public async recordView(input: ViewInputDto): Promise<ViewDto | null> {
		const viewExist = await this.checkViewExistence(input);
		if (!viewExist) {
			console.log('- New View Insert -');
			return await this.viewModel.create(input);
		} else {
			return null;
		}
		return null;
	}

	private async checkViewExistence(input: ViewInputDto): Promise<ViewDto> {
		const { memberId, viewRefId } = input;
		const search: T = {
			memberId: memberId,
			viewRefId: viewRefId,
		};

		return await this.viewModel.findOne(search).exec();
	}

	public async geVisitedProducts(memberId: ObjectId, input: OrdinaryInquiryDto): Promise<ProductsDto> {
		const { page, limit } = input;
		const match: T = { viewGroup: ViewGroup.PRODUCT, memberId: memberId };

		const data: T = await this.viewModel
			.aggregate([
				{ $match: match },
				{ $sort: { updatedAt: -1 } },
				{
					$lookup: {
						from: 'products',
						localField: 'viewRefId', // biz visit qilgan productlarni idisi
						foreignField: '_id', // products collectiondan _idga teng bolganlarni izlamoqdamiz
						as: 'visitedProduct',
					},
				},
				{ $unwind: '$visitedProduct' },
				{
					$facet: {
						list: [
							{ $skip: (page - 1) * limit },
							{ $limit: limit },
							lookupVisit,
							{ $unwind: '$visitedProduct.memberData' },
						],
						metaCounter: [{ $count: 'total' }],
					},
				},
			])
			.exec();

		const result: ProductsDto = { list: [], metaCounter: data[0].metaCounter };
		result.list = data[0].list.map((ele: { visitedProduct: string[] }) => ele.visitedProduct);
		console.log('result:', result);

		return result;
	}
}
