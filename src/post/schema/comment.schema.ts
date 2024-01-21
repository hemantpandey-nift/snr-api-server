import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Types } from 'mongoose';
import { UserSchema } from 'src/user/schemas/user.schema';
import { UserPostSchema } from './post.schema';

const User = mongoose.model('User', UserSchema);
const UserPost = mongoose.model('UserPost', UserPostSchema);

@Schema()
export class PostComment {
  @Prop({
    required: [true, 'Comment description is required'],
    minlength: [5, 'Comment description should contain atleast 2 characters'],
    maxlength: [200, 'Comment description can contain maximum 200 characters'],
  })
  commentDescription: string;

  @Prop({ type: Types.ObjectId, ref: () => User })
  userId;

  @Prop({ type: Types.ObjectId, ref: () => UserPost })
  postId;

  @Prop({
    default: Date.now(),
  })
  createdAt: Date;
}
export const PostCommentSchema = SchemaFactory.createForClass(PostComment);
