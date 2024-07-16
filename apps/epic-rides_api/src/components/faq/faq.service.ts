import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { FaqDto } from '../../libs/dto/faq/faq';
import { FaqInputDto } from '../../libs/dto/faq/faq.input';
import { FaqUpdateDto } from '../../libs/dto/faq/faq.upade';
import { Message } from '../../libs/enums/common.enum';

@Injectable()
export class FaqService {
	constructor(@InjectModel('Faq') private readonly faqModel: Model<FaqDto>) {}

	public async createFaq(memberId: ObjectId, input: FaqInputDto): Promise<FaqDto> {
		input.memberId = memberId;
		const result: FaqDto = await this.faqModel.create(input);

		if (!result) throw new InternalServerErrorException(Message.CREATE_FAILED);

		return result;
	}

	public async updateFaq(memberId: ObjectId, input: FaqUpdateDto): Promise<FaqDto> {
		const result: FaqDto = await this.faqModel
			.findOneAndUpdate({ _id: input._id, memberId: memberId }, input, {
				new: true,
			})
			.exec();

		if (!result) throw new InternalServerErrorException(Message.UPDATE_FAILED);

		return result;
	}

	public async deleteFaq(faqId: ObjectId): Promise<FaqDto> {
		const result: FaqDto = await this.faqModel.findOneAndDelete(faqId).exec();

		if (!result) throw new InternalServerErrorException(Message.REMOVE_FAILED);

		return result;
	}
}
