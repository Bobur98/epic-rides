import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ViewDto } from '../../libs/dto/view/view';
import { ViewInputDto } from '../../libs/dto/view/view.input';
import { T } from '../../libs/types/common';

@Injectable()
export class ViewService {
	constructor(@InjectModel('View') private readonly viewModel: Model<ViewDto>) {}

	public async recordView(input: ViewInputDto): Promise<ViewDto | null> {
		const viewExist = await this.checkViewExistance(input);
		if (!viewExist) {
			console.log('- New View Insert -');
			return await this.viewModel.create(input);
		} else {
			return null;
		}
		return null;
	}

	private async checkViewExistance(input: ViewInputDto): Promise<ViewDto> {
		const { memberId, viewRefId } = input;
		const search: T = { memberId: memberId, viewRefId: viewRefId };

		return await this.viewModel.findOne(search).exec();
	}
}
