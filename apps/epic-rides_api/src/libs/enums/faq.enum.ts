import { registerEnumType } from '@nestjs/graphql';

export enum FaqType {
	MOTORCYCLE = 'Motorcycle',
	PAYMENT = 'Payment',
	BUYERS = 'For Buyers',
	MAKLERS = 'Maklers',
	MEMBERSHIP = 'Membership',
	COMMUNITY = 'Community',
	OTHER = 'Other Inquiries',
}
registerEnumType(FaqType, {
	name: 'FaqType',
});
