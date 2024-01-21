import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { SortOrder, UserSortBy } from '../post.constants';
import { ObjectId } from 'mongoose';

export class GetPostCommentsDto {
  @IsMongoId()
  @IsNotEmpty()
  readonly postId: ObjectId;

  @IsString()
  @IsOptional()
  search: string;

  @IsEnum(UserSortBy)
  @IsOptional()
  readonly sortBy: string;

  @IsEnum(SortOrder)
  @IsOptional()
  readonly order: string;

  @Transform(({ value }) => Number(value))
  @Min(0)
  @IsOptional()
  readonly page: string;

  @Transform(({ value }) => Number(value))
  @Min(0)
  @Max(100)
  @IsOptional()
  readonly limit: string;
}
