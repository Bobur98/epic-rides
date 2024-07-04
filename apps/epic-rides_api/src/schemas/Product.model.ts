import { Schema } from 'mongoose';
import { ProductCondition, ProductLocation, ProductStatus } from '../libs/enums/product.enum';

const ProductSchema = new Schema(
	{
		productBrand: {
			type: String,
			required: true,
		},

		productModel: {
			type: String,
			required: true,
		},

		productYear: {
			type: Number,
			required: true,
		},

		productType: {
			type: String,
			required: true,
		},

		productEngine: {
			type: String,
			required: true,
		},

		productPower: {
			type: Number,
			required: true,
		},

		productTorque: {
			type: Number,
			required: true,
		},

		productWeight: {
			type: Number,
			required: true,
		},

		productPrice: {
			type: Number,
			required: true,
		},

		productCondition: {
			type: String,
			default: ProductCondition.NEW,
			required: true,
		},

		productRent: {
			type: Boolean,
			default: false,
		},

		productBarter: {
			type: Boolean,
			default: true,
		},

		productViews: {
			type: Number,
			default: 0,
		},

		productLikes: {
			type: Number,
			default: 0,
		},

		productRank: {
			type: Number,
			default: 0,
		},

		productStatus: {
			type: String,
			enum: ProductStatus,
			default: ProductStatus.ACTIVE,
		},

		productImages: {
			type: [String],
			required: true,
		},

		productDesc: {
			type: String,
		},

		productComments: {
			type: Number,
			default: 0,
		},

		productLocation: {
			type: String,
			enum: ProductLocation,
			required: true,
		},

		productAddress: {
			type: String,
			required: true,
		},

		memberId: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: 'Member',
		},

		soldAt: {
			type: Date,
		},

		deletedAt: {
			type: Date,
		},
	},
	{ timestamps: true, collection: 'properties' },
);

export default ProductSchema;
