import {
  IsMongoId,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ObjectId } from 'mongoose';

export class CreateCommentDto {
  @IsString()
  @MinLength(5)
  @MaxLength(200)
  @IsNotEmpty()
  readonly commentDescription: string;

  @IsMongoId()
  @IsNotEmpty()
  readonly postId: ObjectId;
}
