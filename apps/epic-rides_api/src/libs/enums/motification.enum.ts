import { registerEnumType } from '@nestjs/graphql';

export enum NotificationType {
	LIKE = 'LIKE',
	COMMENT = 'COMMENT',
	SUBSCRIBE = 'SUBSCRIBE',
	UNSUBSCRIBE = 'UNSUBSCRIBE',
	MESSAGE = 'MESSAGE',
	product = 'product',
}
registerEnumType(NotificationType, {
	name: 'NotificationType',
});

export enum NotificationStatus {
	WAIT = 'WAIT',
	READ = 'READ',
}
registerEnumType(NotificationStatus, {
	name: 'NotificationStatus',
});

export enum NotificationGroup {
	MEMBER = 'MEMBER',
	ARTICLE = 'ARTICLE',
	product = 'product',
}
registerEnumType(NotificationGroup, {
	name: 'NotificationGroup',
});
