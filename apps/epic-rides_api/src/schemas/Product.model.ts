import { Schema } from 'mongoose';
import {
	ProductBrand,
	ProductCondition,
	ProductLocation,
	ProductStatus,
	ProductType,
} from '../libs/enums/product.enum';

const ProductSchema = new Schema(
	{
		productBrand: {
			type: String,
			enum: ProductBrand,
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
			enum: ProductType,
			required: true,
		},

		productEngine: {
			type: String,
			required: true,
		},

		productEngineCc: {
			type: Number,
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
	{ timestamps: true, collection: 'products' },
);

// ProductSchema.index({ productBrand: 1, productPrice: 1, productModel: 1 }, { unique: true });


export default ProductSchema;
