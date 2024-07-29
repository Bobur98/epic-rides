import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ObjectId } from 'mongoose';
import { MemberDto, TotalCounter } from '../member/member';
import { ProductBrand, ProductCondition, ProductLocation, ProductStatus, ProductType } from '../../enums/product.enum';
import { MeLikedDto } from '../like/like';

@ObjectType()
export class ProductDto {
	@Field(() => String)
	_id: ObjectId;

	@Field(() => ProductBrand)
	productBrand: ProductBrand;

	@Field(() => String)
	productModel: string;

	@Field(() => Number)
	productYear: number;

	@Field(() => ProductType)
	productType: ProductType;

	@Field(() => String)
	productEngine: string;

	@Field(() => Number)
	productEngineCc: number;

	@Field(() => Number)
	productPower: number;

	@Field(() => Number)
	productTorque: number;

	@Field(() => Number)
	productWeight: number;

	@Field(() => Number)
	productPrice: number;

	@Field(() => ProductCondition) //bu productType <product.enum>da registerEnumType qilib ko'rsatilgani uchun ishlamoqda(graphQL shuning uchun tanimoqda)
	productCondition: ProductCondition;

	@Field(() => Boolean)
	productRent: boolean;

	@Field(() => Boolean)
	productBarter: boolean;

	@Field(() => Int)
	productViews: number;

	@Field(() => Int)
	productLikes: number;

	@Field(() => Int)
	productRank: number;

	@Field(() => ProductStatus)
	productStatus: ProductStatus;

	@Field(() => [String])
	productImages: string[];

	@Field(() => String, { nullable: true })
	productDesc?: string[];

	@Field(() => Int)
	productComments: number;

	@Field(() => ProductLocation)
	productLocation: ProductLocation;

	@Field(() => String)
	memberId: ObjectId;

	@Field(() => Date, { nullable: true })
	soldAt?: Date;

	@Field(() => Date, { nullable: true })
	deletedAt?: Date;

	@Field(() => Date)
	createdAt?: Date;

	@Field(() => Date)
	updatedAt?: Date;

	/** from aggregation **/
	@Field(() => [MeLikedDto], { nullable: true })
	meLiked?: MeLikedDto[];

	@Field(() => MemberDto, { nullable: true })
	memberData?: MemberDto;
}

@ObjectType()
export class ProductsDto {
	@Field(() => [ProductDto])
	list: ProductDto[];

	@Field(() => [TotalCounter], { nullable: true })
	metaCounter: TotalCounter[];
}
