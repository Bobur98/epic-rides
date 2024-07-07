import { ObjectId } from 'bson';

export const availableAgentSorts = ['createdAt, updatedAt, memberViews, memberLikes, memberRank'];
export const availableMemberSorts = ['createdAt, updatedAt, memberViews, memberLikes'];

export const shapeIntoMongoObjectId = (target: any) => {
	return typeof target === 'string' ? new ObjectId(target) : target;
};
