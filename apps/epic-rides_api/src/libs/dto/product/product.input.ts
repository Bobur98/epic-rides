import { Field, InputType, Int } from '@nestjs/graphql';
import { IsIn, IsInt, IsNotEmpty, IsOptional, Length, Min } from 'class-validator';
import { MemberAuthType, MemberStatus, MemberType } from '../../enums/member.enum';
import { Direction } from '../../enums/common.enum';
import { ObjectId } from 'mongoose';
import { ProductBrand, ProductCondition, ProductLocation, ProductStatus, ProductType } from '../../enums/product.enum';
import { availableOptions, availableProductSorts } from '../../config';

@InputType()
export class ProductInputDto {
	@IsNotEmpty()
	@Length(3, 100)
	@Field(() => ProductBrand)
	productBrand: ProductBrand;

	@IsNotEmpty()
	@Length(3, 100)
	@Field(() => String)
	productModel: string;

	@IsNotEmpty()
	@Field(() => Number)
	productYear: number;

	@IsNotEmpty()
	@Length(3, 100)
	@Field(() => ProductType)
	productType: ProductType;

	@IsNotEmpty()
	@Field(() => String)
	productEngine: string;

	@IsNotEmpty()
	@Field(() => Number)
	productEngineCc: number;

	@IsNotEmpty()
	@Field(() => Number)
	productPower: number;

	@IsNotEmpty()
	@Field(() => Number)
	productTorque: number;

	@IsNotEmpty()
	@Field(() => Number)
	productWeight: number;

	@IsNotEmpty()
	@Field(() => Number)
	productPrice: number;

	@IsNotEmpty()
	@Field(() => ProductCondition) //bu PropertyType <property.enum>da registerEnumType qilib ko'rsatilgani uchun ishlamoqda(graphQL shuning uchun tanimoqda)
	productCondition: ProductCondition;

	@IsOptional()
	@Field(() => Boolean, { nullable: true })
	productRent: boolean;

	@IsOptional()
	@Field(() => Boolean, { nullable: true })
	productBarter: boolean;

	@IsNotEmpty()
	@Field(() => [String])
	productImages: string[];

	@IsOptional()
	@Length(5, 100)
	@Field(() => String, { nullable: true })
	productDesc?: string;

	@IsNotEmpty()
	@Field(() => ProductLocation)
	productLocation: ProductLocation;

	memberId?: ObjectId;
}

@InputType()
export class PricesRange {
	@Field(() => Int)
	start: number;

	@Field(() => Int)
	end: number;
}

@InputType()
export class WeightRange {
	@Field(() => Int)
	start: number;

	@Field(() => Int)
	end: number;
}

@InputType()
export class YearsRange {
	@Field(() => Date)
	start: Date;

	@Field(() => Date)
	end: Date;
}

@InputType()
export class EngineRange {
	@Field(() => Int)
	start: number;

	@Field(() => Int)
	end: number;
}
@InputType()
export class PowerRange {
	@Field(() => Int)
	start: number;

	@Field(() => Int)
	end: number;
}
@InputType()
export class TorqueRange {
	@Field(() => Int)
	start: number;

	@Field(() => Int)
	end: number;
}

@InputType()
class PISearch {
	@IsOptional()
	@Field(() => String, { nullable: true })
	memberId?: ObjectId;

	@IsOptional()
	@Field(() => [ProductLocation], { nullable: true })
	locationList?: ProductLocation[];

	@IsOptional()
	@Field(() => [ProductType], { nullable: true })
	typeList?: ProductType[];

	@IsOptional()
	@Field(() => [String], { nullable: true })
	modelList?: string[];

	@IsOptional()
	@Field(() => [String], { nullable: true })
	brandList?: string[];

	@IsOptional()
	@Field(() => String, { nullable: true })
	engine?: string;

	@IsOptional()
	@Field(() => EngineRange, { nullable: true })
	engineRangeCc?: EngineRange;

	@IsOptional()
	@Field(() => PowerRange, { nullable: true })
	powerRange?: PowerRange;

	@IsOptional()
	@Field(() => TorqueRange, { nullable: true })
	torqueRange?: TorqueRange;

	@IsOptional()
	@IsIn(availableOptions, { each: true })
	@Field(() => [String], { nullable: true })
	options?: string[];

	@IsOptional()
	@Field(() => PricesRange, { nullable: true })
	pricesRange?: PricesRange;

	@IsOptional()
	@Field(() => YearsRange, { nullable: true })
	yearsRange?: YearsRange;

	@IsOptional()
	@Field(() => WeightRange, { nullable: true })
	weightRange?: WeightRange;

	@IsOptional()
	@Field(() => [ProductCondition], { nullable: true })
	conditionList?: ProductCondition[];

	@IsOptional()
	@Field(() => String, { nullable: true })
	text?: string;
}

@InputType()
export class ProductsInquiryDto {
	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	page: number;

	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	limit: number;

	@IsOptional()
	@IsIn(availableProductSorts)
	@Field(() => String, { nullable: true })
	sort?: string;

	@IsOptional()
	@Field(() => Direction, { nullable: true })
	direction?: Direction;

	@IsNotEmpty()
	@Field(() => PISearch)
	search: PISearch;
}

@InputType()
class APISearch {
	@IsOptional()
	@Field(() => ProductStatus, { nullable: true })
	productStatus?: ProductStatus;
}

@InputType()
export class AgentProductsInquiryDto {
	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	page: number;

	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	limit: number;

	@IsOptional()
	@IsIn(availableProductSorts)
	@Field(() => String, { nullable: true })
	sort?: string;

	@IsOptional()
	@Field(() => Direction, { nullable: true })
	direction?: Direction;

	@IsNotEmpty()
	@Field(() => APISearch)
	search: APISearch;
}

@InputType()
class ALLPISearch {
	@IsOptional()
	@Field(() => ProductStatus, { nullable: true })
	productStatus?: ProductStatus;

	@IsOptional()
	@Field(() => [ProductLocation], { nullable: true })
	productLocationList?: ProductLocation[];
}

@InputType()
export class AllProductsInquiryDto {
	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	page: number;

	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	limit: number;

	@IsOptional()
	@IsIn(availableProductSorts)
	@Field(() => String, { nullable: true })
	sort?: string;

	@IsOptional()
	@Field(() => Direction, { nullable: true })
	direction?: Direction;

	@IsNotEmpty()
	@Field(() => ALLPISearch)
	search?: ALLPISearch;
}

@InputType()
export class OrdinaryInquiryDto {
	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	page: number;

	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	limit: number;
}
