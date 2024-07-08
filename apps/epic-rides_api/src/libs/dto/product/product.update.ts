import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt, IsNotEmpty, IsOptional, Length, Min } from 'class-validator';
import { ObjectId } from 'mongoose';
import { ProductCondition, ProductLocation, ProductStatus, ProductType } from '../../enums/product.enum';

@InputType()
export class ProductUpdateDto {
	@IsNotEmpty()
	@Field(() => String)
	_id: ObjectId;

	@IsOptional()
	@Field(() => ProductType, { nullable: true })
	productType?: ProductType;

	@IsOptional()
	@Field(() => ProductStatus, { nullable: true })
	productStatus?: ProductStatus;

	@IsOptional()
	@Field(() => ProductLocation, { nullable: true })
	productLocation?: ProductLocation;

	@IsOptional()
	@Length(3, 100)
	@Field(() => String, { nullable: true })
	productBrand?: string;

	@IsOptional()
	@Field(() => Number, { nullable: true })
	productPrice?: number;

	@IsOptional()
	@Field(() => String, { nullable: true })
	productModel?: string;

	@IsOptional()
	@IsInt()
	@Min(1)
	@Field(() => Int, { nullable: true })
	productYear?: number;

	@IsOptional()
	@IsInt()
	@Min(1)
	@Field(() => String, { nullable: true })
	productEngine?: string;

	@IsOptional()
	@Field(() => Number, { nullable: true })
	productPower?: number;

	@IsOptional()
	@Field(() => Number, { nullable: true })
	productTorque?: number;

	@IsOptional()
	@Field(() => Number, { nullable: true })
	productWeight?: number;

	@IsOptional()
	@Field(() => ProductCondition, { nullable: true })
	productCondition?: ProductCondition;

	@IsOptional()
	@Field(() => [String], { nullable: true })
	productImages?: string[];

	@IsOptional()
	@Length(5, 500)
	@Field(() => String, { nullable: true })
	productDesc?: string;

	@IsOptional()
	@Field(() => Boolean, { nullable: true })
	productBarter?: boolean;

	@IsOptional()
	@Field(() => Boolean, { nullable: true })
	productRent?: boolean;

	soldAt?: Date;

	deletedAt?: Date;
}
