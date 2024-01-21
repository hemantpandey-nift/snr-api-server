import { Document } from 'mongoose';

export interface IUserPost extends Document {
  readonly postDescription: string;
  readonly userId: string;
}
