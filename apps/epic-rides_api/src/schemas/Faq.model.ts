import { Schema } from 'mongoose';
import { FaqType } from '../libs/enums/faq.enum';

const FaqSchema = new Schema(
	{
		memberId: {
			type: Schema.Types.ObjectId,
			required: true,
		},
		faqQuestion: {
			type: String,
			required: true,
		},
		faqAnswer: {
			type: String,
			required: true,
		},
		faqType: {
			type: String,
			enum: FaqType,
			default: FaqType.MOTORCYCLE,
		},
	},
	{ timestamps: true, collection: 'faqs' },
);

export default FaqSchema;
