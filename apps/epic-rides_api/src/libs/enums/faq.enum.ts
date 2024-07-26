import { registerEnumType } from '@nestjs/graphql';

export enum FaqType {
	MOTORCYCLE = 'Motorcycle',
	PAYMENT = 'Payment',
	BUYERS = 'Buyers',
	MAKLERS = 'Maklers',
	MEMBERSHIP = 'Membership',
	COMMUNITY = 'Community',
	OTHER = 'Other',
}
registerEnumType(FaqType, {
	name: 'FaqType',
});
