import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { ProductService } from './product.service';
import { UseGuards } from '@nestjs/common';
import { ObjectId } from 'mongoose';
import { shapeIntoMongoObjectId } from '../../libs/config';
import { MemberType } from '../../libs/enums/member.enum';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ProductDto, ProductsDto } from '../../libs/dto/product/product';
import {
	AgentProductsInquiryDto,
	AllProductsInquiryDto,
	OrdinaryInquiryDto,
	ProductInputDto,
	ProductsInquiryDto,
} from '../../libs/dto/product/product.input';
import { WithoutGuard } from '../auth/guards/without.guard';
import { ProductUpdateDto } from '../../libs/dto/product/product.update';
import { AuthGuard } from '../auth/guards/auth.guard';

@Resolver()
export class ProductResolver {
	constructor(private readonly productService: ProductService) {}

	@Roles(MemberType.AGENT)
	@UseGuards(RolesGuard)
	@Mutation(() => ProductDto)
	public async createProduct(
		@Args('input') input: ProductInputDto,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<ProductDto> {
		console.log('mutation: createProduct');
		input.memberId = memberId;

		return await this.productService.createProduct(input);
	}

	@UseGuards(WithoutGuard)
	@Query((returns) => ProductDto)
	public async getProduct(
		@Args('productId') input: string,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<ProductDto> {
		console.log('Query: getProduct');
		const productId = shapeIntoMongoObjectId(input);
		return await this.productService.getProduct(memberId, productId);
	}

	@Roles(MemberType.AGENT)
	@UseGuards(RolesGuard)
	@Mutation((returns) => ProductDto)
	public async updateProduct(@Args('input') input: ProductUpdateDto, @AuthMember('_id') memberId: ObjectId) {
		console.log('Mutation: updateProduct');
		input._id = shapeIntoMongoObjectId(input._id);
		return await this.productService.updateProduct(memberId, input);
	}

	@UseGuards(WithoutGuard)
	@Query((returns) => ProductsDto)
	public async getProducts(
		@Args('input') input: ProductsInquiryDto,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<ProductsDto> {
		console.log(input);

		console.log('Query: getProducts');
		return await this.productService.getProducts(memberId, input);
	}

	// get member's favorite products
	// @UseGuards(AuthGuard)
	// @Query((returns) => ProductsDto)
	// public async getFavorites(
	// 	@Args('input') input: OrdinaryInquiryDto,
	// 	@AuthMember('_id') memberId: ObjectId,
	// ): Promise<ProductsDto> {
	// 	console.log(input);

	// 	console.log('Query: getFavorites');
	// 	return await this.productService.getFavorites(memberId, input);
	// }

	// @UseGuards(AuthGuard)
	// @Query((returns) => ProductsDto)
	// public async getVisited(
	// 	@Args('input') input: OrdinaryInquiryDto,
	// 	@AuthMember('_id') memberId: ObjectId,
	// ): Promise<ProductsDto> {
	// 	console.log(input);

	// 	console.log('Query: getVisited');
	// 	return await this.productService.getVisited(memberId, input);
	// }

	@Roles(MemberType.AGENT)
	@UseGuards(RolesGuard)
	@Query((returns) => ProductsDto)
	public async getAgentProducts(
		@Args('input') input: AgentProductsInquiryDto,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<ProductsDto> {
		console.log('Query: getAgentProducts');
		return await this.productService.getAgentProducts(memberId, input);
	}

	// @UseGuards(AuthGuard)
	// @Mutation(() => ProductDto)
	// public async likeTargetProduct(
	// 	@Args('productId') input: string,
	// 	@AuthMember('_id') memberId: ObjectId,
	// ): Promise<ProductDto> {
	// 	console.log('Mutation: likeTargetProduct');
	// 	const likeRefId = shapeIntoMongoObjectId(input);
	// 	return await this.productService.likeTargetProduct(memberId, likeRefId);
	// }

	/** ADMIN **/
	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Query((returns) => ProductsDto)
	public async getAllProductsByAdmin(
		@Args('input') input: AllProductsInquiryDto,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<ProductsDto> {
		console.log('Query: getAllProductsByAdmin');
		return await this.productService.getAllProductsByAdmin(input);
	}

	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Mutation(() => ProductDto)
	public async updateProductByAdmin(@Args('input') input: ProductUpdateDto): Promise<ProductDto> {
		console.log('Mutation: updateMemberByAdmin');
		input._id = shapeIntoMongoObjectId(input._id);
		return await this.productService.updateProductByAdmin(input);
	}

	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Mutation(() => ProductDto)
	public async removeProductByAdmin(@Args('productId') input: string): Promise<ProductDto> {
		console.log('Mutation: removeProductByAdmin');
		const productId = shapeIntoMongoObjectId(input);
		return await this.productService.removeProductByAdmin(productId);
	}
}
