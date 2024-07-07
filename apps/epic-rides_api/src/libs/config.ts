import { ObjectId } from 'bson';

export const availableAgentSorts = ['createdAt, updatedAt, memberViews, memberLikes, memberRank'];
export const availableMemberSorts = ['createdAt, updatedAt, memberViews, memberLikes'];
// IMAGE CONFIGURATION (config.js)
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import { T } from './types/common';
import { pipeline } from 'stream';

export const validMimeTypes = ['image/png', 'image/jpg', 'image/jpeg'];
export const getSerialForImage = (filename: string) => {
	const ext = path.parse(filename).ext;
	return uuidv4() + ext;
};
export const shapeIntoMongoObjectId = (target: any) => {
	return typeof target === 'string' ? new ObjectId(target) : target;
};
