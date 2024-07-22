import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { BoardArticleService } from './board-article.service';
import { InjectModel } from '@nestjs/mongoose';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { BoardArticleDto, BoardArticlesDto } from '../../libs/dto/board-article/board-article';
import {
	AllBoardArticlesInquiryDto,
	BoardArticleInputDto,
	BoardArticlesInquiryDto,
} from '../../libs/dto/board-article/board-article.input';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { ObjectId } from 'mongoose';
import { WithoutGuard } from '../auth/guards/without.guard';
import { shapeIntoMongoObjectId } from '../../libs/config';
import { BoardArticleUpdateDto } from '../../libs/dto/board-article/board-article.update';
import { Roles } from '../auth/decorators/roles.decorator';
import { MemberType } from '../../libs/enums/member.enum';
import { RolesGuard } from '../auth/guards/roles.guard';

@Resolver()
export class BoardArticleResolver {
	constructor(private readonly boardArticleService: BoardArticleService) {}

	@UseGuards(AuthGuard)
	@Mutation((returns) => BoardArticleDto)
	public async createBoardArticle(
		@Args('input') input: BoardArticleInputDto,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<BoardArticleDto> {
		console.log('Mutation: createBoardArticle');
		return await this.boardArticleService.createBoardArticle(memberId, input);
	}

	@UseGuards(WithoutGuard)
	@Query((returns) => BoardArticleDto)
	public async getBoardArticle(
		@Args('articleId') input: string,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<BoardArticleDto> {
		console.log('Query: getBoardArticle');
		const articleId = shapeIntoMongoObjectId(input);
		console.log('Transformed articleId:', articleId); // Log the transformed articleId

		return await this.boardArticleService.getBoardArticle(memberId, articleId);
	}

	@UseGuards(AuthGuard)
	@Mutation((returns) => BoardArticleDto)
	public async updateBoardArticle(
		@Args('input') input: BoardArticleUpdateDto,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<BoardArticleDto> {
		console.log('Mutation: updateBoardArticle');
		input._id = shapeIntoMongoObjectId(input._id);
		return await this.boardArticleService.updateBoardArticle(memberId, input);
	}

	@UseGuards(WithoutGuard)
	@Query((returns) => BoardArticlesDto)
	public async getBoardArticles(
		@Args('input') input: BoardArticlesInquiryDto,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<BoardArticlesDto> {
		console.log('Query: getBoardArticles');
		return await this.boardArticleService.getBoardArticles(memberId, input);
	}

	@UseGuards(WithoutGuard)
	@Mutation(() => BoardArticleDto)
	public async likeTargetBoardArticle(
		@Args('boardArticleId') input: string,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<BoardArticleDto> {
		console.log('Mutation: likeTargetProduct');
		const likeRefId = shapeIntoMongoObjectId(input);
		return await this.boardArticleService.likeTargetBoardArticle(memberId, likeRefId);
	}

	/** ADMIN **/
	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Query((returns) => BoardArticlesDto)
	public async getAllBoardArticlesByAdmin(
		@Args('input') input: AllBoardArticlesInquiryDto,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<BoardArticlesDto> {
		console.log('Query: getAllBoardArticlesByAdmin');
		return await this.boardArticleService.getAllBoardArticlesByAdmin(input);
	}

	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Mutation(() => BoardArticleDto)
	public async updateBoardArticleByAdmin(
		@Args('input') input: BoardArticleUpdateDto,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<BoardArticleDto> {
		console.log('Mutation: updateBoardArticleByAdmin');
		return await this.boardArticleService.updateBoardArticleByAdmin(input);
	}

	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Mutation(() => BoardArticleDto)
	public async removeBoardArticleByAdmin(
		@Args('articleId') input: string,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<BoardArticleDto> {
		console.log('Mutation: removeBoardArticleByAdmin');
		const articleId = shapeIntoMongoObjectId(input);
		return await this.boardArticleService.removeBoardArticleByAdmin(articleId);
	}
}
