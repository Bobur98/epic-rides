import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { FaqDto } from '../../libs/dto/faq/faq';
import { FaqInputDto } from '../../libs/dto/faq/faq.input';

@Injectable()
export class FaqService {
	constructor(@InjectModel('Faq') private readonly faqModel: Model<FaqDto>) {}

	public async createFaq(memberId: ObjectId, input: FaqInputDto): Promise<FaqDto> {
		input.memberId = memberId;
		const result: FaqDto = await this.faqModel.create(input);
		return result;
	}
}
