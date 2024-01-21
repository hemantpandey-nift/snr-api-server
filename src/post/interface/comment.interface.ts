import { Document } from 'mongoose';

export interface IUserComment extends Document {
  readonly commentDescription: string;
  readonly userId: string;
  readonly postId: string;
}
